# 노드 목록

본 챕터는 관리 설정의 **노드 관리** 화면(view ID `admin-node-management`) 을 다룹니다. 솔루션에 등록된 모든 노드(에이전트플로우 구성 단위) 를 카테고리별로 탐색하고 검색할 수 있습니다.

> Agent 개발자가 캔버스에서 노드를 추가하는 절차는 [에이전트 만들기 · 노드 추가](../user/12-agentflow-create.md#노드-추가) 챕터를 참고합니다.

## 화면 진입

좌측 사이드바 **관리 설정 → Agent 운영 → 노드 관리** 를 선택합니다. 페이지 헤더는 "노드 관리 — 에이전트플로우 노드를 관리하고 탐색합니다." 로 표시됩니다.

## 화면 구성

| 영역 | 내용 |
|---|---|
| 상단 컨트롤 | **테이블** / **트리** 보기 전환 토글, 검색창 (카테고리·기능·노드 이름·태그 부분 일치) |
| 본문 | 선택한 보기에 따라 테이블 또는 트리 형태로 노드 카탈로그 표시 |

## 노드 카테고리

루트 카테고리 **XGen** 아래에 10개의 기능 그룹(Function) 이 있고, 각 그룹은 다음과 같은 노드들로 구성됩니다. 각 노드는 캔버스로 드래그하여 에이전트플로우에 추가할 수 있습니다.

> 환경별로 배포된 Agent 가 *에이전트* 그룹 하위에 추가될 수 있어, 실제 노출 항목은 환경에 따라 다소 다릅니다. 본 챕터는 stg 표준 환경 기준입니다.

### 모델 컨텍스트 프로토콜 (`mcp`) — 20개

| 노드 이름 | ID | 설명 |
|---|---|---|
| 모든 MCP 불러오기 | `mcp/MCPLoader` | MCP(Model Context Protocol) 서버에 연결하여 모든 도구를 한꺼번에 로드. 활성 MCP 세션 선택 |
| Tavily 웹 검색 | `mcp/tavily_search_mcp` | AI에 최적화된 검색 엔진 Tavily 로 웹 검색. 도메인 필터링·요약 답변 생성·원본 콘텐츠 추출 지원 |
| Brave 웹 검색 | `mcp/brave_search_mcp` | Brave Search API 로 실시간 웹 검색. 국가·기간(일/주/월/년) 필터링과 결과 수 조절 |
| EPG 다음 MCP | `mcp/epg_daum_mcp` | DAUM 에서 한국 홈쇼핑 TV 편성표 조회. 방송 시간·프로그램명·채널 정보 (캐시 지원) |
| EPG 네이버 MCP | `mcp/epg_naver_mcp` | NAVER 에서 한국 홈쇼핑 TV 편성표 조회. DAUM EPG 와 동일 기능, NAVER 데이터 소스 |
| GitHub MCP | `mcp/github_mcp` | 자연어로 GitHub 리포지토리 관리 — 리포지토리·이슈·풀 리퀘스트·코드 검색. App 인증 |
| GitLab MCP | `mcp/gitlab_mcp` | 자연어로 GitLab 프로젝트 관리 — 프로젝트·브랜치·파일·이슈·머지 리퀘스트 |
| 통합 웹 검색 | `mcp/meta_search_mcp` | AI 가 관련 웹사이트를 자동 탐색·크롤링해 종합 정보 수집 (API 키 불필요) |
| 네이버 데이터랩 MCP | `mcp/naver_datalab_mcp` | 검색 트렌드·쇼핑 인사이트. 인기 검색어·검색량 추이·쇼핑 카테고리 분석 |
| 네이버 뉴스 MCP | `mcp/naver_news_mcp` | 네이버 뉴스 API 로 한국 뉴스 검색. 정확도순/날짜순 정렬. 네이버 오픈 API 인증 |
| PostgreSQL MCP | `mcp/postgresql_mcp` | PostgreSQL DB 에 직접 연결하여 읽기 전용 조회. 호스트·포트·사용자명·비밀번호·DB명 입력 |
| DB 연결하기 | `mcp/DatabaseLoader` | 사전 설정 DB 연결 로드. AI 가 list_tables / get_schema / query 도구 자동 사용 |
| 상품 검색 | `mcp/product_search_mcp` | 인기 상품·예정 방송·지난 방송·현재 판매 중 상품 검색. 결과 수·이미지 옵션 |
| Slack MCP | `mcp/slack_mcp` | Slack 워크스페이스 연결 — 메시지 전송·채널 관리·대화 검색. Slack User Token 필요 |
| Nano Banana MCP | `mcp/nano_banana_mcp` | Google Gemini 로 이미지 생성·편집. Flash·Pro 모델, 1K~4K 해상도 |
| Atlassian MCP | `mcp/atlassian_mcp` | Jira 이슈·Confluence 문서 자연어 관리. Cloud·On-premise 모두 지원 |
| Microsoft 365 MCP | `mcp/ms365_mcp` | Microsoft 365 연결 — Outlook 메일·캘린더·Teams·OneDrive·Planner·Excel |
| API 컬렉션 로더 | `mcp/APICollectionLoader` | 관리자 등록 API 컬렉션(ToolGraph) 로드. AI 가 search_tools / call_tool 자동 사용 |
| 웹 브라우저 자동 조작 | `mcp/WebAutomationMCP` | Playwright 브라우저 제어로 웹 작업 자동화. 엑셀 데이터 → 웹 폼 자동 입력, 저장 전 확인 |
| DB 조회하기 | `mcp/DatabaseReader` | 사전 설정 DB 연결에 SQL 쿼리 직접 실행. PostgreSQL·Oracle·Informix 지원 |

### 에이전트 (`agents`) — 3개

| 노드 이름 | ID | 설명 |
|---|---|---|
| 에이전트 Planflow | `agents/planflow` | 결정론적 Plan-and-Execute 에이전트. 의도 분석 → graph 기반 계획 → 순차 실행 → 자연어 응답 |
| 에이전트 Xgen | `agents/xgen` | 워크플로우의 핵심 AI 두뇌. 도구 자동 선택·사용. OpenAI·Anthropic·Google·AWS 모델 |
| 에이전트 Harness | `agents/run_harness` | 저장된 하네스 워크플로우를 한 단계 에이전트로 실행 (system_prompt·도구·전략·RAG·DB·MCP) |

### API 로더 (`api_loader`) — 2개

| 노드 이름 | ID | 설명 |
|---|---|---|
| API 직접 등록하기 | `api_loader/APICallingTool` | 커스텀 REST API 도구를 만들어 Agent 에 연결. 응답 데이터에서 필요한 부분만 추출하는 필터링 |
| 등록된 API 불러오기 | `api_loader/APIToolLoader` | 관리자 등록 API 도구를 드롭다운에서 선택해 즉시 사용 |

### 문서 로더 (`document_loaders`) — 3개

| 노드 이름 | ID | 설명 |
|---|---|---|
| 정보 검색 노드 | `document_loaders/VectorDBContext` | 통합 문서 검색. 검색 모드 선택으로 벡터 DB 검색 방식 설정. Agent RAG Context 입력 |
| 온톨로지 검색 | `document_loaders/OntologySearch` | 미리 빌드된 지식그래프에서 SPARQL + SCS 컨텍스트로 관련 트리플·소스 청크 검색 |
| 정보 검색 노드 (260517) | `document_loaders/VectorDBContextV2` | 정보 검색 노드 재설계 버전(2026-05-17). 꼭 필요한 옵션만 노출, 세부 튜닝값은 best-practice 기본값 |

### 파일 시스템 (`file_system`) — 3개

| 노드 이름 | ID | 설명 |
|---|---|---|
| 테이블 데이터 연결하기 | `file_system/table_data_mcp` | AI 에게 표 형식 데이터(엑셀·CSV) 작업 능력 부여. 자연어로 스프레드시트 읽기·분석·변환 |
| 내 파일 조회·수정 권한 부여 | `file_system/filesystem_storage` | AI 에게 파일 시스템 접근 권한 부여. 지정된 저장 영역에서 파일 탐색·읽기·생성·수정 |
| 문서 양식 편집기 | `file_system/document_adapter` | DOCX·PPTX·HWPX 양식 문서 편집. 9개 도구 (inspect_document / get_cell / get_shapes / render_template …) |

### 기억 (`memory`) — 1개

| 노드 이름 | ID | 설명 |
|---|---|---|
| 멀티턴 DB | `memory/db_memory_v3` | 가장 지능적인 대화 메모리. 신뢰도 낮은 응답 자동 필터링, 시간 경과 가중치 감쇠(Decay), 관련 과거 대화 스마트 선별 |

### 라우터 (`router`) — 1개

| 노드 이름 | ID | 설명 |
|---|---|---|
| 조건 분기 | `router/Router` | 키 값에 따라 데이터를 서로 다른 경로로 분기. 키 값별 출력 핸들이 동적으로 생성 |

### 도구 (`tools`) — 14개

| 노드 이름 | ID | 설명 |
|---|---|---|
| A2UI v0.9 UI 명세 도구 | `tools/a2ui_v0_9` | A2UI v0.9 UI 명세 작성 도구. 카탈로그 탐색·컴포넌트 점검·명세 검증으로 안전한 UI JSON 산출 |
| PDF 파일 생성하기 | `tools/Certificate PDF Tool` | 증명서 PDF 자동 생성. 수료증·상장·이수증 |
| AI 다음 행동 선택기 | `tools/hierarchy_tools` | 매니저-작업자 Agent 계층 구조. 매니저가 전문 작업자에게 하위 작업 위임 + 결과 종합 |
| 이미지 불러오기 | `image_loader` | URL·업로드 이미지를 Agent images 입력으로 전달해 시각적 분석 |
| 파일 업로드 | `input_files` | 사용자 파일 업로드 받기. 문서·스프레드시트·이미지 처리 워크플로우 시작점 |
| AI 기본 행동 규칙 | `input_template` | `{{variable}}` 플레이스홀더 동적 프롬프트. 재사용 가능한 프롬프트 패턴 |
| PC 명령어 실행기 | `tools/local_cli_tool` | 사전 허용된 CLI 명령어 실행 (Tauri 데스크톱 앱 전용). Git·Node.js·Python 안전 실행 |
| AI 작업 계획기 | `tools/agent_planner` | 단계별 작업 계획 생성. 복잡한 작업을 단계로 분해 → Agent plan 입력으로 연결 |
| 샌드박스 코드 실행 | `tools/sandbox_exec` | 격리된 일회용 KVM VM 에서 코드 실행. 계산·데이터 변환·로직 검증 |
| 입력 형식 지정 | `input_schema_provider` | AI 입력 JSON 스키마 정의. 구조화된 입력이 필요한 노드에 연결 |
| 응답 형식 지정 | `output_schema_provider` | AI 응답 출력 JSON 스키마 정의. 일관·파싱 가능한 응답 구조화 |
| 입력 변환기 | `tools/value_processor` | 구조화 입력(JSON·XML·YAML·CSV·텍스트·정규식)에서 원하는 값 추출/변환 |
| 워크벤치 프롬프트 | `tools/workbench_prompt` | Workbench Prompt Studio 의 중앙 관리·버전관리 프롬프트를 워크플로우로 끌어오기 (dev·stg·prd) |
| 다른 워크플로우 연결하기 | `tools/workflow_tool` | 저장된 다른 워크플로우를 도구로 사용. Agent 가 하위 워크플로우 호출 — 모듈형 설계 |

### 시작 노드 (`startnode`) — 1개

| 노드 이름 | ID | 설명 |
|---|---|---|
| 사용자 질문 입력 | `input_string` | 사용자 텍스트 입력 받기 또는 고정 텍스트 설정. 워크플로우 시작점 |

### 종료 노드 (`endnode`) — 3개

| 노드 이름 | ID | 설명 |
|---|---|---|
| AI 답변 출력 | `tools/print_agent_output` | Agent 출력을 화면 표시. Agent 출력에 연결해 워크플로우 UI 응답 노출 |
| 포맷 출력 | `tools/print_format` | 커스텀 템플릿으로 데이터 포맷 표시. 점수·타임스탬프·반복 실행 세부·할 일 목록 구조화 |
| 이메일 전송 | `tools/send_email` | AI 에게 이메일 전송 능력 부여. SMTP 설정 → Agent 가 이메일 작성·전송 |

## 사용 절차

### 트리에서 노드 탐색

1. 상단 보기 토글에서 **트리** 선택
2. 좌측 노드 트리에서 카테고리 펼치기
3. 항목 클릭 시 우측 패널에 노드 상세 정보 표시 (입출력 스펙·태그·설명)

### 테이블에서 노드 탐색

1. 상단 보기 토글에서 **테이블** 선택
2. 컬럼 정렬·필터로 노드 일괄 비교
3. 행 클릭 시 동일하게 우측 패널에 상세 표시

### 검색

상단 검색창에 다음 항목을 입력하면 부분 일치 결과가 즉시 필터링됩니다.

- **카테고리** — 예: `Agent`, `Tool`
- **기능** — 예: `검색`, `호출`
- **노드 이름** — 예: `Document Loader`
- **태그** — 노드에 부여된 라벨

## 운영 권장사항

- **카테고리 명명 일관성** — 사용자 정의 노드를 추가할 때 기존 카테고리 분류를 유지합니다. 새 카테고리는 충분한 노드 수가 누적된 뒤 분리합니다.
- **태그 활용** — 검색 효율을 위해 노드마다 *기능*·*도메인*·*소유 부서* 태그를 부여합니다.
- **배포된 Agent 노드 모니터링** — **Agent** 카테고리 하위 항목은 환경에 배포된 에이전트와 연동됩니다. 미배포·비활성 Agent 가 노출되지 않도록 정기 점검을 권장합니다.

## 관련 챕터

- [에이전트 만들기 · 노드 추가](../user/12-agentflow-create.md#노드-추가) — 사용자가 캔버스에서 노드를 추가하는 절차
- [Agent 운영](32-agent-operations.md) — Agent 운영 그룹의 다른 메뉴 (Agent 관리·채팅 모니터링 등)
- [MCP 라이브러리](28-mcp-market.md) — MCP 카테고리 하위 노드 등록·관리

## 문의

노드 관리 화면 관련 문의는 {{vars.support_email}} 로 연락해 주세요.
