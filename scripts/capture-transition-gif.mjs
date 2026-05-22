// capture-transition-gif.mjs
//
// 범용 "목록 화면 → 어떤 버튼을 클릭하면 새 화면/모달이 열리는" 흐름을 GIF 로
// 만드는 스크립트. canvas-start-gif 의 가상 커서·툴팁 차단·trim·palette 로직을
// 한 곳에 모아 두고, 화면별 설정만 SHOTS 배열에 정의한다.
//
//   cd C:\xgen-manual && node scripts/capture-transition-gif.mjs                    # 모든 SHOTS
//   cd C:\xgen-manual && node scripts/capture-transition-gif.mjs tool-new            # 특정 id 1개
//
// 출력: Xgen_Manual/base/user/images/<file>

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.xgen-stg');
const OUT_DIR = path.join(REPO_ROOT, 'Xgen_Manual', 'base', 'user', 'images');
const TMP_DIR = path.join(REPO_ROOT, '.tmp-transition-gif');
const FFMPEG = process.env.FFMPEG || 'C:/ffmpeg/bin/ffmpeg';

const VIEWPORT = { width: 1280, height: 720 };
const FPS = 15;
const SCALE_WIDTH = 960;
const PRE_CLICK_HOLD_MS = 900;
const POST_CLICK_HOLD_MS = 1800;
const TRIM_LEAD_IN_MS = 400;

// 캡처할 전환들. 각 항목:
//   id        : CLI 인자로 1개만 돌릴 때의 식별자
//   url       : 진입 URL (BASE 와 합쳐짐)
//   waitFor   : 페이지가 안정 상태인지 판정할 추가 selector (옵션)
//   button    : 클릭할 버튼의 Playwright locator 정의
//                 → { role, name } 형태로 page.getByRole(role, { name }) 매핑
//   resultWait: 클릭 결과가 나타났음을 확인할 텍스트/셀렉터 (waitForFunction 통과 시점)
//   file      : 출력 GIF 파일명
//   account   : 'admin' — 어떤 자격증명으로 로그인할지
//   setupClicks (옵션): 메인 클릭 전 사전에 눌러둘 버튼 배열. 각 항목은
//     { button, postWaitMs?, waitForResult? } 형태. trim 의 시작점은 setupClicks 가 끝나고
//     postWaitMs 까지 흐른 직후 (= "정돈된 출발 상태") 가 된다.
const SHOTS = [
  {
    id: 'tool-new',
    url: '/main?view=tool-storage',
    waitFor: 'button:has-text("새 도구")',
    button: { role: 'button', name: /^새 도구$|New Tool/ },
    // 클릭 후 form 화면 상단에 "돌아가기" 버튼 + "쉬운 모드 / 개발자 모드" 모드 토글이 노출됨
    resultWait: () => /돌아가기|쉬운 모드|개발자 모드|웹사이트 URL|Back|Easy mode|Developer mode/i.test(document.body.innerText),
    resultWaitTimeoutMs: 5_000,
    file: 'tool-new.gif',
    account: 'admin',
  },
  {
    id: 'auth-profile-new',
    url: '/main?view=auth-profile',
    waitFor: 'button:has-text("새 프로필")',
    button: { role: 'button', name: /^새 프로필$|New Profile/ },
    // 새 프로필 클릭 후 form 화면: "← 뒤로" + "인증 프로필 생성" 헤더, 기본 설정 탭, 서비스 ID 필드
    resultWait: () => /뒤로|인증 프로필 생성|서비스 ID|Back|Create profile|Service ID/i.test(document.body.innerText),
    resultWaitTimeoutMs: 5_000,
    file: 'auth-profile-new.gif',
    account: 'admin',
  },
  // 캔버스 우상단 ▶ Tutorial 버튼 → 튜토리얼 선택 패널 (기본 튜토리얼 탭) 등장
  // 헤더 버튼이 텍스트 없이 PlayIcon + title 만 갖고, INIT_SCRIPT 가 title 을 strip 하므로
  // getByRole 로는 잡히지 않는다 → data-tutorial 속성 셀렉터로 직접 지정.
  {
    id: 'tutorial-panel',
    url: '/canvas',
    waitFor: 'button[data-tutorial="tutorial"]',
    button: { selector: 'button[data-tutorial="tutorial"]' },
    resultWait: () => /튜토리얼 선택|기본 튜토리얼|템플릿 튜토리얼|Select Tutorial|Basic Tutorial|Template Tutorial/i.test(document.body.innerText),
    resultWaitTimeoutMs: 5_000,
    file: 'tutorial-panel.gif',
    account: 'admin',
  },
  // 튜토리얼 패널이 열린 상태에서 "템플릿 튜토리얼" 탭 클릭 → 사용자가 등록한 가상튜토리얼 목록 (없으면 안내 텍스트)
  {
    id: 'tutorial-template-tab',
    url: '/canvas',
    waitFor: 'button[data-tutorial="tutorial"]',
    setupClicks: [
      {
        // 1) 패널 열기
        button: { selector: 'button[data-tutorial="tutorial"]' },
        postWaitMs: 700,
      },
    ],
    button: { role: 'button', name: /^템플릿 튜토리얼$|^Template Tutorials?$/ },
    // 탭 클릭 시 등록 안내 텍스트 또는 카드 목록 중 하나가 표시됨. 둘 다 fallback 으로 단순 timeout 만으로 진행 가능.
    resultWait: () => /등록된 튜토리얼이 없습니다|No tutorials|이 없습니다/i.test(document.body.innerText)
      || /가상튜토리얼/i.test(document.body.innerText),
    resultWaitTimeoutMs: 2_000,
    file: 'tutorial-template-tab.gif',
    account: 'admin',
  },
  // Agent 제작 → Agent 기획 화면에서 '+ 새 기획서 제작하기' 버튼 → 신규 기획서 작성 폼이 열림
  {
    id: 'plan-new',
    url: '/main?view=main-planning',
    waitFor: 'button:has-text("새 기획서 제작하기")',
    button: { role: 'button', name: /새 기획서 제작하기|New Plan|Create Plan/ },
    // 폼 화면: "새 기획서 작성" 헤더 + 입력 필드들
    resultWait: () => /새 기획서 작성|기획서 제목|업무 분야|영향 범위|Create Plan|Plan Title/i.test(document.body.innerText),
    resultWaitTimeoutMs: 5_000,
    file: 'plan-new.gif',
    account: 'admin',
  },
];

