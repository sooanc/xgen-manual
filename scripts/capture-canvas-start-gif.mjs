// capture-canvas-start-gif.mjs
//
// 캔버스 빈 화면 → "에이전트 시작" 버튼 클릭 → XGEN Agent 노드 자동 배치
// 의 전환을 GIF 로 캡처해 매뉴얼의 canvas-editor.png 를 대체한다.
//
//   cd C:\xgen-manual && node scripts/capture-canvas-start-gif.mjs
//
// 흐름:
//   1. .env.xgen-stg 로드, stg 로그인 → storageState 저장
//   2. recordVideo 컨텍스트로 /canvas 열기 (로그인 트래픽이 영상에 끼지 않게 분리)
//   3. 빈 캔버스 + "에이전트 시작" 버튼 가시 확인
//   4. ~1.2s hold (시작 상태를 명확히 보여주기)
//   5. 버튼 클릭 → XGEN Agent 노드 등장
//   6. ~1.8s hold
//   7. 컨텍스트 close → webm flush → ffmpeg 로 GIF 변환 (palette 2-pass)
//   8. 출력: Xgen_Manual/base/user/images/canvas-editor.gif

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.xgen-stg');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'base', 'user', 'images');
const TMP_DIR = path.join(REPO_ROOT, '.tmp-canvas-start');
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
if (!BASE || !EMAIL || !PASS) throw new Error('XGEN_BASE_URL/EMAIL/PASSWORD missing in .env.xgen-stg');

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
  await recCtx.addInitScript(() => {
    if (window.__virtualCursorInstalled) return;
    window.__virtualCursorInstalled = true;
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

  // ── 6. 결과 hold ──
  await page.waitForTimeout(POST_CLICK_HOLD_MS);
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
  const gifPath = path.join(OUT_DIR, 'canvas-editor.gif');

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
