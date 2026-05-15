# 매뉴얼 작성 가이드

본 파일은 `Xgen_Manual/base/**/*.md` 매뉴얼 본문을 편집·재작성할 때 매번 참고해야 하는 규칙을 모은 곳입니다. AI 어시스턴트 메모리는 휘발성이 있어 세션 간 보존되지 않으므로, 영속적 규칙은 모두 이 파일에 모읍니다. 새 규칙이 정해지면 즉시 여기에 추가하세요.

> **작업 시작 전 항상 이 파일을 먼저 읽으세요.**

## 1. 용어 (Terminology)

### 1.1 관리자 > AI 거버넌스 영역

| 컨텍스트 | 권장 용어 | 사용 금지 |
|---|---|---|
| 한국어 | **에이전트** | "에이전트플로우", "플로우" |
| English | **agent** | "agentflow", "flow(s)" (in this chapter) |

**적용 범위**: [base/admin/29-governance-dashboard.md](base/admin/29-governance-dashboard.md) 및 .en.md.
다른 영역(예: 사용자 매뉴얼 12-agentflow-create)에서는 "에이전트플로우" 정식 명칭 유지.

**근거**: 관리 설정 > AI 거버넌스 UI 라벨이 "에이전트 승인", "Agent Approval" 로 표시되며, 거버넌스 컨텍스트에서는 "플로우" 단위가 아닌 배포된 "에이전트" 단위로 위험·승인을 다룸.

### 1.2 에이전트 vs 에이전트플로우

| 용어 | 의미 |
|---|---|
| **에이전트플로우 (Agentflow)** | 캔버스에서 노드를 추가·연결해 만드는 **설계·구성 단위** (제작 과정에서 다루는 흐름) |
| **에이전트 (Agent)** | 에이전트플로우를 통해 만들어진 **최종 결과물** — 배포·실행·소비의 단위 |

**메뉴명·챕터 제목 규칙**: 사용자가 인지하는 결과물은 "에이전트" 이므로 사이드바 메뉴와 챕터 제목은 결과물 기준으로 작성한다.

| 위치 | 권장 |
|---|---|
| 사이드바 메뉴 / 챕터 h1 | "에이전트 만들기", "에이전트 운영" (영문: "Creating an Agent", "Agent Operations") |
| 본문에서 제작 흐름·캔버스 구조 설명 | "에이전트플로우" 유지 가능 (예: "캔버스에서 에이전트플로우를 구성한다") |
| UI 라벨이 "에이전트플로우" 인 곳 (Agent 작업실 등) | UI 그대로 인용 (`**에이전트플로우 운영 설정**`) |

**적용 파일 (현재)**: [base/user/12-agentflow-create.md](base/user/12-agentflow-create.md) (`# 에이전트 만들기`), [base/user/13-agentflow-operations.md](base/user/13-agentflow-operations.md) (`# 에이전트 운영`) 및 두 영문판. 위 두 챕터로 향하는 모든 링크 텍스트도 새 챕터명으로 갱신.

**파일명**: `12-agentflow-create.md` / `13-agentflow-operations.md` 파일명은 유지 — 외부 링크·앵커 호환성을 위해 변경하지 않는다.

## 2. 솔루션 UI 사실 (Factual UI)

### 2.1 좌상단 모드 전환 버튼

- 실제 UI: **2개** (Agent 작업실 / 관리 설정)
- 권한 범위:
  - **Agent 작업실** — 일반 사용자 및 Agent 개발자
  - **관리 설정** — 시스템 관리자 및 거버넌스 담당자
- 다른 모드(AI 모델관리, AI 거버넌스 등)는 관리 설정 *내부* 메뉴이며 별도 모드 버튼이 아님.

적용 파일: [base/admin/20-admin-overview.md](base/admin/20-admin-overview.md), [base/user/10-getting-started.md](base/user/10-getting-started.md) (한·영 양쪽).

### 2.2 일반 사용자가 사용 가능한 메뉴 범위

일반 사용자(Standard User)는 **Agent 채팅 / 기술지원 / 대시보드** 3개 영역에 접근 가능.

- Agent 제작, 도구 연동, 지식관리 등은 **Agent 개발자 권한** 필요
- 거버넌스·시스템 운영 메뉴는 **관리자 / 거버넌스 담당자 권한** 필요
- 업무 가이드([base/tasks/index.md](base/tasks/index.md))에서 일반 사용자 절은 위 3개에 한정하고, 나머지 작업은 Agent 개발자 절로 분리해야 함.

