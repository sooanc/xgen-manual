// admin-customers.mjs
// /admin/customers.html — 표준 매뉴얼 관리 + 신규 고객사 생성 워크플로우 페이지.
// 백엔드가 없으므로 폼 입력 → CLI 명령 생성 → 클립보드 복사 → 터미널 실행 패턴.

import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

const INDUSTRY_LABELS = {
  financial: '금융',
  manufacturing: '제조',
  public: '공공',
  retail: '유통',
  healthcare: '의료',
  other: '기타',
};

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

async function walkFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walkFiles(full)));
    else out.push(full);
  }
  return out;
}

async function inventoryBase(baseRoot) {
  if (!existsSync(baseRoot)) {
    return { exists: false };
  }
  const sections = ['common', 'user', 'admin'];
  const counts = {};
  let latestMtime = 0;
  for (const s of sections) {
    const dir = join(baseRoot, s);
    if (!existsSync(dir)) {
      counts[s] = 0;
      continue;
    }
    const files = (await walkFiles(dir)).filter((f) => f.endsWith('.md'));
    counts[s] = files.length;
    for (const f of files) {
      const st = await stat(f);
      if (st.mtimeMs > latestMtime) latestMtime = st.mtimeMs;
    }
  }
  return {
    exists: true,
    counts,
    total: counts.common + counts.user + counts.admin,
    latestMtime: latestMtime ? new Date(latestMtime) : null,
  };
}

async function listDefinedCustomers(customersRoot, siteRoot) {
  if (!existsSync(customersRoot)) return [];
  const entries = await readdir(customersRoot, { withFileTypes: true });
  // xgen-standard는 일반 고객사가 아니므로 표에서 제외 (별도 표시)
  const ids = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('_') && e.name !== 'xgen-standard')
    .map((e) => e.name);

  const out = [];
  for (const id of ids) {
    const ymlPath = join(customersRoot, id, 'customer.yml');
    if (!existsSync(ymlPath)) continue;
    let cfg = null;
    try {
      cfg = parseYaml(await readFile(ymlPath, 'utf8'));
    } catch {
      continue;
    }
    const manualDir = join(customersRoot, id, 'manual');
    const manualFiles = (await walkFiles(manualDir)).filter((f) => f.endsWith('.md'));
    const builtPath = join(siteRoot, 'docs', id, 'index.html');
    let builtAt = null;
    if (existsSync(builtPath)) {
      const s = await stat(builtPath);
      builtAt = s.mtime;
    }
    out.push({
      id,
      name: cfg?.customer?.name ?? id,
      industry: cfg?.customer?.industry ?? null,
      version: cfg?.product?.version ?? null,
      manualVersion: cfg?.manual?.version ?? null,
      manualReleasedAt: cfg?.manual?.released_at ?? null,
      domain: cfg?.product?.domain ?? null,
      manualFileCount: manualFiles.length,
      built: !!builtAt,
      builtAt,
    });
  }
  out.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  return out;
}

export async function buildAdminCustomersPage({ siteRoot, customersRoot, baseRoot }) {
  const baseInv = await inventoryBase(baseRoot);
  const customers = await listDefinedCustomers(customersRoot, siteRoot);
  const html = render({ baseInv, customers });
  await writeFile(join(siteRoot, 'admin', 'customers.html'), html, 'utf8');
}

