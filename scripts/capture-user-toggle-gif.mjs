// capture-user-toggle-gif.mjs
//
// 관리자 > 사용자 관리에서 한 사용자의 편집 모달을 열고
// "활성 → 비활성" 토글을 클릭하는 흐름을 GIF 로 만든다.
//
// 출력: Xgen_Manual/base/admin/images/admin-user-toggle.gif
//
//   cd C:\xgen-manual && node scripts/capture-user-toggle-gif.mjs

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.xgen-stg');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'base', 'admin', 'images');
const TMP_DIR = path.join(REPO_ROOT, '.tmp-user-toggle-gif');
const FFMPEG = process.env.FFMPEG || 'C:/ffmpeg/bin/ffmpeg';

const VIEWPORT = { width: 1280, height: 720 };
const FPS = 15;
const SCALE_WIDTH = 960;
const PRE_CLICK_HOLD_MS = 900;
const POST_CLICK_HOLD_MS = 1600;
const TRIM_LEAD_IN_MS = 400;
const OUT_FILE = 'admin-user-toggle.gif';

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
// 시스템관리자 계정 (.env.xgen-stg 의 마지막에 노출된 값이 그대로 들어 있음)
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

  const stripTitles = (root) => {
    try {
      (root || document).querySelectorAll('[title]').forEach((el) => el.removeAttribute('title'));
    } catch {}
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
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installObserver);
  } else { installObserver(); }

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
    if (res.status() !== 200) {
      const body = await res.text().catch(() => '');
      throw new Error(`login failed: ${res.status()} ${body.slice(0, 200)}`);
    }
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
    log(`  login OK`);
  }
  const state = await ctx.storageState();
  await ctx.close();
  return state;
}