### 2.4 역할별 특화 대시보드

`/dashboard` 한 경로지만, 로그인한 계정의 역할·권한에 따라 노출되는 위젯·단축 버튼·인사 카드 부제가 달라진다. 매뉴얼에서는 다음과 같이 4개 역할 뷰로 나눠 설명한다.

| 역할 | 챕터 | 앵커 |
|---|---|---|
| 일반 사용자 | [base/user/18-dashboard.md](base/user/18-dashboard.md) | `#일반-사용자-뷰` |
| Agent 개발자 | [base/user/18-dashboard.md](base/user/18-dashboard.md) | `#agent-개발자-뷰` |
| 시스템 관리자 | [base/admin/30-dashboard.md](base/admin/30-dashboard.md) | `#시스템-관리자-뷰` |
| 거버넌스 담당자 | [base/admin/30-dashboard.md](base/admin/30-dashboard.md) | `#거버넌스-담당자-뷰` |

작성 규칙:

- 사용자 탭(`base/user/18-dashboard.md`)은 **일반 사용자 / Agent 개발자** 두 뷰를 한 챕터 안에 절(level-2 heading)로 분리.
- 관리자 탭(`base/admin/30-dashboard.md`)은 **시스템 관리자 / 거버넌스 담당자** 두 뷰를 한 챕터 안에 절로 분리.
- 업무 가이드([base/tasks/](base/tasks/))의 4개 역할 페이지에는 각각 "로그인 직후 내 역할에 맞는 메인 화면을 보고 싶다" 항목을 두고, 해당 역할 뷰 앵커로 링크.
- 두 챕터 모두 도입부에서 "한 URL이지만 역할별로 다른 화면" 사실을 명시하고 서로 교차 링크.

### 2.3 대시보드는 권한 기반 공용 화면

`/dashboard` 는 로그인 직후 진입하는 **권한 기반 메인 화면**이며 개인별 페이지가 아님.

- ✅ 표현: "일반 사용자 권한자가 공통적으로 보는 메인 화면", "권한별로 노출되는 위젯이 달라짐"
- ❌ 표현 금지: "개인용 대시보드", "내 사용 통계 페이지" — 페이지 자체는 역할 단위 공용이며, 본인 호출 이력 같은 일부 위젯만 개인 데이터를 표시함
- 위젯 표시 여부는 권한(superuser·admin·standard)에 따라 분기. 거버넌스/시스템 위젯은 관리자 권한이 있어야 노출됨.

## 3. 마스킹 (Customer Confidentiality)

- 모든 고객사명·ID는 빌드 시점에 자동 마스킹됨 ([build/lib/mask.mjs](build/lib/mask.mjs)).
- 단어별 첫 글자 + `OOO` 치환 (예: `제주은행` → `제OOO`, `jeju-bank` → `jOOO-bOOO`).
- 표준 매뉴얼(xgen-standard)은 마스킹 제외.
- 매뉴얼 본문에서 고객사를 지칭할 때는 `{{customer.name}}` 매크로 사용 → 빌드 시 자동 마스킹됨.
- **하드코딩된 고객사 실명을 본문에 넣지 마세요** — 마스킹을 우회하게 됨.

## 4. 페이지 메타 표시

- 페이지 푸터 날짜는 **마지막 수정일만** 표시. 생성일 비노출 ([mkdocs.base.yml](mkdocs.base.yml) `enable_creation_date: false`).
- 변경 필요 시 mkdocs.base.yml 만 수정 (markdown 측엔 메타 없음).

## 5. 한/영 동시 유지

매뉴얼 .md를 수정하면 같은 이름의 `.en.md` 파일도 함께 갱신.
- 누락 검출: `for f in base/**/*.md; do [ -f "${f%.md}.en.md" ] || echo "no EN: $f"; done`
- 영문판이 아직 없는 파일은 새로 생성하지 말고 한국어만 두기 (예: 22-role-permission.md 는 영문판 없음).

## 6. 캡처 워크플로

- 캡처 스크립트: [scripts/capture-manual-user.mjs](../scripts/capture-manual-user.mjs), [scripts/capture-manual-admin.mjs](../scripts/capture-manual-admin.mjs).
- 캡처 대상: `https://stg-xgen.x2bee.com/` (stg 환경). 자격증명은 레포 루트 `.env.xgen-stg` (gitignore 처리).
- 새 사이드바 메뉴 추가 시 SHOTS 배열에 `{ view: '<view-id>', file: '<name>.png', label: '<설명>' }` 항목 추가.
- view ID 매핑은 `apps/web/src/features/feature-registry.ts` (사용자 모드) 또는 `permission-taxonomy.ts` (관리자 모드) 참조 (xgen-frontend 본 레포 측).
- 잘못된 view ID는 36798 bytes 의 "Page not found" 플레이스홀더로 저장됨 — 스크립트 내장 검출 로직이 잡아냄.

