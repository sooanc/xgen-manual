# Agent 개발자

> 자기 업무를 자동화할 Agent를 **직접 설계·배포**하는 사용자. 일반 사용자 메뉴에 더해 **Agent 제작·도구 연동·지식관리** 영역 사용 권한이 부여됩니다.

## 첫 Agent를 만들고 배포하는 전체 흐름

1. **작업실 진입** — Agent 작업실 → Agent 설계 → [Agent 작업실 진입](../user/12-agentflow-create.md#agent-작업실-진입)
2. **노드 구성** — Start Node 부터 캔버스에 노드 추가·연결 → [에이전트 만들기](../user/12-agentflow-create.md)
3. **외부 도구 연결** — API Tool / MCP 노드 등록 → [API 도구](../user/12-agentflow-create.md#add-node)
4. **품질 평가** — 테스트 데이터로 응답 품질 확인 → [에이전트 운영](../user/13-agentflow-operations.md#에이전트-품질-분석)
5. **배포 요청 보내기** — Agent 목록 → 카드 더보기 메뉴 → **배포 정보** → 모달의 **배포 토글 ON** → [배포 요청 보내기](../user/13-agentflow-operations.md#request-deployment)
6. **시스템 관리자 배포 승인 대기** — 시스템 관리자가 Agent 관리 화면에서 승인하면 카드 배지가 *배포됨* 으로 갱신 → [이후 흐름](../user/13-agentflow-operations.md#dual-approval-flow)
7. **거버넌스 담당자 거버넌스 승인 대기** — 거버넌스 담당자가 AI 거버넌스 → 에이전트플로우 승인 화면에서 위험·PII·정책을 검토해 승인하면 비로소 사용자에게 노출 → [이후 흐름](../user/13-agentflow-operations.md#dual-approval-flow) <!-- require_view: gov-monitoring -->
7. **시스템 관리자 배포 승인 통과** — 시스템 관리자가 Agent 관리 화면에서 승인하면 비로소 사용자에게 노출 → [이후 흐름](../user/13-agentflow-operations.md#dual-approval-flow) <!-- require_view: no-governance -->

## 로그인 직후 내 역할에 맞는 메인 화면을 보고 싶다
- 시작 위치: 로그인 직후 자동 진입 (또는 좌상단 **XGEN** 로고)
- 절차: [대시보드 · Agent 개발자 뷰](../user/18-dashboard.md#agent-개발자-뷰)
- Agent 개발자에게는 일반 사용자 위젯에 더해 **내가 만든 Agent 운영 지표·승인 대기 현황** 등 제작·배포 관점의 위젯이 함께 노출됩니다.

## Agent에게 내부 문서 및 데이터를 참고하게 하고 싶다 (RAG)
- 시작 위치: 좌측 사이드바 **지식관리 → 컬렉션**
- 절차: [지식관리](../user/15-knowledge.md)

## 자주 쓰는 프롬프트를 저장·공유하고 싶다
- 시작 위치: 좌측 사이드바 **Agent 제작 → Agent 프롬프트**
- 절차: [프롬프트 관리](../user/16-prompt.md)

## 외부 시스템(API) 자격증명을 안전하게 관리하고 싶다
- 시작 위치: 좌측 사이드바 **도구 연동 → 인증 프로필**
- 절차: [인증 프로필](../user/17-auth-profile.md)

## 내 Agent에 배포 요청을 보내고 싶다
- 시작 위치: Agent 작업실 → **Agent 제작 → Agent 목록** → 본인 카드의 **⋯** 메뉴 → **배포 정보**
- 절차: [배포 요청 보내기](../user/13-agentflow-operations.md#request-deployment)
- 핵심: DeploymentModal 의 **배포 토글 ON** 한 번으로 시스템 관리자 큐에 등록.
- 공유 배포 시 *Agent 개발 기획서* 선택 필수. <!-- require_view: admin-agent-dev-plan -->

## 배포 요청 후 진행 상태를 확인하고 싶다
- 시작 위치: [대시보드 · Agent 배포/승인 상태](../user/18-dashboard.md) 위젯 (Agent 개발자 뷰)
- 절차: 위젯의 5개 카운터로 *배포 승인 대기 / 배포 승인 거절 / 거버넌스 승인 대기 / 거버넌스 승인 거절 / 배포·거버넌스 승인완료* 추적 <!-- require_view: gov-monitoring -->
- 절차: 위젯의 카운터로 *배포 승인 대기 / 배포 승인 거절 / 배포 승인완료* 추적 <!-- require_view: no-governance -->
- 상세 흐름: [이중 승인 흐름](../user/13-agentflow-operations.md#dual-approval-flow) <!-- require_view: gov-monitoring -->
- 상세 흐름: [배포 승인 흐름](../user/13-agentflow-operations.md#dual-approval-flow) <!-- require_view: no-governance -->
- 참고: 시스템 관리자(1단계) + 거버넌스 담당자(2단계) 모두 통과해야 사용자에게 노출. 한쪽만 통과한 상태는 미노출. <!-- require_view: gov-monitoring -->
- 참고: 시스템 관리자 배포 승인을 통과하면 사용자에게 노출. <!-- require_view: no-governance -->

## 내 Agent가 거버넌스에서 반려되었다 <!-- require_view: gov-monitoring -->
## 내 Agent 배포가 거부되었다 <!-- require_view: no-governance -->
- 시작 위치: [대시보드 · Agent 배포/승인 상태](../user/18-dashboard.md) → 위젯의 *거버넌스 승인 거절* 카운터 클릭, 또는 카드의 **배포 정보** 재진입 <!-- require_view: gov-monitoring -->
- 시작 위치: [대시보드 · Agent 배포/승인 상태](../user/18-dashboard.md) → 위젯의 *배포 승인 거절* 카운터 클릭, 또는 카드의 **배포 정보** 재진입 <!-- require_view: no-governance -->
- 절차: 반려 사유(`governance_review_comment`)를 확인 → 에이전트 수정 → [배포 요청 보내기](../user/13-agentflow-operations.md#request-deployment) 의 0단계부터 재요청 <!-- require_view: gov-monitoring -->
- 절차: 거부 사유를 확인 → 에이전트 수정 → [배포 요청 보내기](../user/13-agentflow-operations.md#request-deployment) 의 0단계부터 재요청 <!-- require_view: no-governance -->
- 거버넌스 담당자 측 검토 기준: [AI 거버넌스 · 에이전트 승인](../admin/29-governance-dashboard.md#agent-approval) <!-- require_view: gov-monitoring -->

## 외부 API/MCP 서버를 도구로 등록하고 싶다
- 시작 위치: 좌측 사이드바 **도구 연동 → API Tool**
- 절차: [에이전트 만들기 - 노드 추가](../user/12-agentflow-create.md#add-node)

## 운영 중인 Agent의 호출 통계·실패율을 보고 싶다
- 시작 위치: 좌측 사이드바 **Agent 운영 설정**
- 절차: [에이전트 운영](../user/13-agentflow-operations.md)
