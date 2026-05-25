// capture-mcp-new-session-gif.mjs
//
// 관리자 > MCP 관리 > MCP 운영/모니터링 (admin?view=admin-mcp-station) 화면에서
// 우상단 '+ 새 세션' 버튼을 클릭하면 나오는 신규 세션 등록 화면까지의 흐름을 GIF 로.
// 마우스 커서가 명시적으로 보이도록 충분한 step·hold 사용.
//
// 출력: Xgen_Manual/base/admin/images/admin-mcp-station.gif

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.xgen-stg');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'base', 'admin', 'images');
const TMP_DIR = path.join(REPO_ROOT, '.tmp-mcp-new-session-gif');
const FFMPEG = process.env.FFMPEG || 'C:/ffmpeg/bin/ffmpeg';

const VIEWPORT = { width: 1280, height: 720 };
const FPS = 15;
const SCALE_WIDTH = 960;
const PRE_CLICK_HOLD_MS = 800;
const POST_CLICK_HOLD_MS = 2200;
const TRIM_LEAD_IN_MS = 200;
const OUT_FILE = 'admin-mcp-station.gif';

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
    [role="tooltip"], [data-radix-popper-content-wrapper]:has([role="tooltip"]),
    .tippy-box, .tippy-popper, [data-tippy-root],
    .tooltip, .ant-tooltip, .MuiTooltip-popper, .react-tooltip, [data-tooltip] {
      display: none !important; visibility: hidden !important;
      opacity: 0 !important; pointer-events: none !important;
    }
  `;
  if (document.head && !document.getElementById('__gif-no-tooltip')) document.head.appendChild(tipStyle);
  const stripTitles = (root) => { try { (root || document).querySelectorAll('[title]').forEach((el) => el.removeAttribute('title')); } catch {} };
  stripTitles(document);
  new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'attributes' && m.attributeName === 'title' && m.target?.hasAttribute?.('title')) m.target.removeAttribute('title');
      if (m.addedNodes?.length) m.addedNodes.forEach((n) => n.nodeType === 1 && stripTitles(n));
    }
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['title'] });

  const SVG = `<svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 2 L3 17 L7.5 13 L10 19 L13 18 L10.5 12 L17 12 Z" fill="black" stroke="white" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
  const cursor = document.createElement('div'); cursor.id = '__virtualCursor';
  Object.assign(cursor.style, { position: 'fixed', left: '0px', top: '0px', width: '22px', height: '22px', pointerEvents: 'none', zIndex: '2147483647', transform: 'translate(-2px, -2px)' });
  cursor.innerHTML = SVG;
  const ripple = document.createElement('div');
  Object.assign(ripple.style, { position: 'fixed', left: '0px', top: '0px', width: '28px', height: '28px', borderRadius: '50%', border: '2px solid rgba(80, 120, 255, 0.9)', transform: 'translate(-14px, -14px) scale(0.3)', opacity: '0', pointerEvents: 'none', zIndex: '2147483646', transition: 'opacity 0.35s ease-out, transform 0.45s ease-out' });
  const install = () => {
    if (!document.body) return;
    if (!document.getElementById('__virtualCursor')) document.body.appendChild(cursor);
    if (!ripple.isConnected) document.body.appendChild(ripple);
  };
  install(); document.addEventListener('DOMContentLoaded', install);
  window.addEventListener('mousemove', (e) => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }, true);
  window.addEventListener('mousedown', (e) => {
    ripple.style.left = e.clientX + 'px'; ripple.style.top = e.clientY + 'px';
    ripple.style.transition = 'none'; ripple.style.opacity = '0.9'; ripple.style.transform = 'translate(-14px, -14px) scale(0.3)';
    void ripple.offsetWidth;
    ripple.style.transition = 'opacity 0.45s ease-out, transform 0.55s ease-out';
    ripple.style.opacity = '0'; ripple.style.transform = 'translate(-14px, -14px) scale(1.8)';
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
  }
  const state = await ctx.storageState();
  await ctx.close();
  return state;
}

