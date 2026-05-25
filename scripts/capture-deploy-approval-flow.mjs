// capture-deploy-approval-flow.mjs
//
// 관리자 > Agent 운영 > Agent 관리 화면의 '배포 승인 절차' 5단계 자료 캡처.
// STG 에 '배포 대기' 카드가 존재하지 않으므로 절차의 일부는 PNG 정적 캡처.
//
// 출력 (모두 Xgen_Manual/base/admin/images/):
//   - admin-deploy-approval-step1.gif  — 사이드바 진입 → 그리드 로드
//   - admin-deploy-approval-step2.png  — 카드 그리드 + 상태 배지
//   - admin-deploy-approval-step3.gif  — 카드 클릭 → 상세 진입 → 뒤로
//   - admin-deploy-approval-step4.png  — 카드 액션 영역 (설정/삭제)
//   - admin-deploy-approval-step5.png  — 그리드 자동 새로고침 후 상태
//
// 사용 계정: x2bee_ds@plateer.com (시스템 관리자)

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.xgen-stg');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'base', 'admin', 'images');
const TMP_DIR = path.join(REPO_ROOT, '.tmp-deploy-approval');
const FFMPEG = process.env.FFMPEG || 'C:/ffmpeg/bin/ffmpeg';

const VIEWPORT = { width: 1280, height: 720 };
const FPS = 15;
const SCALE_WIDTH = 1024;

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
const ADMIN_PASS = 'admin1234';

