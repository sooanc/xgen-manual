// capture-canvas-start-gif.mjs
//
// 캔버스 빈 화면 → "에이전트 시작" 버튼 클릭 → XGEN Agent 노드 자동 배치
// 의 전환을 GIF 로 캡처해 매뉴얼의 canvas-editor.png 를 대체한다.
//
//   cd C:\xgen-manual && node scripts/capture-canvas-start-gif.mjs
//
// 흐름:
//   1. .env.gs-cert 로드, stg 로그인 → storageState 저장
//   2. recordVideo 컨텍스트로 /canvas 열기 (로그인 트래픽이 영상에 끼지 않게 분리)
//   3. 빈 캔버스 + "에이전트 시작" 버튼 가시 확인
//   4. ~1.2s hold (시작 상태를 명확히 보여주기)
//   5. 버튼 클릭 → XGEN Agent 노드 등장
//   6. ~1.8s hold
//   7. 컨텍스트 close → webm flush → ffmpeg 로 GIF 변환 (palette 2-pass)
//   8. 출력: Xgen_Manual/base/user/images/10 canvas dragdrop.gif

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.gs-cert');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'customers', 'gs-cert', 'overlay', 'user', 'gif');
const TMP_DIR = path.join(REPO_ROOT, '.tmp-gs-canvas-dragdrop');
const FFMPEG = process.env.FFMPEG || 'C:/ffmpeg/bin/ffmpeg';

const VIEWPORT = { width: 1280, height: 720 };
const FPS = 15;
const SCALE_WIDTH = 960; // GIF 폭 (높이 비례)
const PRE_CLICK_HOLD_MS = 900;   // 시작 상태 짧게 보여주기 (커서 이동 단계가 별도 lead-in 역할)
const POST_CLICK_HOLD_MS = 1800;
// 녹화는 컨텍스트 생성 시점부터 시작되므로 /canvas 로드·hydration 까지 모두 잡힌다.
// "에이전트 시작" 버튼이 보이는 순간 - lead-in 만큼 앞부분을 잘라낸다.
const TRIM_LEAD_IN_MS = 400;

function loadEnv(file) {
  const env = {};
  fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((l) => {
    const t = l.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i < 0) return;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  });
  return env;
}

const env = loadEnv(ENV_FILE);
const BASE = env.XGEN_BASE_URL.replace(/\/$/, '');
const EMAIL = env.XGEN_LOGIN_EMAIL;
const PASS = env.XGEN_LOGIN_PASSWORD;
if (!BASE || !EMAIL || !PASS) throw new Error('XGEN_BASE_URL/EMAIL/PASSWORD missing in .env.gs-cert');

