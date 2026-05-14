// site-index.mjs
// dist/site/docs/* 를 스캔하여 빌드된 고객사 목록을 보여주는 dist/site/index.html 생성.
// 내부 점검용 인덱스. 운영 배포 시에는 인증 계층 뒤에 두거나 제외.

import { readFile, writeFile, readdir, stat, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { maskCustomerLabel } from './mask.mjs';

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

export async function buildSiteIndex({ siteRoot, customersRoot }) {
  const docsDir = join(siteRoot, 'docs');
  if (!existsSync(docsDir)) {
    console.warn('[index] dist/site/docs 가 없습니다. HTML 빌드 먼저 수행하세요.');
    return;
  }

  // 빌드된 고객사 = dist/site/docs/<id>/index.html 이 존재하는 항목
  const docDirs = await readdir(docsDir, { withFileTypes: true });
  const builtIds = [];
  for (const e of docDirs) {
    if (!e.isDirectory()) continue;
    if (existsSync(join(docsDir, e.name, 'index.html'))) builtIds.push(e.name);
  }

  // 정의된 고객사 = customers/<id>/customer.yml 이 존재하는 항목 (밑줄 시작은 제외)
  let definedIds = [];
  if (existsSync(customersRoot)) {
    const defEntries = await readdir(customersRoot, { withFileTypes: true });
    definedIds = defEntries
      .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
      .map((e) => e.name)
      .filter((id) => existsSync(join(customersRoot, id, 'customer.yml')));
  }

  const items = [];
  for (const id of builtIds) {
    const customerYmlPath = join(customersRoot, id, 'customer.yml');
    let cfg = null;
    if (existsSync(customerYmlPath)) {
      try {
        cfg = parseYaml(await readFile(customerYmlPath, 'utf8'));
      } catch {
        // ignore
      }
    }
    const indexPath = join(docsDir, id, 'index.html');
    const stats = await stat(indexPath);
    items.push({
      id,
      name: cfg?.customer?.name ?? id,
      industry: cfg?.customer?.industry ?? null,
      productName: cfg?.product?.name ?? null,
      version: cfg?.product?.version ?? null,
      manualVersion: cfg?.manual?.version ?? null,
      manualReleasedAt: cfg?.manual?.released_at ?? null,
      builtAt: stats.mtime,
      isStandard: id === 'xgen-standard',
    });
  }

  // 표준 매뉴얼은 항상 최상단, 나머지는 한글 이름 순
  items.sort((a, b) => {
    if (a.isStandard !== b.isStandard) return a.isStandard ? -1 : 1;
    return a.name.localeCompare(b.name, 'ko');
  });

  const builtCustomerCount = items.filter((i) => !i.isStandard).length;
  const definedCustomerCount = definedIds.filter((id) => id !== 'xgen-standard').length;

  // 메인 페이지 (/index.html) — 내부 미리보기, 운영 시 제거 또는 admin으로 이동 권고
  const mainHtml = render(items, definedCustomerCount, builtCustomerCount, {
    docsPrefix: 'docs',
    variant: 'main',
  });
  await writeFile(join(siteRoot, 'index.html'), mainHtml, 'utf8');

  // 관리자 경로 (/admin/index.html) — 운영 시 인증 게이팅 대상 위치 (구조 데모)
  const adminHtml = render(items, definedCustomerCount, builtCustomerCount, {
    docsPrefix: '../docs',
    variant: 'admin',
  });
  await mkdir(join(siteRoot, 'admin'), { recursive: true });
  await writeFile(join(siteRoot, 'admin', 'index.html'), adminHtml, 'utf8');
}

function render(items, definedCount, builtCount, { docsPrefix, variant }) {
  const cards =
    items
      .map((item) => {
        const industryLabel = item.industry
          ? INDUSTRY_LABELS[item.industry] || item.industry
          : '';
        const industryTag = industryLabel
          ? `<span class="tag tag-industry">${escapeHtml(industryLabel)}</span>`
          : '';
        const standardTag = item.isStandard
          ? '<span class="tag tag-standard">📖 표준 매뉴얼</span>'
          : '';
        const builtAt = item.builtAt.toLocaleString('ko-KR');
        // 표준 매뉴얼은 마스킹 제외, 일반 고객사는 이름·ID 마스킹 (대외비)
        const displayName = item.isStandard ? item.name : maskCustomerLabel(item.name);
        const displayId = item.isStandard ? item.id : maskCustomerLabel(item.id);
        const productLine =
          item.productName
            ? `<div><span class="label">제품</span> ${escapeHtml(item.productName)}${item.version ? ' v' + escapeHtml(item.version) : ''}</div>`
            : '';
        const manualLine =
          item.manualVersion
            ? `<div><span class="label">매뉴얼</span> v${escapeHtml(item.manualVersion)}${item.manualReleasedAt ? ` <span class="muted">(${escapeHtml(item.manualReleasedAt)})</span>` : ''}</div>`
            : '';
        // 검색 대상도 마스킹된 표시값 기준 — 비-내부자가 실명으로 검색해 들춰내지 못하도록
        const searchData = (displayName + ' ' + displayId + ' ' + industryLabel).toLowerCase();
        return `<a class="card${item.isStandard ? ' card-standard' : ''}" href="${escapeHtml(docsPrefix)}/${escapeHtml(item.id)}/index.html" data-search="${escapeHtml(searchData)}">
      <div class="card-head">
        <h2>${escapeHtml(displayName)}</h2>
        ${standardTag}${industryTag}
      </div>
      <div class="card-meta">
        <div><span class="label">ID</span> <code>${escapeHtml(displayId)}</code></div>
        ${productLine}
        ${manualLine}
        <div><span class="label">최근 빌드</span> ${escapeHtml(builtAt)}</div>
      </div>
    </a>`;
      })
      .join('\n') || '<div class="empty">빌드된 고객사가 없습니다. <code>node build/build.mjs --customer &lt;id&gt; --formats html</code> 로 빌드하세요.</div>';

  const banner =
    variant === 'admin'
      ? `<div class="banner banner-admin">
    <div class="banner-text">
      <strong>🔒 관리자 전용 경로 (/admin/)</strong> — 운영 환경에서 인증 계층(SSO·관리자 그룹)으로 보호되는 위치입니다. 현재는 골격 데모용으로 인증 없이 접근 가능합니다.
    </div>
    <a class="banner-link" href="customers.html">📚 매뉴얼 관리</a>
    <a class="banner-link" href="deploy.html">🚀 운영 배포</a>
    <a class="banner-link" href="../index.html">← 메인 페이지로</a>
  </div>`
      : `<div class="banner">
    <div class="banner-text">
      <strong>⚠ 내부용 페이지</strong> — 실제 운영 환경에서는 인증 계층(리버스 프록시·CDN Access)이 고객사별 접근을 제한합니다. 이 목록은 빌드 산출물 점검을 위한 내부 인덱스이며, 운영 배포 시 제거하거나 관리자 전용 경로로 이동해야 합니다.
    </div>
    <a class="banner-link" href="admin/index.html">→ 관리자 전용 경로(/admin/)로 이동</a>
  </div>`;

  const subtitle =
    variant === 'admin'
      ? '관리자 전용 — 고객사 빌드 결과 목록'
      : '고객사별 빌드 결과 목록 (내부 점검용)';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>Xgen 솔루션 매뉴얼</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root {
    --bg:#f7f8fa; --fg:#1a1d21; --sub:#5a6168; --border:#e1e4e8;
    --primary:#3949ab; --primary-bg:#e8eaf6;
    --warn:#fff3cd; --warn-fg:#856404;
    --admin:#fde2e4; --admin-fg:#8b1f24;
  }
  * { box-sizing: border-box; }
  body { margin:0; font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; background:var(--bg); color:var(--fg); line-height:1.6; }
  .container { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
  header h1 { margin:0 0 6px; font-size: 28px; letter-spacing: -0.3px; }
  header p { margin: 0; color: var(--sub); font-size: 14px; }
  .banner { background: var(--warn); color: var(--warn-fg); padding: 14px 16px; border-radius: 8px; margin: 20px 0 16px; font-size: 13px; line-height: 1.55; display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
  .banner-admin { background: var(--admin); color: var(--admin-fg); }
  .banner-text { flex: 1; min-width: 280px; }
  .banner-link { display:inline-block; padding:6px 12px; background: rgba(255,255,255,0.7); color: inherit; text-decoration: none; border-radius: 6px; font-weight: 500; white-space: nowrap; border: 1px solid currentColor; transition: background .1s; }
  .banner-link:hover { background: white; }
  .stats { display: flex; gap: 24px; margin: 16px 0 8px; font-size: 13px; color: var(--sub); }
  .stats strong { color: var(--fg); font-size: 18px; font-weight: 600; }
  .search { width: 100%; padding: 10px 14px; border:1px solid var(--border); border-radius: 8px; font-size: 14px; margin: 16px 0 24px; background: white; }
  .search:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(57,73,171,0.1); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
  .card { display:block; padding: 20px; background: white; border:1px solid var(--border); border-radius: 10px; text-decoration: none; color: inherit; transition: transform .1s, box-shadow .1s, border-color .1s; }
  .card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: var(--primary); }
  .card-head { display:flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
  .card-head h2 { margin: 0; font-size: 18px; flex: 1; min-width: 0; }
  .tag { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; white-space: nowrap; }
  .tag-industry { background: var(--primary-bg); color: var(--primary); }
  .tag-standard { background: #e0f2fe; color: #075985; font-weight: 600; }
  .card-standard { border-color: #075985; border-left: 4px solid #075985; }
  .card-standard:hover { border-color: #0c4a6e; }
  .card-meta { font-size: 13px; color: var(--sub); display: flex; flex-direction: column; gap: 4px; }
  .card-meta .label { display: inline-block; min-width: 70px; color: #999; }
  .card-meta .muted { color: #999; font-size: 12px; }
  .card-meta code { background: #f0f1f3; padding: 1px 6px; border-radius: 3px; font-size: 12px; color: #333; }
  .empty { padding: 60px 20px; text-align: center; color: var(--sub); background: white; border:1px solid var(--border); border-radius: 10px; }
  footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid var(--border); color: var(--sub); font-size: 12px; }
  footer code { background: #f0f1f3; padding: 1px 6px; border-radius: 3px; }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>Xgen 솔루션 매뉴얼</h1>
    <p>${subtitle}</p>
  </header>

  ${banner}

  <div class="stats">
    <div><strong>${builtCount}</strong> 고객사 빌드됨</div>
    <div><strong>${definedCount}</strong> 고객사 정의됨</div>
    <div><span style="color:#999">+ Xgen 표준 매뉴얼</span></div>
  </div>

  <input class="search" type="search" placeholder="고객사명·ID·산업으로 검색…" oninput="onSearch(this.value)" autofocus>

  <div class="grid" id="grid">
    ${cards}
  </div>

  <footer>
    재생성: <code>node build/build.mjs --index-only</code>
  </footer>
</div>

<script>
function onSearch(q) {
  const lower = q.toLowerCase().trim();
  document.querySelectorAll('.card').forEach((card) => {
    card.style.display = card.dataset.search.includes(lower) ? '' : 'none';
  });
}
</script>
</body>
</html>`;
}