function render({ baseInv, customers }) {
  const baseSection = baseInv.exists
    ? `<div class="standard-banner">
        <div>
          <div class="standard-title">📖 표준 매뉴얼</div>
          <div class="standard-sub">base/ 디렉토리에서 직접 편집 · ID: <code>xgen-standard</code></div>
        </div>
        <div class="standard-links">
          <a href="../docs/xgen-standard/index.html" target="_blank" class="standard-link primary">📄 표준 매뉴얼 보기</a>
        </div>
       </div>
       <div class="meta-grid">
        <div class="metric"><div class="metric-label">공통 챕터</div><div class="metric-value">${baseInv.counts.common}</div></div>
        <div class="metric"><div class="metric-label">사용자 챕터</div><div class="metric-value">${baseInv.counts.user}</div></div>
        <div class="metric"><div class="metric-label">관리자 챕터</div><div class="metric-value">${baseInv.counts.admin}</div></div>
        <div class="metric"><div class="metric-label">마지막 수정</div><div class="metric-value-sm">${baseInv.latestMtime ? escapeHtml(baseInv.latestMtime.toLocaleString('ko-KR')) : '—'}</div></div>
       </div>
       <div class="cmd-block">
         <div class="cmd-label">표준 매뉴얼 빌드 / 미리보기</div>
         <div class="cmd-row"><code id="cmd-build-std">node build/build.mjs --customer xgen-standard --formats html</code><button class="copy-btn" onclick="copyCmd('cmd-build-std', this)">📋 복사</button></div>
         <div class="cmd-row"><code id="cmd-serve">npm run serve:base</code><button class="copy-btn" onclick="copyCmd('cmd-serve', this)">📋 복사</button></div>
       </div>`
    : '<div class="empty">base/ 디렉토리를 찾을 수 없습니다.</div>';

  const customerRows = customers.length === 0
    ? '<tr><td colspan="7" class="dim" style="text-align:center;padding:24px">등록된 고객사가 없습니다. 아래 폼으로 첫 고객사를 추가하세요.</td></tr>'
    : customers.map((c) => {
        const industryLabel = c.industry ? INDUSTRY_LABELS[c.industry] || c.industry : '—';
        const builtAt = c.builtAt ? c.builtAt.toLocaleString('ko-KR') : '—';
        const statusClass = c.built ? 'ok' : 'warn';
        const statusText = c.built ? '✓ 빌드됨' : '⚠ 미빌드';
        const manualVer = c.manualVersion
          ? `${escapeHtml(c.manualVersion)}${c.manualReleasedAt ? ` <span class="dim">(${escapeHtml(c.manualReleasedAt)})</span>` : ''}`
          : '—';
        return `<tr>
          <td><strong>${escapeHtml(c.name)}</strong></td>
          <td><code>${escapeHtml(c.id)}</code></td>
          <td>${escapeHtml(industryLabel)}</td>
          <td>${escapeHtml(c.version || '—')}</td>
          <td>${manualVer}</td>
          <td>${escapeHtml(String(c.manualFileCount))}개 파일</td>
          <td><span class="status ${statusClass}">${statusText}</span> <span class="dim">${escapeHtml(builtAt)}</span></td>
        </tr>`;
      }).join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>매뉴얼 관리 - 관리자</title>
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
  body { margin:0; font-family: 'Noto Sans KR', system-ui, sans-serif; background:var(--bg); color:var(--fg); line-height:1.55; font-size:14px; }
  .container { max-width:1200px; margin:0 auto; padding:24px; }
  .topbar { display:flex; align-items:center; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
  .topbar a { color:var(--primary); text-decoration:none; font-size:13px; }
  .topbar a:hover { text-decoration:underline; }
  .topbar .sep { color:#ccc; }
  h1 { margin:0 0 4px; font-size:26px; }
  .subtitle { color:var(--sub); margin:0 0 24px; font-size:14px; }
  h2 { margin:32px 0 12px; font-size:18px; padding-bottom:8px; border-bottom:2px solid var(--border); }
  h3 { margin:0 0 8px; font-size:16px; }

  .step-num { display:inline-block; width:28px; height:28px; line-height:28px; background:var(--primary); color:white; border-radius:50%; text-align:center; font-weight:600; margin-right:8px; font-size:13px; }

  .panel { background:white; border:1px solid var(--border); border-radius:10px; padding:18px; }

  .meta-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px; margin-bottom:14px; }
  .metric { padding:14px; background:#fafbfc; border:1px solid var(--border); border-radius:8px; }
  .metric-label { font-size:12px; color:var(--sub); margin-bottom:4px; }
  .metric-value { font-size:24px; font-weight:600; color:var(--primary); }
  .metric-value-sm { font-size:13px; font-weight:500; color:var(--fg); }

  table { width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden; border:1px solid var(--border); }
  th, td { text-align:left; padding:10px 12px; border-bottom:1px solid var(--border); }
  th { background:#f0f1f3; font-weight:600; font-size:13px; color:var(--sub); }
  tr:last-child td { border-bottom:none; }
  td.dim, .dim { color:var(--sub); font-size:13px; }
  td code, .meta-row code { background:#f0f1f3; padding:1px 6px; border-radius:3px; font-size:12px; }

  .status { display:inline-block; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:500; margin-right:6px; }
  .status.ok { background:var(--ok-bg); color:var(--ok); }
  .status.warn { background:var(--warn-bg); color:var(--warn); }

  .cmd-block { margin-top:14px; padding-top:14px; border-top:1px dashed var(--border); }
  .cmd-label { font-size:11px; color:var(--sub); text-transform:uppercase; letter-spacing:0.5px; margin:6px 0 4px; }
  .cmd-row { display:flex; align-items:stretch; gap:6px; margin-bottom:6px; }
  .cmd-row code { flex:1; background:#1a1d21; color:#e6e8eb; padding:8px 12px; border-radius:6px; font-family:'JetBrains Mono', Consolas, monospace; font-size:12px; overflow-x:auto; white-space:pre; }
  .copy-btn { background:white; border:1px solid var(--border); border-radius:6px; padding:0 10px; cursor:pointer; font-size:12px; white-space:nowrap; }
  .copy-btn:hover { background:var(--primary-bg); border-color:var(--primary); color:var(--primary); }
  .copy-btn.copied { background:var(--ok-bg); color:var(--ok); border-color:var(--ok); }

  .form-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px; margin-bottom:14px; }
  .field { display:flex; flex-direction:column; gap:4px; }
  .field label { font-size:12px; font-weight:500; color:var(--fg); }
  .field label .req { color:var(--danger); margin-left:2px; }
  .field input, .field select { padding:8px 12px; border:1px solid var(--border); border-radius:6px; font-size:14px; background:white; font-family:inherit; }
  .field input:focus, .field select:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 3px rgba(57,73,171,0.1); }
  .field input.invalid { border-color:var(--danger); background:var(--danger-bg); }
  .field .hint { font-size:11px; color:var(--sub); margin-top:2px; }
  .field .err { font-size:11px; color:var(--danger); margin-top:2px; display:none; }
  .field.has-error .err { display:block; }

  .auto-tasks { margin-top:14px; padding:12px 14px; background:#fafbfc; border-radius:6px; font-size:13px; color:var(--sub); border-left:3px solid var(--primary); }
  .auto-tasks h4 { margin:0 0 6px; font-size:13px; color:var(--fg); }
  .auto-tasks ul { margin:0; padding-left:20px; }
  .auto-tasks li { margin:2px 0; }

  .info-tip { padding:10px 14px; background:var(--primary-bg); color:var(--primary); border-radius:6px; font-size:13px; margin-bottom:12px; }
  .info-tip strong { font-weight:600; }

  .standard-banner { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 18px; background:#e0f2fe; color:#075985; border-radius:8px; margin-bottom:14px; flex-wrap:wrap; border-left:4px solid #075985; }
  .standard-title { font-size:15px; font-weight:700; margin-bottom:2px; }
  .standard-sub { font-size:12px; color:#0c4a6e; }
  .standard-sub code { background:rgba(255,255,255,0.6); padding:1px 6px; border-radius:3px; font-size:11px; }
  .standard-links { display:flex; gap:8px; }
  .standard-link { display:inline-block; padding:8px 14px; background:white; color:#075985; text-decoration:none; border-radius:6px; font-weight:500; font-size:13px; border:1px solid #075985; transition:all .15s; }
  .standard-link.primary { background:#075985; color:white; }
  .standard-link.primary:hover { background:#0c4a6e; }
  .standard-link:not(.primary):hover { background:#f0f9ff; }

  footer { margin-top:40px; padding-top:16px; border-top:1px solid var(--border); color:var(--sub); font-size:12px; }
  footer code { background:#f0f1f3; padding:1px 6px; border-radius:3px; }
</style>
</head>
<body>
<div class="container">
  <div class="topbar">
    <a href="index.html">← 고객사 목록</a>
    <span class="sep">|</span>
    <a href="../index.html">메인</a>
    <span class="sep">|</span>
    <a href="deploy.html">🚀 운영 배포</a>
  </div>

  <h1>📚 매뉴얼 관리</h1>
  <p class="subtitle">표준 솔루션 매뉴얼(base)을 점검하고 신규 고객사를 추가하는 워크플로우입니다.</p>

  <h2><span class="step-num">1</span>표준 매뉴얼 (base)</h2>
  <p class="dim">모든 신규 고객사 생성 시 이 매뉴얼이 통째로 복사됩니다. base 자체는 <code>base/</code> 디렉토리에서 직접 편집·관리합니다.</p>
  <div class="panel">
    ${baseSection}
    <div class="info-tip" style="margin-top:14px;margin-bottom:0">
      <strong>💡 base 변경의 영향:</strong> base 수정은 이후 추가되는 <em>신규 고객사에만</em> 자동 반영됩니다. 이미 등록된 고객사의 manual은 base와 독립이므로, base 갱신을 반영하려면 수동 비교·복사가 필요합니다 (sync 도구 추후 추가).
    </div>
  </div>

  <h2><span class="step-num">2</span>신규 고객사 생성</h2>
  <p class="dim">아래 폼을 채우면 자동으로 명령어가 생성됩니다. 명령어를 복사해 터미널에서 실행하세요.</p>
  <div class="panel">
    <div class="form-grid">
      <div class="field" id="field-id">
        <label>고객사 ID<span class="req">*</span></label>
        <input type="text" id="cust-id" placeholder="예: acme-bank" autocomplete="off">
        <span class="hint">소문자/숫자/하이픈만. 폴더명과 일치합니다.</span>
        <span class="err">소문자, 숫자, 하이픈(-)만 사용 가능합니다.</span>
      </div>
      <div class="field">
        <label>고객사 이름<span class="req">*</span></label>
        <input type="text" id="cust-name" placeholder="예: ACME은행" autocomplete="off">
        <span class="hint">표지 / HTML 타이틀에 표시됩니다.</span>
      </div>
      <div class="field">
        <label>산업 분야</label>
        <select id="cust-industry">
          <option value="other">기타</option>
          <option value="financial">금융</option>
          <option value="manufacturing">제조</option>
          <option value="public">공공</option>
          <option value="retail">유통</option>
          <option value="healthcare">의료</option>
        </select>
      </div>
      <div class="field">
        <label>제품 버전</label>
        <input type="text" id="cust-version" value="2.3.0" autocomplete="off">
        <span class="hint">솔루션 빌드 버전 (product.version)</span>
      </div>
      <div class="field">
        <label>매뉴얼 버전</label>
        <input type="text" id="cust-manual-version" placeholder="예: 2.3.0-rev1" autocomplete="off">
        <span class="hint">비우면 &lt;제품 버전&gt;-rev1 자동 (manual.version)</span>
      </div>
      <div class="field">
        <label>도메인</label>
        <input type="text" id="cust-domain" placeholder="예: xgen.acmebank.co.kr" autocomplete="off">
        <span class="hint">{{product.domain}}으로 본문에서 참조됩니다.</span>
      </div>
      <div class="field">
        <label>문의 메일</label>
        <input type="email" id="cust-email" placeholder="예: support@acmebank.co.kr" autocomplete="off">
        <span class="hint">{{vars.support_email}}</span>
      </div>
    </div>

    <div class="cmd-block">
      <div class="cmd-label">생성된 명령어</div>
      <div class="cmd-row"><code id="cmd-new"></code><button class="copy-btn" onclick="copyCmd('cmd-new', this)">📋 복사</button></div>
    </div>

    <div class="auto-tasks">
      <h4>실행 시 자동 처리</h4>
      <ul>
        <li><code>customers/&lt;id&gt;/manual/</code> ← <code>base/</code> 트리 통째 복사</li>
        <li><code>customers/&lt;id&gt;/customer.yml</code> 자동 생성 (입력값 반영)</li>
        <li><code>customers/&lt;id&gt;/branding/</code> 빈 폴더 생성</li>
      </ul>
    </div>

    <div class="info-tip" style="margin-top:14px">
      <strong>다음 단계:</strong> 실행 후 <code>customers/&lt;id&gt;/manual/</code> 에서 자유롭게 매뉴얼을 커스터마이징하고, <code>node build/build.mjs --customer &lt;id&gt; --formats html,docx</code> 로 빌드하세요.
    </div>
  </div>

  <h2><span class="step-num">3</span>등록된 고객사 (${customers.length}개)</h2>
  <table>
    <thead>
      <tr><th>고객사</th><th>ID</th><th>산업</th><th>제품 버전</th><th>매뉴얼 버전</th><th>매뉴얼 파일</th><th>빌드 상태</th></tr>
    </thead>
    <tbody>${customerRows}</tbody>
  </table>

  <footer>
    이 페이지는 빌드 시 자동 생성됩니다. 재생성: <code>node build/build.mjs --index-only</code>
  </footer>
</div>

<script>
function escAttr(v) {
  return String(v).replace(/"/g, '\\\\"');
}

function buildCommand() {
  var id = document.getElementById('cust-id').value.trim();
  var name = document.getElementById('cust-name').value.trim();
  var industry = document.getElementById('cust-industry').value;
  var version = document.getElementById('cust-version').value.trim();
  var manualVersion = document.getElementById('cust-manual-version').value.trim();
  var domain = document.getElementById('cust-domain').value.trim();
  var email = document.getElementById('cust-email').value.trim();

  // ID 형식 검증
  var idField = document.getElementById('field-id');
  if (id && !/^[a-z0-9-]+$/.test(id)) {
    idField.classList.add('has-error');
    document.getElementById('cust-id').classList.add('invalid');
  } else {
    idField.classList.remove('has-error');
    document.getElementById('cust-id').classList.remove('invalid');
  }

  if (!id || !name) {
    return '# 고객사 ID와 이름을 입력하세요';
  }

  var parts = ['node build/new-customer.mjs'];
  parts.push('--id ' + id);
  parts.push('--name "' + escAttr(name) + '"');
  if (industry && industry !== 'other') parts.push('--industry ' + industry);
  if (version && version !== '2.3.0') parts.push('--product-version ' + version);
  if (manualVersion) parts.push('--manual-version ' + manualVersion);
  if (domain) parts.push('--domain ' + domain);
  if (email) parts.push('--support-email ' + email);

  return parts.join(' \\\\\\n  ');
}

function refreshCommand() {
  document.getElementById('cmd-new').textContent = buildCommand();
}

function copyCmd(elemId, btn) {
  var el = document.getElementById(elemId);
  if (!el) return;
  var text = el.textContent;
  // Strip line continuation markers for execution-friendly copy
  var clean = text.replace(/\\\\\\n\\s+/g, ' ');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(clean).then(function () {
      var orig = btn.textContent;
      btn.textContent = '✓ 복사됨';
      btn.classList.add('copied');
      setTimeout(function () { btn.textContent = orig; btn.classList.remove('copied'); }, 1500);
    });
  } else {
    var r = document.createRange();
    r.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    btn.textContent = '✓ 복사됨';
    btn.classList.add('copied');
    setTimeout(function () { btn.textContent = '📋 복사'; btn.classList.remove('copied'); }, 1500);
  }
}

document.querySelectorAll('#cust-id, #cust-name, #cust-industry, #cust-version, #cust-manual-version, #cust-domain, #cust-email')
  .forEach(function (el) { el.addEventListener('input', refreshCommand); });
refreshCommand();
</script>
</body>
</html>`;
}
