# Admin Console Overview

This chapter covers what a system administrator needs to know upon first logging into the solution. Detailed feature operations are covered in subsequent chapters.

## Access

The admin console is not reached via a direct URL. Click the **Admin Center** button — one of the two mode-switch buttons (**Agent Workspace** / **Admin Center**) at the top-left of the solution — to enter the admin area.

1. Log in with an account that has administrator privileges
2. From the top-left mode-switch buttons (**Agent Workspace** / **Admin Center**), click **Admin Center**
3. You land on the **Admin Control Center** overview, which presents the responsibilities, primary menus, and operations guide in three steps (STEP 1–3)

![Admin Center entry — the Admin Control Center screen. STEP 1 Understanding Admin Areas (Governance Officer / System Administrator split), STEP 2 Pick a Main Menu (Users/Access Control, Agent Operations, AI Governance, etc. — 9 cards), with the 11-section admin sidebar on the left](images/admin-entry.png)

The main column is organized into three steps:

| Step | Content |
|---|---|
| STEP 1 — Understanding Admin Areas | Explains the split between "Governance Officer" and "System Administrator" responsibilities. AI Governance is governed by a separate permission system and is intentionally decoupled from general system administration. |
| STEP 2 — Pick a Main Menu | Exposes the 9 admin areas (Users / Access Control, Agent Operations, AI Governance, Environment, System Status, Data Management, MCP Management, Service Operations, Knowledge Operations) as cards. Clicking a card opens that area's default screen. |
| STEP 3 — Operations Guide | Quick links to the operations recipes: first-time checklist, daily operations, system-security review, and AI governance policy operation. |

See the [Admin Console Layout](#admin-console-layout) table below for the full menu breakdown.

!!! note "Administrator Privileges Required"
    All features in the admin console are available only to accounts with **Administrator** or **Superuser** privileges. Standard users do not see the menu at all.

## Permission Tiers

The solution uses a three-tier permission model.

| Tier | Korean | What they can do |
|---|---|---|
| Standard User | 일반 사용자 | Use Agent Workspace. Edit and share own items |
| Administrator | 관리자 | Manage users/roles, configure system, monitor operations |
| Superuser | 최고 관리자 | Everything plus permission delegation and system reset |

New administrators are granted the **Administrator** tier by default. We recommend keeping at least one **Superuser** for the system, ideally on a separate account isolated from daily operations.

## Admin Console Layout

The Admin sidebar is organized into the following 9 sections (some may be hidden depending on permissions).

| Section | Korean | Main Menus | Manual Chapter |
|---|---|---|---|
| Users / Access Control | 사용자 / 접근제어 | User Management, Role / Permission Management | [User Management](21-user-management.md), [Role / Permission](22-role-permission.md) |
| Agent Operations | Agent 운영 | Agent Management, Chat Monitoring, User Tokens, Node Management, Prompt Templates, User Feedback, Response Quality Evaluation, Agent Retention Analysis, Task Planning | [Agent Operations](32-agent-operations.md) |
| AI Governance | AI 거버넌스 | AI Risk Assessment, Inspection History, Service Change History, **Control Policy Management** | [PII Policy](25-pii-policy.md), [AI Governance](29-governance-dashboard.md) |
| Environment | 환경 설정 | General, **LLM**, Infrastructure, **Search / Embedding**, Audio, **Guardrail**, Sidebar | [LLM Settings](23-llm-settings.md), [Embedding Settings](24-embedding-settings.md), [Guardrail Model Setup](25b-guardrail-model.md) |
| System Status | 시스템 상태 | **System Monitoring**, System Inspection, Log Viewer | [System Monitor](26-system-monitor.md), [Audit Log](27-audit-log.md) |
| Data Management | 데이터 관리 | Database, DB Connection, Batch Jobs, **Data Audit Log** | [Data Management](33-data-management.md) |
| MCP Management | MCP 관리 | **MCP Library**, MCP Operations & Monitoring | [MCP Library](28-mcp-market.md) |
| Service Operations | 서비스 운영 | Announcements, FAQ, 1:1 Admin Inquiry | [Tech Support Handling](31-tech-support-handling.md) |
| Knowledge Operations | 지식 운영 | Collection Management | [Knowledge Operations](34-knowledge-operations.md) |

!!! info "Menu Naming"
    Menu names on screen may vary slightly between solution versions and user permissions. This manual is based on {{product.name}} {{product.version}}; **bolded** menus are those this manual covers.

## First-Run Checklist

Items the operations team should verify immediately after deployment. Detailed steps for each item are in their respective chapters.

- [ ] **Activate the Superuser account** — Confirm the initial superuser account created at install time can log in
- [ ] **Connect an LLM provider** — Choose a provider matching company policy (OpenAI / Anthropic / on-premise vLLM, etc.) and register the API key or endpoint
- [ ] **Connect an embedding model + vector DB** — Required for knowledge search to work
- [ ] **Review PII policy** — Confirm the items targeted for automatic masking. Financial-sector deployments should add custom regex patterns
- [ ] **Define roles** — Define organization-specific roles (e.g., "Analyst", "Operator") and assign them to users
- [ ] **Set system monitor thresholds** — Configure CPU/memory/disk thresholds that trigger alerts
- [ ] **Audit log retention policy** — Confirm the retention window meets relevant regulations (typically 5+ years for finance)

## Operating Principles

General principles to follow when working in the admin console.

1. **Check impact before changes** — System configuration changes affect all users immediately. LLM and embedding setting changes in particular can affect ongoing chats and executions.
2. **Audit awareness** — All administrator actions are recorded in the audit log. Periodic review is recommended.
3. **Least privilege** — Grant users only the minimum permissions needed for their work. Revoke temporary privilege escalations after the task.
4. **Backup first** — Export the current state before bulk changes to collections or prompts.

## Contact

For questions about administrator features, please contact {{vars.support_email}}.
