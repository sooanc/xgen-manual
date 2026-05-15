# Glossary

This glossary defines core terminology used throughout the manual. Feature-specific terms are revisited in their respective chapters.

## Solution Basics

| Term | Korean | Definition |
|---|---|---|
| Xgen | Xgen | Product name — natural-language AI work-automation solution |
| Agent Workspace | Agent 작업실 | User workspace for creating and operating agents and agentflows |
| Admin Center | 관리 설정 | Administrative area accessible only to users with **SuperUser** permission |
| Dashboard | 대시보드 | Landing screen showing status and statistics at a glance |

## Core Objects

| Term | Korean | Definition |
|---|---|---|
| Agent | 에이전트 | An AI work unit defined to automate a specific task |
| Agentflow | 에이전트플로우 | A defined AI workflow connecting multiple nodes — the unit of operational deployment |
| Node | 노드 | A single work unit within an agentflow (LLM call, tool execution, branching, etc.) |
| Canvas | 캔버스 | The area for visually editing an agentflow |
| Tool | 도구 | An external function or API the agent can invoke |
| MCP | Model Context Protocol | The standard protocol connecting AI models with external tools |
| Prompt | 프롬프트 | An instruction passed to an AI model (System / User prompts) |
| Authentication Profile | 인증 프로필 | A bundle of credentials (keys/tokens) used for external API integrations |

!!! note "Agent vs Agentflow"
    - **Agent**: A single AI work unit performing one task
    - **Agentflow**: A workflow weaving multiple agents and nodes — the deployment unit
    - The legacy term "Workflow" is no longer used.

## Knowledge Management

| Term | Korean | Definition |
|---|---|---|
| Collection | 컬렉션 | A grouping unit for documents in the knowledge store |
| Document | 문서 | The original asset (text, PDF, image) uploaded to a collection |
| Chunk | 청크 | A small text segment that a document is split into for embedding |
| Embedding | 임베딩 | The vector representation of a chunk that enables similarity search |
| Vector Database | 벡터 데이터베이스 | The DB that stores and searches embedding vectors (e.g., Qdrant) |
| Embedding Model | 임베딩 모델 | The model that converts text into vectors |
| Reranker | 리랭커 | The model that re-orders the initial vector search results |
| Ontology | 온톨로지 | Structured metadata defining concepts and relationships in documents |

## Execution and Chat

| Term | Korean | Definition |
|---|---|---|
| Chat | 채팅 | A conversational session between a user and an agent |
| Message | 메시지 | A single utterance in a chat (user or agent) |
| Execution | 실행 | One run of an agentflow that produced results |
| Tool Call | 도구 호출 | An event where the agent invoked a tool or function |
| Citations | 인용 | The source documents or assets referenced by an AI response |
| Logs | 로그 | Step-by-step detailed records of an execution |

## Deployment and Operations

| Term | Korean | Definition |
|---|---|---|
| Deploy | 배포 | Publishing an agentflow so users or external systems can invoke it |
| Embed | 임베드 | Code snippet that embeds an agentflow interface into an external page |
| Version | 버전 | The change-history unit for agentflows, prompts, and documents |
| Schedule | 스케줄 | Automated execution timing (daily, weekly, Cron, etc.) |
| Share | 공유 | Granting another user access to an item |
| Deployment Status | 배포 상태 | Lifecycle stage of an agentflow — Draft / Active / Inactive / Archived |

## Users and Permissions

| Term | Korean | Definition |
|---|---|---|
| Standard User | 일반 사용자 | Base user tier (`is_superuser: false`) — uses Agent Workspace for daily work. The top-left **Admin Center** mode-switch is not visible to this tier |
| SuperUser | 슈퍼유저 | Administrative tier (`is_superuser: true`) — accesses the top-left **Admin Center** mode and performs all administrative tasks (user/role management, system settings, AI governance) |
| Initial (root) SuperUser | 초기(루트) 슈퍼유저 | The very first SuperUser, created without authentication on the `/admin/create-superuser` screen when no SuperUser exists yet (right after initial installation). The data model and flag are identical to any other SuperUser; "root" is a *context label* meaning "created via the bootstrap path" — not a separate permission tier. Once the first SuperUser exists, that screen automatically redirects to `/login` and is no longer reachable |
| Role | 역할 | A bundle of permissions (e.g., "System Administrator", "Governance Officer", "Operator", "Analyst") |
| Permission | 권한 | An access grant for a specific feature or resource |

!!! note "Tier (two levels) vs Role (many) vs Permission (ABAC keys)"
    The permission system is split into **three independent layers**:

    - **Tier**: decided by the single `is_superuser` flag — two levels, Standard User and SuperUser.
    - **Role**: free-form labels defined by your organization — System Administrator, Governance Officer, Analyst, etc. Within the same SuperUser tier, roles control which sidebar menus you see.
    - **Permission**: ABAC keys such as `admin.user:read`. They are bundled into roles or granted directly to a user, gating sections / tabs / buttons.

    The full picture and the order in which gates evaluate is documented in [Role / Permission Management · Permission Model](../admin/22-role-permission.md#permission-model).

## Governance and Security

| Term | Korean | Definition |
|---|---|---|
| PII | Personally Identifiable Information | Information identifying an individual (national ID, phone, email, etc.) |
| Masking | 마스킹 | Hiding PII with characters such as asterisks (`*`) |
| Risk Level | 위험 등급 | Risk classification of an AI response or request |
| Audit Log | 감사 로그 | Retained records of user activity and system events |

## Notation Conventions

This manual follows the rules below.

- **Korean primary, English in parentheses**: First mention uses the form `에이전트플로우(Agentflow)`. Subsequent mentions in the same chapter use Korean only.
- **Unified terms**: Where the source code mixes terms (e.g., `Canvas` / `캔버스`), this manual standardizes on the Korean form.
- **Code and identifiers**: Use monospace — e.g., `customer.id`, `xgen.example.com`.
- **Language switch**: This manual defaults to Korean. Use the language toggle (🌐) at the top right of the page to switch to English.