async function captureShot(browser, storageState) {
  log(`shot mcp-new-session — ${OUT_FILE}`);
  const recCtx = await browser.newContext({ viewport: VIEWPORT, locale: 'ko-KR', storageState, recordVideo: { dir: TMP_DIR, size: VIEWPORT } });
  await recCtx.addInitScript(INIT_SCRIPT);
  const page = await recCtx.newPage();
  const ctxStart = Date.now();

  await page.goto(`${BASE}/admin?view=admin-mcp-station`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForFunction(() => /MCP 운영|MCP 모니터링|MCP Station/i.test(document.body.innerText), null, { timeout: 30_000 })
    .catch(() => log('  warning: header text not detected'));
  await page.waitForTimeout(1200);

  // '+ 새 세션' 버튼 위치 확보
  const newBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).filter(b => /\+\s*새 세션/.test(b.textContent || '') || b.textContent.trim() === '+ 새 세션');
    const visible = btns.find(b => !b.disabled && b.offsetParent !== null);
    if (!visible) return null;
    visible.scrollIntoView({ block: 'center' });
    return { rect: visible.getBoundingClientRect().toJSON(), text: visible.textContent.trim() };
  });
  if (!newBtn) throw new Error('+ 새 세션 button not found');
  log(`  target btn:`, newBtn);

  // 가상 커서 명시적으로 등장 — 본문 좌측에 천천히 이동
  await page.mouse.move(0, 0);
  await page.waitForTimeout(150);
  await page.mouse.move(420, 380, { steps: 30 });
  await page.waitForTimeout(500);
  const tReady = Date.now() - ctxStart;
  log(`  ready (cursor visible) at t=${tReady}ms`);
  await page.waitForTimeout(PRE_CLICK_HOLD_MS);

  // '+ 새 세션' 버튼으로 천천히 이동 → hover → 클릭
  const cx = newBtn.rect.x + newBtn.rect.width / 2;
  const cy = newBtn.rect.y + newBtn.rect.height / 2;
  log(`  animating cursor to + 새 세션 (${cx.toFixed(0)}, ${cy.toFixed(0)})`);
  await page.mouse.move(cx, cy, { steps: 60 });
  await page.waitForTimeout(450);
  await page.mouse.click(cx, cy);

  // 신규 세션 등록 화면 노출 대기 (모달 또는 페이지 전환)
  await page.waitForFunction(() => {
    const modal = document.querySelector('[role="dialog"], .MuiDialog-root, .MuiModal-root');
    if (modal) return true;
    return /세션 생성|새 세션|MCP 서버 선택|연결 정보|Create Session/i.test(document.body.innerText || '');
  }, null, { timeout: 5_000 }).catch(() => log('  warning: 신규 세션 화면 not detected'));
  await page.waitForTimeout(400);

  // 결과 화면에서 첫 입력칸/필드 근처로 커서 이동시켜 hover 시연
  const focusRect = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"], .MuiDialog-root, .MuiModal-root') || document.body;
    const input = modal.querySelector('input, textarea, [role="combobox"], select');
    return input?.getBoundingClientRect().toJSON() || null;
  });
  if (focusRect) {
    await page.mouse.move(focusRect.x + 40, focusRect.y + focusRect.height / 2, { steps: 25 });
  } else {
    await page.mouse.move(1100, 120, { steps: 8 });
  }
  await page.waitForTimeout(POST_CLICK_HOLD_MS);
  const tEnd = Date.now() - ctxStart;
  log(`  total ≈ ${tEnd}ms`);

  const video = page.video();
  await page.close();
  await recCtx.close();
  const webmPath = await video.path();
  log(`  webm saved (${fs.statSync(webmPath).size} bytes)`);

  const trimStartMs = Math.max(0, tReady - TRIM_LEAD_IN_MS);
  const trimDurMs = tEnd - trimStartMs;
  const trimmedPath = path.join(TMP_DIR, `trimmed.webm`);
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
