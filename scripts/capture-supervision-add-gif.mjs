// capture-supervision-add-gif.mjs
//
// 관리자 > 사용자 / 접근제어 > 역할/권한 관리 → '권한 구조' 탭 → 우상단 '권한 구조 추가' 버튼 클릭 →
// 신규 상하 관계 등록 모달이 열리는 흐름을 GIF 로.
//
// 출력: Xgen_Manual/base/admin/images/admin-role-management-supervision-tab.gif

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.xgen-stg');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'base', 'admin', 'images');
const TMP_DIR = path.join(REPO_ROOT, '.tmp-supervision-add-gif');
const FFMPEG = process.env.FFMPEG || 'C:/ffmpeg/bin/ffmpeg';

const VIEWPORT = { width: 1280, height: 720 };
const FPS = 15;
const SCALE_WIDTH = 960;
const PRE_CLICK_HOLD_MS = 900;
const POST_CLICK_HOLD_MS = 1800;
const TRIM_LEAD_IN_MS = 400;
const OUT_FILE = 'admin-role-management-supervision-tab.gif';

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
const ADMIN_EMAIL = 'x2bee_ds@plateer.com';
const ADMIN_PASS = env.XGEN_LOGIN_PASSWORD;

fs.rmSync(TMP_DIR, { recursive: true, force: true });
fs.mkdirSync(TMP_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const log = (...a) => console.log('[gif]', ...a);

const INIT_SCRIPT = () => {
  if (window.__virtualCursorInstalled) return;
  window.__virtualCursorInstalled = true;
  const tipStyle = document.createElement('style');
  tipStyle.id = '__gif-no-tooltip';
  tipStyle.textContent = `
    [role="tooltip"],
    [data-radix-popper-content-wrapper]:has([role="tooltip"]),
    .tippy-box, .tippy-popper, [data-tippy-root],
    .tooltip, .ant-tooltip, .MuiTooltip-popper,
    .react-tooltip, [data-tooltip] {
      display: none !important; visibility: hidden !important;
      opacity: 0 !important; pointer-events: none !important;
    }
  `;
  const installTipStyle = () => {
    if (!document.head) return;
    if (!document.getElementById('__gif-no-tooltip')) document.head.appendChild(tipStyle);
  };
  installTipStyle();
  document.addEventListener('DOMContentLoaded', installTipStyle);

  const stripTitles = (root) => {
    try { (root || document).querySelectorAll('[title]').forEach((el) => el.removeAttribute('title')); } catch {}
  };
  const installObserver = () => {
    stripTitles(document);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'title' && m.target?.hasAttribute?.('title')) {
          m.target.removeAttribute('title');
        }
        if (m.addedNodes?.length) m.addedNodes.forEach((n) => n.nodeType === 1 && stripTitles(n));
      }
    });
    mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['title'] });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installObserver);
  else installObserver();

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
    void ripple.offsetWidth;
    ripple.style.transition = 'opacity 0.45s ease-out, transform 0.55s ease-out';
    ripple.style.opacity = '0';
    ripple.style.transform = 'translate(-14px, -14px) scale(1.8)';
  }, true);
};

async function loginAndGetStorage(browser) {
  log(`logging in as ${ADMIN_EMAIL}`);
  const ctx = await browser.newContext({ viewport: VIEWPORT, locale: 'ko-KR' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60_000 });
  if (await page.$('#login-email')) {
    await page.fill('#login-email', ADMIN_EMAIL);
    await page.fill('#login-password', ADMIN_PASS);
    const [res] = await Promise.all([
      page.waitForResponse(r => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST', { timeout: 30_000 }),
      page.click('button[type="submit"]'),
    ]);
    if (res.status() !== 200) throw new Error(`login failed: ${res.status()}`);
    await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 30_000 });
    log(`  login OK`);
  }
  const state = await ctx.storageState();
  await ctx.close();
  return state;
}

