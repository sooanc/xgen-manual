// Probe v5: directly click each menu button by exact text match and capture URL.
//   node scripts/probe-admin-views.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.xgen-stg');

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

const log = (...a) => console.log('[probe]', ...a);

// Menu items to probe — from live sidebar dump
const TARGETS = {
  'Agent 운영': [
    'Agent 관리', '채팅 모니터링', '사용자 토큰', '노드 관리', '프롬프트 템플릿',
    '사용자 피드백', '응답 품질 평가', 'Agent 리텐션 분석', '업무기획',
  ],
  '데이터 관리': ['데이터베이스', 'DB 연결', '배치 작업', '데이터 감사 로그'],
  '서비스 운영': ['공지 게시판', '자주 묻는 질문', '1:1 관리자 문의'],
  '지식 운영': ['컬렉션 관리'],
};

async function clickByText(page, label) {
  return page.evaluate((label) => {
    const aside = document.querySelector('aside');
    if (!aside) return false;
    const btns = Array.from(aside.querySelectorAll('button'));
    const target = btns.find((b) => (b.textContent || '').trim() === label);
    if (!target) return false;
    target.click();
    return true;
  }, label);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, locale: 'ko-KR' });
  const page = await ctx.newPage();

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60_000 });
  if (await page.$('#login-email')) {
    await page.fill('#login-email', EMAIL);
    await page.fill('#login-password', PASS);
    const [r] = await Promise.all([
      page.waitForResponse(
        (r) => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST',
        { timeout: 30_000 }
      ),
      page.click('button[type="submit"]'),
    ]);
    if (r.status() !== 200) throw new Error('login failed');
    await page.waitForURL((u) => !u.toString().includes('/login'));
  }

  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForTimeout(3000);

  for (const [group, items] of Object.entries(TARGETS)) {
    log(`=== ${group} ===`);
    for (const label of items) {
      const ok = await clickByText(page, label);
      if (!ok) {
        log(`  ${label.padEnd(20)} NOT FOUND`);
        continue;
      }
      await page.waitForTimeout(1500);
      const url = page.url();
      const m = url.match(/[?&]view=([^&#]+)/);
      const viewId = m ? m[1] : '(no view=)';
      log(`  ${label.padEnd(20)} view=${viewId}`);
      // back to /admin
      await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle', timeout: 30_000 });
      await page.waitForTimeout(600);
    }
  }

  await browser.close();
})().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
