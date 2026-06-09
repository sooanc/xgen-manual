// capture-gs-recapture-pngs.mjs
// GS인증 계정(gs@plateer.com)으로 두 장의 PNG 를 재캡처합니다.
// base/ 버전은 비-GS 계정(좌하단 '최수안...')으로 찍혀 GS인증 매뉴얼에 부적절.
//
//   cd C:\xgen-manual && node scripts/capture-gs-recapture-pngs.mjs
//
// 출력:
//   - customers/gs-cert/overlay/user/images/auth-profile-create.png
//       (도구 연동 → 인증 프로필 → '새 프로필' 클릭 → 인증 프로필 생성 폼)
//   - customers/gs-cert/overlay/admin/images/admin-role-permission-inspect.png
//       (역할/권한 관리 → '권한 조회' 클릭 → 권한 조회 모달)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.gs-cert');
const USER_OUT = path.join(REPO_ROOT, 'Xgen_Manual', 'customers', 'gs-cert', 'overlay', 'user', 'images');
const ADMIN_OUT = path.join(REPO_ROOT, 'Xgen_Manual', 'customers', 'gs-cert', 'overlay', 'admin', 'images');

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

fs.mkdirSync(USER_OUT, { recursive: true });
fs.mkdirSync(ADMIN_OUT, { recursive: true });
const log = (...a) => console.log('[recapture]', ...a);

async function login(page) {
  log('navigating to', BASE);
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 60_000 });
  const emailByRole = page.getByRole('textbox', { name: '이메일을 입력해 주세요' });
  if (await emailByRole.isVisible({ timeout: 3_000 }).catch(() => false)) {
    log('submitting credentials (jeju form)');
    await emailByRole.fill(EMAIL);
    await page.getByRole('textbox', { name: '패스워드를 입력해 주세요' }).fill(PASS);
    await page.getByRole('button', { name: '로그인', exact: true }).click();
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
  } else if (await page.$('#login-email')) {
    log('submitting credentials (legacy form)');
    await page.fill('#login-email', EMAIL);
    await page.fill('#login-password', PASS);
    const [res] = await Promise.all([
      page.waitForResponse((r) => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST', { timeout: 30_000 }),
      page.click('button[type="submit"]'),
    ]);
    if (res.status() !== 200) throw new Error(`login failed: ${res.status()}`);
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
  } else {
    log('WARNING: no login form detected — proceeding');
  }
  await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, locale: 'ko-KR' });
  const page = await ctx.newPage();
  try {
    await login(page);

    // ─────────────────────────────────────────────────────────────
    // 1) auth-profile-create.png (사용자 모드)
    // ─────────────────────────────────────────────────────────────
    log('warming up /main');
    await page.goto(`${BASE}/main`, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});
    await page.waitForSelector('aside button', { timeout: 15_000 }).catch(() => {});

    log('→ auth-profile view');
    await page.goto(`${BASE}/main?view=auth-profile`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await page.waitForSelector('aside button', { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(3500);

    log("clicking '새 프로필'");
    const newProfileBtn = page.getByRole('button', { name: /새\s*프로필/ }).first();
    await newProfileBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await newProfileBtn.click();
    // 인증 프로필 생성 폼 등장 대기 (서비스 ID 필드 / 인증 프로필 생성 헤더)
    await page.getByText('인증 프로필 생성', { exact: false }).first().waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const authDest = path.join(USER_OUT, 'auth-profile-create.png');
    await page.screenshot({ path: authDest, fullPage: false });
    log(`  saved auth-profile-create.png (${fs.statSync(authDest).size} bytes)`);

    // ─────────────────────────────────────────────────────────────
    // 2) admin-role-permission-inspect.png (관리자 모드)
    // ─────────────────────────────────────────────────────────────
    log('entering admin mode (/admin)');
    await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});
    await page.waitForSelector('aside button', { timeout: 20_000 }).catch(() => {});
    await page.waitForTimeout(2000);

    log('→ admin-role-management view');
    await page.goto(`${BASE}/admin?view=admin-role-management`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await page.waitForSelector('aside button', { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(3500);

    log("clicking '권한 조회'");
    const inspectBtn = page.getByRole('button', { name: '권한 조회', exact: true }).first();
    await inspectBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await inspectBtn.click();
    // 권한 조회 모달(dialog) + 사용자 검색칸 등장 대기
    await page.waitForSelector('[role="dialog"]', { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(1800);
    const roleDest = path.join(ADMIN_OUT, 'admin-role-permission-inspect.png');
    await page.screenshot({ path: roleDest, fullPage: false });
    log(`  saved admin-role-permission-inspect.png (${fs.statSync(roleDest).size} bytes)`);
  } finally {
    await browser.close();
    log('done.');
  }
})().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
