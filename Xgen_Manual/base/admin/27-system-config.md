# 전체 설정

본 챕터는 **관리 설정 → 환경 설정 → 전체 설정** 화면에서 다루는 시스템 환경 변수의 의미를 영역별로 설명합니다. 이 화면은 솔루션이 사용하는 **모든 환경 변수**를 한 페이지에서 통합 조회·편집하는 어드밴스드 뷰입니다.

!!! info "전용 메뉴를 먼저 사용하세요"
    일상적인 설정은 *LLM*, *검색 / 임베딩*, *가드레일* 같은 **개별 전용 메뉴**에서 더 쉽게 다룰 수 있습니다. 전체 설정 화면은 같은 값을 *키-값 단위로 정밀하게 조회·편집* 해야 할 때 사용합니다.

## 화면 구성

좌측 메뉴 **관리 설정 → 환경 설정 → 전체 설정**을 선택하면 화면이 열립니다. 상단에는 *"환경 변수명, 경로, 값으로 검색..."* 검색창이 있어 키 이름·점 표기 경로·값으로 즉시 필터링할 수 있습니다.

각 설정 항목은 카드로 나열되며 다음 정보를 보여줍니다.

| 표시 | 의미 |
|---|---|
| **환경 변수명** | 대문자 키 (예: `EMBEDDING_PROVIDER`) |
| **경로** | 점 표기 설정 경로 (예: `embedding.provider`) |
| **타입 배지** | 값 형식 — `Str`(문자열) / `Num`(숫자) / `Bool`(참·거짓) / `Json` / `Enum`(정해진 선택값) / `Array`(목록) |
| **설정됨 / 기본값 배지** | *설정됨* 은 기본값과 다르게 변경해 운영 중이라는 뜻이고, *기본값* 은 출고 기본값 그대로라는 뜻입니다 |
| **현재 값 / 기본값** | 현재 적용된 값과 출고 기본값을 함께 표시 |

일부 항목은 카드에 *무엇을 하는 설정인지* 설명과 선택 가능한 값 안내가 함께 표시됩니다. 비밀번호·API 키 등 민감한 값은 `********` 로 가려져 표시됩니다.

!!! warning "변경 전 영향 범위 확인 필수"
    전체 설정은 LLM·임베딩·가드레일·워크플로우 등 **솔루션 동작에 직접 영향을 주는 키**를 함께 노출합니다. 잘못된 값은 진행 중인 채팅·Agent 실행·지식 검색에 즉시 영향을 줄 수 있습니다. 변경 전 운영팀과 함께 검토하고, 같은 키를 전용 메뉴에서도 바꿀 수 있으므로 *어느 화면에서 변경했는지* 일관되게 기록하세요.

## 설정 영역 한눈에 보기

카테고리 탭은 환경에 따라 다를 수 있으나, 일반적으로 다음 영역으로 구성됩니다. 대부분은 전용 메뉴에서 더 쉽게 설정할 수 있으며, 해당 챕터를 함께 안내합니다.

