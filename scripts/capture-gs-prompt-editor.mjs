// capture-gs-prompt-editor.mjs
// xgen.x2bee.com 라이브 화면에서 '프롬프트 편집기(새 프롬프트 만들기)' 모달만
// GS인증 전용 계정으로 재캡처합니다. base/ 의 prompt-editor.png 는 비-GS 계정
// (좌하단 '최수안...') 으로 찍혀 있어, gs-cert overlay 에 GS인증 계정 버전을 덮습니다.
//
//   cd C:\xgen-manual && node scripts/capture-gs-prompt-editor.mjs
//
// 자격증명: .env.gs-cert (gs@plateer.com)
// 출력: Xgen_Manual/customers/gs-cert/overlay/user/images/prompt-editor.png

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.gs-cert');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'customers', 'gs-cert', 'overlay', 'user', 'images');
const DEST = path.join(OUT_DIR, 'prompt-editor.png');

const env = {};
fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/).forEach((l) => {
  const t = l.trim();
  if (!t || t.startsWith('#')) return;
  const i = t.indexOf('=');
  if (i < 0) return;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
});
const BASE = env.XGEN_BASE_URL.replace(/\/$/, '');
const EMAIL = env.XGEN_LOGIN_EMAIL;
const PASS = env.XGEN_LOGIN_PASSWORD;

fs.mkdirSync(OUT_DIR, { recursive: true });
const log = (...a) => console.log('[capture]', ...a);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, locale: 'ko-KR' });
  const page = await ctx.newPage();

  log('navigating to', BASE);
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 60_000 });
  const emailByRole = page.getByRole('textbox', { name: '이메일을 입력해 주세요' });
  const hasJejuForm = await emailByRole.isVisible({ timeout: 3_000 }).catch(() => false);
  if (hasJejuForm) {
    log('submitting credentials (jeju form)');
    await emailByRole.fill(EMAIL);
    await page.getByRole('textbox', { name: '패스워드를 입력해 주세요' }).fill(PASS);
    await page.getByRole('button', { name: '로그인', exact: true }).click();
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
  } else if (await page.$('#login-email')) {
    log('submitting credentials (legacy form)');
    await page.fill('#login-email', EMAIL);
    await page.fill('#login-password', PASS);
    const [loginRes] = await Promise.all([
      page.waitForResponse((r) => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST', { timeout: 30_000 }),
      page.click('button[type="submit"]'),
    ]);
    log('  login API:', loginRes.status());
    if (loginRes.status() !== 200) throw new Error(`login failed: ${loginRes.status()}`);
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
  } else {
    log('WARNING: no login form detected — proceeding (already signed in?)');
  }
  await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});

  // 콜드로드 가드 회피: /main 진입 후 SPA 라우팅으로 prompt-storage view 진입
  log('warming up /main');
  await page.goto(`${BASE}/main`, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});
  await page.waitForSelector('aside button', { timeout: 15_000 }).catch(() => {});

  log('navigating to prompt-storage view');
  await page.goto(`${BASE}/main?view=prompt-storage`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  await page.waitForSelector('aside button', { timeout: 15_000 }).catch(() => {});
  await page.waitForTimeout(3500);

  // '새 프롬프트' 버튼 클릭 → '새 프롬프트 만들기' 모달 열기
  log("clicking '새 프롬프트'");
  const newBtn = page.getByRole('button', { name: /새\s*프롬프트/ }).first();
  await newBtn.waitFor({ state: 'visible', timeout: 15_000 });
  await newBtn.click();

  // 모달 등장 대기 ('새 프롬프트 만들기' 제목 + 프롬프트 제목 입력칸)
  await page.getByText('새 프롬프트 만들기', { exact: false }).first().waitFor({ state: 'visible', timeout: 15_000 });
  await page.waitForTimeout(1200);

  await page.screenshot({ path: DEST, fullPage: false });
  const size = fs.statSync(DEST).size;
  log(`→ prompt-editor.png  (${size} bytes)`);

  await browser.close();
  log('done:', DEST);
})();
