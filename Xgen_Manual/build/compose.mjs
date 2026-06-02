// compose.mjs
// fork-on-create 모델: customers/<id>/manual/ 트리를 .build/composed/<id>/docs/ 로 복사하고
// 변수 치환 후 mkdocs.yml을 생성한다. base를 매번 합성하던 이전 모델과 달리,
// 고객사 manual은 이미 독립적인 콘텐츠 사본이므로 단순 복사 + 변수 치환만 수행한다.
//
// 특수 케이스: customer.id === 'xgen-standard' 이면 customers/xgen-standard/manual/ 대신
// base/ 디렉토리를 직접 docs source로 사용한다 (Xgen 표준 매뉴얼).

import { readFile, writeFile, cp, rm, mkdir, readdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { maskCustomerLabel } from './lib/mask.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..');

const PATHS = {
  base: join(ROOT, 'base'),
  customers: join(ROOT, 'customers'),
  shared: join(ROOT, 'shared'),
  build: join(ROOT, '.build'),
  mkdocsBase: join(ROOT, 'mkdocs.base.yml'),
  screenTruth: join(ROOT, 'screen-truth.json'),
};

// ─── 유틸 ──────────────────────────────────────────────────────────────────

async function walkFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkFiles(full)));
    } else {
      out.push(full);
    }
  }
  return out;
}

function lookupVar(path, ctx) {
  const parts = path.split('.');
  let cur = ctx;
  for (const k of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[k];
  }
  return cur;
}

function substituteVars(text, ctx) {
  return text.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (match, path) => {
    const v = lookupVar(path, ctx);
    return v === undefined ? match : String(v);
  });
}

// ─── frontmatter 파싱 ──────────────────────────────────────────────────────
// .md 상단의 `--- ... ---` 블록을 파싱. 없으면 meta={}, body=원문.
function parseFrontmatter(text) {
  if (!text.startsWith('---\n') && !text.startsWith('---\r\n')) {
    return { meta: {}, body: text };
  }
  const headerStart = text.indexOf('\n') + 1;
  const closer = text.indexOf('\n---', headerStart);
  if (closer < 0) return { meta: {}, body: text };
  const yamlStr = text.slice(headerStart, closer);
  // body 시작: closer 이후 '\n---' 다음 줄바꿈
  const afterFence = text.indexOf('\n', closer + 4);
  const body = afterFence < 0 ? '' : text.slice(afterFence + 1);
  try {
    return { meta: parseYaml(yamlStr) || {}, body };
  } catch {
    return { meta: {}, body: text };
  }
}

// ─── screen-truth.json 로드 ────────────────────────────────────────────────
// 캡처가 stg 에서 실제 본 view 의 가용 여부. 파일 없거나 손상되면 빈 객체
// fallback — 즉 어떤 챕터도 제외하지 않음 (안전 디폴트).
//
// customerId 가 주어지고 customers/<id>/screen-truth.json 이 존재하면 *그 파일을 우선* 사용.
// 이로써 같은 base/ 콘텐츠로 다른 환경(예: main 브랜치 = xgen.x2bee.com)을 타깃하는
// 커스터머가 자기 환경에서 미존재한 view 를 별도로 표시할 수 있음.
async function loadScreenTruth(customerId) {
  const candidates = [];
  if (customerId) {
    candidates.push(join(PATHS.customers, customerId, 'screen-truth.json'));
  }
  candidates.push(PATHS.screenTruth);

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    try {
      const raw = await readFile(path, 'utf8');
      const parsed = JSON.parse(raw);
      console.log(`[compose${customerId ? `:${customerId}` : ''}] screen-truth source: ${relative(ROOT, path).split(sep).join('/')}`);
      return { ...parsed, views: parsed.views || {} };
    } catch (e) {
      console.warn(`[compose] screen-truth 파싱 실패 (${path}): ${e.message}`);
    }
  }
  return { views: {} };
}

// ─── 고객사 설정 로드 ───────────────────────────────────────────────────────

