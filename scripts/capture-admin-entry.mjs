// One-off: refresh admin-entry.png for 20-admin-overview.md
//   node scripts/capture-admin-entry.mjs
// 시스템 관리자 계정으로 /admin 진입 후 사이드바를 강제로 펼쳐 캡처.

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
const EMAIL = env.XGEN_SYSTEM_ADMIN_EMAIL || env.XGEN_LOGIN_EMAIL;
const PASS = env.XGEN_SYSTEM_ADMIN_PASSWORD || env.XGEN_LOGIN_PASSWORD;

const log = (...a) => console.log('[admin-entry-capture]', ...a);

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
    log('submitting credentials (system admin):', EMAIL);
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

  // Navigate to /admin
  log('navigating to /admin');
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForSelector('aside', { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(3500);

  // Expand only known admin-section group headers. Profile/user menus must NOT be clicked
  // (clicking "마이페이지" navigates away to the profile page).
  const SIDEBAR_GROUPS = [
    '사용자 / 접근제어', 'Agent 운영', 'AI 거버넌스', '환경 설정',
    '시스템 상태', '보안', '데이터 관리', 'MCP 관리', 'MLOps',
    '서비스 운영', '지식 운영',
  ];

  async function expandAll() {
    return await page.evaluate((groups) => {
      const aside = document.querySelector('aside');
      if (!aside) return 0;
      let count = 0;
      const candidates = aside.querySelectorAll(
        'button[aria-expanded="false"], [role="button"][aria-expanded="false"]'
      );
      candidates.forEach((el) => {
        const txt = (el.textContent || '').trim();
        const matches = groups.some((g) => txt.includes(g));
        if (!matches) return;
        el.click();
        count++;
      });
      return count;
    }, SIDEBAR_GROUPS);
  }

  for (let i = 0; i < 3; i++) {
    const n = await expandAll();
    log(`  expansion pass ${i + 1}: clicked ${n} trigger(s)`);
    if (n === 0) break;
    await page.waitForTimeout(800);
  }

  await page.waitForTimeout(1000);

  const shots = [
    { dest: path.join(OUT_DIR, 'admin-entry.png'), fullPage: false, label: 'admin entry (viewport)' },
    // admin-sidebar.png 는 본문 미참조 — 제외 (2026-05-22)
  ];

  for (const shot of shots) {
    log(`→ ${path.relative(REPO_ROOT, shot.dest)} [${shot.label}] fullPage=${shot.fullPage}`);
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
