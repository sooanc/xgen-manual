// deploy.mjs — 운영 배포 스크립트
//
// Usage:
//   node build/deploy.mjs --target staging                        # 빌드 + 스테이징 패키지 생성
//   node build/deploy.mjs --target production                     # 빌드 + 운영 패키지 생성
//   node build/deploy.mjs --target production --customers customer-a,customer-b
//   node build/deploy.mjs --target production --skip-build        # 기존 dist 사용
//   node build/deploy.mjs --target production --dry-run           # 실행 안 하고 계획만 출력
//
// 동작:
//   1. deploy.config.yml에서 target 정책 로드
//   2. 사전 검증 (preflight)
//   3. 모든 고객사 HTML 빌드 (--skip-build 시 생략)
//   4. dist/site/ 를 dist/deploy/<target>/ 로 복사 후 정책에 따라 정리
//   5. manifest.json 생성
//   6. dist/deploy/history.json 에 이력 추가

import { parseArgs } from 'node:util';
import { readFile, writeFile, readdir, stat, cp, rm, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { listCustomers, ROOT } from './compose.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const DEPLOY_ROOT = join(DIST, 'deploy');
const DEPLOY_CONFIG = join(ROOT, 'deploy.config.yml');

function log(msg) { console.log(`[deploy] ${msg}`); }
function warn(msg) { console.warn(`[deploy] ⚠ ${msg}`); }
function fail(msg) { console.error(`[deploy] ✗ ${msg}`); process.exit(1); }

// ─── CLI 파싱 ────────────────────────────────────────────────────────────
const { values: args } = parseArgs({
  options: {
    target: { type: 'string' },
    customers: { type: 'string' },
    'skip-build': { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
  },
  strict: false,
});

if (!args.target) {
  console.error(
    'Usage: node build/deploy.mjs --target <staging|production> [--customers a,b] [--skip-build] [--dry-run]'
  );
  process.exit(1);
}

// ─── 설정 로드 ───────────────────────────────────────────────────────────
async function loadTargetConfig(targetName) {
  if (!existsSync(DEPLOY_CONFIG)) fail(`deploy.config.yml not found at ${DEPLOY_CONFIG}`);
  const cfg = parseYaml(await readFile(DEPLOY_CONFIG, 'utf8'));
  const t = cfg?.targets?.[targetName];
  if (!t) fail(`target "${targetName}" not found in deploy.config.yml`);
  return t;
}

// ─── 사전 검증 ───────────────────────────────────────────────────────────
async function preflight(target, customerIds) {
  log(`사전 검증 시작 (target=${args.target})`);

  // 1. 도구
  const checks = [
    { cmd: 'pandoc', args: ['--version'], label: 'Pandoc' },
    { cmd: 'python', args: ['-m', 'mkdocs', '--version'], label: 'MkDocs' },
  ];
  for (const c of checks) {
    const r = spawnSync(c.cmd, c.args, { encoding: 'utf8' });
    if (r.status !== 0) fail(`${c.label} not available: ${r.error?.message ?? r.stderr}`);
    log(`  ✓ ${c.label}: ${(r.stdout || '').split('\n')[0].trim()}`);
  }

  // 2. 고객사 정의 확인
  if (customerIds.length === 0) fail('배포할 고객사가 없습니다.');
  for (const id of customerIds) {
    const ymlPath = join(ROOT, 'customers', id, 'customer.yml');
    if (!existsSync(ymlPath)) fail(`customer.yml not found: customers/${id}/customer.yml`);
  }
  log(`  ✓ 정의된 고객사 ${customerIds.length}개: ${customerIds.join(', ')}`);

  // 3. Git 상태
  if (target.require_clean_git) {
    try {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
      if (status.trim()) {
        fail('Git 작업 트리가 깨끗하지 않습니다 (require_clean_git=true).\n' + status);
      }
      log('  ✓ Git 작업 트리 깨끗함');
    } catch (e) {
      warn('Git 상태 확인 실패: ' + e.message);
    }
  }

  log('사전 검증 통과');
}

// ─── 빌드 ────────────────────────────────────────────────────────────────
function runBuild(customerIds) {
  log(`HTML 빌드 시작 (${customerIds.length}개 고객사)`);
  const buildScript = join(__dirname, 'build.mjs');
  const r = spawnSync(
    'node',
    [buildScript, '--customer', customerIds.join(','), '--formats', 'html'],
    { stdio: 'inherit' }
  );
  if (r.status !== 0) fail('빌드 실패');
  log('빌드 완료');
}

// 단일 고객사 빌드를 위해 build.mjs는 customer 단일 ID만 처리하므로 루프
function runBuildLoop(customerIds) {
  const buildScript = join(__dirname, 'build.mjs');
  for (const id of customerIds) {
    log(`  → ${id} 빌드`);
    const r = spawnSync(
      'node',
      [buildScript, '--customer', id, '--formats', 'html'],
      { stdio: 'inherit' }
    );
    if (r.status !== 0) fail(`빌드 실패: ${id}`);
  }
}

// ─── 패키지 작성 ─────────────────────────────────────────────────────────
async function packageDeploy(target, customerIds, targetName) {
  const outDir = join(DEPLOY_ROOT, targetName);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const siteSrc = join(DIST, 'site');
  if (!existsSync(siteSrc)) fail('dist/site가 없습니다. 빌드를 먼저 실행하세요.');

  // 1. dist/site 통째 복사
  await cp(siteSrc, outDir, { recursive: true });
  log(`  ✓ site 복사 → ${relative(ROOT, outDir)}`);

  // 2. 정책에 따라 제거/교체
  // 2-a. 미리보기 산출물
  if (target.strip_base_preview) {
    const previewDir = join(outDir, 'docs', '__base_preview__');
    if (existsSync(previewDir)) {
      await rm(previewDir, { recursive: true, force: true });
      log('  ✓ __base_preview__ 제거');
    }
  }

  // 2-b. /admin/ 제거
  if (!target.include_admin_index) {
    const adminDir = join(outDir, 'admin');
    if (existsSync(adminDir)) {
      await rm(adminDir, { recursive: true, force: true });
      log('  ✓ /admin/ 제거 (운영 정책)');
    }
  }

  // 2-c. /index.html 정책
  if (target.strip_root_index) {
    const placeholder = `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><title>${target.base_url ?? '솔루션 가이드'}</title>
<style>body{font-family:'Pretendard Variable',Pretendard,-apple-system,BlinkMacSystemFont,system-ui,Roboto,'Helvetica Neue','Segoe UI','Apple SD Gothic Neo','Noto Sans KR',sans-serif;margin:0;display:flex;height:100vh;align-items:center;justify-content:center;color:#444;background:#f7f8fa;}div{text-align:center;padding:32px;}</style>
</head><body><div>
<h1>솔루션 가이드</h1>
<p>접근하시려는 매뉴얼 페이지의 직접 링크를 사용해 주세요.<br>또는 사내 포털에서 다시 접속하시기 바랍니다.</p>
</div></body></html>`;
    await writeFile(join(outDir, 'index.html'), placeholder, 'utf8');
    log('  ✓ /index.html 을 안전한 placeholder로 교체');
  }

  // 2-d. 배포에 포함될 고객사 외 제거
  const docsDir = join(outDir, 'docs');
  if (existsSync(docsDir)) {
    const present = (await readdir(docsDir, { withFileTypes: true }))
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    const allowSet = new Set(customerIds);
    for (const id of present) {
      if (!allowSet.has(id) && !id.startsWith('__')) {
        await rm(join(docsDir, id), { recursive: true, force: true });
        log(`  ✓ 미포함 고객사 제거: ${id}`);
      }
    }
  }

  return outDir;
}

// ─── 매니페스트 ──────────────────────────────────────────────────────────
async function walkSize(dir) {
  let count = 0,
    bytes = 0;
  async function walk(d) {
    const entries = await readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const full = join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else {
        count++;
        const s = await stat(full);
        bytes += s.size;
      }
    }
  }
  await walk(dir);
  return { count, bytes };
}

async function gatherCustomerVersions(customerIds) {
  const out = [];
  for (const id of customerIds) {
    try {
      const cfg = parseYaml(
        await readFile(join(ROOT, 'customers', id, 'customer.yml'), 'utf8')
      );
      out.push({
        id,
        name: cfg?.customer?.name ?? id,
        product: cfg?.product?.name ?? null,
        version: cfg?.product?.version ?? null,
      });
    } catch {
      out.push({ id, name: id, product: null, version: null });
    }
  }
  return out;
}

function getGitInfo() {
  try {
    const commit = execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
    let dirty = false;
    try {
      const s = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
      dirty = s.trim().length > 0;
    } catch {}
    return { commit, branch, dirty };
  } catch {
    return { commit: null, branch: null, dirty: null };
  }
}

async function writeManifest(outDir, target, targetName, customerIds) {
  const { count, bytes } = await walkSize(outDir);
  const manifest = {
    target: targetName,
    target_description: target.description ?? null,
    base_url: target.base_url ?? null,
    deployed_at: new Date().toISOString(),
    deployer: process.env.USERNAME || process.env.USER || 'unknown',
    git: getGitInfo(),
    policy: {
      include_admin_index: !!target.include_admin_index,
      strip_root_index: !!target.strip_root_index,
      strip_base_preview: !!target.strip_base_preview,
    },
    customers: await gatherCustomerVersions(customerIds),
    artifacts: {
      file_count: count,
      total_bytes: bytes,
      output_dir: relative(ROOT, outDir).split(sep).join('/'),
    },
  };
  await writeFile(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  log(`  ✓ manifest.json 작성 (파일 ${count}개, ${(bytes / 1024).toFixed(1)} KB)`);
  return manifest;
}

async function appendHistory(manifest) {
  await mkdir(DEPLOY_ROOT, { recursive: true });
  const histPath = join(DEPLOY_ROOT, 'history.json');
  let history = [];
  if (existsSync(histPath)) {
    try {
      history = JSON.parse(await readFile(histPath, 'utf8'));
    } catch {
      history = [];
    }
  }
  history.unshift({
    deployed_at: manifest.deployed_at,
    target: manifest.target,
    deployer: manifest.deployer,
    customers: manifest.customers.map((c) => `${c.id}@${c.version || '?'}`),
    file_count: manifest.artifacts.file_count,
    git_commit: manifest.git?.commit ? manifest.git.commit.slice(0, 8) : null,
    git_dirty: manifest.git?.dirty ?? null,
  });
  // 최근 50개만 유지
  history = history.slice(0, 50);
  await writeFile(histPath, JSON.stringify(history, null, 2), 'utf8');
  log(`  ✓ 배포 이력 기록 → dist/deploy/history.json`);
}

// ─── 메인 ────────────────────────────────────────────────────────────────
async function main() {
  const targetName = String(args.target);
  const target = await loadTargetConfig(targetName);

  // 고객사 결정
  let customerIds;
  if (args.customers) {
    customerIds = String(args.customers).split(',').map((s) => s.trim()).filter(Boolean);
  } else if (target.customers === 'all' || !target.customers) {
    customerIds = await listCustomers();
  } else if (Array.isArray(target.customers)) {
    customerIds = target.customers;
  } else {
    fail(`잘못된 customers 설정: ${target.customers}`);
  }

  if (args['dry-run']) {
    console.log('\n=== DRY RUN — 실제 실행하지 않음 ===');
    console.log('Target  :', targetName);
    console.log('정책    :', JSON.stringify(target, null, 2));
    console.log('고객사  :', customerIds);
    console.log('출력    :', join(DEPLOY_ROOT, targetName));
    console.log('====================================\n');
    return;
  }

  await preflight(target, customerIds);

  if (!args['skip-build']) {
    runBuildLoop(customerIds);
  } else {
    log('--skip-build 지정 — 기존 dist/site 사용');
  }

  const outDir = await packageDeploy(target, customerIds, targetName);
  const manifest = await writeManifest(outDir, target, targetName, customerIds);
  await appendHistory(manifest);

  console.log(`\n✓ 배포 패키지 준비 완료: ${relative(ROOT, outDir)}`);
  console.log(`  매니페스트: ${relative(ROOT, join(outDir, 'manifest.json'))}`);
  console.log(`\n다음 단계: 위 폴더를 호스팅 대상에 업로드하세요.`);
  console.log(`  S3 예: aws s3 sync ${relative(ROOT, outDir).split(sep).join('/')}/ s3://<bucket>/ --delete`);
}

main().catch((e) => {
  console.error('\n[deploy] FAIL:', e.message);
  process.exit(1);
});