fs.rmSync(TMP_DIR, { recursive: true, force: true });
fs.mkdirSync(TMP_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const log = (...a) => console.log('[gif]', ...a);

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ── 1. 로그인 (영상 X) → storageState 저장 ──
  log('logging in to', BASE);
  const authCtx = await browser.newContext({ viewport: VIEWPORT, locale: 'ko-KR' });
  const authPage = await authCtx.newPage();
  await authPage.goto(BASE, { waitUntil: 'networkidle', timeout: 60_000 });
  if (await authPage.$('#login-email')) {
    await authPage.fill('#login-email', EMAIL);
    await authPage.fill('#login-password', PASS);
    const [res] = await Promise.all([
      authPage.waitForResponse(
        (r) => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST',
        { timeout: 30_000 },
      ),
      authPage.click('button[type="submit"]'),
    ]);
    if (res.status() !== 200) throw new Error(`login failed: ${res.status()}`);
    await authPage.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
    log('  login OK');
  }
  const storageState = await authCtx.storageState();
  await authCtx.close();

  // ── 2. 녹화 컨텍스트 + /canvas ──
  log('opening /canvas with recordVideo');
  const recCtx = await browser.newContext({
    viewport: VIEWPORT,
    locale: 'ko-KR',
    storageState,
    recordVideo: { dir: TMP_DIR, size: VIEWPORT },
  });

  // Playwright 비디오는 OS 커서를 그리지 않는다.
  // 모든 페이지가 열리는 시점에 가상 커서(SVG arrow) 를 주입해 mousemove/click 을
  // 따라다니게 하면, page.mouse.move()/click() 으로 발생하는 이벤트가 GIF 에 보인다.
  // 클릭 순간 짧은 ripple 로 시청자가 클릭 위치를 인지하기 쉽게 한다.
  //
  // 추가로:
  // - 브라우저 native `title` 툴팁 / 커스텀 UI 툴팁(.tippy, [role=tooltip] 등) 을
  //   CSS 와 title 속성 제거로 모두 차단한다. GIF 해상도가 제한적인데 작은 말풍선이
  //   뜨면 가독성이 더 떨어지고 지저분해 보이기 때문.
  await recCtx.addInitScript(() => {
    if (window.__virtualCursorInstalled) return;
    window.__virtualCursorInstalled = true;

    // ── 툴팁 억제 (CSS) ──
    const tipStyle = document.createElement('style');
    tipStyle.id = '__gif-no-tooltip';
    // role=tooltip 은 Radix 의 실제 tooltip content 에 붙는다.
    // Radix popper 래퍼는 popover/dropdown 도 공유하므로 :has([role=tooltip]) 로
    // 툴팁을 담은 래퍼만 정확히 가린다 (popover/dropdown 정상 동작 보존).
    tipStyle.textContent = `
      [role="tooltip"],
      [data-radix-popper-content-wrapper]:has([role="tooltip"]),
      .tippy-box, .tippy-popper, [data-tippy-root],
      .tooltip, .ant-tooltip, .MuiTooltip-popper,
      .react-tooltip, [data-tooltip] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    const installTipStyle = () => {
      if (!document.head) return;
      if (!document.getElementById('__gif-no-tooltip')) document.head.appendChild(tipStyle);
    };
    installTipStyle();
    document.addEventListener('DOMContentLoaded', installTipStyle);

    // ── native title= 속성 strip (DOM 변동 대응) ──
    const stripTitles = (root) => {
      try {
        (root || document).querySelectorAll('[title]').forEach((el) => {
          el.setAttribute('data-gif-orig-title', el.getAttribute('title') || '');
          el.removeAttribute('title');
        });
      } catch {}
    };
    const installObserver = () => {
      stripTitles(document);
      const mo = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.type === 'attributes' && m.attributeName === 'title' && m.target?.hasAttribute?.('title')) {
            m.target.removeAttribute('title');
          }
          if (m.addedNodes?.length) {
            m.addedNodes.forEach((n) => n.nodeType === 1 && stripTitles(n));
          }
        }
      });
      mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['title'] });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', installObserver);
    } else {
      installObserver();
    }
    const SVG = `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2 L3 17 L7.5 13 L10 19 L13 18 L10.5 12 L17 12 Z"
        fill="black" stroke="white" stroke-width="1.2" stroke-linejoin="round"/>
    </svg>`;
    const cursor = document.createElement('div');
    cursor.id = '__virtualCursor';
    Object.assign(cursor.style, {
      position: 'fixed', left: '0px', top: '0px', width: '22px', height: '22px',
      pointerEvents: 'none', zIndex: '2147483647',
      transform: 'translate(-2px, -2px)', willChange: 'left, top',
    });
    cursor.innerHTML = SVG;

    const ripple = document.createElement('div');
    Object.assign(ripple.style, {
      position: 'fixed', left: '0px', top: '0px', width: '28px', height: '28px',
      borderRadius: '50%', border: '2px solid rgba(80, 120, 255, 0.9)',
      transform: 'translate(-14px, -14px) scale(0.3)', opacity: '0',
      pointerEvents: 'none', zIndex: '2147483646',
      transition: 'opacity 0.35s ease-out, transform 0.45s ease-out',
    });

    const install = () => {
      if (!document.body) return;
      if (!document.getElementById('__virtualCursor')) document.body.appendChild(cursor);
      if (!ripple.isConnected) document.body.appendChild(ripple);
    };
    install();
    document.addEventListener('DOMContentLoaded', install);

    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    }, true);
    window.addEventListener('mousedown', (e) => {
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.transition = 'none';
      ripple.style.opacity = '0.9';
      ripple.style.transform = 'translate(-14px, -14px) scale(0.3)';
      // force reflow
      void ripple.offsetWidth;
      ripple.style.transition = 'opacity 0.45s ease-out, transform 0.55s ease-out';
      ripple.style.opacity = '0';
      ripple.style.transform = 'translate(-14px, -14px) scale(1.8)';
    }, true);
  });

  const page = await recCtx.newPage();
  const ctxStart = Date.now();           // 녹화 t=0 기준
  await page.goto(`${BASE}/canvas`, { waitUntil: 'networkidle', timeout: 45_000 });

  // ── 3. 빈 캔버스 + "에이전트 시작" 버튼 대기 ──
  const startBtn = page.getByRole('button', { name: /에이전트 시작|Start Agent/ }).first();
  await startBtn.waitFor({ state: 'visible', timeout: 30_000 });
  const tEmptyReady = Date.now() - ctxStart;
  log(`  empty-state start button visible at t=${tEmptyReady}ms`);

  // 시작 시 가상 커서를 좌측 안쪽에 배치 (이후 버튼으로 부드럽게 이동시키기 위함).
  await page.mouse.move(140, 360);

  // ── 4. 시작 상태를 잠시 보여주기 ──
  await page.waitForTimeout(PRE_CLICK_HOLD_MS);

  // ── 5. 버튼까지 부드럽게 이동 → 클릭 → XGEN Agent 노드 등장 대기 ──
  const btnBox = await startBtn.boundingBox();
  if (btnBox) {
    const tx = btnBox.x + btnBox.width / 2;
    const ty = btnBox.y + btnBox.height / 2;
    log(`  animating cursor to (${tx.toFixed(0)}, ${ty.toFixed(0)})`);
    await page.mouse.move(tx, ty, { steps: 25 });   // 25 step ≈ ~400ms smooth glide
    await page.waitForTimeout(150);
  }
  log('  clicking start agent');
  await startBtn.click();
  // 노드 추가 확인: empty state 가 사라지면 노드가 들어온 것.
  await page.waitForFunction(
    () => !document.body.innerText.match(/에이전트 시작|Start Agent/),
    null,
    { timeout: 15_000 },
  ).catch(() => log('  warning: 에이전트 시작 텍스트가 사라지지 않았음 — 그래도 진행'));
  log('  agent node appears to be added');

  // ── 6. dragdrop 시나리오 — 시작노드 → 이동 → 종료노드 → 이동 ──
  //   ① '노드 추가' 클릭 → 모달
  //   ② '시작 노드' 카테고리 펼치기 → '사용자 질문 입력' 클릭 (자동 배치)
  //   ③ 추가된 노드를 XGEN Agent 노드 왼쪽으로 드래그
  //   ④ 다시 '노드 추가' → '종료 노드' → 'AI 답변 출력'
  //   ⑤ 추가된 노드를 XGEN Agent 노드 오른쪽으로 드래그
  // (포트 단위 연결은 내부 구조 의존도가 높아 본 캡처에선 노드 드래그 모션까지만)

  await page.waitForTimeout(700);

  async function openAddNodeModal(label) {
    log(`  ${label}: clicking 노드 추가`);
    const addBtn = page.getByRole('button', { name: /^노드\s*추가$|Add Node/ }).first();
    await addBtn.waitFor({ state: 'visible', timeout: 8_000 });
    const box = await addBtn.boundingBox();
    if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 18 });
    await page.waitForTimeout(150);
    await addBtn.click();
    await page.waitForTimeout(700);
  }

  async function pickCategoryItem(categoryLabel, itemLabel) {
    log(`  expanding "${categoryLabel}"`);
    const cat = page.getByRole('button', { name: new RegExp(`^${categoryLabel}\\s*▾`) }).first();
    await cat.waitFor({ state: 'visible', timeout: 5_000 });
    const cbox = await cat.boundingBox();
    if (cbox) await page.mouse.move(cbox.x + cbox.width / 2, cbox.y + cbox.height / 2, { steps: 14 });
    await page.waitForTimeout(150);
    await cat.click();
    await page.waitForTimeout(500);

    log(`  picking "${itemLabel}"`);
    const item = await page.waitForFunction(
      (label) => {
        const items = Array.from(document.querySelectorAll('button[class*="__item"]'));
        return items.find((el) => el.textContent.includes(label)) || null;
      },
      itemLabel,
      { timeout: 5_000 },
    );
    const itemEl = item.asElement();
    const ibox = await itemEl.boundingBox();
    if (ibox) await page.mouse.move(ibox.x + ibox.width / 2, ibox.y + ibox.height / 2, { steps: 14 });
    await page.waitForTimeout(180);
    await itemEl.click();
    await page.waitForTimeout(900);
  }

  async function connectPorts({ fromNodeMatch, fromPortLabelRegex, toNodeMatch, toPortLabelRegex, label }) {
    // 캔버스 위 포트 (작은 원, ~10px) 좌표를 찾아 mouse drag 로 두 포트를 연결.
    //   fromNodeMatch / toNodeMatch: 노드 textContent 매칭 정규식
    //   fromPortLabelRegex / toPortLabelRegex: portRow 내 portLabel 매칭 정규식
    const coords = await page.evaluate((args) => {
      const portGroups = Array.from(document.querySelectorAll('[class*="__portGroup"]'));
      const containers = [...new Set(portGroups.map((g) => {
        let p = g.parentElement;
        while (p && !/Node-module|node-card|nodeWrapper/.test(p.className || '')) p = p.parentElement;
        return p || g.parentElement;
      }))].filter(Boolean);

      const fromRe = new RegExp(args.fromNode);
      const toRe = new RegExp(args.toNode);
      const fromLabelRe = new RegExp(args.fromLabel);
      const toLabelRe = new RegExp(args.toLabel);

      const fromNode = containers.find((n) => fromRe.test(n.textContent));
      const toNode = containers.find((n) => toRe.test(n.textContent) && n !== fromNode);
      if (!fromNode || !toNode) return { error: 'nodes not found', fromFound: !!fromNode, toFound: !!toNode };

      function findPort(node, labelRe, preferOutput) {
        // portRow 들 안에서 portLabel 매칭 → 가장 가까운 작은 port circle 좌표 반환
        const rows = Array.from(node.querySelectorAll('[class*="__portRow"]'));
        const matchedRows = rows.filter((r) => {
          const lab = r.querySelector('[class*="__portLabel"]');
          return lab && labelRe.test(lab.textContent.trim());
        });
        if (!matchedRows.length) return null;
        // portRow 안의 port circle 들 (작은 점) 중에서 preferOutput 이면 오른쪽, 아니면 왼쪽 선택
        let bestPort = null;
        let bestX = preferOutput ? -Infinity : Infinity;
        for (const r of matchedRows) {
          const ports = Array.from(r.querySelectorAll('[class*="__port"]'))
            .filter((p) => !/__portLabel|__portRow|__portGroup/.test(p.className || ''));
          for (const p of ports) {
            const rect = p.getBoundingClientRect();
            const cx = rect.x + rect.width / 2;
            if ((preferOutput && cx > bestX) || (!preferOutput && cx < bestX)) {
              bestX = cx;
              bestPort = { x: cx, y: rect.y + rect.height / 2 };
            }
          }
        }
        return bestPort;
      }

      const fromPort = findPort(fromNode, fromLabelRe, true);  // output 측 = 오른쪽 포트
      const toPort = findPort(toNode, toLabelRe, false);       // input 측 = 왼쪽 포트
      if (!fromPort || !toPort) return { error: 'ports not found', fromPort, toPort };
      return { fromPort, toPort };
    }, {
      fromNode: fromNodeMatch,
      toNode: toNodeMatch,
      fromLabel: fromPortLabelRegex,
      toLabel: toPortLabelRegex,
    });

    if (coords.error) {
      log(`  connect ${label} skipped: ${coords.error}`);
      return;
    }
    log(`  connecting ${label}: (${coords.fromPort.x.toFixed(0)},${coords.fromPort.y.toFixed(0)}) → (${coords.toPort.x.toFixed(0)},${coords.toPort.y.toFixed(0)})`);
    await page.mouse.move(coords.fromPort.x, coords.fromPort.y, { steps: 14 });
    await page.waitForTimeout(120);
    await page.mouse.down();
    // 직선 드래그 — 중간 지점 한 번 거쳐 가시성 ↑
    const midX = (coords.fromPort.x + coords.toPort.x) / 2;
    const midY = (coords.fromPort.y + coords.toPort.y) / 2;
    await page.mouse.move(midX, midY, { steps: 18 });
    await page.mouse.move(coords.toPort.x, coords.toPort.y, { steps: 18 });
    await page.waitForTimeout(180);
    await page.mouse.up();
    await page.waitForTimeout(600);
  }

  async function dragLatestNode(direction) {
    const drag = await page.evaluate((dir) => {
      const groups = Array.from(document.querySelectorAll('[class*="__portGroup"]'));
      const containers = [...new Set(groups.map((g) => {
        let p = g.parentElement;
        while (p && !/Node-module|node-card|nodeWrapper/.test(p.className || '')) p = p.parentElement;
        return p || g.parentElement;
      }))].filter(Boolean);
      const lastNode = containers[containers.length - 1];
      const xgenNode = containers.find((n) => /에이전트 Xgen|Xgen/.test(n.textContent));
      if (!lastNode || !xgenNode) return { error: 'nodes not found' };
      const lb = lastNode.getBoundingClientRect();
      const xb = xgenNode.getBoundingClientRect();
      const sourceX = lb.x + lb.width / 2;
      const sourceY = lb.y + lb.height / 2;
      const targetX = dir === 'left'
        ? xb.x - lb.width / 2 - 40
        : xb.x + xb.width + lb.width / 2 + 40;
      const targetY = xb.y + xb.height / 2;
      return { sourceX, sourceY, targetX, targetY };
    }, direction);
    if (drag.error) {
      log(`  drag skipped: ${drag.error}`);
      return;
    }
    log(`  dragging from (${drag.sourceX.toFixed(0)},${drag.sourceY.toFixed(0)}) → (${drag.targetX.toFixed(0)},${drag.targetY.toFixed(0)})`);
    await page.mouse.move(drag.sourceX, drag.sourceY, { steps: 20 });
    await page.waitForTimeout(150);
    await page.mouse.down();
    await page.mouse.move(drag.targetX, drag.targetY, { steps: 28 });
    await page.waitForTimeout(180);
    await page.mouse.up();
    await page.waitForTimeout(600);
  }

  // ① ~ ③ 시작 노드 (사용자 질문 입력) → 왼쪽 배치 → XGEN 입력으로 연결
  await openAddNodeModal('start-node-add');
  await pickCategoryItem('시작 노드', '사용자 질문 입력');
  await dragLatestNode('left');
  await connectPorts({
    fromNodeMatch: '사용자 질문 입력|startnode',
    fromPortLabelRegex: '텍스트|출력',
    toNodeMatch: '에이전트 Xgen|Xgen',
    toPortLabelRegex: '^텍스트$|입력 텍스트',
    label: '시작 → XGEN',
  });

  // ④ ~ ⑤ 종료 노드 (AI 답변 출력) → 오른쪽 배치 → XGEN 스트림 출력에서 연결
  await openAddNodeModal('end-node-add');
  await pickCategoryItem('종료 노드', 'AI 답변 출력');
  await dragLatestNode('right');
  await connectPorts({
    fromNodeMatch: '에이전트 Xgen|Xgen',
    fromPortLabelRegex: '스트림|STREAM',
    toNodeMatch: 'AI 답변 출력|endnode',
    toPortLabelRegex: '입력|텍스트',
    label: 'XGEN → 종료',
  });

  // 마지막 상태 hold
  await page.waitForTimeout(POST_CLICK_HOLD_MS + 800);
  const tEnd = Date.now() - ctxStart;
  log(`  total recorded duration ≈ ${tEnd}ms`);

  // ── 7. close → webm flush ──
  const video = page.video();
  await page.close();
  await recCtx.close();
  const webmPath = await video.path();
  log('  webm saved:', webmPath, `(${fs.statSync(webmPath).size} bytes)`);

  await browser.close();

  // ── 7b. webm trim: [tEmptyReady - lead-in, tEnd] ──
  const trimStartMs = Math.max(0, tEmptyReady - TRIM_LEAD_IN_MS);
  const trimDurMs = tEnd - trimStartMs;
  const trimmedPath = path.join(TMP_DIR, 'trimmed.webm');
  log(`ffmpeg trim — ss=${(trimStartMs / 1000).toFixed(2)}s  t=${(trimDurMs / 1000).toFixed(2)}s`);
  // -c copy 는 webm 키프레임 간격이 넓어 ss/t 가 무시되는 경우가 있어 재인코딩으로 정확히 자른다.
  let r = spawnSync(FFMPEG, [
    '-y',
    '-ss', `${(trimStartMs / 1000).toFixed(3)}`,
    '-i', webmPath,
    '-t', `${(trimDurMs / 1000).toFixed(3)}`,
    '-c:v', 'libvpx',
    '-b:v', '2M',
    '-an',
    trimmedPath,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('ffmpeg trim failed');

  // ── 8. webm → GIF (2-pass palette) ──
  const palettePath = path.join(TMP_DIR, 'palette.png');
  const gifPath = path.join(OUT_DIR, '10 canvas dragdrop.gif');

  const filter = `fps=${FPS},scale=${SCALE_WIDTH}:-1:flags=lanczos`;

  log('ffmpeg pass 1 — palette');
  r = spawnSync(FFMPEG, ['-y', '-i', trimmedPath, '-vf', `${filter},palettegen`, palettePath], {
    stdio: 'inherit',
  });
  if (r.status !== 0) throw new Error('ffmpeg palette pass failed');

  log('ffmpeg pass 2 — gif');
  r = spawnSync(FFMPEG, [
    '-y',
    '-i', trimmedPath,
    '-i', palettePath,
    '-lavfi', `${filter} [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3`,
    gifPath,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('ffmpeg gif pass failed');

  const size = fs.statSync(gifPath).size;
  log('GIF written:', gifPath, `(${(size / 1024).toFixed(1)} KB)`);

  // 임시 webm 보존 (재실험용). palette 도 같이.
  log('done.');
})();
