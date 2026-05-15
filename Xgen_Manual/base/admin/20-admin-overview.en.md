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

!!! note "SuperUser Privileges Required"
    Admin Center is the **SuperUser-only area** that integrates user permissions, agent operations, AI governance, system environment, and data/knowledge assets. It is accessible only to accounts with **SuperUser** privileges (`is_superuser: true`); Standard Users do not see the **Admin Center** mode-switch button at the top-left at all.

    SuperUser is further split into two **roles** on top of the same permission tier. Even within the same SuperUser tier, the sidebar menu scope varies depending on which role is assigned.

    | Role | Access Scope |
    |---|---|
    | **Governance Officer** | Can view the AI Governance menu along with system operations status and management metrics. Granted only to those with internal control / audit responsibility. |
    | **System Administrator** | Has access to operations, environment, and data administration menus, but cannot access the AI Governance menu. |

    The AI Governance menu is provided only to those with internal control and audit responsibility, and is operated separately from system administration privileges. This separation lets the platform run reliably under enterprise requirements for internal control, audit response, and access governance.

## Permission Tiers { #permission-tiers }

The solution uses a **two-tier permission model** decided by a single `is_superuser` flag. For the full *Tier / Role / Permission* three-layer picture, see [Role / Permission Management · Permission Model](22-role-permission.md#permission-model).

| Tier | Korean | `is_superuser` | What they can do |
|---|---|---|---|
| Standard User | 일반 사용자 | `false` | Use Agent Workspace. Edit and share own items |
| SuperUser | 슈퍼유저 | `true` | Manage users/roles, configure system, run AI governance, monitor operations, delegate permissions, reset the system |

New users are created as **Standard User** by default. Granting SuperUser privilege is allowed only to an existing SuperUser. Keep at least one SuperUser for the system, ideally on a separate account isolated from daily operations.

!!! info "Initial (root) SuperUser — created once during initial installation"
    Right after the solution is first installed, no SuperUser exists yet. While that is the case, a one-time **initial SuperUser creation screen** at `/admin/create-superuser` is reachable without authentication, where you can register the very first SuperUser. This first account is commonly referred to as the **initial (root) SuperUser**.

    - Once the first SuperUser is created, the same screen automatically redirects to `/login` and is never reachable again.
    - Subsequent SuperUsers are added through the [User Management](21-user-management.md) flow described in this chapter.
    - The word "root" is just a context label meaning *"created via the bootstrap path"*; the data model and permission flag are identical to any other SuperUser (`is_superuser: true`). Do not confuse this with an OS-level root account.

## Admin Console Layout

The Admin sidebar has 9 groups and 28 menus in total (some may be hidden depending on permissions). The mapping from each menu to its manual chapter is below.

| Group | Menu | Manual Chapter |
|---|---|---|
| Users / Access Control | User Management | [User Management](21-user-management.md) |
| Users / Access Control | Role / Permission | [Role / Permission](22-role-permission.md) |
| Agent Operations | Agent Management | [Agent Operations](32-agent-operations.md) |
| Agent Operations | Chat Monitoring | [Agent Operations · Chat Monitoring](32-agent-operations.md#chat-monitoring) |
| Agent Operations | User Tokens | [Agent Operations](32-agent-operations.md) |
| Agent Operations | Node Management | [Agent Operations](32-agent-operations.md) |
| Agent Operations | Prompt Templates | [Agent Operations](32-agent-operations.md) |
| Agent Operations | User Feedback | [Agent Operations · User Feedback](32-agent-operations.md#user-feedback) |
| Agent Operations | Response Quality Evaluation | [Agent Operations](32-agent-operations.md) |
| Agent Operations | Agent Retention Analysis | [Agent Operations](32-agent-operations.md) |
| Agent Operations | Task Planning | [Agent Operations · Task Planning](32-agent-operations.md#task-planning) |
| AI Governance | AI Risk Assessment | [AI Governance · Risk Review](29-governance-dashboard.md#risk-review) |
| AI Governance | Inspection History | [AI Governance · Inspection](29-governance-dashboard.md#inspection) |
| AI Governance | Service Change History | [AI Governance · Audit & Tracking](29-governance-dashboard.md#audit-tracking) |
| AI Governance | Control Policy Management | [PII Policy](25-pii-policy.md), [AI Governance · Control Policy](29-governance-dashboard.md#control-policy) |
| Environment | General | (not covered) |
| Environment | LLM | [LLM Settings](23-llm-settings.md) |
| Environment | Infrastructure | (not covered) |
| Environment | Search / Embedding | [Embedding Settings](24-embedding-settings.md) |
| Environment | Audio | (not covered) |
| Environment | Guardrail | [Guardrail Model Setup](25b-guardrail-model.md) |
| Environment | Sidebar | (not covered) |
| System Status | System Monitoring | [System Monitor](26-system-monitor.md) |
| System Status | System Inspection | (not covered) |
| System Status | Log Viewer | (not covered) |
| Data Management | Database | [Data Management · Database](33-data-management.md#database) |
| Data Management | DB Connection | [Data Management · DB Connection](33-data-management.md#db-connection) |
| Data Management | Batch Jobs | [Data Management · Batch Jobs](33-data-management.md#batch-jobs) |
| Data Management | Data Audit Log | [Data Management · Data Audit Log](33-data-management.md#data-audit-log), [Audit Log](27-audit-log.md) |
| MCP Management | MCP Library | [MCP Library](28-mcp-market.md) |
| MCP Management | MCP Operations & Monitoring | (not covered) |
| Service Operations | Announcement Board | [Tech Support Handling · Notice Board](31-tech-support-handling.md#notice-board-authoring) |
| Service Operations | FAQ | [Tech Support Handling · FAQ](31-tech-support-handling.md#faq-authoring) |
| Service Operations | 1:1 Admin Inquiry | [Tech Support Handling · 1:1 Admin Inquiry](31-tech-support-handling.md#1-1-admin-inquiry-handling) |
| Knowledge Operations | Collection Management | [Knowledge Operations](34-knowledge-operations.md) |

!!! info "Menu Naming"
    Menu names on screen may vary slightly between solution versions and user permissions. This manual is based on {{product.name}} {{product.version}}; **bolded** menus are those this manual covers.

## First-Run Checklist

Items the operations team should verify immediately after deployment. Detailed steps for each item are in their respective chapters.

- [ ] **Register the initial (root) SuperUser** — Right after installation, open `/admin/create-superuser` and register the first SuperUser; confirm that account can log in. The screen is reachable only once, so store the password through a safe out-of-band channel
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
