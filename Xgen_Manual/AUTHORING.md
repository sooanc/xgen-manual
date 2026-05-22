# 매뉴얼 작성 가이드

본 파일은 `Xgen_Manual/base/**/*.md` 매뉴얼 본문을 편집·재작성할 때 매번 참고해야 하는 규칙을 모은 곳입니다. AI 어시스턴트 메모리는 휘발성이 있어 세션 간 보존되지 않으므로, 영속적 규칙은 모두 이 파일에 모읍니다. 새 규칙이 정해지면 즉시 여기에 추가하세요.

> **작업 시작 전 항상 이 파일을 먼저 읽으세요.**

> **함께 따라야 할 가이드** — 본 파일은 *무엇을* 적을지에 관한 사실 규칙을 다룹니다. *어떻게* 적을지에 관한 문체·표현 규칙은 [TONE_AND_MANNER.md](TONE_AND_MANNER.md) 를 별도로 따릅니다. 두 파일을 모두 따르되, 사실 정합성(본 파일) 이 표현 스타일(TONE) 보다 우선합니다.

## 0. 최우선 규칙 — stg 라이브가 단일 진실원 { #stg-truth }

> 본 절은 다른 모든 규칙을 *압도* 한다. 어긋날 때는 무조건 본 절을 따른다.

### 0.1 진실 우선순위

| 순위 | 출처 | 비고 |
|---|---|---|
| **1** | `https://stg-xgen.x2bee.com` 라이브 화면 | 메뉴·라벨·구조·기능 가용성의 **유일한 정답** |
| 2 | `screen-truth.json` 의 `views.*.ok` / `notFound` | stg 캡처가 자동으로 채운 view 가용성 캐시 (수동 수정 금지) |
| 3 | XGEN-STG 소스 코드 | *참고만*. 소스와 stg 가 다르면 stg 가 맞다 |

소스에 컴포넌트가 존재해도 stg 에 노출되지 않는 메뉴는 **존재하지 않는 메뉴로 취급한다.**
이유: 매뉴얼은 사용자가 보는 화면을 설명하는 것이지, 코드의 *잠재적* 기능을 설명하는 것이 아니다. 소스만 보고 적으면 사용자가 매뉴얼을 따라 클릭했을 때 "그 메뉴 없는데요" 신뢰 붕괴가 발생한다.

### 0.2 챕터를 편집·신규 작성하기 전 — Pre-Flight 체크

순서대로 모두 통과해야 키보드를 두드린다. 하나라도 모르면 stg 에 직접 들어가서 확인한다.

1. **본 파일 (AUTHORING.md) 을 먼저 읽었는가** — 메모리에 없을 가능성을 가정하고 매 세션 새로 읽는다.
2. **편집 대상 챕터가 다루는 메뉴/화면이 stg 에 실제 존재하는가**
   - 확인 1: 사이드바에서 그 메뉴가 보이는지 직접 클릭
   - 확인 2: 또는 `screen-truth.json` 의 해당 `view` 키가 `ok: true` 인지
   - `notFound: true` 인 view 면 → 그 view 를 *참조하는* 모든 본문(사이드바 매핑 표, "관련 챕터" 링크, 절 내 진입 경로) 에서 즉시 제거해야 한다. nav 자동 제외만 믿지 말 것 — 다른 챕터의 본문 텍스트는 여전히 남아 있을 수 있다.
3. **편집 대상 절의 라벨·진입 경로가 stg 와 일치하는가** — 위 1·2 가 OK 라도 절 단위 라벨이 바뀌었을 수 있다. 의심 가면 캡처로 확인.

### 0.3 "라이브에 없는 메뉴" 가 발견되면 — 즉시 처리

매뉴얼 편집 중 stg 와 어긋난 메뉴/섹션이 보이면 **그 자리에서** 처리한다 (별도 티켓 만들지 말 것).

- 사이드바 매핑 표 (예: 11-getting-started.md 의 "사용자 사이드바 요약") 에서 해당 행 삭제
- 그 view 를 단독으로 다루는 챕터 `.md` 파일은 삭제 (require_view 자동 제외만으로는 충분하지 않음 — 파일 자체를 두면 다른 챕터 링크·검색·관련 항목에서 다시 표면화됨)
- 다른 챕터 본문에서 그 메뉴를 진입 경로로 인용한 부분은 더 일반적인 진입 경로로 다시 적거나 절째 삭제

