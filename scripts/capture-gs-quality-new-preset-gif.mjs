// capture-gs-quality-new-preset-gif.mjs
// gs@plateer.com 계정으로 Agent 품질 평가 → 품질 척도 정의 탭 → "새 프리셋 생성" 클릭 →
// 프리셋 작성 모달이 열리는 흐름 GIF.
//
//   cd C:\xgen-manual && node scripts/capture-gs-quality-new-preset-gif.mjs
//
// 출력: Xgen_Manual/customers/gs-cert/overlay/user/images/quality-new-preset.gif
//   (base/ 의 표준 캡처는 그대로 두고, GS인증 매뉴얼만 gs 계정 화면으로 오버레이)

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.gs-cert');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'customers', 'gs-cert', 'overlay', 'user', 'images');
const TMP_DIR = path.join(REPO_ROOT, '.tmp-gs-quality-new-preset');
const FFMPEG = process.env.FFMPEG || 'C:/ffmpeg/bin/ffmpeg';

const VIEWPORT = { width: 1280, height: 720 };
const FPS = 15;
const SCALE_WIDTH = 960;
const PRE_CLICK_HOLD_MS = 1100;
const POST_CLICK_HOLD_MS = 2400;   // 모달이 떠서 보이는 시간 확보
const TRIM_LEAD_IN_MS = 400;
const OUT_FILE = 'quality-new-preset.gif';

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

const log = (...a) => console.log('[gs-preset-gif]', ...a);