export async function loadCustomerConfig(customerId) {
  const dir = join(PATHS.customers, customerId);
  const ymlPath = join(dir, 'customer.yml');
  if (!existsSync(ymlPath)) {
    throw new Error(`customer.yml not found: ${ymlPath}`);
  }
  const raw = await readFile(ymlPath, 'utf8');
  const cfg = parseYaml(raw);

  if (!cfg?.customer?.id) throw new Error(`${customerId}: customer.id missing`);
  if (cfg.customer.id !== customerId) {
    throw new Error(
      `${customerId}: customer.id (${cfg.customer.id}) != folder name (${customerId})`
    );
  }
  if (!cfg?.product?.name || !cfg?.product?.version) {
    throw new Error(`${customerId}: product.name and product.version are required`);
  }
  if (!cfg?.manual?.version) {
    throw new Error(
      `${customerId}: manual.version is required (예: "${cfg.product.version}-rev1"). ` +
        `같은 product.version에 대해 여러 매뉴얼 리비전이 존재할 수 있으므로 명시적으로 지정해야 합니다.`
    );
  }

  cfg.__paths = {
    customerDir: dir,
    manualDir: join(dir, 'manual'),
    brandingDir: join(dir, 'branding'),
  };
  return cfg;
}

export async function listCustomers() {
  const entries = await readdir(PATHS.customers, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => e.name);
}

// ─── 합성 메인 ─────────────────────────────────────────────────────────────

/**
 * customer/<id>/manual/ 트리를 .build/composed/<id>/docs/ 로 복사하고 변수 치환.
 * __base_preview__ 인 경우 base/ 디렉토리를 직접 source로 사용.
 */
