// capture-user-type-dropdown-gif.mjs
//
// 관리자 > 사용자 관리에서 한 사용자의 편집 모달을 열고
// '사용자 유형' Select 를 클릭해 드롭다운(일반 사용자 / 슈퍼유저)이 펼쳐지는 흐름을 GIF 로 만든다.
//
// 출력: Xgen_Manual/base/admin/images/admin-user-type-dropdown.gif

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.xgen-stg');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'base', 'admin', 'images');
const TMP_DIR = path.join(REPO_ROOT, '.tmp-user-type-gif');
const FFMPEG = process.env.FFMPEG || 'C:/ffmpeg/bin/ffmpeg';

const VIEWPORT = { width: 1280, height: 720 };
const FPS = 15;
const SCALE_WIDTH = 960;
const PRE_CLICK_HOLD_MS = 900;
const POST_CLICK_HOLD_MS = 1800;
const TRIM_LEAD_IN_MS = 400;
const OUT_FILE = 'admin-user-type-dropdown.gif';

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
      page.waitForResponse(
        (r) => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST',
        { timeout: 30_000 },
      ),
      page.click('button[type="submit"]'),
    ]);
    if (res.status() !== 200) throw new Error(`login failed: ${res.status()}`);
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
    log(`  login OK`);
  }
  const state = await ctx.storageState();
  await ctx.close();
  return state;
}

async function captureShot(browser, storageState) {
  log(`shot user-type-dropdown — ${OUT_FILE}`);
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

  // 모달 내 '사용자 유형' Select 찾기 — 라벨 텍스트로 인근 select element 추적
  const selectInfo = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]') || document.body;
    // 라벨 "사용자 유형" 을 가진 컨테이너 찾기
    const all = Array.from(modal.querySelectorAll('*'));
    const labelEl = all.find(el => el.children.length === 0 && el.textContent.trim() === '사용자 유형');
    if (!labelEl) return { ok: false, reason: 'label not found' };
    // 같은 부모 또는 다음 형제에서 select-like element 찾기
    let candidate = null;
    const parents = [labelEl.parentElement, labelEl.parentElement?.parentElement, labelEl.parentElement?.parentElement?.parentElement].filter(Boolean);
    for (const p of parents) {
      candidate = p.querySelector('[role="combobox"], [role="button"][aria-haspopup], .MuiSelect-select, .MuiAutocomplete-root, button[aria-haspopup], select, [class*="select"]:not(label)');
      if (candidate && candidate !== labelEl) break;
    }
    if (!candidate) {
      // 형제 검사
      let sib = labelEl.nextElementSibling;
      while (sib && !candidate) {
        candidate = sib.matches?.('[role="combobox"], [role="button"][aria-haspopup], .MuiSelect-select, button[aria-haspopup], select') ? sib : sib.querySelector?.('[role="combobox"], [role="button"][aria-haspopup], .MuiSelect-select, button[aria-haspopup], select');
        sib = sib.nextElementSibling;
      }
    }
    if (!candidate) return { ok: false, reason: 'select element not found near label' };
    candidate.scrollIntoView({ block: 'center' });
    return { ok: true, rect: candidate.getBoundingClientRect().toJSON(), tag: candidate.tagName, classes: candidate.className };
  });
  log(`  select info:`, selectInfo);
  if (!selectInfo.ok) throw new Error(`사용자 유형 select not found: ${selectInfo.reason}`);

  // 가상 커서를 모달 내 안정 위치에 두기 — trim 시작
  await page.mouse.move(450, 250, { steps: 8 });
  const tReady = Date.now() - ctxStart;
  log(`  ready (modal stable) at t=${tReady}ms`);
  await page.waitForTimeout(PRE_CLICK_HOLD_MS);

  const selCx = selectInfo.rect.x + selectInfo.rect.width / 2;
  const selCy = selectInfo.rect.y + selectInfo.rect.height / 2;
  log(`  animating cursor to 사용자 유형 (${selCx.toFixed(0)}, ${selCy.toFixed(0)})`);
  await page.mouse.move(selCx, selCy, { steps: 30 });
  await page.waitForTimeout(200);
  await page.mouse.click(selCx, selCy);

  // 드롭다운 옵션 대기 — '슈퍼유저' 또는 '일반 사용자' 텍스트 노출
  await page.waitForFunction(() => {
    // listbox 또는 popper 가 새로 나타났는지 확인 (모달 밖일 수도 있음)
    const popper = document.querySelector('[role="listbox"], .MuiPopover-paper, .MuiMenu-paper, [role="menu"]');
    if (!popper) return false;
    return /슈퍼유저|일반 사용자|SuperUser|Standard/i.test(popper.textContent || '');
  }, null, { timeout: 5_000 }).catch(() => log(`  warning: 드롭다운 옵션 not detected`));
  log(`  dropdown opened`);

  // 커서를 옵션 영역 살짝 위로 호버시켜 보여줌 (선택은 안 함)
  const optionRect = await page.evaluate(() => {
    const popper = document.querySelector('[role="listbox"], .MuiPopover-paper, .MuiMenu-paper, [role="menu"]');
    if (!popper) return null;
    const opts = Array.from(popper.querySelectorAll('[role="option"], li, [role="menuitem"]'));
    const target = opts.find(o => /슈퍼유저|SuperUser/i.test(o.textContent || '')) || opts[1] || opts[0];
    return target?.getBoundingClientRect().toJSON() || null;
  });
  if (optionRect) {
    const ox = optionRect.x + Math.min(60, optionRect.width / 3);
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

  const size = fs.statSync(gifPath).size;
  log(`  GIF: ${gifPath} (${(size / 1024).toFixed(1)} KB)`);
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