### 0.4 새 매뉴얼 절을 채우기 전 — 캡처 우선

가능하면 **먼저 stg 화면을 캡처/녹화** 한 뒤 그 결과를 보고 본문을 적는다. "라벨이 이러이러할 것" 이라는 추측으로 본문을 먼저 쓰고 캡처를 뒤에 맞추면, 라벨이 다를 때 본문을 모두 수정해야 한다.

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

### 2.0 매뉴얼의 단일 진실원 — *stg 화면*

매뉴얼이 묘사하는 모든 메뉴·라벨·구조는 **stg 라이브 화면(`https://stg-xgen.x2bee.com`) 에 실제 노출되는 것** 만이 정답이다. 소스 코드와 stg 화면이 다르면 **stg 화면을 기준** 으로 적는다.

이를 자동화하는 파이프라인은 7a 절(`require_view` + `screen-truth.json`) 에 정리되어 있으며, 캡처 스크립트가 *view 가용 여부* 를 stg 에서 직접 확인해 빌드 nav 에서 제외한다.

**소스를 *참고는 해도* 그대로 옮겨 적지 말 것** — 다음 세 가지가 서로 다른 표현이라는 점을 항상 분리해서 다뤄야 한다.

| 구분 | 어디서 정의 | 사용자 눈에 보이는가? | 매뉴얼에 적는 방식 |
|---|---|---|---|
| **사이드바 라벨** | i18n locale (예: `admin.sidebar.governance.operationHistory.title`) | ✅ 사이드바 텍스트 | *우선 기준* — 표·본문에서 "사이드바 라벨" 로 인용 |
| **페이지 헤더** | 화면 컴포넌트 내부 텍스트 | ✅ 화면 상단 | 사이드바 라벨과 *다를 수 있음*. 다르면 "진입 시 헤더는 …" 으로 별도 명시 |
| **백엔드 adminSection 식별자** | 권한 카테고리 (예: `gov-service-history`, `admin-governance`) | ❌ (UI 그룹 라벨로 노출 안 됨) | 매뉴얼 본문에 *사용자가 보는 영역명처럼* 적지 말 것. 필요 시 백엔드 권한 매트릭스에서만 인용 |

특히 **AI 거버넌스** 처럼 백엔드는 4개 카테고리(`gov-risk-review` / `gov-inspection` / `gov-service-history` / `gov-control-policy`) 로 묶이지만 프론트엔드는 단일 `admin-governance` 아코디언으로 머지하는 케이스가 있다. 매뉴얼은 머지 후의 *4개 평면 사이드바 아이템* 을 그대로 적어야 한다.

**적용 파일** (현 시점):
- [base/admin/29-governance-dashboard.md](base/admin/29-governance-dashboard.md) — 사이드바 4개 평면 아이템 표, 각 H2 헤더에 명시 anchor (`#risk-review` / `#inspection` / `#audit-tracking` / `#control-policy`) 한·영 동일.

**근거**: 2026-05-18 사용자 확인. 매뉴얼이 *AI 감사·추적 관리 (Service / Operation History) — 서비스 변경 이력, 운영 이력* 으로 적은 표가 실제 stg 사이드바에는 *AI 서비스 변경 이력* 단일 아이템 한 줄로만 노출되어 사용자가 매뉴얼 위치를 찾지 못함. 소스 검증: [apps/web/src/features/admin-feature-registry.ts](../apps/web/src/features/admin-feature-registry.ts) `GOVERNANCE_MERGE_SOURCE_SECTION_IDS` + `GOVERNANCE_SIDEBAR_ITEM_IDS_ALLOWED` + `GOVERNANCE_ITEM_ORDER` 화이트리스트가 4개 아이템만 허용.

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

### 2.6 에이전트 서비스화는 **이중 승인** 통과가 필수

배포 요청된 에이전트가 사용자에게 서비스되려면 **두 명의 SuperUser** 가 각각의 화면에서 승인해야 한다. 한쪽만 통과하면 서비스 활성화되지 않는다.

