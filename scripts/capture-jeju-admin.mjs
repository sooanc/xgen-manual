// capture-jeju-admin.mjs
// jeju-xgen.x2bee.com 라이브 화면을 jeju-bank customer overlay 로 캡처 (관리자 모드).
//
//   cd C:\xgen-manual && node scripts/capture-jeju-admin.mjs
//
// 자격증명: .env.jeju-xgen-admin (시스템 관리자 계정 x2bee_ds@plateer.com)
// 출력 위치: Xgen_Manual/customers/jeju-bank/overlay/admin/images/
// screen-truth: Xgen_Manual/customers/jeju-bank/screen-truth.json
//
// compose.mjs 가 본 디렉토리를 base/admin/images/ 위에 overlay 하여 jeju-bank 매뉴얼
// 빌드 결과에 고객사(김제주) 관리자명이 노출된 캡처가 들어가도록 합니다.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.jeju-xgen-admin');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'customers', 'jeju-bank', 'overlay', 'admin', 'images');

// screen-truth.json: 캡처가 stg 에서 확인한 view 가용 여부 캐시. compose.mjs 가 .md
// frontmatter 의 require_view 와 매칭해 미존재 챕터를 nav 에서 제외. 사용자/관리자
// 캡처 양쪽이 같은 파일에 머지 기록.
const SCREEN_TRUTH_FILE = path.join(REPO_ROOT, 'Xgen_Manual', 'customers', 'jeju-bank', 'screen-truth.json');

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

// 각 항목: { path | view, file, label, [fullPage], [wait], [selector] }
// view 가 있으면 /admin?view=<view>, path 가 있으면 ${BASE}${path}
const SHOTS = [
  // 20-admin-overview.md
  { path: '/admin', file: 'admin-entry.png', label: 'Admin entry (default dashboard)' },
  // admin-sidebar.png 는 현재 본문에서 미참조 — 제외

  // 21-user-management.md
  { view: 'admin-users', file: 'admin-users.png', label: 'User management' },

  // 22-role-permission.md
  { view: 'admin-role-management', file: 'admin-roles.png', label: 'Role / Permission management' },

  // 23-llm-settings.md
  { view: 'admin-setting-llm', file: 'admin-llm.png', label: 'LLM settings' },

  // 24-embedding-settings.md
  { view: 'admin-setting-embed', file: 'admin-embed.png', label: 'Embedding / Search settings' },

  // 25-pii-policy.md  (AI 통제 정책 — gov-control-policy 항목은 29 절 아래에 함께 캡처)
  // (PII / 금칙어 / AI 위험도 등급 탭별 캡처는 별도 스크립트 scripts/capture-control-policy.mjs 참조)

  // 25b-guardrail-model.md  (환경 설정 → 가드레일: 외부 Guard 모델 호출 설정)
  { view: 'admin-setting-guarder', file: 'admin-guardrails.png', label: 'Guardrail model setup (external Guard endpoint)' },

  // 26-system-monitor.md
  { view: 'admin-system-monitor', file: 'admin-system-monitor.png', label: 'System monitoring' },

  // 27-audit-log.md
  { view: 'admin-audit-logs', file: 'admin-data-audit-logs.png', label: 'Data audit log' },

  // 28-mcp-market.md
  { view: 'admin-mcp-market', file: 'admin-mcp-market.png', label: 'MCP library' },
  { view: 'admin-mcp-station', file: 'admin-mcp-station.png', label: 'MCP operations & monitoring' },

  // 29-governance-dashboard.md
  { view: 'gov-monitoring', file: 'admin-gov-monitoring.png', label: 'Governance monitoring' },
  { view: 'gov-risk-management', file: 'admin-gov-risk.png', label: 'AI risk assessment' },
  // gov-control-policy: 25-pii-policy.md(PII 탭 기본 노출) + 29-governance-dashboard.md(요약 위젯) 양쪽이 참조
  { view: 'gov-control-policy', file: 'admin-gov-control-policy.png', label: 'Control policy management (AI 통제 정책)' },
  { view: 'gov-audit-tracking', file: 'admin-gov-audit-tracking.png', label: 'Service change history' },

  // 30-dashboard.md  (admin 로그인 상태로 본 /dashboard)
  // admin-dashboard-view.png 는 본문 미참조 (dashboard-overview.png 가 양쪽 모드 모두 커버) — 제외

  // 31-tech-support-handling.md
  { view: 'admin-support-notice', file: 'admin-support-notice.png', label: 'Admin notice board' },
  { view: 'admin-support-faq', file: 'admin-support-faq.png', label: 'Admin FAQ' },
  { view: 'admin-support-qna', file: 'admin-support-qna.png', label: 'Admin 1:1 Inquiries' },

  // 32-agent-operations.md
  { view: 'admin-agentflow-management', file: 'admin-agent-management.png', label: 'Agent management (admin view)' },
  // 아래 4개는 본문 미참조 (전용 챕터가 없음) — 제외
  //   admin-chat-monitoring.png · admin-prompt-store.png · admin-agent-dev-plan.png
  //   (admin-agent-dev-plan 은 stg 라이브에 main-planning view 자체가 없음)
  { view: 'admin-feedback-monitoring', file: 'admin-feedback-monitoring.png', label: 'User feedback' },
  // (admin-user-token-dashboard / admin-node-management / admin-agentflow-tester / admin-agent-retention 는 추후 추가)

  // 33-data-management.md
  { view: 'admin-database', file: 'admin-database.png', label: 'Database (SQL console)' },
  // admin-db-connection / admin-db-batch / admin-db-audit 도 본문 미참조 — 제외

  // 34-knowledge-operations.md
  { view: 'admin-knowledge-collection', file: 'admin-knowledge-collection.png', label: 'Knowledge collection management (TTL)' },
];

const log = (...a) => console.log('[admin-capture]', ...a);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    locale: 'ko-KR',
  });
  const page = await ctx.newPage();

  // 1) Login — jeju-xgen 폼은 #login-email id 없이 placeholder 기반 textbox.
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

  // 2) Warm up /admin (mode switch)
  log('entering admin mode');
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForSelector('aside button', { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(2500);

  // 모든 사이드바 섹션 펼치기 (이후 각 view 캡처 시 사이드바 상태 일관성 유지)
  await page.evaluate(() => {
    document.querySelectorAll('aside [data-sidebar-trigger="true"]').forEach((el) => {
      const txt = (el.textContent || '').trim();
      // 사용자 프로필 드롭다운(아바타) 텍스트는 expansion 대상에서 제외.
      // jeju 환경 사용자명은 '김제주(...)' 라 '김' 도 화이트리스트에 포함.
      if (/최|김|swan|admin@|My\s*Page|Settings\s*$/i.test(txt) || el.getAttribute('aria-label') === 'More') return;
      el.click();
    });
  });
  await page.waitForTimeout(1000);

  // 8971/41107: hydration placeholder, 36798: "Page not found"
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

  for (const shot of SHOTS) {
    const dest = path.join(OUT_DIR, shot.file);
    const target = shot.path ? `${BASE}${shot.path}` : `${BASE}/admin?view=${shot.view}`;
    log(`→ ${shot.file}  [${shot.label}]  ${target}`);

    let lastSize = 0;
    let lastNotFound = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
        await page.waitForSelector('aside button', { timeout: 15_000 }).catch(() => {});
        await page.waitForTimeout((shot.wait ?? 3500) + (attempt - 1) * 2000);

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
      source: 'admin',
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
})().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