async function captureShot(browser, storageState) {
  log(`shot supervision-add — ${OUT_FILE}`);
  const recCtx = await browser.newContext({
    viewport: VIEWPORT, locale: 'ko-KR', storageState,
    recordVideo: { dir: TMP_DIR, size: VIEWPORT },
  });
  await recCtx.addInitScript(INIT_SCRIPT);
  const page = await recCtx.newPage();

  const ctxStart = Date.now();
  await page.goto(`${BASE}/admin?view=admin-role-management`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForFunction(() => /역할\/권한 관리/.test(document.body.innerText), null, { timeout: 30_000 });
  await page.waitForTimeout(800);

  // setup: '권한 구조' 탭 클릭 → 상하 관계 목록 노출
  const supTab = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button, [role="tab"]'));
    const target = tabs.find(t => t.textContent.trim() === '권한 구조');
    if (!target) return { ok: false };
    target.scrollIntoView({ block: 'center' });
    target.click();
    return { ok: true };
  });
  if (!supTab.ok) throw new Error('권한 구조 tab not found');
  await page.waitForFunction(() => /상위 권한|하위 권한/.test(document.body.innerText), null, { timeout: 5_000 })
    .catch(() => log('  warning: supervision table not detected'));
  await page.waitForTimeout(800);

  // 우상단 '권한 구조 추가' 버튼 위치 확보
  const addBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.textContent.trim() === '권한 구조 추가');
    if (!target) return { ok: false };
    target.scrollIntoView({ block: 'center' });
    return { ok: true, rect: target.getBoundingClientRect().toJSON() };
  });
  if (!addBtn.ok) throw new Error('권한 구조 추가 button not found');

  // 가상 커서를 화면 좌상단 본문 영역으로 이동 → trim 시작점
  await page.mouse.move(420, 280, { steps: 8 });
  const tReady = Date.now() - ctxStart;
  log(`  ready (supervision tab open) at t=${tReady}ms`);
  await page.waitForTimeout(PRE_CLICK_HOLD_MS);

  // '권한 구조 추가' 버튼으로 가상 커서 이동 → 클릭
  const addCx = addBtn.rect.x + addBtn.rect.width / 2;
  const addCy = addBtn.rect.y + addBtn.rect.height / 2;
  log(`  animating cursor to 권한 구조 추가 (${addCx.toFixed(0)}, ${addCy.toFixed(0)})`);
  await page.mouse.move(addCx, addCy, { steps: 30 });
  await page.waitForTimeout(200);
  await page.mouse.click(addCx, addCy);

  // 모달 노출 대기 — '상위' / '하위' 라벨 또는 '저장' 버튼 노출
  await page.waitForFunction(() => {
    const modal = document.querySelector('[role="dialog"]');
    if (!modal) return false;
    return /상위|하위|저장/.test(modal.textContent || '');
  }, null, { timeout: 5_000 }).catch(() => log(`  warning: 모달 요소 detection 실패`));
  log(`  모달 열림`);

  // 모달 가운데로 커서 호버 (살짝 우측 이동)
  await page.mouse.move(900, 250, { steps: 10 });
  await page.waitForTimeout(POST_CLICK_HOLD_MS);
  const tEnd = Date.now() - ctxStart;
  log(`  total ≈ ${tEnd}ms`);

  const video = page.video();
  await page.close();
  await recCtx.close();
  const webmPath = await video.path();
  log(`  webm saved: ${webmPath} (${fs.statSync(webmPath).size} bytes)`);

  const trimStartMs = Math.max(0, tReady - TRIM_LEAD_IN_MS);
  const trimDurMs = tEnd - trimStartMs;
  const trimmedPath = path.join(TMP_DIR, `trimmed.webm`);
  log(`  ffmpeg trim — ss=${(trimStartMs / 1000).toFixed(2)}s  t=${(trimDurMs / 1000).toFixed(2)}s`);
  let r = spawnSync(FFMPEG, [
    '-y', '-ss', `${(trimStartMs / 1000).toFixed(3)}`, '-i', webmPath,
    '-t', `${(trimDurMs / 1000).toFixed(3)}`,
    '-c:v', 'libvpx', '-b:v', '2M', '-an', trimmedPath,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg trim failed`);

  const palettePath = path.join(TMP_DIR, `palette.png`);
  const gifPath = path.join(OUT_DIR, OUT_FILE);
  const filter = `fps=${FPS},scale=${SCALE_WIDTH}:-2:flags=lanczos`;
  r = spawnSync(FFMPEG, ['-y', '-i', trimmedPath, '-vf', `${filter},palettegen=stats_mode=diff`, palettePath], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`palette failed`);
  r = spawnSync(FFMPEG, [
    '-y', '-i', trimmedPath, '-i', palettePath,
    '-lavfi', `${filter} [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle`,
    '-loop', '0', '-f', 'gif', gifPath,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`gif encode failed`);
  log(`  GIF: ${gifPath} (${(fs.statSync(gifPath).size / 1024).toFixed(1)} KB)`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const storage = await loginAndGetStorage(browser);
    await captureShot(browser, storage);
  } finally {
    await browser.close();
  }
  log('done.');
})();
