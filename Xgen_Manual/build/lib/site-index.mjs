// site-index.mjs
// dist/site/docs/* 를 스캔하여 빌드된 고객사 목록을 보여주는 dist/site/index.html 생성.
// 내부 점검용 인덱스. 운영 배포 시에는 인증 계층 뒤에 두거나 제외.

import { readFile, writeFile, readdir, stat, mkdir } from 'node:fs/promises';
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
      displayTitle: cfg?.customer?.display_title ?? null,
      industry: cfg?.customer?.industry ?? null,
      gitlabBranch: cfg?.customer?.gitlab_branch ?? null,
      productName: cfg?.product?.name ?? null,
      version: cfg?.product?.version ?? null,
      domain: cfg?.product?.domain ?? null,
      manualVersion: cfg?.manual?.version ?? null,
      manualReleasedAt: cfg?.manual?.released_at ?? null,
      builtAt: stats.mtime,
      isStandard: id === 'xgen-standard',
    });
  }

  // 정렬 우선순위:
  //   0 — xgen-standard (stage 기준 단일 진실원)
  //   1 — gs-cert       (main 환경 + GS인증 권한 제한 뷰)
  //   2 — 일반 고객사   (한글 이름 순)
  // 동일 우선순위 안에서는 display_title 우선, 그 다음 customer.name 의 한글 정렬을 사용.
  const sortRank = (item) => {
    if (item.id === 'xgen-standard') return 0;
    if (item.id === 'gs-cert') return 1;
    return 2;
  };
  items.sort((a, b) => {
    const ra = sortRank(a);
    const rb = sortRank(b);
    if (ra !== rb) return ra - rb;
    const titleA = a.displayTitle || a.name;
    const titleB = b.displayTitle || b.name;
    return titleA.localeCompare(titleB, 'ko');
  });

  // 매뉴얼 총 개수 = 빌드된 모든 매뉴얼 (xgen-standard / xgen-main 등 공개용 표준 매뉴얼 포함)
  const builtManualCount = items.length;
  const definedManualCount = definedIds.length;

  // 메인 페이지 (/index.html) — 내부 미리보기, 운영 시 제거 또는 admin으로 이동 권고
  const mainHtml = render(items, definedManualCount, builtManualCount, {
    docsPrefix: 'docs',
    variant: 'main',
    gateHref: 'gate.html',
  });
  await writeFile(join(siteRoot, 'index.html'), mainHtml, 'utf8');

  // 관리자 경로 (/admin/index.html) — 운영 시 인증 게이팅 대상 위치 (구조 데모)
  const adminHtml = render(items, definedManualCount, builtManualCount, {
    docsPrefix: '../docs',
    variant: 'admin',
    gateHref: '../gate.html',
  });
  await mkdir(join(siteRoot, 'admin'), { recursive: true });
  await writeFile(join(siteRoot, 'admin', 'index.html'), adminHtml, 'utf8');

  // 비밀번호 게이트 페이지 (/gate.html) — 고객사 전용 매뉴얼 진입 전에 거치는 단일 폼.
  // 사이트 루트 한 곳에만 두고 main/admin 양쪽에서 상대 경로로 참조.
  await writeFile(join(siteRoot, 'gate.html'), renderGate(), 'utf8');
}