async function captureShot(browser, storageState) {
  log(`shot user-toggle — ${OUT_FILE}`);
  const recCtx = await browser.newContext({
    viewport: VIEWPORT,
    locale: 'ko-KR',
    storageState,
    recordVideo: { dir: TMP_DIR, size: VIEWPORT },
  });
  await recCtx.addInitScript(INIT_SCRIPT);
  const page = await recCtx.newPage();

  const ctxStart = Date.now();
  await page.goto(`${BASE}/admin?view=admin-users`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForSelector('button:has-text("편집")', { state: 'visible', timeout: 30_000 });
  await page.waitForTimeout(800);

  // setup click — 활성 사용자 행의 첫 '편집' 클릭. (자기 자신은 보통 활성이므로 첫 번째 활성 사용자를 찾는다.)
  // 더 안전하게: 첫 번째 활성 행의 편집 버튼.
  const editClicked = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr, [role="row"]'));
    // '활성' 텍스트가 포함된 행에서 '편집' 버튼 찾기
    for (const r of rows) {
      const text = r.textContent || '';
      if (text.includes('활성')) {
        const btns = Array.from(r.querySelectorAll('button'));
        const edit = btns.find(b => b.textContent.trim() === '편집');
        if (edit) {
          edit.scrollIntoView({ block: 'center' });
          return { ok: true, rect: edit.getBoundingClientRect().toJSON() };
        }
      }
    }
    // fallback: 첫 편집 버튼
    const allEdit = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.trim() === '편집');
    if (allEdit[0]) {
      allEdit[0].scrollIntoView({ block: 'center' });
      return { ok: true, rect: allEdit[0].getBoundingClientRect().toJSON(), fallback: true };
    }
    return { ok: false };
  });
  if (!editClicked.ok) throw new Error('편집 button not found');
  log(`  found edit btn at`, editClicked.rect, editClicked.fallback ? '(fallback)' : '');

  // 가상 커서를 편집 버튼 근처로 천천히 이동 → 클릭
  await page.mouse.move(140, 360);
  await page.waitForTimeout(500);
  const editCx = editClicked.rect.x + editClicked.rect.width / 2;
  const editCy = editClicked.rect.y + editClicked.rect.height / 2;
  await page.mouse.move(editCx, editCy, { steps: 25 });
  await page.waitForTimeout(200);
  await page.mouse.click(editCx, editCy);

  // 사용자 편집 모달 열림 대기
  await page.waitForFunction(() => /사용자 편집/.test(document.body.innerText), null, { timeout: 8_000 });
  await page.waitForTimeout(700);

  // 토글이 활성(=ON, blue) 상태가 아니라면 (다른 비활성 사용자였다면) 다른 행 선택 필요.
  // 모달 내 '활성' 라벨이 표시되어 있는지 확인.
  const toggleInfo = await page.evaluate(() => {
    // 모달 내부에서 토글 옆 라벨 찾기 — '활성' 또는 '비활성' 텍스트
    const modal = document.querySelector('[role="dialog"]') || document.body;
    const text = modal.textContent || '';
    const isActive = /\b활성\b/.test(text) && !/\b비활성\b/.test(text.split('비밀번호')[0] || '');
    // 토글 스위치 element 찾기 — Material UI .MuiSwitch-root 또는 role=switch
    let sw = modal.querySelector('input[type="checkbox"][role="switch"], [role="switch"], .MuiSwitch-root input, button[role="switch"]');
    if (!sw) {
      sw = modal.querySelector('input[type="checkbox"]');
    }
    if (!sw) return { ok: false, isActive };
    // 클릭 가능한 부모 라벨/스위치 wrapper 의 rect 사용
    const wrapper = sw.closest('label, .MuiSwitch-root, [role="switch"]') || sw;
    wrapper.scrollIntoView({ block: 'center' });
    return { ok: true, isActive, rect: wrapper.getBoundingClientRect().toJSON(), checked: sw.checked };
  });
  log(`  toggle info:`, toggleInfo);
  if (!toggleInfo.ok) throw new Error('toggle switch not found in modal');

  // trim 시작점: 모달이 열리고 toggle 이 안정화된 직후
  const tReady = Date.now() - ctxStart;
  log(`  ready (modal stable) at t=${tReady}ms`);

  await page.waitForTimeout(PRE_CLICK_HOLD_MS);

  // 토글 클릭 — 가상 커서 이동 후 클릭
  const toggleCx = toggleInfo.rect.x + toggleInfo.rect.width / 2;
  const toggleCy = toggleInfo.rect.y + toggleInfo.rect.height / 2;
  log(`  animating cursor to toggle (${toggleCx.toFixed(0)}, ${toggleCy.toFixed(0)})`);
  await page.mouse.move(toggleCx, toggleCy, { steps: 25 });
  await page.waitForTimeout(150);
  await page.mouse.click(toggleCx, toggleCy);

  // 토글 변경 결과 — 라벨이 '활성' ↔ '비활성' 으로 바뀜
  await page.waitForFunction(() => {
    const modal = document.querySelector('[role="dialog"]') || document.body;
    return /비활성/.test(modal.textContent || '');
  }, null, { timeout: 4_000 }).catch(() => log(`  warning: 비활성 label not detected — 그래도 진행`));
  log(`  toggle clicked`);

  // hover 회피
  await page.mouse.move(1100, 120, { steps: 8 });
  await page.waitForTimeout(POST_CLICK_HOLD_MS);
  const tEnd = Date.now() - ctxStart;
  log(`  total ≈ ${tEnd}ms`);

  const video = page.video();
  await page.close();
  await recCtx.close();
  const webmPath = await video.path();
  log(`  webm saved: ${webmPath} (${fs.statSync(webmPath).size} bytes)`);

  // trim
  const trimStartMs = Math.max(0, tReady - TRIM_LEAD_IN_MS);
  const trimDurMs = tEnd - trimStartMs;
  const trimmedPath = path.join(TMP_DIR, `trimmed.webm`);
  log(`  ffmpeg trim — ss=${(trimStartMs / 1000).toFixed(2)}s  t=${(trimDurMs / 1000).toFixed(2)}s`);
  let r = spawnSync(FFMPEG, [
    '-y',
    '-ss', `${(trimStartMs / 1000).toFixed(3)}`,
    '-i', webmPath,
    '-t', `${(trimDurMs / 1000).toFixed(3)}`,
    '-c:v', 'libvpx', '-b:v', '2M', '-an',
    trimmedPath,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg trim failed`);

  const palettePath = path.join(TMP_DIR, `palette.png`);
  const gifPath = path.join(OUT_DIR, OUT_FILE);
  const filter = `fps=${FPS},scale=${SCALE_WIDTH}:-2:flags=lanczos`;

  log(`  ffmpeg pass 1 — palette`);
  r = spawnSync(FFMPEG, ['-y', '-i', trimmedPath, '-vf', `${filter},palettegen=stats_mode=diff`, palettePath], {
    stdio: 'inherit',
  });
  if (r.status !== 0) throw new Error(`palette failed`);

  log(`  ffmpeg pass 2 — gif`);
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
