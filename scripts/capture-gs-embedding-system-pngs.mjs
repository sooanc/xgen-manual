// capture-gs-embedding-system-pngs.mjs
// gs@plateer.com 계정으로 임베딩 / 시스템 모니터링 / 로그 조회 화면 PNG 캡처.
//
//   cd C:\xgen-manual && node scripts/capture-gs-embedding-system-pngs.mjs
//
// 출력: Xgen_Manual/customers/gs-cert/overlay/admin/images/
//   - admin-embedding-reranker-tab.png  (임베딩 설정 → 리랭커 탭)
//   - admin-embedding-vectordb-tab.png  (임베딩 설정 → 벡터 데이터베이스 탭)
//   - admin-system-health.png           (시스템 상태 → 시스템 조회)
//   - admin-backend-logs-all.png        (시스템 상태 → 로그 조회 → 전체)
//   - admin-backend-logs-error.png      (오류)
//   - admin-backend-logs-warn.png       (경고)
//   - admin-backend-logs-info.png       (정보)
//   - admin-backend-logs-debug.png      (디버그)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.gs-cert');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'customers', 'gs-cert', 'overlay', 'admin', 'images');

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

const log = (...a) => console.log('[gs-shots]', ...a);

async function login(page) {
  log('navigating to', BASE);
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 60_000 });
  const emailBox = page.getByRole('textbox', { name: '이메일을 입력해 주세요' });
  if (await emailBox.isVisible({ timeout: 3_000 }).catch(() => false)) {
    log('submitting credentials');
    await emailBox.fill(EMAIL);
    await page.getByRole('textbox', { name: '패스워드를 입력해 주세요' }).fill(PASS);
    await page.getByRole('button', { name: '로그인', exact: true }).click();
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
    log('  login OK');
  }
  await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
}

async function clickTabByText(page, tabRegex, label) {
  log(`  click tab "${label}"`);
  const clicked = await page.evaluate((re) => {
    const reObj = new RegExp(re);
    const tabs = Array.from(document.querySelectorAll('[role="tab"], button, div[class*="tab"]'));
    const tab = tabs.find((t) => reObj.test(t.textContent.trim()) && t.textContent.length < 30);
    if (!tab) return false;
    tab.scrollIntoView({ block: 'center' });
    tab.click();
    return true;
  }, tabRegex.source);
  if (!clicked) log(`    warn: "${label}" 탭 미발견`);
  await page.waitForTimeout(1500);
}

async function captureView(page, urlSuffix, filename, opts = {}) {
  const url = `${BASE}${urlSuffix}`;
  log(`navigate ${urlSuffix} → ${filename}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  await page.waitForSelector('aside button', { timeout: 15_000 }).catch(() => {});
  await page.waitForTimeout(opts.wait ?? 2500);
  if (opts.tabRegex) await clickTabByText(page, opts.tabRegex, opts.tabLabel || filename);
  if (opts.extraWait) await page.waitForTimeout(opts.extraWait);
  const dest = path.join(OUT_DIR, filename);
  await page.screenshot({ path: dest, fullPage: !!opts.fullPage });
  log(`  saved ${filename} (${fs.statSync(dest).size} bytes)`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, locale: 'ko-KR' });
  const page = await ctx.newPage();
  try {
    await login(page);

    // 1) 임베딩 설정 → 리랭커 탭
    await captureView(page, '/admin?view=admin-setting-embed', 'admin-embedding-reranker-tab.png', {
      tabRegex: /리랭커|Reranker/,
      tabLabel: '리랭커',
    });

    // 2) 임베딩 설정 → 벡터 데이터베이스 탭
    await captureView(page, '/admin?view=admin-setting-embed', 'admin-embedding-vectordb-tab.png', {
      tabRegex: /벡터\s*데이터베이스|Vector\s*Database/,
      tabLabel: '벡터 데이터베이스',
    });

    // 3) 시스템 상태 → 시스템 조회 (실제 view = admin-system-health)
    await captureView(page, '/admin?view=admin-system-health', 'admin-system-health.png', { wait: 3500 });

    // 4-8) 로그 조회 → All/오류/경고/정보/디버그 (실제 view = admin-backend-logs, 첫 탭 영문 'All')
    const logShots = [
      { file: 'admin-backend-logs-all.png', tab: /^All$|^전체$/, label: 'All' },
      { file: 'admin-backend-logs-error.png', tab: /^오류$|^Error$/, label: '오류' },
      { file: 'admin-backend-logs-warn.png', tab: /^경고$|^Warn$/, label: '경고' },
      { file: 'admin-backend-logs-info.png', tab: /^정보$|^Info$/, label: '정보' },
      { file: 'admin-backend-logs-debug.png', tab: /^디버그$|^Debug$/, label: '디버그' },
    ];
    for (const shot of logShots) {
      await captureView(page, '/admin?view=admin-backend-logs', shot.file, {
        tabRegex: shot.tab,
        tabLabel: shot.label,
        extraWait: 1500,
      });
    }
  } finally {
    await browser.close();
    log('done. files in:', OUT_DIR);
  }
})().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