function render(items, definedCount, builtCount, { docsPrefix, variant, gateHref }) {
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
          ? '<span class="tag tag-standard">📖 XGEN</span>'
          : '';
        // 공개 매뉴얼 화이트리스트 — 비밀번호 게이트 없이 즉시 진입 가능.
        //   xgen-standard / xgen-main: 표준 매뉴얼 2종
        //   gs-cert: GS인증용 외부 공개 매뉴얼
        // 그 외(jeju-bank 등 일반 고객사) 는 비밀번호 게이트 적용. 클릭 시 gate.html 로 보내고
        // sessionStorage 로 한 번 통과하면 탭이 닫힐 때까지 유지.
        const PUBLIC_CARDS = new Set(['xgen-standard', 'gs-cert']);
        const isGated = !PUBLIC_CARDS.has(item.id);
        const gatedTag = isGated
          ? '<span class="tag tag-gated">🔒 고객사 전용</span>'
          : '';
        const builtAt = item.builtAt.toLocaleString('ko-KR');
        // 카드 타이틀은 customer.name 그대로 노출. ID 코드 칸은 customer.gitlab_branch
        // (GitLab 브랜치 명) 가 있으면 우선 사용, 없으면 customer.id 폴백.
        const displayName = item.name;
        const displayId = item.gitlabBranch || item.id;
        const productLine =
          item.productName
            ? `<div><span class="label">솔루션</span> ${escapeHtml(item.productName)}${item.version ? ' v' + escapeHtml(item.version) : ''}</div>`
            : '';
        const domainLine =
          item.domain
            ? `<div><span class="label">서비스 도메인</span> <code class="domain">${escapeHtml(item.domain)}</code></div>`
            : '';
        // 검색 대상도 마스킹된 표시값 기준 — 비-내부자가 실명으로 검색해 들춰내지 못하도록.
        // display_title(예: 'GS인증') 가 명시된 customer 도 그 키워드로 찾을 수 있게 포함.
        const searchData = (displayName + ' ' + displayId + ' ' + industryLabel + ' ' + (item.displayTitle || '')).toLowerCase();
        const cardClass = `card${item.isStandard ? ' card-standard' : ''}${isGated ? ' card-gated' : ''}`;
        // 게이트 카드는 전용 비밀번호 페이지(/gate.html)로 보내고, 통과 후 docs/<id>/index.html 로 이동.
        // 공개 카드는 매뉴얼 인덱스로 직접 이동.
        const href = isGated
          ? `${gateHref}?to=${encodeURIComponent(item.id)}`
          : `${escapeHtml(docsPrefix)}/${escapeHtml(item.id)}/index.html`;
        // 카드 제목 우선순위:
        //   1) customer.display_title 명시(예: 'GS인증' 같은 외부용 이름)
        //   2) ID(=gitlab_branch 또는 customer.id) — 표준 매뉴얼 카드에서 환경 식별
        // displayName(=customer.name) 은 마스킹/표준화 결과 다수 customer 가 'XGEN'
        // 으로 동일해 카드 변별력이 없어 폴백 후순위로만 사용.
        const cardTitle = item.displayTitle || displayId;
        return `<a class="${cardClass}" href="${href}" data-search="${escapeHtml(searchData)}">
      <div class="card-head">
        <h2>${escapeHtml(cardTitle)}</h2>
        ${standardTag}${gatedTag}${industryTag}
      </div>
      <div class="card-meta">
        ${domainLine}
        ${productLine}
        <div><span class="label">최근 빌드</span> ${escapeHtml(builtAt)}</div>
      </div>
    </a>`;
      })
      .join('\n') || '<div class="empty">빌드된 매뉴얼이 없습니다. <code>node build/build.mjs --customer &lt;id&gt; --formats html</code> 로 빌드하세요.</div>';

  const banner = '';

  const subtitle =
    variant === 'admin'
      ? '관리자 전용 — 매뉴얼 빌드 결과 목록'
      : '매뉴얼 빌드 결과 목록';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>솔루션 가이드</title>
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
  .tag-gated { background: #fef3c7; color: #92400e; font-weight: 600; }
  .card-gated { position: relative; }
  .card-gated::before { content: ''; position: absolute; top: 0; right: 0; width: 0; height: 0; border-style: solid; border-width: 0 36px 36px 0; border-color: transparent #fef3c7 transparent transparent; border-radius: 0 10px 0 0; }
  .card-meta { font-size: 13px; color: var(--sub); display: flex; flex-direction: column; gap: 4px; }
  .card-meta .label { display: inline-block; min-width: 70px; color: #999; }
  .card-meta .muted { color: #999; font-size: 12px; }
  .card-meta code { background: #f0f1f3; padding: 1px 6px; border-radius: 3px; font-size: 12px; color: #333; }
  .card-meta code.domain { background: var(--primary-bg); color: var(--primary); font-weight: 600; padding: 2px 8px; font-size: 13px; }
  .empty { padding: 60px 20px; text-align: center; color: var(--sub); background: white; border:1px solid var(--border); border-radius: 10px; }
  .guide { background: white; border:1px solid var(--border); border-radius: 10px; padding: 16px 20px; margin: 16px 0; }
  .guide-title { margin: 0 0 10px; font-size: 14px; font-weight: 600; color: var(--fg); }
  .guide-list { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.8; color: var(--sub); }
  .guide-list code { background: #f0f1f3; padding: 1px 6px; border-radius: 3px; font-size: 12px; color: #333; }
  footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid var(--border); color: var(--sub); font-size: 12px; }
  footer code { background: #f0f1f3; padding: 1px 6px; border-radius: 3px; }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>솔루션 가이드</h1>
    <p>${subtitle}</p>
  </header>

  ${banner}

  <section class="guide" aria-label="매뉴얼 구분 안내">
    <h2 class="guide-title">매뉴얼 구분</h2>
    <ul class="guide-list">
      <li><code>stage</code> — 개발 및 출시 예정 기능을 포함한 표준 매뉴얼</li>
      <li><code>main</code> — 현재 운영 중인 안정 버전 기준의 매뉴얼</li>
      <li>고객사별 매뉴얼 — 고객사 환경에 맞춰 구성된 전용 매뉴얼 (🔒 비밀번호 인증 필요)</li>
    </ul>
  </section>

  <div class="stats">
    <div><strong>${builtCount}</strong>개의 매뉴얼 빌드됨</div>
    <div><strong>${definedCount}</strong>개의 매뉴얼 정의됨</div>
  </div>

  <input class="search" type="search" placeholder="매뉴얼명·ID·산업으로 검색…" oninput="onSearch(this.value)" autofocus>

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

// ─── 비밀번호 게이트 페이지 ─────────────────────────────────────────────────
// dist/site/gate.html — 고객사 전용 매뉴얼 진입 전 비밀번호 확인 폼.
// URL 쿼리 'to=<customer-id>' 로 진입 대상 지정. 통과 시 docs/<id>/index.html 로 이동.
// sessionStorage 에 한 번 통과한 사실을 저장해 같은 탭 안에선 다시 묻지 않음.
//
// 보안 한계: 정적 사이트(GitHub Pages) 라 인스펙터로 우회 가능. *고객사 전용 매뉴얼임을
// 알리는 안내 게이트* 수준이며, 진짜 보안이 필요하면 서버 인증 계층이 별도로 필요합니다.
function renderGate() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>고객사 전용 매뉴얼 — 솔루션 가이드</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root {
    --bg:#f7f8fa; --fg:#1a1d21; --sub:#5a6168; --border:#e1e4e8;
    --primary:#3949ab; --primary-bg:#e8eaf6;
    --error:#b91c1c;
  }
  * { box-sizing: border-box; }
  body { margin:0; font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; background:var(--bg); color:var(--fg); line-height:1.6; min-height:100vh; display:flex; align-items:center; justify-content:center; padding: 24px; }
  .gate { max-width: 420px; width: 100%; background: white; border:1px solid var(--border); border-radius: 12px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.04); }
  .gate-icon { font-size: 32px; line-height: 1; margin-bottom: 12px; }
  .gate h1 { margin: 0 0 8px; font-size: 22px; letter-spacing: -0.3px; }
  .gate p.lead { margin: 0 0 24px; color: var(--sub); font-size: 14px; }
  .gate label { display:block; font-size: 13px; color: var(--sub); margin-bottom: 6px; }
  .gate input[type="password"] { width: 100%; padding: 12px 14px; border:1px solid var(--border); border-radius: 8px; font-size: 15px; background: white; transition: border-color .1s, box-shadow .1s; }
  .gate input[type="password"]:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(57,73,171,0.1); }
  .gate button { width: 100%; margin-top: 12px; padding: 12px 14px; background: var(--primary); color: white; border:none; border-radius: 8px; font-size: 15px; font-weight: 500; cursor: pointer; transition: background .1s; }
  .gate button:hover { background: #2c3995; }
  .gate .err { margin-top: 12px; color: var(--error); font-size: 13px; min-height: 1.4em; }
  .gate .back { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); font-size: 13px; }
  .gate .back a { color: var(--sub); text-decoration: none; }
  .gate .back a:hover { color: var(--primary); text-decoration: underline; }
  .gate .target { color: var(--fg); font-weight: 500; }
</style>
</head>
<body>
<div class="gate">
  <div class="gate-icon">🔒</div>
  <h1>고객사 전용 매뉴얼</h1>
  <p class="lead">이 매뉴얼은 고객사 전용으로 공개되어 있습니다. 비밀번호를 입력해 주세요.</p>
  <form id="form" autocomplete="off">
    <label for="pwd">비밀번호</label>
    <input id="pwd" type="password" autofocus required>
    <button type="submit">진입</button>
    <div id="err" class="err" role="alert"></div>
  </form>
  <p class="back">
    <a href="index.html">← 솔루션 가이드 메인으로 돌아가기</a>
  </p>
</div>
<script>
  const HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'; // sha256('admin123')
  // 키 버전(v2) 분리: 이전 prompt 기반 게이트가 'xgen-manual-gated-unlocked' 에 남긴 unlock
  // 상태가 새 폼을 자동 통과시키는 문제를 막기 위해 키 이름 자체를 분리.
  const STORAGE_KEY = 'xgen-manual-gate-unlocked-v2';
  const params = new URLSearchParams(location.search);
  const target = (params.get('to') || '').replace(/[^a-zA-Z0-9_-]/g, ''); // 안전 화이트리스트
  const destination = target ? 'docs/' + target + '/index.html' : 'index.html';

  // 같은 탭에서 이미 통과한 적이 있으면 폼을 거치지 않고 즉시 이동.
  if (sessionStorage.getItem(STORAGE_KEY) === '1' && target) {
    location.replace(destination);
  }

  async function sha256Hex(text) {
    const buf = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('err');
    errEl.textContent = '';
    const pwd = document.getElementById('pwd').value;
    if (!pwd) return;
    const hex = await sha256Hex(pwd);
    if (hex === HASH) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      location.href = destination;
    } else {
      errEl.textContent = '비밀번호가 일치하지 않습니다. 다시 입력해 주세요.';
      document.getElementById('pwd').select();
    }
  });
</script>
</body>
</html>`;
}
