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

## 2. 솔루션 UI 사실 (Factual UI)

### 2.1 좌상단 모드 전환 버튼

- 실제 UI: **2개** (Agent 작업실 / 관리 설정)
- 권한 범위:
  - **Agent 작업실** — 일반 사용자 및 Agent 개발자
  - **관리 설정** — 시스템 관리자 및 거버넌스 담당자
- 다른 모드(AI 모델관리, AI 거버넌스 등)는 관리 설정 *내부* 메뉴이며 별도 모드 버튼이 아님.

적용 파일: [base/admin/20-admin-overview.md](base/admin/20-admin-overview.md), [base/user/10-getting-started.md](base/user/10-getting-started.md) (한·영 양쪽).

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

## 8. 챕터 구조 원칙

- **메뉴 중심**: 솔루션의 실제 UI 메뉴 구조를 그대로 따라감. "대시보드" 같은 화면 한 개를 챕터 전체 주제로 두지 않음.
- 챕터 도입부 — 화면 진입 경로 + 사이드바/하위 메뉴 매핑 표.
- 각 절은 사이드바의 한 항목 단위.
- 운영 권장사항 절은 챕터 말미.
- "문의: {{vars.support_email}}" 절은 모든 챕터 마지막에 일관되게 유지.

## 9. 변경 이력

- 2026-05-13: 신규 작성. 거버넌스 챕터 용어 통일(에이전트플로우 → 에이전트) 정책 추가.
