// capture-dashboard-only.mjs
// 4개 역할별로 /dashboard 화면을 각각 로그인하여 캡처한다.
//
//   node scripts/capture-dashboard-only.mjs
//
// 자격증명: .env.xgen-stg 의 XGEN_<ROLE>_EMAIL / XGEN_<ROLE>_PASSWORD
// 출력 위치:
//   - 일반 사용자       → Xgen_Manual/base/user/images/dashboard-standard.png (+ -full)
//   - Agent 개발자      → Xgen_Manual/base/user/images/dashboard-developer.png
//   - 시스템 관리자     → Xgen_Manual/base/admin/images/dashboard-system-admin.png
//   - 거버넌스 담당자   → Xgen_Manual/base/admin/images/dashboard-governance.png

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.xgen-stg');
const USER_OUT = path.join(REPO_ROOT, 'Xgen_Manual', 'base', 'user', 'images');
const ADMIN_OUT = path.join(REPO_ROOT, 'Xgen_Manual', 'base', 'admin', 'images');

const env = {};
fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/).forEach((l) => {
  const t = l.trim();
  if (!t || t.startsWith('#')) return;
  const i = t.indexOf('=');
  if (i < 0) return;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
});
const BASE = env.XGEN_BASE_URL.replace(/\/$/, '');

const ROLES = [
  {
    label: '일반 사용자',
    email: env.XGEN_STANDARD_USER_EMAIL,
    password: env.XGEN_STANDARD_USER_PASSWORD,
    shots: [
      { dest: path.join(USER_OUT, 'dashboard-standard.png'), fullPage: false },
      // dashboard-standard-full.png 는 본문 미참조 — 제외
    ],
  },
  {
    label: 'Agent 개발자',
    email: env.XGEN_AGENT_DEVELOPER_EMAIL,
    password: env.XGEN_AGENT_DEVELOPER_PASSWORD,
    shots: [
      { dest: path.join(USER_OUT, 'dashboard-developer.png'), fullPage: false },
      // dashboard-developer-full.png 는 본문 미참조 — 제외
    ],
  },
  {
    label: '시스템 관리자',
    email: env.XGEN_SYSTEM_ADMIN_EMAIL,
    password: env.XGEN_SYSTEM_ADMIN_PASSWORD,
    shots: [
      // dashboard-system-admin.png 는 본문 미참조 — 제외
      { dest: path.join(ADMIN_OUT, 'dashboard-system-admin-full.png'), fullPage: true },
    ],
  },
  {
    label: '거버넌스 담당자',
    email: env.XGEN_GOVERNANCE_OFFICER_EMAIL,
    password: env.XGEN_GOVERNANCE_OFFICER_PASSWORD,
    shots: [
      // dashboard-governance.png 는 본문 미참조 — 제외
      { dest: path.join(ADMIN_OUT, 'dashboard-governance-full.png'), fullPage: true },
    ],
  },
];

const log = (...a) => console.log('[dashboard-capture]', ...a);

async function captureForRole(browser, role) {
  if (!role.email || !role.password) {
    log(`SKIP ${role.label}: 자격증명 누락`);
    return;
  }
  log(`=== ${role.label} (${role.email}) ===`);
  // 매 역할마다 새 컨텍스트로 격리 (쿠키 분리)
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    locale: 'ko-KR',
  });
  const page = await ctx.newPage();

  log('navigating to', BASE);
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60_000 });

  if (await page.$('#login-email')) {
    log('submitting credentials');
    await page.fill('#login-email', role.email);
    await page.fill('#login-password', role.password);
    const [loginRes] = await Promise.all([
      page.waitForResponse(
        (r) => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST',
        { timeout: 30_000 }
      ),
      page.click('button[type="submit"]'),
    ]);
    log('  login API:', loginRes.status());
    if (loginRes.status() !== 200) {
      log(`  ${role.label} 로그인 실패 — 캡처 건너뜀`);
      await ctx.close();
      return;
    }
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
  }
  await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});

  for (const shot of role.shots) {
    log(`→ ${path.relative(REPO_ROOT, shot.dest)}  fullPage=${shot.fullPage}`);
    fs.mkdirSync(path.dirname(shot.dest), { recursive: true });
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(3500);
    await page.screenshot({ path: shot.dest, fullPage: shot.fullPage });
    const size = fs.statSync(shot.dest).size;
    log(`   saved ${size} bytes`);
  }

  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const role of ROLES) {
    await captureForRole(browser, role);
  }
  await browser.close();
  log('done');
})().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