function loadEnv(file) {
  const env = {};
  fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((l) => {
    const t = l.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i < 0) return;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  });
  return env;
}

const env = loadEnv(ENV_FILE);
const BASE = env.XGEN_BASE_URL.replace(/\/$/, '');
const ACCOUNTS = {
  admin: { email: env.XGEN_LOGIN_EMAIL, pass: env.XGEN_LOGIN_PASSWORD },
};

fs.rmSync(TMP_DIR, { recursive: true, force: true });
fs.mkdirSync(TMP_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const log = (...a) => console.log('[gif]', ...a);

// 가상 커서 + ripple + 툴팁/title 억제 init 스크립트 (canvas-start 와 동일 구조)
const INIT_SCRIPT = () => {
  if (window.__virtualCursorInstalled) return;
  window.__virtualCursorInstalled = true;

  const tipStyle = document.createElement('style');
  tipStyle.id = '__gif-no-tooltip';
  tipStyle.textContent = `
    [role="tooltip"],
    [data-radix-popper-content-wrapper]:has([role="tooltip"]),
    .tippy-box, .tippy-popper, [data-tippy-root],
    .tooltip, .ant-tooltip, .MuiTooltip-popper,
    .react-tooltip, [data-tooltip] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;
  const installTipStyle = () => {
    if (!document.head) return;
    if (!document.getElementById('__gif-no-tooltip')) document.head.appendChild(tipStyle);
  };
  installTipStyle();
  document.addEventListener('DOMContentLoaded', installTipStyle);

  const stripTitles = (root) => {
    try {
      (root || document).querySelectorAll('[title]').forEach((el) => el.removeAttribute('title'));
    } catch {}
  };
  const installObserver = () => {
    stripTitles(document);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'title' && m.target?.hasAttribute?.('title')) {
          m.target.removeAttribute('title');
        }
        if (m.addedNodes?.length) m.addedNodes.forEach((n) => n.nodeType === 1 && stripTitles(n));
      }
    });
    mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['title'] });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installObserver);
  } else { installObserver(); }

  const SVG = `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 2 L3 17 L7.5 13 L10 19 L13 18 L10.5 12 L17 12 Z"
      fill="black" stroke="white" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`;
  const cursor = document.createElement('div');
  cursor.id = '__virtualCursor';
  Object.assign(cursor.style, {
    position: 'fixed', left: '0px', top: '0px', width: '22px', height: '22px',
    pointerEvents: 'none', zIndex: '2147483647',
    transform: 'translate(-2px, -2px)', willChange: 'left, top',
  });
  cursor.innerHTML = SVG;

  const ripple = document.createElement('div');
  Object.assign(ripple.style, {
    position: 'fixed', left: '0px', top: '0px', width: '28px', height: '28px',
    borderRadius: '50%', border: '2px solid rgba(80, 120, 255, 0.9)',
    transform: 'translate(-14px, -14px) scale(0.3)', opacity: '0',
    pointerEvents: 'none', zIndex: '2147483646',
    transition: 'opacity 0.35s ease-out, transform 0.45s ease-out',
  });

  const install = () => {
    if (!document.body) return;
    if (!document.getElementById('__virtualCursor')) document.body.appendChild(cursor);
    if (!ripple.isConnected) document.body.appendChild(ripple);
  };
  install();
  document.addEventListener('DOMContentLoaded', install);

  window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }, true);
  window.addEventListener('mousedown', (e) => {
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    ripple.style.transition = 'none';
    ripple.style.opacity = '0.9';
    ripple.style.transform = 'translate(-14px, -14px) scale(0.3)';
    void ripple.offsetWidth;
    ripple.style.transition = 'opacity 0.45s ease-out, transform 0.55s ease-out';
    ripple.style.opacity = '0';
    ripple.style.transform = 'translate(-14px, -14px) scale(1.8)';
  }, true);
};

async function loginAndGetStorage(browser, account) {
  log(`logging in as ${account.email}`);
  const ctx = await browser.newContext({ viewport: VIEWPORT, locale: 'ko-KR' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60_000 });
  if (await page.$('#login-email')) {
    await page.fill('#login-email', account.email);
    await page.fill('#login-password', account.pass);
    const [res] = await Promise.all([
      page.waitForResponse(
        (r) => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST',
        { timeout: 30_000 },
      ),
      page.click('button[type="submit"]'),
    ]);
    if (res.status() !== 200) {
      const body = await res.text().catch(() => '');
      throw new Error(`login failed for ${account.email}: ${res.status()} ${body.slice(0, 200)}`);
    }
    await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30_000 });
    log(`  login OK (${account.email})`);
  }
  const state = await ctx.storageState();
  await ctx.close();
  return state;
}

async function captureShot(browser, shot, storageState) {
  log(`shot ${shot.id} — ${shot.file}`);
  const recCtx = await browser.newContext({
    viewport: VIEWPORT,
    locale: 'ko-KR',
    storageState,
    recordVideo: { dir: TMP_DIR, size: VIEWPORT },
  });
  await recCtx.addInitScript(INIT_SCRIPT);
  const page = await recCtx.newPage();

  const ctxStart = Date.now();
  await page.goto(`${BASE}${shot.url}`, { waitUntil: 'networkidle', timeout: 45_000 });

  if (shot.waitFor) {
    await page.waitForSelector(shot.waitFor, { state: 'visible', timeout: 30_000 });
  }
  // 안정화 위해 살짝 더 기다림
  await page.waitForTimeout(500);

  // 사전 클릭 단계 — trim 전(준비 단계) 에 실행. GIF 에는 나오지만 trim 시작점이
  // 마지막 setupClick + postWait 이후로 잡혀 결과적으로 잘려나간다.
  if (shot.setupClicks?.length) {
    for (const sc of shot.setupClicks) {
      const setupBtn = sc.button.selector
        ? page.locator(sc.button.selector).first()
        : page.getByRole(sc.button.role, { name: sc.button.name }).first();
      await setupBtn.waitFor({ state: 'visible', timeout: 5_000 });
      log(`  setup click: ${sc.button.selector ?? sc.button.name}`);
      await setupBtn.click();
      await page.waitForTimeout(sc.postWaitMs ?? 500);
    }
  }

  const tReady = Date.now() - ctxStart;
  log(`  ready (after setup) at t=${tReady}ms`);

  // 가상 커서 시작 위치
  await page.mouse.move(140, 360);
  await page.waitForTimeout(PRE_CLICK_HOLD_MS);

  const btn = shot.button.selector
    ? page.locator(shot.button.selector).first()
    : page.getByRole(shot.button.role, { name: shot.button.name }).first();
  await btn.waitFor({ state: 'visible', timeout: 5_000 });
  const box = await btn.boundingBox();
  if (box) {
    const tx = box.x + box.width / 2;
    const ty = box.y + box.height / 2;
    log(`  animating cursor to (${tx.toFixed(0)}, ${ty.toFixed(0)})`);
    await page.mouse.move(tx, ty, { steps: 25 });
    await page.waitForTimeout(150);
  }
  log(`  clicking ${shot.id} button`);
  await btn.click();

  // 결과 표시 대기
  if (shot.resultWait) {
    await page.waitForFunction(shot.resultWait, null, { timeout: shot.resultWaitTimeoutMs ?? 8_000 })
      .catch(() => log(`  warning: resultWait timed out for ${shot.id} — 그래도 진행`));
  }
  log(`  result visible`);

  // hover 재트리거 방지 — 커서를 상단 우측으로 회피
  await page.mouse.move(900, 120, { steps: 8 });
  await page.waitForTimeout(POST_CLICK_HOLD_MS);
  const tEnd = Date.now() - ctxStart;
  log(`  total recorded duration ≈ ${tEnd}ms`);

  const video = page.video();
  await page.close();
  await recCtx.close();
  const webmPath = await video.path();
  log(`  webm saved: ${webmPath} (${fs.statSync(webmPath).size} bytes)`);

  // trim
  const trimStartMs = Math.max(0, tReady - TRIM_LEAD_IN_MS);
  const trimDurMs = tEnd - trimStartMs;
  const trimmedPath = path.join(TMP_DIR, `${shot.id}.trimmed.webm`);
  log(`  ffmpeg trim — ss=${(trimStartMs / 1000).toFixed(2)}s  t=${(trimDurMs / 1000).toFixed(2)}s`);
  let r = spawnSync(FFMPEG, [
    '-y',
    '-ss', `${(trimStartMs / 1000).toFixed(3)}`,
    '-i', webmPath,
    '-t', `${(trimDurMs / 1000).toFixed(3)}`,
    '-c:v', 'libvpx', '-b:v', '2M', '-an',
    trimmedPath,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg trim failed for ${shot.id}`);

  const palettePath = path.join(TMP_DIR, `${shot.id}.palette.png`);
  const gifPath = path.join(OUT_DIR, shot.file);
  const filter = `fps=${FPS},scale=${SCALE_WIDTH}:-2:flags=lanczos`;

  log(`  ffmpeg pass 1 — palette`);
  r = spawnSync(FFMPEG, ['-y', '-i', trimmedPath, '-vf', `${filter},palettegen=stats_mode=diff`, palettePath], {
    stdio: 'inherit',
  });
  if (r.status !== 0) throw new Error(`palette failed for ${shot.id}`);

  log(`  ffmpeg pass 2 — gif`);
  r = spawnSync(FFMPEG, [
    '-y', '-i', trimmedPath, '-i', palettePath,
    '-lavfi', `${filter} [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle`,
    '-loop', '0', '-f', 'gif', gifPath,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`gif encode failed for ${shot.id}`);

  const size = fs.statSync(gifPath).size;
  log(`  GIF: ${gifPath} (${(size / 1024).toFixed(1)} KB)`);
}

(async () => {
  const onlyId = process.argv[2];
  const shotsToRun = onlyId ? SHOTS.filter((s) => s.id === onlyId) : SHOTS;
  if (!shotsToRun.length) {
    console.error(`no shot matches id=${onlyId}. available: ${SHOTS.map((s) => s.id).join(', ')}`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  // 동일 계정 재로그인을 줄이기 위해 account 별 storageState 캐시
  const storageCache = new Map();

  try {
    for (const shot of shotsToRun) {
      const account = ACCOUNTS[shot.account];
      if (!account?.email || !account?.pass) {
        throw new Error(`missing credentials for account=${shot.account} (set XGEN_${shot.account.toUpperCase()}_EMAIL/PASSWORD in .env.xgen-stg)`);
      }
      if (!storageCache.has(shot.account)) {
        storageCache.set(shot.account, await loginAndGetStorage(browser, account));
      }
      await captureShot(browser, shot, storageCache.get(shot.account));
    }
  } finally {
    await browser.close();
  }
  log('all done.');
})();