| 단계 | 담당 역할 | 화면 | 데이터 모델 | API |
|---|---|---|---|---|
| 0. 배포 요청 | Agent 개발자 | Agent 작업실 → 에이전트 운영 (자기 에이전트) | `inquire_deploy: true` | `updateAgentflow(... inquire_deploy: true ...)` |
| 1. **배포 승인** | **시스템 관리자** | 관리 설정 → Agent 운영 → **Agent 관리** 카드 액션 (`admin-agentflow-management-orchestrator`) | `is_accepted` + `enable_deploy` → `is_deployed: true` | `updateAgentflowAdmin(... enable_deploy: true, inquire_deploy: false, is_accepted: true ...)` |
| 2. **거버넌스 승인** | **거버넌스 담당자** | 관리 설정 → AI 거버넌스 → **에이전트플로우 승인** (`gov-agentflow-approval`) | `is_governance_accepted` + `governance_reviewed_by` + `governance_review_comment` | `reviewGovernanceAgentflow(workflow_id, isAccepted, comment)` |
| ✅ 서비스 가능 | — | — | `is_deployed: true` **AND** `is_governance_accepted: true` | (자동) |

**적용 규칙**:

- "에이전트 승인" 을 한 단계 절차처럼 단일하게 서술하지 말 것. 항상 **배포 승인(시스템 관리자) + 거버넌스 승인(거버넌스 담당자)** 두 단계로 분리해 명시한다.
- 시스템 관리자 측 챕터([base/admin/32-agent-operations.md](base/admin/32-agent-operations.md))의 "Agent 관리" 절에는 *배포 승인* 절차(요청 감지 → 카드 액션 → 승인/거부 토스트) 를 반드시 포함.
- 거버넌스 측 챕터([base/admin/29-governance-dashboard.md](base/admin/29-governance-dashboard.md))의 "에이전트 승인" 절은 *이중 승인의 2단계* 임을 도입부에 명시하고, 시스템 관리자 승인이 선행되어야 거버넌스 큐에 노출됨을 안내.
- 사용자/Agent 개발자 입장의 [base/user/13-agentflow-operations.md](base/user/13-agentflow-operations.md) 에서 배포 요청을 다룰 때도 "요청 후 ① 시스템 관리자 ② 거버넌스 담당자 두 단계 승인을 거쳐 서비스가 활성화된다" 는 흐름을 한 줄로 안내한다.
- "관리자 승인만으로 배포된다" / "거버넌스 승인만 받으면 끝" 같은 단편적 표현 금지.
- 대시보드 위젯([features/dashboard-components/src/widgets/agentflow/approval-pipeline-widget.tsx](../features/dashboard-components/src/widgets/agentflow/approval-pipeline-widget.tsx)) 의 5-stat 라벨(배포 승인 대기 / 배포 승인 거절 / 거버넌스 승인 대기 / 거버넌스 승인 거절 / 배포·거버넌스 승인완료) 와 일관된 용어를 사용한다.

**근거**: 2026-05-15 사용자 확인 + 소스 검증.
- [packages/api-client/src/agentflow.ts](../packages/api-client/src/agentflow.ts) `AgentflowContent` — `is_accepted`, `is_deployed`, `inquire_deploy`, `is_governance_accepted` 4개 플래그가 별개로 존재.
- [features/admin-agentflow-management-view/src/index.tsx](../features/admin-agentflow-management-view/src/index.tsx) — `inquire_deploy === true` 인 카드에만 dropdown "승인 / 거부" 액션 노출. 승인 시 `enable_deploy: true, inquire_deploy: false` 로 업데이트.
- [features/admin-agentflow-management-view/src/AgentflowEditModal.tsx](../features/admin-agentflow-management-view/src/AgentflowEditModal.tsx) — `is_accepted` (승인 상태) 토글이 별도 존재 — 운영 중 일시 비활성화 스위치 역할.
- [features/gov-agentflow-approval/src/index.tsx](../features/gov-agentflow-approval/src/index.tsx) — 거버넌스 측 승인 큐. `reviewGovernanceAgentflow(workflow_id, isAccepted, comment)` 로 `is_governance_accepted` 처리.
- [features/dashboard-components/src/widgets/agentflow/approval-pipeline-widget.tsx](../features/dashboard-components/src/widgets/agentflow/approval-pipeline-widget.tsx) — 대시보드가 "2-단계 승인 파이프라인" 으로 명시. 5-stat 라벨이 위 흐름과 1:1 매칭.