## 7. 빌드·배포 흐름

```
.md 편집
   ↓ git push (main)
   ↓ GitHub Actions (.github/workflows/pages.yml)
   ↓ 빌드: node build/build.mjs --customer all --formats html
   ↓ 배포: dist/site → public/ → GitHub Pages
https://sooanc.github.io/xgen-manual/  (라이브, ~2분)
```

- **GitLab 본 레포에 매뉴얼 푸시 금지** — GitHub `sooanc/xgen-manual` 만 사용.
- 자격증명·로컬 산출물(`.build/`, `dist/`, `node_modules/`)은 모두 `.gitignore` 처리됨.

## 7a. 화면 기준 자동 nav 제외 (require_view)

매뉴얼은 **stg 화면이 정답**입니다. 코드/브랜치에는 있어도 stg 에 아직 배포되지 않은 메뉴는 매뉴얼 사이드바에서 빠져야 합니다. 이를 자동화하는 파이프라인:

```
capture-manual-{user,admin}.mjs  →  screen-truth.json  →  compose.mjs  →  .pages (nav 제외)
```

### 7a.1 챕터에 `require_view:` frontmatter 추가

특정 view 메뉴에 의존하는 챕터는 `.md` 상단에 frontmatter 를 둡니다 (한·영 양쪽).

```markdown
---
require_view: main-planning
---
# 업무 기획
...
```

- `require_view` 값은 [scripts/capture-manual-user.mjs](../scripts/capture-manual-user.mjs) / [capture-manual-admin.mjs](../scripts/capture-manual-admin.mjs) `SHOTS` 배열의 `view` ID 와 동일해야 함 (예: `main-planning`, `admin-agent-dev-plan`).
- 한 챕터가 여러 view 에 걸치면 리스트로:
  ```yaml
  require_view:
    - canvas-intro
    - agentflow-scheduler
  ```
  → 나열한 view **하나라도** stg 에 없으면 제외 (보수적).

### 7a.2 동작 흐름

1. **캡처 단계**: 캡처 스크립트가 `https://stg-xgen.x2bee.com/main?view=<id>` 에 실제 접속해 "Page not found" 또는 placeholder 크기(8971/41107/36798) 여부 판정 → 결과를 [Xgen_Manual/screen-truth.json](screen-truth.json) `views` 맵에 머지 기록 (다른 source 의 기존 키는 보존).
2. **빌드 단계**: `compose.mjs` 가 `screen-truth.json` 을 읽어 각 `.md` frontmatter `require_view` 와 매칭. 미존재 view 면 해당 챕터를 nav 에서 제외.
3. **제외 방식**: mkdocs 1.5+ 의 `not_in_nav:` 옵션을 생성되는 `mkdocs.yml` 에 주입. `.md` 와 `.en.md` 형제 양쪽을 한 줄씩 등록해 두 언어 모두에서 사이드바·검색에서 제외. awesome-pages 가 만든 자동 nav 위에서도 정상 동작.
4. **페이지는 남김**: `.md` 자체는 docs/ 에 그대로 복사·빌드되므로 직접 URL (`/user/11a-task-planning.html` 등) 로는 접근 가능 (외부에서 옛 링크로 들어오는 경우 대비).

### 7a.3 캡처가 실패하거나 안 돌면

- `screen-truth.json` 의 마지막 성공 결과를 그대로 재사용 (캡처는 키를 **머지** 하지 덮어쓰지 않음).
- 파일이 비어 있거나 손상되면 **어떤 챕터도 제외하지 않는 안전 디폴트** (`views: {}`).
- 즉 "캡처 안 돌리면 모든 챕터 표시" 가 보장됨 — 빌드가 절대 막히지 않음.

### 7a.4 새 챕터 추가 시 체크리스트

1. `SHOTS` 배열에 캡처 항목 추가 (`view`, `file`, `label`).
2. 한·영 `.md` 양쪽 상단에 `require_view: <id>` frontmatter.
3. `node scripts/capture-manual-user.mjs` (또는 admin) 한 번 실행해 `screen-truth.json` 갱신.
4. 화면이 stg 에 아직 없으면 자동으로 nav 에서 빠진 채 빌드됨. 배포 후 캡처 재실행하면 자동 복귀.

