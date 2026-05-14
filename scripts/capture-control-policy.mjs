// One-off: capture AI 통제 정책 화면 (3개 탭) using governance officer credentials.
//   node scripts/capture-control-policy.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.xgen-stg');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'base', 'admin', 'images');

const env = {};
fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/).forEach((l) => {
  const t = l.trim();
  if (!t || t.startsWith('#')) return;
  const i = t.indexOf('=');
  if (i < 0) return;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
});
const BASE = env.XGEN_BASE_URL.replace(/\/$/, '');
const EMAIL = env.XGEN_GOVERNANCE_OFFICER_EMAIL || env.XGEN_LOGIN_EMAIL;
const PASS = env.XGEN_GOVERNANCE_OFFICER_PASSWORD || env.XGEN_LOGIN_PASSWORD;

const log = (...a) => console.log('[control-policy-capture]', ...a);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    locale: 'ko-KR',
  });
  const page = await ctx.newPage();

  log('navigating to', BASE);
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60_000 });

  if (await page.$('#login-email')) {
    log('submitting credentials (governance officer):', EMAIL);
    await page.fill('#login-email', EMAIL);
    await page.fill('#login-password', PASS);
    const [loginRes] = await Promise.all([
      page.waitForResponse(
        (r) => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST',
        { timeout: 30_000 }
      ),
      page.click('button[type="submit"]'),
    ]);
    log('  login API:', loginRes.status());
    if (loginRes.status() !== 200) throw new Error('login failed');
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
  }
  await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});

  // Open AI 통제 정책 — default tab (PII)
  const target = `${BASE}/admin?view=gov-control-policy`;
  log('navigating to', target);
  await page.goto(target, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForTimeout(3500);

  const shots = [
    { dest: path.join(OUT_DIR, 'admin-gov-control-policy.png'), tab: null, fullPage: false },
    { dest: path.join(OUT_DIR, 'admin-gov-control-policy-pii.png'), tab: '개인정보보호 (PII)', fullPage: false },
    { dest: path.join(OUT_DIR, 'admin-gov-control-policy-banned.png'), tab: '금칙어', fullPage: false },
    { dest: path.join(OUT_DIR, 'admin-gov-control-policy-risk.png'), tab: 'AI 위험도 등급', fullPage: false },
  ];

  for (const shot of shots) {
    if (shot.tab) {
      log(`switching to tab: ${shot.tab}`);
      const btn = await page.getByRole('button', { name: shot.tab }).first();
      try {
        await btn.click({ timeout: 5_000 });
      } catch (e) {
        await page.locator(`text=${shot.tab}`).first().click({ timeout: 5_000 }).catch(() => {});
      }
      await page.waitForTimeout(2000);
    }
    log(`→ ${path.relative(REPO_ROOT, shot.dest)}`);
    await page.screenshot({ path: shot.dest, fullPage: shot.fullPage });
    const size = fs.statSync(shot.dest).size;
    log(`   saved ${size} bytes`);
  }

  await browser.close();
  log('done');
})().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