// 가상 커서 + 툴팁 억제 (canvas-start 스크립트와 동일 패턴)
const INIT_SCRIPT = () => {
  if (window.__virtualCursorInstalled) return;
  window.__virtualCursorInstalled = true;
  const tipStyle = document.createElement('style');
  tipStyle.id = '__gif-no-tooltip';
  tipStyle.textContent = `
    [role="tooltip"], [data-radix-popper-content-wrapper]:has([role="tooltip"]),
    .tippy-box, .tippy-popper, [data-tippy-root],
    .tooltip, .ant-tooltip, .MuiTooltip-popper, .react-tooltip, [data-tooltip] {
      display: none !important; visibility: hidden !important;
      opacity: 0 !important; pointer-events: none !important;
    }`;
  const installTip = () => { if (document.head && !document.getElementById('__gif-no-tooltip')) document.head.appendChild(tipStyle); };
  installTip();
  document.addEventListener('DOMContentLoaded', installTip);
  const stripTitles = (root) => { try { (root || document).querySelectorAll('[title]').forEach((el) => el.removeAttribute('title')); } catch {} };
  const installObs = () => {
    stripTitles(document);
    new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'title' && m.target?.hasAttribute?.('title')) m.target.removeAttribute('title');
        if (m.addedNodes?.length) m.addedNodes.forEach((n) => n.nodeType === 1 && stripTitles(n));
      }
    }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['title'] });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installObs); else installObs();
  const SVG = `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M3 2 L3 17 L7.5 13 L10 19 L13 18 L10.5 12 L17 12 Z" fill="black" stroke="white" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
  const cursor = document.createElement('div');
  cursor.id = '__virtualCursor';
  Object.assign(cursor.style, { position: 'fixed', left: '0px', top: '0px', width: '22px', height: '22px', pointerEvents: 'none', zIndex: '2147483647', transform: 'translate(-2px, -2px)' });
  cursor.innerHTML = SVG;
  const ripple = document.createElement('div');
  Object.assign(ripple.style, { position: 'fixed', left: '0px', top: '0px', width: '28px', height: '28px', borderRadius: '50%', border: '2px solid rgba(80,120,255,0.9)', transform: 'translate(-14px,-14px) scale(0.3)', opacity: '0', pointerEvents: 'none', zIndex: '2147483646', transition: 'opacity .35s ease-out, transform .45s ease-out' });
  const install = () => { if (!document.body) return; if (!document.getElementById('__virtualCursor')) document.body.appendChild(cursor); if (!ripple.isConnected) document.body.appendChild(ripple); };
  install();
  document.addEventListener('DOMContentLoaded', install);
  window.addEventListener('mousemove', (e) => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }, true);
  window.addEventListener('mousedown', (e) => {
    ripple.style.left = e.clientX + 'px'; ripple.style.top = e.clientY + 'px';
    ripple.style.transition = 'none'; ripple.style.opacity = '0.9'; ripple.style.transform = 'translate(-14px,-14px) scale(0.3)';
    void ripple.offsetWidth;
    ripple.style.transition = 'opacity .45s ease-out, transform .55s ease-out'; ripple.style.opacity = '0'; ripple.style.transform = 'translate(-14px,-14px) scale(1.8)';
  }, true);
};

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1. 로그인 (녹화 X)
  log('login', BASE, EMAIL);
  const authCtx = await browser.newContext({ viewport: VIEWPORT, locale: 'ko-KR' });
  const authPage = await authCtx.newPage();
  await authPage.goto(BASE, { waitUntil: 'networkidle', timeout: 60_000 });
  if (await authPage.$('#login-email')) {
    await authPage.fill('#login-email', EMAIL);
    await authPage.fill('#login-password', PASS);
    const [res] = await Promise.all([
      authPage.waitForResponse((r) => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST', { timeout: 30_000 }),
      authPage.click('button[type="submit"]'),
    ]);
    if (res.status() !== 200) throw new Error(`login failed: ${res.status()}`);
    await authPage.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
    log('  login OK');
  }
  const storageState = await authCtx.storageState();
  await authCtx.close();

  // 2. 녹화 컨텍스트
  const recCtx = await browser.newContext({ viewport: VIEWPORT, locale: 'ko-KR', storageState, recordVideo: { dir: TMP_DIR, size: VIEWPORT } });
  await recCtx.addInitScript(INIT_SCRIPT);
  const page = await recCtx.newPage();
  const ctxStart = Date.now();

  // 3. /main 진입 → 'Agent 품질 평가' 메뉴 클릭 → 품질 척도 정의 탭 (이 구간은 trim 됨)
  await page.goto(`${BASE}/main`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForTimeout(2500);
  const menu = page.locator('a, button, [role="menuitem"], li').filter({ hasText: /^Agent 품질 평가$/ }).last();
  await menu.click({ timeout: 15_000 });
  await page.waitForURL(/view=agentflow-tester/, { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(2000);
  const tab = page.getByText(/품질 척도 정의/).first();
  await tab.click({ timeout: 15_000 });
  await page.waitForTimeout(1500);

  // 4. '새 프리셋 생성' 버튼 가시 → tReady
  const newBtn = page.getByRole('button', { name: /새 프리셋 생성|프리셋 생성/ }).first();
  await newBtn.waitFor({ state: 'visible', timeout: 20_000 });
  const tReady = Date.now() - ctxStart;
  log(`  '새 프리셋 생성' visible at t=${tReady}ms`);

  await page.mouse.move(180, 360);
  await page.waitForTimeout(PRE_CLICK_HOLD_MS);

  // 5. 버튼으로 커서 이동 → 클릭 → 모달 등장
  const box = await newBtn.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 25 });
    await page.waitForTimeout(150);
  }
  log('  clicking 새 프리셋 생성');
  await newBtn.click();
  // 모달 등장 대기
  await page.waitForSelector('[role="dialog"], .modal, [class*="modal" i], [class*="Modal"]', { state: 'visible', timeout: 12_000 })
    .then(() => log('  modal visible'))
    .catch(() => log('  warning: 모달 selector 미검출 — 그래도 진행'));
  await page.mouse.move(660, 200, { steps: 6 });

  // 6. hold
  await page.waitForTimeout(POST_CLICK_HOLD_MS);
  const tEnd = Date.now() - ctxStart;
  log(`  recorded ~${tEnd}ms`);

  // 7. close → webm
  const video = page.video();
  await page.close();
  await recCtx.close();
  const webmPath = await video.path();
  await browser.close();
  log('  webm:', webmPath, `(${fs.statSync(webmPath).size} bytes)`);

  // 7b. trim
  const trimStartMs = Math.max(0, tReady - TRIM_LEAD_IN_MS);
  const trimDurMs = tEnd - trimStartMs;
  const trimmedPath = path.join(TMP_DIR, 'trimmed.webm');
  log(`ffmpeg trim ss=${(trimStartMs / 1000).toFixed(2)}s t=${(trimDurMs / 1000).toFixed(2)}s`);
  let r = spawnSync(FFMPEG, ['-y', '-ss', `${(trimStartMs / 1000).toFixed(3)}`, '-i', webmPath, '-t', `${(trimDurMs / 1000).toFixed(3)}`, '-c:v', 'libvpx', '-b:v', '2M', '-an', trimmedPath], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('ffmpeg trim failed');

  // 8. webm → GIF (2-pass palette)
  const palettePath = path.join(TMP_DIR, 'palette.png');
  const gifPath = path.join(OUT_DIR, OUT_FILE);
  const filter = `fps=${FPS},scale=${SCALE_WIDTH}:-1:flags=lanczos`;
  log('ffmpeg palette');
  r = spawnSync(FFMPEG, ['-y', '-i', trimmedPath, '-vf', `${filter},palettegen`, palettePath], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('palette pass failed');
  log('ffmpeg gif');
  r = spawnSync(FFMPEG, ['-y', '-i', trimmedPath, '-i', palettePath, '-lavfi', `${filter} [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3`, gifPath], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('gif pass failed');
  log('GIF written:', gifPath, `(${(fs.statSync(gifPath).size / 1024).toFixed(1)} KB)`);
  log('done.');
})();
