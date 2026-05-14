// One-off: capture entry screens for the previously-uncovered admin areas.
//   node scripts/capture-new-admin-areas.mjs

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

const log = (...a) => console.log('[capture]', ...a);

const SHOTS = [
  // 32-agent-operations.md
  { view: 'admin-agentflow-management', file: 'admin-agent-management.png', label: 'Agent 관리' },
  { view: 'admin-chat-monitoring', file: 'admin-chat-monitoring.png', label: '채팅 모니터링' },
  { view: 'admin-feedback-monitoring', file: 'admin-feedback-monitoring.png', label: '사용자 피드백' },
  { view: 'admin-prompt-store', file: 'admin-prompt-store.png', label: '프롬프트 템플릿' },
  { view: 'admin-agent-dev-plan', file: 'admin-agent-dev-plan.png', label: '업무기획' },

  // 33-data-management.md
  { view: 'admin-database', file: 'admin-database.png', label: '데이터베이스' },
  { view: 'admin-db-connection', file: 'admin-db-connection.png', label: 'DB 연결' },
  { view: 'admin-db-batch', file: 'admin-db-batch.png', label: '배치 작업' },
  { view: 'admin-db-audit', file: 'admin-db-audit.png', label: '데이터 감사 로그' },

  // 34-knowledge-operations.md
  { view: 'admin-knowledge-collection', file: 'admin-knowledge-collection.png', label: '컬렉션 관리' },
];

const PLACEHOLDER_SIZES = new Set([8971, 41107, 36798]);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, locale: 'ko-KR' });
  const page = await ctx.newPage();

  log('navigating to BASE for login');
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60_000 });
  // Wait briefly for any login form to render
  await page.waitForTimeout(2000);
  if (await page.$('#login-email')) {
    log('login form visible — submitting');
    await page.fill('#login-email', EMAIL);
    await page.fill('#login-password', PASS);
    const [r] = await Promise.all([
      page.waitForResponse(
        (r) => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST',
        { timeout: 30_000 }
      ),
      page.click('button[type="submit"]'),
    ]);
    log('  login API:', r.status());
    if (r.status() !== 200) throw new Error('login failed');
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  } else {
    log('no login form (already authenticated?)');
  }

  // Warm up admin mode
  log('warming up /admin');
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForTimeout(2500);
  log('current url after warm-up:', page.url());
  // Sanity check — make sure we have an admin sidebar
  const haveSidebar = await page.$('aside');
  if (!haveSidebar) {
    log('NO aside element — session likely lost. URL=' + page.url());
    throw new Error('admin mode warm-up failed');
  }

  for (const shot of SHOTS) {
    const dest = path.join(OUT_DIR, shot.file);
    const target = `${BASE}/admin?view=${shot.view}`;
    log(`→ ${shot.file} [${shot.label}] ${target}`);
    let lastSize = 0;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
        await page.waitForTimeout(3500 + (attempt - 1) * 1500);
        await page.screenshot({ path: dest, fullPage: false });
        lastSize = fs.statSync(dest).size;
        if (!PLACEHOLDER_SIZES.has(lastSize)) {
          log(`   saved ${lastSize} bytes (attempt ${attempt})`);
          break;
        }
        log(`   placeholder ${lastSize} bytes — retry ${attempt}/3`);
      } catch (e) {
        log(`   attempt ${attempt} err: ${e.message.slice(0, 80)}`);
      }
    }
    if (PLACEHOLDER_SIZES.has(lastSize)) {
      log(`   BAD CAPTURE for ${shot.view} — view may be invalid or page not found`);
    }
  }

  await browser.close();
  log('done');
})().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