### 7a.5 디버깅

- compose 가 어느 챕터를 숨겼는지 확인: 빌드 로그에서 `hide from nav: ...` 라인.
- 실제 주입 결과: `.build/composed/<customer>/mkdocs.yml` 의 `not_in_nav:` 블록.
- 기대와 다르면 `screen-truth.json` 의 해당 view 항목(`ok`, `notFound`, `lastSize`) 확인.

## 7b. 변경 완료 기준 — 라이브 결과 검증

매뉴얼·빌드 파이프라인 변경은 다음 두 단계 **모두** 통과한 뒤에야 "완료" 로 보고한다.

1. **로컬 풀빌드 통과**: `cd Xgen_Manual && node build/build.mjs --customer xgen-standard --formats html` 가 exit 0 으로 끝나는지. compose 만 단독 실행하는 것은 검증이 아니다 — mkdocs 단까지 가야 awesome-pages·i18n·macros 등 플러그인 간 충돌이 드러난다.
2. **배포된 라이브 사이트의 grep 검증**: GitHub Actions 워크플로가 끝난 뒤 (보통 push 후 3~5분), 배포된 URL 을 직접 받아 기대한 변화가 반영됐는지 확인.
   ```powershell
   $html = Invoke-WebRequest -Uri "https://sooanc.github.io/xgen-manual/docs/xgen-standard/user/index.html" -UseBasicParsing
   ($html.Content | Select-String -Pattern "11a-task-planning" -AllMatches).Matches.Count   # 0 이어야 함
   ```

**Why:** push 완료 / build 통과 / "이론상 동작할 것" 같은 중간 체크포인트로 완료를 보고하면 사용자가 직접 라이브 사이트에서 확인해야 하고, 반영이 안 됐을 때 "다시 봐 달라" 사이클이 반복된다. 2026-05-15 세션에서 compose 만 단독 검증한 채 push 했다가 mkdocs build 단계에서 awesome-pages 가 깨져 #40 빌드가 실패 → 사용자가 "여전히 안 됨" 을 두 번 보고하는 일이 있었다. 사용자 피드백: *"다음부터는 제대로 반영된 최종 결과를 한번에 볼 수 있으면 좋겠다."*

**How to apply:**
- UI/배포 변경 후 push 했으면 **CI 완료까지 기다린 뒤** 배포 URL 을 직접 fetch 해서 검증한다. CI 가 실패하면 즉시 진단·재push, 성공하면 grep 으로 기대 결과 확인.
- 검증할 수 없는 부분은 "이 부분은 검증 못함" 이라고 명시적으로 인정한다. "should work" 류 표현 금지.
- 매뉴얼 컨텐츠 변경(예: 챕터 신설·삭제·이동, nav 영향) 도 동일 — `dist/site/<customer>/<section>/index.html` 또는 라이브 URL 의 사이드바 마크업에서 기대 변화 확인.

## 8. 챕터 구조 원칙

### 8.1 전체 진입 구조 — Task 우선, 메뉴는 보조

B2B 온프레미스 환경에서 사용자는 메뉴를 외우지 않고 **"이런 일을 하고 싶다"** 로 매뉴얼을 찾는다. 따라서:

1. **메인 진입**: [업무 가이드](base/tasks/index.md) — 4개 역할(일반 사용자 / Agent 개발자 / 시스템 관리자 / 거버넌스 담당자) 기준 Task → 챕터 매핑
2. **보조 진입**: 공통 / 사용자 / 관리자 탭 — 메뉴 구조 기준 상세 레퍼런스
3. 홈 페이지([base/index.md](base/index.md))는 업무 가이드 진입을 시각적으로 가장 강조

새 챕터·새 기능을 추가하면 반드시 **업무 가이드의 해당 역할 절**에도 "이 작업이 필요하다면 → 이 챕터" 항목을 추가한다. 메뉴 챕터만 만들고 Task 매핑을 빼면 사용자 만족도가 낮아진다.

### 8.2 개별 챕터 작성

- **메뉴 중심**: 솔루션의 실제 UI 메뉴 구조를 그대로 따라감. "대시보드" 같은 화면 한 개를 챕터 전체 주제로 두지 않음.
- 챕터 도입부 — 화면 진입 경로 + 사이드바/하위 메뉴 매핑 표.
- 각 절은 사이드바의 한 항목 단위.
- 운영 권장사항 절은 챕터 말미.
- "문의: {{vars.support_email}}" 절은 모든 챕터 마지막에 일관되게 유지.