**적용 파일**:
- 본문: [base/admin/32-agent-operations.md](base/admin/32-agent-operations.md), [base/admin/29-governance-dashboard.md](base/admin/29-governance-dashboard.md), [base/user/13-agentflow-operations.md](base/user/13-agentflow-operations.md)
- 업무 가이드 (각 역할별 task → 챕터 매핑): [base/tasks/02-agent-developer.md](base/tasks/02-agent-developer.md), [base/tasks/03-system-admin.md](base/tasks/03-system-admin.md), [base/tasks/04-governance-officer.md](base/tasks/04-governance-officer.md)
- 각 `.en.md` 영문판 동일.

**3개 명시 anchor (한·영 동일)**:
- [base/user/13-agentflow-operations.md](base/user/13-agentflow-operations.md) — `#request-deployment` (배포 요청 보내기), `#dual-approval-flow` (이중 승인 흐름), `#deployment` (배포 절 전체)
- [base/admin/32-agent-operations.md](base/admin/32-agent-operations.md) — `#agent-mgmt-deploy-approval` (시스템 관리자 1차 배포 승인)
- [base/admin/29-governance-dashboard.md](base/admin/29-governance-dashboard.md) — `#agent-approval` (거버넌스 2차 승인)

업무 가이드와 본문 챕터 모두 위 6개 anchor 로만 cross-link 한다. 한글 헤더 슬러그(`_1` `agent-1` 등) 는 mkdocs 정책에 따라 휘발성이므로 직접 참조 금지.

### 2.5 권한 등급 — Standard User / SuperUser 2단계 + 초기(루트) SuperUser

XGEN 의 권한 등급은 **`is_superuser` 플래그 하나로 결정되는 2단계** 다. 이전 매뉴얼이 사용하던 "일반 사용자 / 관리자(Administrator) / 최고 관리자(Superuser)" 3단계 표현은 폐기.

| 구분 | 한국어 | 영문 | `is_superuser` | 설명 |
|---|---|---|---|---|
| 일반 | 일반 사용자 | **Standard User** | `false` | Agent 작업실 기본 사용자. 좌상단 모드 전환에서 "관리 설정" 버튼 비노출 |
| 관리 | 슈퍼유저 | **SuperUser** | `true` | 좌상단 **관리 설정** 모드 접근 권한자. 사용자/역할 관리, 시스템 설정, AI 거버넌스 등 모든 관리 기능 수행 |

**"루트 사용자(root user)" 라는 별도 권한 등급은 존재하지 않는다.** 흔히 루트 SuperUser 라 부르는 계정은 다음을 가리킨다:

- **초기(루트) SuperUser**: 시스템 최초 설치 후 SuperUser 가 한 명도 없을 때, `/admin/create-superuser` 화면에서 **인증 없이 1회만** 생성되는 첫 SuperUser. 생성되고 나면 같은 화면은 자동으로 `/login` 으로 리다이렉트되어 다시 노출되지 않음.
- 같은 화면 출처([apps/web/src/app/admin/create-superuser/page.tsx](../apps/web/src/app/admin/create-superuser/page.tsx), [features/admin-create-superuser/src/index.tsx](../features/admin-create-superuser/src/index.tsx)) 의 API: `checkSuperuser()` → `GET /api/admin/base/superuser`, `createSuperuser()` → `POST /api/admin/base/create-superuser`.
- 생성된 계정의 데이터 모델은 평범한 SuperUser 와 동일 (`is_superuser: true`). 구분은 **"최초 1회 부트스트랩 경로로 만들었는가"** 일 뿐, 등급/플래그는 같다. 매뉴얼에서 "루트" 라는 단어를 쓸 때는 이 *부트스트랩 SuperUser* 를 가리킴을 명시할 것.
- 이후 추가 SuperUser 는 **관리 설정 → 사용자 관리** 모달의 *유형* 필드에서 `Superuser` 를 선택해 생성 (`user_type: 'superuser'` → `is_superuser: true`).

