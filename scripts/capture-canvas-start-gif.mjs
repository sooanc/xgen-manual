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
const PRE_CLICK_HOLD_MS = 1200;
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
  const page = await recCtx.newPage();
  const ctxStart = Date.now();           // 녹화 t=0 기준
  await page.goto(`${BASE}/canvas`, { waitUntil: 'networkidle', timeout: 45_000 });

  // ── 3. 빈 캔버스 + "에이전트 시작" 버튼 대기 ──
  const startBtn = page.getByRole('button', { name: /에이전트 시작|Start Agent/ }).first();
  await startBtn.waitFor({ state: 'visible', timeout: 30_000 });
  const tEmptyReady = Date.now() - ctxStart;
  log(`  empty-state start button visible at t=${tEmptyReady}ms`);

  // ── 4. 시작 상태를 잠시 보여주기 ──
  await page.waitForTimeout(PRE_CLICK_HOLD_MS);

  // ── 5. 클릭 → XGEN Agent 노드 등장 대기 ──
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