## 9. 변경 이력

- 2026-05-13: 신규 작성. 거버넌스 챕터 용어 통일(에이전트플로우 → 에이전트) 정책 추가.
- 2026-05-13: 8.1 절 신설 — Task 우선 / 메뉴 보조 구조 원칙. 신규 [base/tasks/index.md](base/tasks/index.md) (홈과 공통 사이의 독립 탭) 페이지 추가. 홈 페이지가 업무 가이드를 메인 진입으로 안내.
- 2026-05-13: 업무 가이드를 1개 페이지 → 5개 파일(landing + 4개 역할별)로 분리. 각 역할이 좌측 사이드바에 페이지로 노출되어 발견성 향상. mkdocs i18n nav_translations 에 '업무 가이드 → Task Guide' 추가.
- 2026-05-13: 2.2 / 2.3 절 신설 — 일반 사용자 메뉴 범위(Agent 채팅·기술지원·대시보드)와 "대시보드는 권한 기반 공용 화면" 규칙. "개인용 대시보드" 표현 사용 금지.
- 2026-05-14: 2.2 절 보강 — 업무 가이드 탭(base/tasks/) 에서 대시보드 안내 제외. 대시보드 설명은 사용자/관리자 탭에만 둔다.
- 2026-05-14: 2.4 절 신설 — 역할별 특화 대시보드 (4개 뷰) 정책. 사용자 탭은 일반 사용자/Agent 개발자, 관리자 탭은 시스템 관리자/거버넌스 담당자로 분리하고, 업무 가이드 4개 역할 페이지에 각각 역할 뷰 앵커 링크. (5-13 의 "대시보드 안내 제외" 입장은 철회 — 역할별 뷰로 다시 안내함.)
- 2026-05-14: 1.2 절 신설 — 에이전트 vs 에이전트플로우 용어 구분. 사이드바 메뉴·챕터 제목은 "에이전트 만들기/에이전트 운영" (영문 "Creating an Agent / Agent Operations") 으로 통일. 본문에서 캔버스 구성·흐름을 설명할 때는 "에이전트플로우" 유지 가능. 파일명은 호환성 유지 차원에서 그대로.
- 2026-05-14: PII 보호 정책 vs 가드레일 모델 설정 분리. [base/admin/25-pii-policy.md](base/admin/25-pii-policy.md) 는 **AI 거버넌스 > 통제 정책 관리** 화면(`?view=gov-control-policy`, "AI 통제 정책")의 PII/금칙어/AI 위험도 등급 3개 탭을 다루고, 신설 [base/admin/25b-guardrail-model.md](base/admin/25b-guardrail-model.md) 는 **환경 설정 > 가드레일** 화면(`?view=admin-setting-guarder`)의 외부 Guard 모델 호출 설정을 다룬다. 이전 25-pii-policy 가 가드레일 화면 캡처를 잘못 참조하던 문제 정정.
- 2026-05-15: 7a 절 신설 — 화면 기준 자동 nav 제외 (require_view) 파이프라인. 캡처 스크립트가 stg 에서 view 가용 여부를 [screen-truth.json](screen-truth.json) 에 머지 기록 → `compose.mjs` 가 `.md` frontmatter `require_view` 와 매칭해 미존재 챕터를 awesome-pages `.pages` 로 nav 에서 제외. 페이지(.md)는 docs/ 에 남기므로 직접 URL 접근은 가능. 캐논컬 적용: [base/user/11a-task-planning.md](base/user/11a-task-planning.md) (require_view: main-planning).
- 2026-05-15: 7b 절 신설 — 변경 완료 기준. 매뉴얼·빌드 파이프라인 변경은 (1) 로컬 풀빌드 통과 + (2) 배포된 라이브 사이트 grep 검증 둘 다 끝난 뒤에야 "완료" 보고. compose 단독 실행은 검증 아님 — mkdocs 단까지 가야 플러그인 충돌이 드러남.
- 2026-05-15 (재정): 7a 절 nav 제외 메커니즘을 awesome-pages `.pages` 명시 nav 에서 mkdocs 1.5+ `not_in_nav:` 로 교체. 이전 방식은 mkdocs-static-i18n 의 `docs_structure: suffix` 와 충돌해 `NavEntryNotFound` 로 빌드가 실패했다. `not_in_nav:` 는 awesome-pages 가 만든 자동 nav 위에서도 동작하며 `.md`/`.en.md` 양쪽을 한 줄씩 등록해 두 언어 모두 사이드바·검색에서 제외한다.
