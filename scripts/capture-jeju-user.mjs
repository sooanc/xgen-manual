// capture-jeju-user.mjs
// jeju-xgen.x2bee.com 라이브 화면을 jeju-bank customer overlay 로 캡처 (사용자 모드).
//
//   cd C:\xgen-manual && node scripts/capture-jeju-user.mjs
//
// 자격증명: .env.jeju-xgen-user (에이전트 개발자 계정 customer_success@plateer.com)
// 출력 위치: Xgen_Manual/customers/jeju-bank/overlay/user/images/
// screen-truth: Xgen_Manual/customers/jeju-bank/screen-truth.json
//
// compose.mjs 가 본 디렉토리를 base/user/images/ 위에 overlay 하여 jeju-bank 매뉴얼
// 빌드 결과에 고객사(김제주) 사용자명이 노출된 캡처가 들어가도록 합니다.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.jeju-xgen-user');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'customers', 'jeju-bank', 'overlay', 'user', 'images');
const SCREEN_TRUTH_FILE = path.join(REPO_ROOT, 'Xgen_Manual', 'customers', 'jeju-bank', 'screen-truth.json');

const env = {};
fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/).forEach((l) => {
  const t = l.trim();
  if (!t || t.startsWith('#')) return;
  const i = t.indexOf('=');
  if (i < 0) return;
  env[t.slice(0, i).trim()] = t
    .slice(i + 1)
    .trim()
    .replace(/^["']|["']$/g, '');
});
const BASE = env.XGEN_BASE_URL.replace(/\/$/, '');
const EMAIL = env.XGEN_LOGIN_EMAIL;
const PASS = env.XGEN_LOGIN_PASSWORD;

fs.mkdirSync(OUT_DIR, { recursive: true });

// 각 항목 형식: { path | view, file, label, [fullPage], [wait], [selector] }
const SHOTS_LOGGED_IN = [
  // 18-dashboard.md
  { path: '/dashboard', file: 'dashboard-overview.png', label: 'Dashboard overview' },
  { path: '/dashboard', file: 'dashboard-full.png', label: 'Dashboard (full scroll)', fullPage: true, wait: 2000 },

  // 10-getting-started.md — 첫 메인 화면 (사이드바 hydration 끝난 /main)
  // main-overview.png 는 현재 본문에서 미참조 (사이드바 중심 설명으로 충분) — 제외
  { path: '/main', file: 'main-sidebar.png', label: 'Main sidebar view' },
  // 11a-task-planning 챕터는 stg 에 main-planning view 가 없어 통째로 제거됨 (2026-05-22).

  // 12-agentflow-create.md
  { view: 'canvas-intro', file: 'agentflow-list.png', label: 'Agent 작업실 진입 (Canvas Intro)' },
  // canvas-editor 는 정지 PNG 대신 GIF (빈 상태 → "에이전트 시작" → XGEN Agent 노드 전환) 로 대체됨.
  // 갱신 시: node scripts/capture-canvas-start-gif.mjs

  // 13-agentflow-operations.md
  { view: 'agentflow-scheduler', file: 'scheduler.png', label: 'Agent scheduler' },
  // tester.png 는 현재 본문 미참조 (실행/디버깅 절은 다른 캡처로 커버) — 제외

  // 14-chat.md
  { view: 'new-chat', file: 'chat-new.png', label: 'New chat' },
  { view: 'current-chat', file: 'chat-current.png', label: 'Current chat' },
  { view: 'chat-history', file: 'chat-history.png', label: 'Chat history' },

  // 15-knowledge.md
  { view: 'knowledge-collection', file: 'collection-list.png', label: 'Knowledge collections' },
  // 파일 저장소 / DB 연동 정지 PNG 는 storage-new.gif / database-new.gif 로 대체됨 (2026-05-22).
  // 갱신: node scripts/capture-transition-gif.mjs storage-new
  //       node scripts/capture-transition-gif.mjs database-new

  // 16-prompt.md
  { view: 'prompt-storage', file: 'prompts.png', label: 'Prompts library' },

  // 17-auth-profile.md
  { view: 'auth-profile', file: 'auth-profile.png', label: 'Auth profiles' },

  // tools.png 는 사용자 요청으로 삭제됨 (2026-05-22). 12-agentflow-create 는
  // tool-new.gif (capture-transition-gif.mjs) 가 대체, 17a-api-tools 는 본문
  // 표/설명만으로 충분하다고 판단. 향후 재캡처 필요 시 복원.

  // 19-tech-support.md (이미 있지만 함께 갱신)
  { view: 'support-notices', file: 'support-notice.png', label: 'Notice Board' },
  { view: 'support-faq', file: 'support-faq.png', label: 'FAQ' },
  { view: 'support-qna', file: 'support-qna.png', label: '1:1 Admin Inquiry' },
];

const log = (...a) => console.log('[capture]', ...a);

async function loginAndCaptureLoginScreen(ctx) {
  // 별도 페이지에서 로그인 화면만 캡처 (로그인 전).
  // 11-login.md 의 "표준 로그인" 절에 사용.
  const page = await ctx.newPage();
  log('capturing login screen (pre-auth)');
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});
  if (!(await page.$('#login-email'))) {
    // fallback: BASE 가 자동 리다이렉트하면 거기서 캡처
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});
  }
  await page.waitForTimeout(1500);
  const dest = path.join(OUT_DIR, 'login.png');
  await page.screenshot({ path: dest, fullPage: false });
  log(`→ login.png  (${fs.statSync(dest).size} bytes)`);
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1) 로그인 전 화면 캡처 (별도 컨텍스트)
  const preAuthCtx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    locale: 'ko-KR',
  });
  await loginAndCaptureLoginScreen(preAuthCtx);
  await preAuthCtx.close();

  // 2) 로그인 후 캡처
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    locale: 'ko-KR',
  });
  const page = await ctx.newPage();

  log('navigating to', BASE);
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 60_000 });
  // jeju-xgen 로그인 폼은 #login-email id 가 아닌 placeholder 기반 textbox.
  // 두 가지 selector 모두 시도해 호환성 확보.
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
      page.waitForResponse(
        (r) => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST',
        { timeout: 30_000 }
      ),
      page.click('button[type="submit"]'),
    ]);
    log('  login API:', loginRes.status());
    if (loginRes.status() !== 200) throw new Error(`login failed: ${loginRes.status()}`);
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
  } else {
    log('WARNING: no login form detected — proceeding (already signed in?)');
  }
  await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});

  log('warming up /main');
  await page.goto(`${BASE}/main`, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});
  await page.waitForSelector('aside button', { timeout: 15_000 }).catch(() => {});

  // 8971/41107: hydration 미완 placeholder, 36798: "Page not found" 빈 페이지
  const PLACEHOLDER_SIZES = new Set([8971, 41107, 36798]);

  // 기존 screen-truth.json 로드 (캡처 실패 시 fallback 으로 사용)
  let truth = { capturedAt: null, baseUrl: BASE, views: {} };
  if (fs.existsSync(SCREEN_TRUTH_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(SCREEN_TRUTH_FILE, 'utf8'));
      truth = { ...truth, ...parsed, views: parsed.views || {} };
    } catch (e) {
      log(`warning: screen-truth.json parse failed, starting fresh: ${e.message}`);
    }
  }

  for (const shot of SHOTS_LOGGED_IN) {
    const dest = path.join(OUT_DIR, shot.file);
    const target = shot.path ? `${BASE}${shot.path}` : `${BASE}/main?view=${shot.view}`;
    log(`→ ${shot.file}  [${shot.label}]  ${target}`);

    let lastSize = 0;
    let lastNotFound = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
        await page.waitForSelector('aside button', { timeout: 15_000 }).catch(() => {});
        await page.waitForTimeout((shot.wait ?? 3500) + (attempt - 1) * 2000);

        // 본문에 "Page not found" 노출되면 view 매핑이 잘못된 것 — 재시도해도 동일
        const notFound = await page
          .locator('text=/Page not found|페이지를 찾을 수 없/i')
          .first()
          .isVisible({ timeout: 500 })
          .catch(() => false);

        if (shot.selector) {
          const el = await page.$(shot.selector);
          if (!el) throw new Error(`selector not found: ${shot.selector}`);
          await el.screenshot({ path: dest });
        } else {
          await page.screenshot({ path: dest, fullPage: !!shot.fullPage });
        }
        lastSize = fs.statSync(dest).size;
        lastNotFound = notFound;
        if (!notFound && !PLACEHOLDER_SIZES.has(lastSize)) {
          log(`   saved ${lastSize} bytes  (attempt ${attempt})`);
          break;
        }
        log(`   ${notFound ? 'Page-not-found' : 'placeholder'} ${lastSize} bytes — retry ${attempt}/3`);
      } catch (e) {
        log(`   attempt ${attempt} error: ${e.message.slice(0, 100).replace(/\s+/g, ' ')}`);
      }
    }
    const truthKey = shot.view ?? shot.path;
    const ok = !lastNotFound && !PLACEHOLDER_SIZES.has(lastSize);
    truth.views[truthKey] = {
      ok,
      lastSize,
      notFound: lastNotFound,
      capturedAt: new Date().toISOString(),
      source: 'user',
    };
    if (!ok) {
      log(`   final: BAD CAPTURE (${lastSize} bytes, notFound=${lastNotFound}) — view '${truthKey}' likely invalid`);
    }
  }

  // screen-truth.json 갱신 (이번 run 의 키만 덮어쓰고 나머지는 보존)
  truth.capturedAt = new Date().toISOString();
  truth.baseUrl = BASE;
  fs.writeFileSync(SCREEN_TRUTH_FILE, JSON.stringify(truth, null, 2), 'utf8');
  log(`screen-truth.json updated: ${SCREEN_TRUTH_FILE}`);

  await browser.close();
  log('done. files in:', OUT_DIR);
})();