**적용 규칙**:

- 본문에서 "관리자(Administrator)" 와 "최고 관리자(Superuser)" 를 별개 등급으로 구분하지 않는다. 둘 다 **SuperUser** 한 등급으로 통합.
- 관리자 영역 내부의 **역할(Role)** 분리는 그대로 유지: 동일 SuperUser 권한자라도 "시스템 관리자(System Administrator)" / "거버넌스 담당자(Governance Officer)" 역할에 따라 사이드바 노출 메뉴가 달라진다. 이는 권한 *등급* 이 아닌 역할 레이어임을 명시할 것.
- "권한 등급 변경" 표·UI 컬럼은 **Standard User ↔ SuperUser** 2개 값만 사용.
- 첫 사용 체크리스트의 "초기 superuser 계정 활성화" 항목은 *`/admin/create-superuser` 화면으로 첫 SuperUser 를 등록* 하는 절차로 풀어쓴다 — 별도 OS 레벨 root 계정 활성화를 의미하지 않음.
- Agent 개발자(Agent Developer)는 권한 등급이 아닌 **Standard User 위에 부여되는 역할/유형** 이다. "Agent 개발자 권한 필요" 라는 표현은 등급이 아닌 역할 부여를 의미함을 잊지 말 것.

**근거**: 2026-05-15 사용자 확인 + 소스 검증.
- [packages/types/src/index.ts](../packages/types/src/index.ts) `User` / `AdminUser` 인터페이스는 `is_superuser: boolean` 단일 플래그만 사용 (다른 `is_admin` / `user_type` 는 deprecated 호환 필드).
- [features/admin-users/src/UserEditModal.tsx](../features/admin-users/src/UserEditModal.tsx) 의 사용자 유형 Select 는 `'standard'` / `'superuser'` 두 값만 노출.
- 별도 `is_root` / `is_first` / `bootstrap` 같은 사용자 플래그는 프론트엔드 전역에서 존재하지 않음.

**적용 파일**:
- 본문: [base/common/01-glossary.md](base/common/01-glossary.md), [base/admin/20-admin-overview.md](base/admin/20-admin-overview.md), [base/admin/21-user-management.md](base/admin/21-user-management.md), [base/admin/22-role-permission.md](base/admin/22-role-permission.md), [base/user/10-getting-started.md](base/user/10-getting-started.md)
- 각 `.en.md` 영문판 동일.

**권한 모델 명시 anchor (한·영 동일 — `{ #slug }` 부여)**:
- [base/admin/22-role-permission.md](base/admin/22-role-permission.md) — `#permission-model` (3 레이어 도입부, 단일 진실원)
- [base/admin/20-admin-overview.md](base/admin/20-admin-overview.md) — `#permission-tiers` (권한 등급 2단계 표)
- [base/user/10-getting-started.md](base/user/10-getting-started.md) — `#user-types` (Agent 작업실 사용자 유형 표)

