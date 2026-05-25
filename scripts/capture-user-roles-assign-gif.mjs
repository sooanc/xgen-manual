// capture-user-roles-assign-gif.mjs
//
// 사용자 관리 → 편집 → 사용자 편집 모달 → '권한' 탭 클릭 → 역할 다중 선택 영역 노출 흐름을 GIF 로.
//
// 출력: Xgen_Manual/base/admin/images/admin-user-roles-assign.gif

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.xgen-stg');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'base', 'admin', 'images');
const TMP_DIR = path.join(REPO_ROOT, '.tmp-user-roles-gif');
const FFMPEG = process.env.FFMPEG || 'C:/ffmpeg/bin/ffmpeg';

const VIEWPORT = { width: 1280, height: 720 };
const FPS = 15;
const SCALE_WIDTH = 960;
const PRE_CLICK_HOLD_MS = 900;
const POST_CLICK_HOLD_MS = 1800;
const TRIM_LEAD_IN_MS = 400;
const OUT_FILE = 'admin-user-roles-assign.gif';

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
  log(`shot user-roles-assign — ${OUT_FILE}`);
  const recCtx = await browser.newContext({
    viewport: VIEWPORT, locale: 'ko-KR', storageState,
    recordVideo: { dir: TMP_DIR, size: VIEWPORT },
  });
  await recCtx.addInitScript(INIT_SCRIPT);
  const page = await recCtx.newPage();

  const ctxStart = Date.now();
  await page.goto(`${BASE}/admin?view=admin-users`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForSelector('button:has-text("편집")', { state: 'visible', timeout: 30_000 });
  await page.waitForTimeout(800);

  // setup: 첫 편집 버튼 클릭 → 사용자 편집 모달 오픈
  const editClicked = await page.evaluate(() => {
    const allEdit = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.trim() === '편집');
    if (!allEdit[0]) return { ok: false };
    allEdit[0].scrollIntoView({ block: 'center' });
    return { ok: true, rect: allEdit[0].getBoundingClientRect().toJSON() };
  });
  if (!editClicked.ok) throw new Error('편집 button not found');
  await page.mouse.move(140, 360);
  await page.waitForTimeout(300);
  const editCx = editClicked.rect.x + editClicked.rect.width / 2;
  const editCy = editClicked.rect.y + editClicked.rect.height / 2;
  await page.mouse.move(editCx, editCy, { steps: 20 });
  await page.waitForTimeout(150);
  await page.mouse.click(editCx, editCy);

  await page.waitForFunction(() => /사용자 편집/.test(document.body.innerText), null, { timeout: 8_000 });
  await page.waitForTimeout(700);

  // 모달 내 '권한' 탭 찾기 (기본정보·권한·상세정보 중 권한)
  const roleTab = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]') || document.body;
    const tabs = Array.from(modal.querySelectorAll('button, [role="tab"]'));
    const target = tabs.find(t => t.textContent.trim() === '권한');
    if (!target) return { ok: false };
    target.scrollIntoView({ block: 'center' });
    return { ok: true, rect: target.getBoundingClientRect().toJSON() };
  });
  if (!roleTab.ok) throw new Error('권한 tab not found in modal');

  // 가상 커서를 모달 좌상단으로 이동 → trim 시작점
  await page.mouse.move(450, 200, { steps: 8 });
  const tReady = Date.now() - ctxStart;
  log(`  ready (modal stable) at t=${tReady}ms`);
  await page.waitForTimeout(PRE_CLICK_HOLD_MS);

  // '권한' 탭 클릭
  const tabCx = roleTab.rect.x + roleTab.rect.width / 2;
  const tabCy = roleTab.rect.y + roleTab.rect.height / 2;
  log(`  animating cursor to 권한 tab (${tabCx.toFixed(0)}, ${tabCy.toFixed(0)})`);
  await page.mouse.move(tabCx, tabCy, { steps: 25 });
  await page.waitForTimeout(200);
  await page.mouse.click(tabCx, tabCy);

  // 권한 탭이 활성화되면 역할 영역이 노출됨. '역할' 라벨이 보일 때까지 대기.
  await page.waitForFunction(() => {
    const modal = document.querySelector('[role="dialog"]') || document.body;
    return /역할/.test(modal.textContent || '');
  }, null, { timeout: 4_000 }).catch(() => log(`  warning: 역할 text not detected`));
  await page.waitForTimeout(700);

  // 역할 선택 영역(Select 또는 multi-select)으로 커서 이동
  const roleSelectRect = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]') || document.body;
    // 역할 라벨 → 인접 select-like
    const all = Array.from(modal.querySelectorAll('*'));
    const labelEl = all.find(el => el.children.length === 0 && /^역할/.test(el.textContent.trim()));
    if (!labelEl) return null;
    let candidate = null;
    const parents = [labelEl.parentElement, labelEl.parentElement?.parentElement, labelEl.parentElement?.parentElement?.parentElement].filter(Boolean);
    for (const p of parents) {
      candidate = p.querySelector('[role="combobox"], .MuiSelect-select, .MuiAutocomplete-root, button[aria-haspopup], select, [class*="MuiAutocomplete"]');
      if (candidate && candidate !== labelEl) break;
    }
    if (!candidate) return null;
    candidate.scrollIntoView({ block: 'center' });
    return candidate.getBoundingClientRect().toJSON();
  });
  if (roleSelectRect) {
    const rx = roleSelectRect.x + Math.min(80, roleSelectRect.width / 3);
    const ry = roleSelectRect.y + roleSelectRect.height / 2;
    log(`  hover role select (${rx.toFixed(0)}, ${ry.toFixed(0)})`);
    await page.mouse.move(rx, ry, { steps: 25 });
    await page.waitForTimeout(400);
    // 클릭해서 다중 선택 드롭다운 열기
    await page.mouse.click(rx, ry);
    await page.waitForTimeout(800);
  }

  // 드롭다운에서 옵션 위로 hover 시켜 선택 가능함을 보여주기
  const optionRect = await page.evaluate(() => {
    const popper = document.querySelector('[role="listbox"], .MuiPopover-paper, .MuiMenu-paper, [role="menu"], .MuiAutocomplete-popper, [class*="popper"]');
    if (!popper) return null;
    const opts = Array.from(popper.querySelectorAll('[role="option"], li, [role="menuitem"]'));
    return opts[1]?.getBoundingClientRect().toJSON() || opts[0]?.getBoundingClientRect().toJSON() || null;
  });
  if (optionRect) {
    const ox = optionRect.x + 60;
    const oy = optionRect.y + optionRect.height / 2;
    await page.mouse.move(ox, oy, { steps: 20 });
  }
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