export async function compose(customerId) {
  const cfg = await loadCustomerConfig(customerId);

  const composedRoot = join(PATHS.build, 'composed', customerId);
  const docsDir = join(composedRoot, 'docs');

  // 1. 깨끗한 출력 디렉토리
  await rm(composedRoot, { recursive: true, force: true });
  await mkdir(docsDir, { recursive: true });

  // 2. 매뉴얼 소스 결정 — base/ 직접 사용하는 customer 들 vs 자체 customers/<id>/manual/ 사용
  //    base/ 사용: xgen-standard (stg), xgen-main (main), jeju-bank (jeju-dev)
  //      각각 자기 customers/<id>/screen-truth.json 의 ok:false view 로 환경별 갭만 자동 제외.
  const BASE_BACKED_CUSTOMERS = new Set(['xgen-standard', 'xgen-main', 'jeju-bank', 'gs-cert']);
  const usesBase = BASE_BACKED_CUSTOMERS.has(customerId);
  const manualSrc = usesBase ? PATHS.base : cfg.__paths.manualDir;
  if (!existsSync(manualSrc)) {
    throw new Error(
      `[compose:${customerId}] 매뉴얼 소스가 없습니다: ${manualSrc}\n` +
        `  → 신규 고객사라면 'node build/new-customer.mjs --id ${customerId}'로 base에서 복사하세요.`
    );
  }

  // 3. 매뉴얼 트리 통째 복사
  await cp(manualSrc, docsDir, { recursive: true });

  // 3a. customer-specific overlay — base/ 를 공유하는 customer (xgen-main / jeju-bank 등) 가
  //     자신만의 캡처(예: 고객사 사용자명이 보이는 PNG) 로 base 파일을 덮어쓰고 싶을 때 사용.
  //     customers/<id>/overlay/<rel> 가 있으면 .build/composed/<id>/docs/<rel> 로 복사.
  //     예: customers/jeju-bank/overlay/user/images/login.png
  //         → .build/composed/jeju-bank/docs/user/images/login.png 로 덮어씀.
  if (usesBase) {
    const overlayDir = join(cfg.__paths.customerDir, 'overlay');
    if (existsSync(overlayDir)) {
      const overlayFiles = await walkFiles(overlayDir);
      let overlaidCount = 0;
      for (const f of overlayFiles) {
        const rel = relative(overlayDir, f).split(sep).join('/');
        const dst = join(docsDir, rel);
        await mkdir(dirname(dst), { recursive: true });
        await copyFile(f, dst);
        overlaidCount++;
      }
      if (overlaidCount > 0) {
        console.log(
          `[compose:${customerId}] overlaid ${overlaidCount} customer file(s) from customers/${customerId}/overlay/`
        );
      }
    }
  }

  // 4. shared/scripts → docs/assets/js
  const sharedScripts = join(PATHS.shared, 'scripts');
  if (existsSync(sharedScripts)) {
    const scriptsDst = join(docsDir, 'assets', 'js');
    await mkdir(scriptsDst, { recursive: true });
    await cp(sharedScripts, scriptsDst, { recursive: true });
  }

  // 5. shared/styles → docs/assets/css
  const sharedStyles = join(PATHS.shared, 'styles');
  if (existsSync(sharedStyles)) {
    const stylesDst = join(docsDir, 'assets', 'css');
    await mkdir(stylesDst, { recursive: true });
    await cp(sharedStyles, stylesDst, { recursive: true });
  }

  // 6. 변수 치환 — 모든 .md 파일에 대해
  //    고객사명은 대외비라 마스킹된 버전을 macro context 와 site_name 에 주입.
  //    표준 매뉴얼(xgen-standard)은 마스킹 제외. customer.id 는 경로용이라 raw 유지.
  const isStandard = BASE_BACKED_CUSTOMERS.has(customerId);
  const displayCustomer = isStandard
    ? cfg.customer
    : { ...cfg.customer, name: maskCustomerLabel(cfg.customer.name) };
  const ctx = {
    customer: displayCustomer,
    product: cfg.product,
    manual: cfg.manual,
    build: cfg.build ?? {},
    vars: cfg.vars ?? {},
  };
  const mdFiles = (await walkFiles(docsDir)).filter((f) => f.endsWith('.md'));

  // 6a. 변수 치환 + frontmatter 의 require_view 수집
  //     require_view 가 가리키는 view 가 screen-truth.json 에서 ok:false 면 nav 제외 대상.
  //     i18n suffix(.en.md) 형제 파일도 함께 제외 — 두 언어 모두 nav 에서 숨기기 위해.
  const screenTruth = await loadScreenTruth(customerId);
  const excludedRelPaths = []; // docsDir 기준 상대 경로 (POSIX) — mkdocs not_in_nav 용
  for (const f of mdFiles) {
    const text = await readFile(f, 'utf8');
    const { meta } = parseFrontmatter(text);
    const replaced = substituteVars(text, ctx);
    if (replaced !== text) await writeFile(f, replaced, 'utf8');

    const requireView = meta?.require_view;
    if (!requireView) continue;
    const wanted = Array.isArray(requireView) ? requireView : [requireView];
    const anyMissing = wanted.some((v) => screenTruth.views?.[v]?.ok === false);
    if (!anyMissing) continue;

    const rel = relative(docsDir, f).split(sep).join('/');
    excludedRelPaths.push(rel);
    console.log(
      `[compose:${customerId}] hide from nav: ${rel} (require_view: ${wanted.join(', ')}) — stg 에서 미확인`
    );
  }

  // 6b. mkdocs `not_in_nav` 으로 제외 — awesome-pages 가 만든 nav 위에서도 동작.
  //     이전엔 디렉토리별 .pages 명시 nav 를 썼으나 i18n suffix 모드와 충돌해 빌드 실패.
  //     not_in_nav 는 mkdocs 1.5+ 코어 기능으로 "파일은 빌드하되 nav 에서만 제거" 를 보장.
  //     base/en 챕터 양쪽 다 빌드되어 직접 URL 접근은 유지됨.
  // (실제 주입은 아래 mkdocs.yml 생성 단계에서 baseMkdocs.not_in_nav 에 셋팅)

  // 6c-pre. 인라인 require_view 마커 처리.
  //   라인의 어딘가에 `<!-- require_view: <view-id> -->` 가 있고 해당 view 가
  //   screen-truth 에서 ok:false 이면 그 라인 전체 제거.
  //   챕터 단위가 아닌 *표 행 / 절 / 한 줄짜리 본문* 단위 갭 표현에 사용.
  //   예: customers/xgen-main 에서 라이브에 없는 메뉴 행만 골라 가릴 때.
  {
    const inlineMarkerRegex = /<!--\s*require_view:\s*([a-zA-Z0-9_-]+)\s*-->/;
    const inlineExcludedSet = new Set(excludedRelPaths);
    for (const f of mdFiles) {
      const relPath = relative(docsDir, f).split(sep).join('/');
      // nav 제외 챕터여도 본문 strip 은 수행 — 직접 URL 진입 시에도 해당 라인이 보이지 않도록.

      const text = await readFile(f, 'utf8');
      let strippedCount = 0;
      const out = text.split(/\r?\n/).filter((line) => {
        const m = line.match(inlineMarkerRegex);
        if (!m) return true;
        const view = m[1];
        if (screenTruth.views?.[view]?.ok === false) {
          strippedCount++;
          return false;
        }
        return true;
      });
      if (strippedCount > 0) {
        await writeFile(f, out.join('\n'), 'utf8');
        console.log(
          `[compose:${customerId}] strip ${strippedCount} inline-marker line(s) → ${relPath}`
        );
      }
    }

    // 6c-pre-block. 블록 단위 require_view 마커 처리.
    //   `<!-- require_view_start: <view-id> -->` 와 `<!-- require_view_end -->` 사이의
    //   여러 줄 (헤딩 + 본문 + 표 + admonition 등) 을 통째로 제거.
    //   해당 view 가 ok:false 인 customer 에서만 블록 제거됨.
    //   섹션 단위(예: ### Harmbench 안전성 평가 절 전체) 갭 표현에 사용.
    //   ok:true 또는 미정의 view 의 경우 마커 자체만 제거(주석이라 안전).
    const blockStartRegex = /<!--\s*require_view_start:\s*([a-zA-Z0-9_-]+)\s*-->/;
    const blockEndRegex = /<!--\s*require_view_end\s*-->/;
    for (const f of mdFiles) {
      const relPath = relative(docsDir, f).split(sep).join('/');
      // nav 제외 챕터여도 본문 block strip 은 수행.

      const text = await readFile(f, 'utf8');
      const lines = text.split(/\r?\n/);
      const result = [];
      // 중첩 가드 지원 — depth counter 사용.
      // skipDepth > 0 이면 현재 외곽 strip 블록 안. 내부 start 도 함께 카운트 +1,
      // end 마다 -1. 0 으로 떨어지면 strip 영역 종료.
      let skipDepth = 0;
      let strippedLines = 0;
      let blockCount = 0;
      for (const line of lines) {
        if (skipDepth > 0) {
          const startInside = line.match(blockStartRegex);
          if (startInside) {
            skipDepth++;
          } else if (blockEndRegex.test(line)) {
            skipDepth--;
          }
          strippedLines++;
          continue;
        }
        const startMatch = line.match(blockStartRegex);
        if (startMatch) {
          const view = startMatch[1];
          if (screenTruth.views?.[view]?.ok === false) {
            skipDepth = 1; // 시작 마커도 함께 제거
            blockCount++;
            strippedLines++;
            continue;
          }
          // view 가 visible 하면 시작 마커만 제거(주석으로 남기면 노이즈)
          strippedLines++;
          continue;
        }
        if (blockEndRegex.test(line)) {
          // 매칭 안 된 end 마커는 단독 제거
          strippedLines++;
          continue;
        }
        result.push(line);
      }
      if (blockCount > 0) {
        await writeFile(f, result.join('\n'), 'utf8');
        console.log(
          `[compose:${customerId}] strip ${blockCount} block(s) (${strippedLines} lines) → ${relPath}`
        );
      } else if (strippedLines > 0) {
        // 마커만 있고 블록 비활성 없음 — 그래도 마커 정리해서 깔끔하게 출력
        await writeFile(f, result.join('\n'), 'utf8');
      }
    }
  }

  // 6c. 제외된 챕터를 가리키는 *테이블 행* 을 다른 챕터 본문에서도 자동 제거.
  //     사이드바 매핑 표(예: user/11-getting-started.md 의 "Agent 작업실 구성" 표,
  //     admin/20-admin-overview.md 의 "관리자 사이드바 요약" 표) 에 적힌 행이
  //     라이브에 없는 메뉴를 안내해 사용자 혼란을 유발하는 것을 방지.
  //
  //     룰: 라인이 `|` 로 시작(=md 테이블 행) 하고 본문에 `](<excluded-base>.md...)` 패턴이
  //         포함되면 그 라인 전체를 삭제. 다른 형태(문단·각주 등)는 영향 없음 — 그 경우는
  //         AUTHORING.md 0.3 절에 따라 수동 정리 대상.
  if (excludedRelPaths.length > 0) {
    const excludedBases = new Set(
      excludedRelPaths.map((rel) => rel.split('/').pop().replace(/\.en\.md$|\.md$/, ''))
    );
    const excludedSet = new Set(excludedRelPaths);
    for (const f of mdFiles) {
      const relPath = relative(docsDir, f).split(sep).join('/');
      if (excludedSet.has(relPath)) continue; // 자기 자신은 손대지 않음

      const text = await readFile(f, 'utf8');
      let strippedCount = 0;
      const out = text.split(/\r?\n/).filter((line) => {
        if (!line.startsWith('|')) return true; // 테이블 행만 대상
        for (const base of excludedBases) {
          // [text](anything/base.md), [text](base.md#anchor) 모두 매칭
          if (line.includes(`](${base}.md`) || line.includes(`/${base}.md`)) {
            strippedCount++;
            return false;
          }
        }
        return true;
      });
      if (strippedCount > 0) {
        await writeFile(f, out.join('\n'), 'utf8');
        console.log(
          `[compose:${customerId}] strip ${strippedCount} table row(s) → ${relPath} (excluded chapters: ${[...excludedBases].join(', ')})`
        );
      }
    }
  }

  // 7. mkdocs.yml 생성
  const baseMkdocs = parseYaml(await readFile(PATHS.mkdocsBase, 'utf8'));
  // site_name 은 mkdocs.base.yml 의 값('솔루션 가이드')을 그대로 사용 — 고객사명 접두 제거
  baseMkdocs.site_dir = join(ROOT, 'dist', 'site', 'docs', cfg.customer.id);
  baseMkdocs.docs_dir = 'docs';
  if (cfg.outputs?.html?.site_url && /^https?:\/\//.test(cfg.outputs.html.site_url)) {
    baseMkdocs.site_url = cfg.outputs.html.site_url;
  } else {
    delete baseMkdocs.site_url;
  }
  baseMkdocs.extra = {
    ...(baseMkdocs.extra ?? {}),
    customer: displayCustomer,
    product: cfg.product,
    manual: cfg.manual,
    build: cfg.build ?? {},
    vars: cfg.vars ?? {},
  };
  // 푸터 카피라이트에 제품·매뉴얼 버전 나란히 표기
  baseMkdocs.copyright =
    `${cfg.product.name} ${cfg.product.version} · 매뉴얼 ${cfg.manual.version}` +
    (cfg.manual.released_at ? ` (${cfg.manual.released_at})` : '');

  // screen-truth 기반 nav 제외 — mkdocs 1.5+ not_in_nav 멀티라인 스트링.
  // 각 줄은 docs_dir 기준 상대 경로. i18n .en.md 형제도 함께 등록해 두 언어 모두 숨김.
  if (excludedRelPaths.length > 0) {
    baseMkdocs.not_in_nav = excludedRelPaths.join('\n') + '\n';
  }

  const mkdocsYmlPath = join(composedRoot, 'mkdocs.yml');
  await writeFile(mkdocsYmlPath, stringifyYaml(baseMkdocs), 'utf8');

  return {
    composedRoot,
    docsDir,
    mkdocsConfig: mkdocsYmlPath,
    customerConfig: cfg,
  };
}

// CLI 진입점
if (import.meta.url === `file://${process.argv[1].split(sep).join('/')}`) {
  const id = process.argv[2];
  if (!id) {
    console.error('Usage: node build/compose.mjs <customer-id>');
    process.exit(1);
  }
  compose(id)
    .then((r) => console.log(`[compose:${id}] OK → ${r.composedRoot}`))
    .catch((e) => {
      console.error(e.message);
      process.exit(1);
    });
}