권한 등급·역할·권한 어디를 다룰 때든 [base/admin/22-role-permission.md#permission-model](base/admin/22-role-permission.md#permission-model) 로 보내 3 레이어 도입부를 단일 진실원으로 만든다. 다른 챕터(`20-admin-overview` 권한 등급 절, `01-glossary` 사용자·권한 표) 에는 *짧은 정의 + cross-link* 만 둔다 — 정의를 중복 작성하면 정합이 깨진다.

한국어 헤더 슬러그(`_1`, `_3` 등) 는 mkdocs 정책에 따라 휘발성이므로 cross-link 에 직접 사용 금지. 항상 명시 anchor 만 참조한다.

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
- 단어별 첫 글자 + `OOO` 치환 (예: `샘플은행` → `샘OOO`, `sample-co` → `sOOO-cOOO`).
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
- "문의: Xgen 솔루션 관리자" 절은 모든 챕터 마지막에 일관되게 유지.

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
- 2026-05-15: [base/user/10-getting-started.md](base/user/10-getting-started.md) 를 "시작하기" 가벼운 튜토리얼에서 "Agent 작업실 개요" 본격 레퍼런스 챕터로 재구성 (한·영 양쪽). 관리자 탭의 [base/admin/20-admin-overview.md](base/admin/20-admin-overview.md) 와 평행한 구조 — 접속 → 권한 등급 → 사이드바 6개 섹션 매핑 표 → 첫 사용 체크리스트 → 운영 원칙. 파일명은 호환성 유지 차원에서 그대로. 인바운드 링크([base/user/index.md](base/user/index.md) 학습 경로, [base/tasks/01-standard-user.md](base/tasks/01-standard-user.md) "처음 어디부터") 의 링크 텍스트도 새 챕터명으로 갱신.
- 2026-05-15: 2.6 절 신설 — 에이전트 서비스화는 **시스템 관리자 배포 승인 + 거버넌스 담당자 거버넌스 승인** 두 단계 모두 통과해야 한다는 규칙. 데이터 모델은 `inquire_deploy` → `is_accepted` + `is_deployed` → `is_governance_accepted` 의 별도 플래그 4개로 추적되며, 양쪽이 모두 true 일 때만 서비스됨. 소스 근거: [features/admin-agentflow-management-view/src/index.tsx](../features/admin-agentflow-management-view/src/index.tsx), [features/gov-agentflow-approval/src/index.tsx](../features/gov-agentflow-approval/src/index.tsx), [features/dashboard-components/src/widgets/agentflow/approval-pipeline-widget.tsx](../features/dashboard-components/src/widgets/agentflow/approval-pipeline-widget.tsx) ("2-단계 승인 파이프라인" 주석). 적용: [base/admin/32-agent-operations.md](base/admin/32-agent-operations.md) 에 시스템 관리자 측 배포 승인 절 신설, [base/admin/29-governance-dashboard.md](base/admin/29-governance-dashboard.md) 의 에이전트 승인 절을 *2단계* 임을 명시하도록 보강.
- 2026-05-15 (보강): 각 역할별 챕터에 **절차** 가 누락 없도록 다음을 추가/재작성. 사용자(13-agentflow-operations)의 "배포" 절을 *배포 요청* 절차(카드 dropdown → 배포 정보 → 배포 토글 ON) 로 재작성하고 5-stat 위젯과 매칭되는 진행상태 추적 표 추가; admin/32-agent-operations 의 배포 승인 절차를 *사이드바 진입 → 배지 식별 → 상세 → ⋯ 메뉴 승인/거부 → 결과 확인* 5단계로 구체화 + 배지 색 해석표; admin/29-governance-dashboard 의 거버넌스 승인 절차를 *사이드바 진입 → 4-stat 카드 필터 → 테이블 컬럼 → 상세 모달 → 코멘트 모달* 5단계로 구체화. 업무 가이드 3개(tasks/02-agent-developer, tasks/03-system-admin, tasks/04-governance-officer) 와 각 영문판에도 동일 cross-link 보강. 소스 근거: [features/canvas-deploy/src/index.tsx](../features/canvas-deploy/src/index.tsx) (DeploymentModal · `enable_deploy` 토글이 단일 트리거), [features/main-agentflow-management-storage/src/index.tsx](../features/main-agentflow-management-storage/src/index.tsx) (deploy-info 액션은 `inquireDeploy` 가 true 인 카드를 *pending* 상태로 표기).
- 2026-05-18 (라이브 전수조사): playwright MCP 로 stg 라이브 (`https://stg-xgen.x2bee.com/dashboard`) 를 일반 사용자(`ssoony.choi@gmail.com`) + 시스템 관리자(`x2bee_ds@plateer.com`) 양쪽 계정으로 직접 진입해 우측 고정 패널 = 사용자·관리자 양쪽 모두 **3개** (최신 업데이트 / 자주 묻는 질문 / **관리자 문의**) 임을 확인. 매뉴얼이 *4개 항목* + *"최근 서비스 요청 목록 TOP 3"* + *"내 문의"* 로 적은 부분이 stg 라이브와 다르므로 [base/user/18-dashboard.md](base/user/18-dashboard.md) 의 우측 패널 표를 3개로 재작성하고, [base/admin/30-dashboard.md](base/admin/30-dashboard.md) 의 "우측 패널 의미 차이" 절·운영 활용·트러블슈팅 표를 stg 실제 라벨로 정정. 우측 패널 표에 명시 anchor `#right-panel` 부여(한·영 동일). 본문에 "기획서·이전 매뉴얼과의 차이" note 로 갭 원인 명문화.
- 2026-05-18: 2.0 절 신설 — *매뉴얼의 단일 진실원은 stg 화면* 규칙을 7a 절에서 끌어와 본문 최상단에 명시. *사이드바 라벨 ≠ 페이지 헤더 ≠ 백엔드 adminSection 식별자* 분리 규칙 + AI 거버넌스 4개 평면 아이템 케이스를 영속화. [base/admin/29-governance-dashboard.md](base/admin/29-governance-dashboard.md) 의 "사이드바 구성" 표를 *영역 4개* 에서 *사이드바 평면 4개 아이템* 으로 재작성하고 4개 H2 헤더에 명시 anchor (`#risk-review` / `#inspection` / `#audit-tracking` / `#control-policy`, 한·영 동일) 부여. 인바운드 한글 슬러그 cross-link 들도 새 anchor 로 일괄 재맵핑 (20-admin-overview, 25-pii-policy, 30-dashboard, tasks/04-governance-officer; 한·영).
- 2026-05-15 (보강): 2.5 절 — *3 레이어 권한 모델* 도입부([base/admin/22-role-permission.md#permission-model](base/admin/22-role-permission.md#permission-model)) 신설. 등급(Tier) / 역할(Role) / 권한(Permission) 의 독립 레이어 구조 + 게이트 평가 순서 + Agent Developer / 초기 SuperUser 경계 정리를 단일 챕터에 모음. [20-admin-overview.md](base/admin/20-admin-overview.md) 의 *권한 등급* 절과 [01-glossary.md](base/common/01-glossary.md) 의 *사용자와 권한* note 는 짧은 정의 + cross-link 만 두어 정의 중복을 피함. 영문판 [20-admin-overview.en.md](base/admin/20-admin-overview.en.md) 헤더에 `{ #permission-tiers }` 명시 anchor 부여.
- 2026-05-15: 2.5 절 신설 — 권한 등급을 **`is_superuser` 플래그 단일 기준 Standard User / SuperUser 2단계** 로 정정. 이전 "일반 사용자 / 관리자(Administrator) / 최고 관리자(Superuser)" 3단계 표현은 폐기. "루트 사용자" 라는 별도 등급은 존재하지 않으며, 최초 설치 시 `/admin/create-superuser` 화면에서 1회만 생성되는 **초기(루트) SuperUser** 가 그 자리에 해당함을 명시. 관리자 내부의 "시스템 관리자 / 거버넌스 담당자" 구분은 권한 등급이 아닌 *역할* 레이어로 유지. 소스 근거: [packages/types/src/index.ts](../packages/types/src/index.ts), [features/admin-users/src/UserEditModal.tsx](../features/admin-users/src/UserEditModal.tsx), [features/admin-create-superuser/src/index.tsx](../features/admin-create-superuser/src/index.tsx). 적용 파일: [base/common/01-glossary.md](base/common/01-glossary.md), [base/admin/20-admin-overview.md](base/admin/20-admin-overview.md), [base/admin/21-user-management.md](base/admin/21-user-management.md), [base/admin/22-role-permission.md](base/admin/22-role-permission.md), [base/user/10-getting-started.md](base/user/10-getting-started.md) 및 영문판.
- 2026-05-19: [TONE_AND_MANNER.md](TONE_AND_MANNER.md) 신설 — *"솔루션 가이드 자동화" 스크립트* 와 본문 직접 편집 시 따라야 할 톤·매너 규칙(문체·용어·UI 문구·금지 표현·권장 톤 7개) 분리. AUTHORING.md 최상단에 cross-link 추가 — 본 파일은 *무엇을* (사실 정합성), TONE_AND_MANNER 는 *어떻게* (표현 스타일). 충돌 시 AUTHORING 우선.
