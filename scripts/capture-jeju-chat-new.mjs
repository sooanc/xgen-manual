// capture-jeju-chat-new.mjs
// jeju-xgen.x2bee.com 라이브에서 '새 채팅'(view=new-chat) 화면만 재캡처.
//   cd C:\xgen-manual && node scripts/capture-jeju-chat-new.mjs
// 자격: .env.jeju-xgen-user (에이전트 개발자) / 출력: jeju-bank overlay/user/images/chat-new.png

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.jeju-xgen-user');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'customers', 'jeju-bank', 'overlay', 'user', 'images');

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

const log = (...a) => console.log('[chat-new]', ...a);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, locale: 'ko-KR' });
  const page = await ctx.newPage();

  log('login', BASE);
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 60_000 });
  const emailByRole = page.getByRole('textbox', { name: '이메일을 입력해 주세요' });
  const hasJejuForm = await emailByRole.isVisible({ timeout: 3_000 }).catch(() => false);
  if (hasJejuForm) {
    await emailByRole.fill(EMAIL);
    await page.getByRole('textbox', { name: '패스워드를 입력해 주세요' }).fill(PASS);
    await page.getByRole('button', { name: '로그인', exact: true }).click();
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
  } else if (await page.$('#login-email')) {
    await page.fill('#login-email', EMAIL);
    await page.fill('#login-password', PASS);
    await Promise.all([
      page.waitForResponse((r) => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST', { timeout: 30_000 }),
      page.click('button[type="submit"]'),
    ]);
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
  }
  await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});

  log('warming up /main');
  await page.goto(`${BASE}/main`, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});
  await page.waitForSelector('aside button', { timeout: 15_000 }).catch(() => {});

  const SHOTS = [
    { view: 'auth-profile', file: 'auth-profile.png' },
  ];
  const PLACEHOLDER_SIZES = new Set([8971, 41107, 36798]);
  for (const shot of SHOTS) {
    const dest = path.join(OUT_DIR, shot.file);
    const target = `${BASE}/main?view=${shot.view}`;
    log(`→ ${shot.file}  ${target}`);
    let lastSize = 0;
    for (let attempt = 1; attempt <= 3; attempt++) {
      await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
      await page.waitForSelector('aside button', { timeout: 15_000 }).catch(() => {});
      await page.waitForTimeout(3500 + (attempt - 1) * 2000);
      const notFound = await page.locator('text=/Page not found|페이지를 찾을 수 없/i').first().isVisible({ timeout: 500 }).catch(() => false);
      await page.screenshot({ path: dest, fullPage: false });
      lastSize = fs.statSync(dest).size;
      if (!notFound && !PLACEHOLDER_SIZES.has(lastSize)) { log(`   saved ${lastSize} bytes (attempt ${attempt})`); break; }
      log(`   ${notFound ? 'not-found' : 'placeholder'} ${lastSize} — retry ${attempt}/3`);
    }
  }

  await browser.close();
  log('done →', dest);
})();