fs.rmSync(TMP_DIR, { recursive: true, force: true });
fs.mkdirSync(TMP_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const log = (...a) => console.log('[deploy]', ...a);

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

async function webmToGif(webmPath, outName, trimStartSec, trimDurSec) {
  const trimmedPath = path.join(TMP_DIR, `trim-${outName}.webm`);
  let r = spawnSync(FFMPEG, [
    '-y', '-ss', `${trimStartSec.toFixed(3)}`, '-i', webmPath,
    '-t', `${trimDurSec.toFixed(3)}`,
    '-c:v', 'libvpx', '-b:v', '2M', '-an', trimmedPath,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg trim failed for ${outName}`);
  const palettePath = path.join(TMP_DIR, `palette-${outName}.png`);
  const gifPath = path.join(OUT_DIR, outName);
  const filter = `fps=${FPS},scale=${SCALE_WIDTH}:-2:flags=lanczos`;
  r = spawnSync(FFMPEG, ['-y', '-i', trimmedPath, '-vf', `${filter},palettegen=stats_mode=diff`, palettePath], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`palette gen failed for ${outName}`);
  r = spawnSync(FFMPEG, [
    '-y', '-i', trimmedPath, '-i', palettePath,
    '-lavfi', `${filter} [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle`,
    '-loop', '0', '-f', 'gif', gifPath,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`gif encode failed for ${outName}`);
  log(`  ✓ GIF: ${outName} (${(fs.statSync(gifPath).size / 1024).toFixed(1)} KB)`);
}

// Step 1: 사이드바 진입 → 그리드 로드 (GIF)
async function captureStep1(browser, storageState) {
  log('step1: 사이드바 진입 → 그리드 로드 (GIF)');
  const recCtx = await browser.newContext({ viewport: VIEWPORT, locale: 'ko-KR', storageState, recordVideo: { dir: TMP_DIR, size: VIEWPORT } });
  await recCtx.addInitScript(INIT_SCRIPT);
  const page = await recCtx.newPage();
  const t0 = Date.now();

  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForTimeout(800);
  // 커서를 왼쪽 사이드바 영역에 배치
  await page.mouse.move(120, 400, { steps: 6 });
  const tReady = Date.now() - t0;
  await page.waitForTimeout(700);

  // Agent 운영 아코디언 클릭
  const agentOpRect = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Agent 운영');
    if (!btn) return null;
    btn.scrollIntoView({ block: 'center' });
    return btn.getBoundingClientRect().toJSON();
  });
  if (!agentOpRect) throw new Error('Agent 운영 아코디언 버튼 없음');
  await page.mouse.move(agentOpRect.x + agentOpRect.width / 2, agentOpRect.y + agentOpRect.height / 2, { steps: 25 });
  await page.waitForTimeout(250);
  await page.mouse.click(agentOpRect.x + agentOpRect.width / 2, agentOpRect.y + agentOpRect.height / 2);
  await page.waitForTimeout(700);

  // Agent 관리 서브메뉴 클릭
  const mgmtRect = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Agent 관리');
    if (!btn) return null;
    btn.scrollIntoView({ block: 'center' });
    return btn.getBoundingClientRect().toJSON();
  });
  if (!mgmtRect) throw new Error('Agent 관리 서브메뉴 없음');
  await page.mouse.move(mgmtRect.x + mgmtRect.width / 2, mgmtRect.y + mgmtRect.height / 2, { steps: 25 });
  await page.waitForTimeout(250);
  await page.mouse.click(mgmtRect.x + mgmtRect.width / 2, mgmtRect.y + mgmtRect.height / 2);
  await page.waitForFunction(() => /Agent 관리/.test(document.body.innerText), null, { timeout: 30_000 });
  await page.waitForTimeout(1800);

  // 커서를 카드 그리드 첫 행 근처로 이동
  await page.mouse.move(640, 380, { steps: 25 });
  await page.waitForTimeout(700);
  const tEnd = Date.now() - t0;

  const video = page.video();
  await page.close();
  await recCtx.close();
  const webmPath = await video.path();
  const trimStart = Math.max(0, (tReady - 400) / 1000);
  const trimDur = (tEnd - tReady + 800) / 1000;
  await webmToGif(webmPath, 'admin-deploy-approval-step1.gif', trimStart, trimDur);
}

// Step 2: 카드 그리드 + 배지 (PNG)
async function captureStep2(browser, storageState) {
  log('step2: 카드 그리드 + 상태 배지 (PNG)');
  const ctx = await browser.newContext({ viewport: VIEWPORT, locale: 'ko-KR', storageState });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/admin?view=admin-agentflow-management`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForFunction(() => /Agent 관리/.test(document.body.innerText), null, { timeout: 30_000 });
  await page.waitForTimeout(1500);
  // 우측에 카드 2~3개가 보이는 영역만 캡처 (좌측 사이드바 + 상단 헤더 포함)
  const outPath = path.join(OUT_DIR, 'admin-deploy-approval-step2.png');
  await page.screenshot({ path: outPath, fullPage: false });
  log(`  ✓ PNG: admin-deploy-approval-step2.png (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
  await page.close();
  await ctx.close();
}

// Step 3: 카드 클릭 → 상세 → 뒤로 (GIF)
async function captureStep3(browser, storageState) {
  log('step3: 카드 클릭 → 상세 진입 → 뒤로 (GIF)');
  const recCtx = await browser.newContext({ viewport: VIEWPORT, locale: 'ko-KR', storageState, recordVideo: { dir: TMP_DIR, size: VIEWPORT } });
  await recCtx.addInitScript(INIT_SCRIPT);
  const page = await recCtx.newPage();
  const t0 = Date.now();
  await page.goto(`${BASE}/admin?view=admin-agentflow-management`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForFunction(() => /Agent 관리/.test(document.body.innerText), null, { timeout: 30_000 });
  // 카드가 그려질 때까지 명시 대기
  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('div')).some(d => /설명 없음|노드 \d+/.test(d.textContent || ''));
  }, null, { timeout: 30_000 });
  await page.waitForTimeout(1500);
  await page.mouse.move(500, 600, { steps: 6 });
  const tReady = Date.now() - t0;
  await page.waitForTimeout(700);

  // 첫 번째 카드 식별 (텍스트 기반으로 fallback)
  const cardRect = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('div')).filter(el => {
      const cls = el.className?.toString?.() || '';
      const t = el.textContent || '';
      const r = el.getBoundingClientRect();
      return /rounded-xl/.test(cls) && /설정/.test(t) && /삭제/.test(t) && r.width > 200 && r.width < 600 && r.height > 100 && r.height < 400;
    });
    if (!all.length) return null;
    all[0].scrollIntoView({ block: 'center' });
    const r = all[0].getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  if (!cardRect) throw new Error('카드 없음');
  const cx = cardRect.x + cardRect.width / 2;
  const cy = cardRect.y + 50;
  await page.mouse.move(cx, cy, { steps: 25 });
  await page.waitForTimeout(400);
  await page.mouse.click(cx, cy);
  await page.waitForTimeout(2200);

  // ← 뒤로 버튼 누르기
  const backRect = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a')).filter(b => /뒤로|돌아가기|Back|←/.test(b.textContent || b.getAttribute('aria-label') || ''));
    if (!btns.length) return null;
    btns[0].scrollIntoView({ block: 'center' });
    return btns[0].getBoundingClientRect().toJSON();
  });
  if (backRect) {
    await page.mouse.move(backRect.x + backRect.width / 2, backRect.y + backRect.height / 2, { steps: 25 });
    await page.waitForTimeout(300);
    await page.mouse.click(backRect.x + backRect.width / 2, backRect.y + backRect.height / 2);
    await page.waitForTimeout(1500);
  } else {
    // 뒤로가기 버튼 없으면 브라우저 back
    await page.goBack({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
  }
  await page.mouse.move(500, 600, { steps: 15 });
  await page.waitForTimeout(600);
  const tEnd = Date.now() - t0;

  const video = page.video();
  await page.close();
  await recCtx.close();
  const webmPath = await video.path();
  const trimStart = Math.max(0, (tReady - 400) / 1000);
  const trimDur = (tEnd - tReady + 600) / 1000;
  await webmToGif(webmPath, 'admin-deploy-approval-step3.gif', trimStart, trimDur);
}

// Step 4: 카드 액션 영역 (PNG)
async function captureStep4(browser, storageState) {
  log('step4: 카드 액션 영역 (PNG)');
  const ctx = await browser.newContext({ viewport: VIEWPORT, locale: 'ko-KR', storageState });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/admin?view=admin-agentflow-management`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForFunction(() => /Agent 관리/.test(document.body.innerText), null, { timeout: 30_000 });
  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('div')).some(d => /설명 없음|노드 \d+/.test(d.textContent || ''));
  }, null, { timeout: 30_000 });
  await page.waitForTimeout(1500);
  // 첫 번째 카드 영역 클립 캡처 (텍스트 기반 fallback)
  const cardSel = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('div')).filter(el => {
      const cls = el.className?.toString?.() || '';
      const t = el.textContent || '';
      const r = el.getBoundingClientRect();
      return /rounded-xl/.test(cls) && /설정/.test(t) && /삭제/.test(t) && r.width > 200 && r.width < 600 && r.height > 100 && r.height < 400;
    });
    if (!all.length) return null;
    const r = all[0].getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const outPath = path.join(OUT_DIR, 'admin-deploy-approval-step4.png');
  if (cardSel) {
    await page.screenshot({
      path: outPath,
      clip: { x: Math.max(0, cardSel.x - 10), y: Math.max(0, cardSel.y - 10), width: Math.min(VIEWPORT.width, cardSel.w + 20), height: Math.min(VIEWPORT.height, cardSel.h + 20) },
    });
  } else {
    await page.screenshot({ path: outPath });
  }
  log(`  ✓ PNG: admin-deploy-approval-step4.png (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
  await page.close();
  await ctx.close();
}

// Step 5: 그리드 상태 (PNG)
async function captureStep5(browser, storageState) {
  log('step5: 그리드 상태 (PNG)');
  const ctx = await browser.newContext({ viewport: VIEWPORT, locale: 'ko-KR', storageState });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/admin?view=admin-agentflow-management`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForFunction(() => /Agent 관리/.test(document.body.innerText), null, { timeout: 30_000 });
  await page.waitForTimeout(1500);
  const outPath = path.join(OUT_DIR, 'admin-deploy-approval-step5.png');
  await page.screenshot({ path: outPath, fullPage: false });
  log(`  ✓ PNG: admin-deploy-approval-step5.png (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
  await page.close();
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const storage = await loginAndGetStorage(browser);
    await captureStep1(browser, storage);
    await captureStep2(browser, storage);
    await captureStep3(browser, storage);
    await captureStep4(browser, storage);
    await captureStep5(browser, storage);
  } finally {
    await browser.close();
  }
  log('done.');
})();
