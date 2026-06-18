// admin-deploy.mjs
// /admin/deploy.html — 운영 배포 가이드 + 대시보드 페이지를 생성한다.
// 정적 페이지이므로 실행은 admin이 터미널에서 직접 하지만, UI는:
//   - 사전 검증 상태 (어떤 고객사가 빌드되어 있고 정의되어 있는지)
//   - 단계별 워크플로우와 명령어 (클릭 한 번으로 클립보드 복사)
//   - 최근 배포 이력 (history.json 임베드)
//   - 현재 매니페스트 (각 환경별 manifest.json 임베드)

import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { maskCustomerLabel } from './mask.mjs';

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

const INDUSTRY_LABELS = {
  financial: '금융', manufacturing: '제조', public: '공공',
  retail: '유통', healthcare: '의료', other: '기타',
};

async function readJsonSafe(path) {
  if (!existsSync(path)) return null;
  try { return JSON.parse(await readFile(path, 'utf8')); }
  catch { return null; }
}

async function readYamlSafe(path) {
  if (!existsSync(path)) return null;
  try { return parseYaml(await readFile(path, 'utf8')); }
  catch { return null; }
}

export async function buildAdminDeployPage({ siteRoot, customersRoot, configPath, deployRoot }) {
  const adminDir = join(siteRoot, 'admin');

  // 정의된 고객사
  const definedIds = existsSync(customersRoot)
    ? (await readdir(customersRoot, { withFileTypes: true }))
        .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
        .map((e) => e.name)
        .filter((id) => existsSync(join(customersRoot, id, 'customer.yml')))
    : [];

  const customers = [];
  for (const id of definedIds) {
    const cfg = await readYamlSafe(join(customersRoot, id, 'customer.yml'));
    const builtPath = join(siteRoot, 'docs', id, 'index.html');
    let builtAt = null;
    if (existsSync(builtPath)) {
      const s = await stat(builtPath);
      builtAt = s.mtime.toISOString();
    }
    customers.push({
      id,
      name: cfg?.customer?.name ?? id,
      industry: cfg?.customer?.industry ?? null,
      version: cfg?.product?.version ?? null,
      built: !!builtAt,
      builtAt,
    });
  }

  // 배포 설정
  const deployConfig = await readYamlSafe(configPath);
  const targets = deployConfig?.targets ?? {};

  // 배포 이력
  const history = (await readJsonSafe(join(deployRoot, 'history.json'))) ?? [];

  // 각 target의 매니페스트
  const manifests = {};
  for (const targetName of Object.keys(targets)) {
    manifests[targetName] = await readJsonSafe(
      join(deployRoot, targetName, 'manifest.json')
    );
  }

  const html = render({ customers, targets, manifests, history });
  await writeFile(join(adminDir, 'deploy.html'), html, 'utf8');
}