| 영역 | 무엇을 설정하나 | 전용 메뉴 / 챕터 |
|---|---|---|
| 임베딩 / 검색 | 문서·질의를 벡터로 바꾸는 임베딩 모델과 리랭커 | [임베딩·벡터 검색 설정](24-embedding-settings.md) |
| 벡터 DB | 임베딩 벡터를 저장·검색하는 벡터 데이터베이스 연결 | [임베딩·벡터 검색 설정](24-embedding-settings.md) |
| LLM 제공자 | 채팅·추론에 사용하는 언어 모델 (OpenAI / Anthropic / Gemini / vLLM 등) | [LLM 설정](23-llm-settings.md) |
| 가드레일 | 유해 표현·금칙어·개인정보(PII) 필터 | [가드레일 모델 설정](25b-guardrail-model.md), [PII 보호 정책](25-pii-policy.md) |
| 비전 언어 | 이미지·문서를 이해(OCR)하는 모델 | — |
| 문서 처리 | 업로드 문서 안의 이미지에서 텍스트 추출 | — |
| 음성 (STT / TTS) | 음성↔텍스트 변환 | — |
| 애플리케이션 | 배포 승인·공유 정책·세션·보안 등 운영 정책 | (아래 [애플리케이션](#application) 상세) |
| 간편결재 연동 | 외부 전자결재 시스템 연동 | — | <!-- require_view: gs-cert-config-exclude -->
| 지식 보존(TTL) | 지식 자동 만료 기간 | — |
| 알림 | 슬랙·이메일·시스템 경보 발송 | — |
| GPU 인프라 | 온디맨드 GPU 임대·모델 서빙 | — |
| 모델 학습·실험 | 학습 서버·실험 추적 연동 | — |

아래에서 각 영역의 대표 설정을 자세히 설명합니다. 표의 *환경 변수명* 은 검색창에 그대로 입력하면 해당 항목으로 바로 이동할 수 있습니다.

## 임베딩 / 검색

문서와 질의를 벡터로 바꾸어 지식 검색(RAG)을 수행하는 영역입니다. 자세한 등록 절차는 [임베딩·벡터 검색 설정](24-embedding-settings.md)을 참고하세요.

| 환경 변수명 | 의미 |
|---|---|
| `EMBEDDING_PROVIDER` | 임베딩 제공자 선택. 외부 API(OpenAI 등) 또는 자체 호스팅 서버(custom) 중 선택합니다. |
| `CUSTOM_EMBEDDING_URL` / `CUSTOM_EMBEDDING_MODEL_NAME` | 자체 호스팅 임베딩 서버의 주소와 모델 식별자. |
| `OPENAI_EMBEDDING_MODEL_NAME`, `VOYAGE_*` | OpenAI·Voyage 등 외부 제공자를 쓸 때의 모델·키·URL. |
| `AUTO_DETECT_EMBEDDING_DIM` | 모델이 출력하는 벡터 차원을 자동 감지할지 여부. |
| `EMBEDDING_RERANKER_PROVIDER` / `EMBEDDING_RERANKER_MODEL` | 1차 검색 결과의 순위를 재조정하는 리랭커의 방식과 모델. |

!!! warning "임베딩 차원과 벡터 DB 차원은 일치해야 합니다"
    임베딩 모델이 출력하는 벡터 차원과 벡터 DB의 `벡터 차원(vector_dimension)` 값이 다르면 적재·검색이 실패합니다. 임베딩 모델을 바꿀 때는 차원도 함께 확인하고, 필요하면 기존 컬렉션을 재임베딩해야 합니다.

## 벡터 DB

임베딩 벡터를 저장하고 유사도 검색을 수행하는 벡터 데이터베이스 연결 정보입니다.

| 환경 변수명 | 의미 |
|---|---|
| `QDRANT_HOST` / `QDRANT_PORT` | 벡터 데이터베이스 호스트와 포트. |
| `QDRANT_VECTOR_DIMENSION` | 저장 벡터의 차원. **임베딩 모델의 출력 차원과 반드시 일치해야 합니다.** |
| `QDRANT_USE_GRPC` / `QDRANT_GRPC_PORT` | gRPC 통신 사용 여부와 포트. |
| `QDRANT_API_KEY` | 인증이 활성화된 경우의 접속 키. |

## LLM 제공자 { #llm }

채팅·추론에 사용하는 언어 모델 설정입니다. 제공자마다 *API 키 / 기본 모델 / 베이스 URL / temperature / 최대 토큰 / 요청 타임아웃* 항목이 같은 형태로 반복됩니다. 자세한 등록은 [LLM 설정](23-llm-settings.md)을 참고하세요.

| 환경 변수명 | 의미 |
|---|---|
| `DEFAULT_LLM_PROVIDER` | 기본으로 사용할 LLM 제공자 (OpenAI / Anthropic / Gemini / vLLM 등). |
| `LLM_AUTO_FALLBACK` | 기본 제공자 호출이 실패하면 다른 제공자로 자동 전환할지 여부. |
| `LLM_CONNECTION_TIMEOUT` / `LLM_MAX_RETRIES` | 연결 대기 시간(초)과 재시도 횟수. |
| `OPENAI_*` / `ANTHROPIC_*` / `GEMINI_*` / `VLLM_*` | 각 제공자별 API 키·기본 모델·베이스 URL·temperature·최대 토큰·타임아웃. |

`temperature` 는 응답의 창의성(0에 가까울수록 일관적, 1에 가까울수록 다양함)을, `최대 토큰(max_tokens)` 은 한 번에 생성하는 응답 길이 상한을 의미합니다.

## 가드레일 / 안전성

LLM 입력·출력의 위험성을 검사하는 가드레일 영역입니다. 자세한 설정은 [가드레일 모델 설정](25b-guardrail-model.md)과 [PII 보호 정책](25-pii-policy.md)을 참고하세요.

| 환경 변수명 | 의미 |
|---|---|
| `GUARDER_PROVIDER` | 가드 모델 방식 (사용 안 함 / 외부 / 자체 호스팅 등). |
| `GUARDER_API_BASE_URL` / `GUARDER_MODEL_NAME` | 가드 모델 서버 주소와 모델명. |
| `IS_AVAILABLE_GUARDER` | 유해성 가드 기능 사용 여부(on/off). |
| `IS_AVAILABLE_PIIS` | 개인정보(PII) 탐지·마스킹 사용 여부. |
| `IS_AVAILABLE_FORBIDDEN_WORDS` | 금칙어 필터 사용 여부. |
| `GUARDER_FAIL_OPEN` | 가드 모델 장애 시 처리. `true` 면 장애가 나도 서비스를 계속하고, `false` 면 차단합니다. |
| `GUARDER_RIGOROUS` | 엄격 모드 — 더 보수적으로 판정합니다. |

!!! note "가드 기능은 모델 연결과 사용 여부가 분리되어 있습니다"
    가드 모델 서버(`GUARDER_*`)가 지정되어 있어도 `IS_AVAILABLE_GUARDER` · `IS_AVAILABLE_PIIS` · `IS_AVAILABLE_FORBIDDEN_WORDS` 가 모두 꺼져 있으면 실제 검사는 동작하지 않습니다. 통제 정책을 적용하려면 모델 연결과 각 사용 여부를 함께 켜야 합니다.

## 비전 언어 모델

이미지·스캔 문서를 이해하거나 OCR로 텍스트화하는 모델 설정입니다.

| 환경 변수명 | 의미 |
|---|---|
| `VISION_LANGUAGE_MODEL_PROVIDER` | 사용할 비전 제공자 선택 (사용 안 함 / OpenAI / Anthropic / Gemini / vLLM / AWS 등). |
| `VISION_LANGUAGE_<제공자>_*` | 제공자별 API 키·베이스 URL·모델명·temperature·이미지 품질·배치 크기. |
| `VISION_LANGUAGE_VLLM_MODEL_TYPE` | 자체 서빙(vLLM) 모델의 유형. 유형에 따라 샘플링 기본값과 OCR 프롬프트가 자동 적용됩니다. |
| `VISION_LANGUAGE_VLLM_OCR_INSTRUCTION` | 비전 모델에 보낼 OCR 지시 프롬프트(비우면 기본값 사용). |

## 문서 처리

업로드한 문서 안의 이미지에서 텍스트를 추출하는 설정입니다. `DOCUMENT_PROCESSOR_IMAGE_TEXT_MODEL_PROVIDER` 로 사용할 모델 제공자를 고르고, 제공자별 베이스 URL·키·모델명을 지정합니다. 사용하지 않으면 `no_model` 로 둡니다.

## 음성 (STT / TTS)

| 환경 변수명 | 의미 |
|---|---|
| `IS_AVAILABLE_STT` / `STT_PROVIDER` | 음성→텍스트(STT) 사용 여부와 제공자. |
| `IS_AVAILABLE_TTS` / `TTS_PROVIDER` | 텍스트→음성(TTS) 사용 여부와 제공자. |

각 제공자별 모델명·디바이스(cpu/gpu) 항목이 함께 제공됩니다. 음성 기능을 사용하지 않는 환경에서는 사용 여부를 꺼 둡니다.

## 애플리케이션 { #application }

배포 승인·공유·세션·보안 등 솔루션 운영 정책을 정하는 영역으로, **거버넌스·보안에 직접 영향**을 줍니다. 변경 시 특히 주의가 필요합니다.

| 환경 변수명 | 의미 |
|---|---|
| `DEPLOYMENT_MODE` | 에이전트 외부 배포 승인 절차. *즉시 배포 / 관리자 승인 1단계 / 관리자+거버넌스 2단계* 중 선택합니다. 2단계 승인 흐름은 [Agent 운영](32-agent-operations.md#agent-mgmt-deploy-approval)·[AI 거버넌스](29-governance-dashboard.md#agent-approval)에서 다룹니다. |
| `REQUIRE_RE_DEPLOY_ACCEPT` | 워크플로우를 수정·저장하면 기존 배포 승인을 무효화하고 재승인을 요구할지 여부. |
| `SHARE_POLICY` | 공유와 배포의 연계 방식. *독립* 또는 *배포 완료 상태에서만 공유 효력* 중 선택합니다. | <!-- require_view: gs-cert-config-exclude -->
| `SHARE_PERMISSION_MODE` | 공유 권한 범위. *조회·실행만* 또는 *역할별 읽기·쓰기 허용* 중 선택합니다. | <!-- require_view: gs-cert-config-exclude -->
| `SHARE_ON_UNDEPLOY` | 배포가 해제될 때 기존 공유를 *일시정지 / 삭제 / 유지* 중 어떻게 처리할지. | <!-- require_view: gs-cert-config-exclude -->
| `AGENT_DEV_PLAN_REQUIRED` | 배포(요청) 시 Agent 개발 기획서 선택을 필수로 할지 여부. |
| `ADMIN_IP_ACL` | 슈퍼관리자 로그인·요청을 허용할 IP 화이트리스트. 비어 있으면 IP 검사를 하지 않습니다. |
| `ACCESS_TOKEN_EXPIRE_MIN` | 로그인 후 세션이 자동 만료되는 최대 수명(분). |
| `INACTIVITY_TIMEOUT_MIN` | 일정 시간 활동이 없으면 세션을 강제 만료하는 비활동 타임아웃(분). `0` 이면 비활성. |
| `REFRESH_TOKEN_EXPIRE_DAYS` | 자동 재로그인이 가능한 기간(일). 만료되면 다시 로그인해야 합니다. |
| `WORKFLOW_MAX_WORKERS` | 워크플로우 동시 실행 수 상한. |
| `SIDEBAR_CONFIG` | 사이드바 메뉴 구성(JSON). 보통 *환경 설정 → 사이드바* 화면에서 토글로 관리합니다. |
| `PATHFINDER_DOWNLOAD_URL` | Agent 설계 시작 화면의 패스파인더 배너에서 열 다운로드 링크. | <!-- require_view: gs-cert-config-exclude -->

<!-- require_view_start: gs-cert-config-exclude -->
## 간편결재 연동

에이전트 배포 승인을 외부 전자결재(간편결재) 시스템과 연동하는 설정입니다.

| 환경 변수명 | 의미 |
|---|---|
| `APPROVAL_ENABLED` | 외부 간편결재 연동 사용 여부. 끄면 솔루션 내부 자체 승인만 동작합니다. |
| `APPROVAL_HOST` | 간편결재 API 베이스 URL. |
| `APPROVAL_CLIENT_ID` / `APPROVAL_CLIENT_SECRET` | 사전 발급된 연동 인증 정보(시크릿은 민감 값). |
| `APPROVAL_CALLBACK_BASE_URL` | 결재 결과를 받을 콜백 베이스 URL. |
| `APPROVAL_ADMIN_APPROVERS` | 1차 결재자(플랫폼 관리자) 후보 이메일 목록. |
| `APPROVAL_GOVERNANCE_APPROVERS` | 2차 결재자(거버넌스 관리자) 후보 이메일 목록. 2단계 승인 모드에서 사용합니다. |
<!-- require_view_end -->

## 지식 보존 (TTL)

업로드한 지식의 자동 만료 정책입니다.

| 환경 변수명 | 의미 |
|---|---|
| `KNOWLEDGE_TTL_MAX_DAYS` | 보존 기간으로 설정할 수 있는 최대 일수. |
| `KNOWLEDGE_TTL_DEFAULT_DAYS` | 신규 지식의 기본 보존 일수. |
| `KNOWLEDGE_TTL_GRACE_PERIOD_DAYS` | 만료 후 실제 삭제까지의 유예 기간(일). |

## 알림

시스템 이벤트·경보를 외부로 알리는 설정입니다.

| 환경 변수명 | 의미 |
|---|---|
| `NOTIFICATION_ENABLED` | 알림 발송 전체 사용 여부. |
| `SLACK_WEBHOOK_URL` | 슬랙 알림 수신 주소. |
| `EMAIL_SMTP_HOST` / `EMAIL_SMTP_PORT` / `EMAIL_USERNAME` | 이메일 발송용 SMTP 서버 정보. |
| `CPU_ALERT_THRESHOLD` / `MEMORY_ALERT_THRESHOLD` | 자원 사용률 경보 임계치(%). | <!-- require_view: gs-cert-config-exclude -->
| `NOTIFICATION_*` (통합 메시징) | 사내 통합 메시징 시스템 연동 정보(호스트·클라이언트·인터페이스 식별자 등). |

## GPU 인프라 · 모델 서빙

외부 GPU를 임대해 모델을 서빙하는 자동화와, 추가 추론 서버 연결 설정입니다. 시스템 설치·운영 단계에서 인프라 담당자가 구성하는 항목입니다.

| 환경 변수명 | 의미 |
|---|---|
| `VAST_*` | 온디맨드 GPU 임대(VAST) 설정 — 사용할 컨테이너 이미지, 가격 상한·디스크·GPU RAM 같은 인스턴스 선택 조건, 자동 종료·타임아웃. |
| `VLLM_*` (vast) | 임대한 GPU에서 띄울 vLLM 서버 옵션 — 서빙 모델, 최대 컨텍스트 길이, GPU 메모리 사용률, 병렬화 옵션. |
| `SGL_*` | SGLang 추론 서버 연결. | <!-- require_view: gs-cert-config-exclude -->
| `SESSION_STATION_*` | 세션·대화 상태 저장 서비스 연결과 보존 시간. |
| `WORKFLOW_EXECUTION_TIMEOUT` | 워크플로우 1회 실행 제한 시간(초). |

## 모델 학습 · 실험 · 외부 연동

| 환경 변수명 | 의미 |
|---|---|
| `TRAINER_HOST` / `TRAINER_PORT` | 모델 학습 서비스 연결 정보. |
| `MLFLOW_*` | 실험·모델 추적(MLflow) 연결 — 트래킹 URL, 기본 실험, 캐시 위치. |
| `HF_TOKEN` / `IS_AVAILABLE_HUGGINGFACE` / `HUGGINGFACE_*` | HuggingFace 모델 허브 연동 — 토큰, 사용 여부, API·캐시·오프라인 모드. |
| `AWS_*` | AWS Bedrock 호출용 자격 증명·리전·엔드포인트. |

## 운영 권장사항

- **개별 전용 메뉴를 우선 사용** — LLM·임베딩·가드레일 등은 전용 메뉴가 입력 검증·연결 테스트를 함께 제공합니다. 전체 설정은 정밀 조회·예외 편집에 사용합니다.
- **변경 전 백업·기록** — 값을 바꾸기 전 현재 값을 기록해 두고, 변경 사유와 화면을 함께 남깁니다. 모든 변경은 감사 로그에 기록됩니다.
- **민감 값 취급 주의** — API 키·시크릿·토큰은 별도 보안 채널로만 전달하고 화면 공유·캡처 시 노출되지 않도록 합니다.
- **사용 여부 토글 확인** — 가드레일·음성·알림 등은 모델·연결을 지정해도 *사용 여부(`IS_AVAILABLE_*`, `*_ENABLED`)* 를 켜야 실제로 동작합니다.

## 문의

전체 설정 관련 문의는 Xgen 솔루션 관리자에게 문의해 주세요.