function render({ customers, targets, manifests, history }) {
  const builtCount = customers.filter((c) => c.built).length;
  const allBuilt = customers.length > 0 && builtCount === customers.length;

  const customerRows = customers.map((c) => {
    const industryLabel = c.industry ? INDUSTRY_LABELS[c.industry] || c.industry : '';
    const builtAt = c.builtAt ? new Date(c.builtAt).toLocaleString('ko-KR') : '—';
    const statusClass = c.built ? 'ok' : 'warn';
    const statusText = c.built ? '✓ 빌드됨' : '⚠ 미빌드';
    return `<tr>
      <td><strong>${escapeHtml(maskCustomerLabel(c.name))}</strong></td>
      <td><code>${escapeHtml(maskCustomerLabel(c.id))}</code></td>
      <td>${escapeHtml(industryLabel)}</td>
      <td>${escapeHtml(c.version || '—')}</td>
      <td><span class="status ${statusClass}">${statusText}</span></td>
      <td class="dim">${escapeHtml(builtAt)}</td>
    </tr>`;
  }).join('\n');

  const targetCards = Object.entries(targets).map(([name, t]) => {
    const m = manifests[name];
    const lastDeploy = m
      ? `<div class="meta-row"><span class="label">최근 배포</span> ${escapeHtml(new Date(m.deployed_at).toLocaleString('ko-KR'))} (by ${escapeHtml(m.deployer || 'unknown')})</div>
         <div class="meta-row"><span class="label">파일 수</span> ${escapeHtml(String(m.artifacts?.file_count ?? '—'))}개 (${((m.artifacts?.total_bytes ?? 0) / 1024).toFixed(1)} KB)</div>
         <div class="meta-row"><span class="label">고객사</span> ${escapeHtml(m.customers?.map(c => `${maskCustomerLabel(c.name)}@${c.version || '?'}`).join(', ') || '—')}</div>
         <div class="meta-row"><span class="label">Git</span> <code>${escapeHtml((m.git?.commit ?? '').slice(0,8) || '—')}</code> ${m.git?.dirty ? '<span class="status warn">dirty</span>' : ''}</div>`
      : '<div class="meta-row dim">아직 이 환경으로 배포된 적이 없습니다.</div>';

    const policyBadges = [
      t.include_admin_index ? '<span class="badge badge-on">/admin/ 포함</span>' : '<span class="badge badge-off">/admin/ 제외</span>',
      t.strip_root_index ? '<span class="badge badge-on">root index 차단</span>' : '<span class="badge badge-off">root index 유지</span>',
      t.strip_base_preview ? '<span class="badge badge-on">미리보기 제거</span>' : '',
      t.require_clean_git ? '<span class="badge badge-on">Git clean 필수</span>' : '',
    ].filter(Boolean).join(' ');

    const cmd = `node build/deploy.mjs --target ${name}`;
    const dryCmd = `node build/deploy.mjs --target ${name} --dry-run`;

    return `<div class="target-card target-${escapeHtml(name)}">
      <div class="target-head">
        <h3>${escapeHtml(name)}</h3>
        <span class="dim">${escapeHtml(t.description || '')}</span>
      </div>
      <div class="meta-row"><span class="label">URL</span> <code>${escapeHtml(t.base_url || '—')}</code></div>
      <div class="meta-row"><span class="label">정책</span> ${policyBadges}</div>
      ${lastDeploy}
      <div class="cmd-block">
        <div class="cmd-label">사전 점검 (실행 안 함)</div>
        <div class="cmd-row"><code id="cmd-dry-${escapeHtml(name)}">${escapeHtml(dryCmd)}</code><button class="copy-btn" onclick="copyCmd('cmd-dry-${escapeHtml(name)}', this)">📋 복사</button></div>
        <div class="cmd-label">배포 실행</div>
        <div class="cmd-row"><code id="cmd-run-${escapeHtml(name)}">${escapeHtml(cmd)}</code><button class="copy-btn" onclick="copyCmd('cmd-run-${escapeHtml(name)}', this)">📋 복사</button></div>
      </div>
      ${t.notes ? `<div class="notes">${escapeHtml(t.notes).split('\n').map(l => l.trim()).filter(Boolean).map(l => `<div>${escapeHtml(l)}</div>`).join('')}</div>` : ''}
    </div>`;
  }).join('\n');

  const historyRows = history.length === 0
    ? '<tr><td colspan="6" class="dim" style="text-align:center;padding:24px">아직 배포 이력이 없습니다.</td></tr>'
    : history.slice(0, 20).map((h) => `<tr>
        <td class="dim">${escapeHtml(new Date(h.deployed_at).toLocaleString('ko-KR'))}</td>
        <td><span class="badge badge-${escapeHtml(h.target)}">${escapeHtml(h.target)}</span></td>
        <td>${escapeHtml(h.deployer || '—')}</td>
        <td>${escapeHtml((h.customers || []).join(', '))}</td>
        <td>${escapeHtml(String(h.file_count ?? '—'))}</td>
        <td><code>${escapeHtml(h.git_commit || '—')}</code> ${h.git_dirty ? '<span class="status warn">dirty</span>' : ''}</td>
      </tr>`).join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>운영 배포 - 관리자</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root {
    --bg:#f7f8fa; --fg:#1a1d21; --sub:#5a6168; --border:#e1e4e8;
    --primary:#3949ab; --primary-bg:#e8eaf6;
    --ok:#0d7a3d; --ok-bg:#e6f4ea;
    --warn:#856404; --warn-bg:#fff3cd;
    --danger:#8b1f24; --danger-bg:#fde2e4;
  }
  * { box-sizing: border-box; }
  body { margin:0; font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; background:var(--bg); color:var(--fg); line-height:1.55; font-size: 14px; }
  .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
  .topbar { display:flex; align-items:center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .topbar a { color: var(--primary); text-decoration: none; font-size: 13px; }
  .topbar a:hover { text-decoration: underline; }
  .topbar .sep { color: #ccc; }
  h1 { margin: 0 0 4px; font-size: 26px; }
  .subtitle { color: var(--sub); margin: 0 0 24px; font-size: 14px; }
  h2 { margin: 32px 0 12px; font-size: 18px; padding-bottom: 8px; border-bottom: 2px solid var(--border); }
  h3 { margin: 0 0 8px; font-size: 16px; }

  .step-num { display:inline-block; width:28px; height:28px; line-height:28px; background:var(--primary); color:white; border-radius:50%; text-align:center; font-weight:600; margin-right: 8px; font-size: 13px; }

  table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--border); }
  th { background: #f0f1f3; font-weight: 600; font-size: 13px; color: var(--sub); }
  tr:last-child td { border-bottom: none; }
  td.dim, .dim { color: var(--sub); font-size: 13px; }
  td code, .meta-row code { background:#f0f1f3; padding: 1px 6px; border-radius: 3px; font-size: 12px; }

  .status { display:inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; }
  .status.ok { background: var(--ok-bg); color: var(--ok); }
  .status.warn { background: var(--warn-bg); color: var(--warn); }

  .preflight-summary { padding: 14px 18px; border-radius: 8px; margin: 8px 0 16px; font-size: 14px; }
  .preflight-summary.ok { background: var(--ok-bg); color: var(--ok); border-left: 4px solid var(--ok); }
  .preflight-summary.warn { background: var(--warn-bg); color: var(--warn); border-left: 4px solid var(--warn); }

  .target-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 16px; }
  .target-card { background: white; border:1px solid var(--border); border-radius: 10px; padding: 18px; }
  .target-card.target-production { border-top: 3px solid var(--danger); }
  .target-card.target-staging { border-top: 3px solid var(--primary); }
  .target-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
  .meta-row { font-size: 13px; margin: 4px 0; }
  .meta-row .label { display: inline-block; min-width: 80px; color: #999; }

  .badge { display: inline-block; padding: 1px 7px; border-radius: 10px; font-size: 11px; margin-right: 4px; }
  .badge-on { background: var(--ok-bg); color: var(--ok); }
  .badge-off { background: #f0f1f3; color: var(--sub); }
  .badge-staging { background: var(--primary-bg); color: var(--primary); }
  .badge-production { background: var(--danger-bg); color: var(--danger); font-weight: 600; }

  .cmd-block { margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--border); }
  .cmd-label { font-size: 11px; color: var(--sub); text-transform: uppercase; letter-spacing: 0.5px; margin: 6px 0 4px; }
  .cmd-row { display:flex; align-items:stretch; gap: 6px; margin-bottom: 6px; }
  .cmd-row code { flex: 1; background: #1a1d21; color: #e6e8eb; padding: 8px 12px; border-radius: 6px; font-family: 'JetBrains Mono', Consolas, monospace; font-size: 12px; overflow-x: auto; white-space: nowrap; }
  .copy-btn { background: white; border: 1px solid var(--border); border-radius: 6px; padding: 0 10px; cursor: pointer; font-size: 12px; white-space: nowrap; }
  .copy-btn:hover { background: var(--primary-bg); border-color: var(--primary); color: var(--primary); }
  .copy-btn.copied { background: var(--ok-bg); color: var(--ok); border-color: var(--ok); }

  .notes { margin-top: 12px; padding: 10px 12px; background: #fafbfc; border-radius: 6px; font-size: 12px; color: var(--sub); border-left: 3px solid var(--border); }
  .notes div { margin: 2px 0; }

  .upload-section { background: white; border: 1px solid var(--border); border-radius: 10px; padding: 18px; }
  .upload-section h3 { margin-top: 0; }
  .upload-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-top: 12px; }
  .upload-option { padding: 12px; background: #fafbfc; border-radius: 6px; border: 1px solid var(--border); }
  .upload-option strong { display: block; margin-bottom: 6px; }

  footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid var(--border); color: var(--sub); font-size: 12px; }
</style>
</head>
<body>
<div class="container">
  <div class="topbar">
    <a href="index.html">← 고객사 목록</a>
    <span class="sep">|</span>
    <a href="../index.html">메인</a>
    <span class="sep">|</span>
    <a href="customers.html">📚 매뉴얼 관리</a>
  </div>

  <h1>🚀 운영 배포</h1>
  <p class="subtitle">Xgen_Manual 빌드 결과를 호스팅 환경으로 배포하는 워크플로우입니다. 실제 명령은 터미널에서 실행됩니다.</p>

  <h2><span class="step-num">1</span>사전 검증</h2>
  <div class="preflight-summary ${allBuilt ? 'ok' : 'warn'}">
    ${allBuilt
      ? `✓ 정의된 고객사 ${customers.length}개 모두 빌드되어 있습니다. 배포 준비 완료.`
      : `⚠ 정의된 고객사 ${customers.length}개 중 ${builtCount}개만 빌드되어 있습니다. 배포 스크립트는 자동으로 전체 재빌드를 수행합니다.`}
  </div>

  <table>
    <thead>
      <tr><th>고객사</th><th>ID</th><th>산업</th><th>버전</th><th>빌드 상태</th><th>최근 빌드</th></tr>
    </thead>
    <tbody>
      ${customerRows || '<tr><td colspan="6" class="dim" style="text-align:center;padding:24px">정의된 고객사가 없습니다.</td></tr>'}
    </tbody>
  </table>

  <h2><span class="step-num">2</span>배포 환경 선택 및 실행</h2>
  <p class="dim">각 환경의 정책은 <code>deploy.config.yml</code> 에서 관리됩니다. 명령어를 복사해 터미널에서 실행하세요.</p>
  <div class="target-grid">
    ${targetCards || '<div class="dim">deploy.config.yml에 target이 정의되지 않았습니다.</div>'}
  </div>

  <h2><span class="step-num">3</span>호스팅 업로드 (수동)</h2>
  <div class="upload-section">
    <p style="margin-top:0">배포 스크립트는 <code>dist/deploy/&lt;target&gt;/</code> 폴더에 정적 파일을 준비할 뿐, 호스팅 업로드는 수행하지 않습니다. 환경에 맞는 방법을 선택하세요.</p>
    <div class="upload-options">
      <div class="upload-option">
        <strong>AWS S3 + CloudFront</strong>
        <div class="cmd-row"><code id="cmd-s3">aws s3 sync dist/deploy/production/ s3://&lt;bucket&gt;/ --delete</code><button class="copy-btn" onclick="copyCmd('cmd-s3', this)">📋</button></div>
      </div>
      <div class="upload-option">
        <strong>nginx (rsync)</strong>
        <div class="cmd-row"><code id="cmd-rsync">rsync -avz --delete dist/deploy/production/ user@host:/var/www/manual/</code><button class="copy-btn" onclick="copyCmd('cmd-rsync', this)">📋</button></div>
      </div>
      <div class="upload-option">
        <strong>Cloudflare Pages</strong>
        <div class="cmd-row"><code id="cmd-cf">wrangler pages deploy dist/deploy/production/ --project-name xgen-manual</code><button class="copy-btn" onclick="copyCmd('cmd-cf', this)">📋</button></div>
      </div>
      <div class="upload-option">
        <strong>로컬 검증 (HTTP)</strong>
        <div class="cmd-row"><code id="cmd-py">cd dist/deploy/production; python -m http.server 8080</code><button class="copy-btn" onclick="copyCmd('cmd-py', this)">📋</button></div>
      </div>
    </div>
  </div>

  <h2><span class="step-num">4</span>배포 이력</h2>
  <p class="dim">최근 20건. 전체는 <code>dist/deploy/history.json</code> 참조.</p>
  <table>
    <thead>
      <tr><th>일시</th><th>환경</th><th>배포자</th><th>고객사</th><th>파일 수</th><th>Git</th></tr>
    </thead>
    <tbody>${historyRows}</tbody>
  </table>

  <footer>
    이 페이지는 빌드 시 자동 생성됩니다. 재생성: <code>node build/build.mjs --index-only</code><br>
    배포 정책 수정: <code>deploy.config.yml</code> 편집 후 빌드 재실행
  </footer>
</div>

<script>
function copyCmd(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  const text = el.textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = '✓ 복사됨';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 1500);
    });
  } else {
    // Fallback for file:// 환경
    const r = document.createRange();
    r.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    btn.textContent = '✓ 복사됨';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '📋 복사'; btn.classList.remove('copied'); }, 1500);
  }
}
</script>
</body>
</html>`;
}
