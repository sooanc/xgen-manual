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

The solution uses a **two-tier permission model** decided by a single `is_superuser` flag. Role definition / assignment and ABAC permission grants are covered in the [Role / Permission Management](22-role-permission.md#permission-model) chapter.

| Tier | Korean | What they can do |
|---|---|---|
| Standard User | 일반 사용자 | Use Agent Workspace. Edit and share own items |
| SuperUser | 슈퍼유저 | Manage users/roles, configure system, run AI governance, monitor operations, delegate permissions, reset the system |

New users are created as **Standard User** by default. Granting SuperUser privilege is allowed only to an existing SuperUser. Keep at least one SuperUser for the system, ideally on a separate account isolated from daily operations.

## Admin Console Layout

The Admin sidebar has **9 groups and 36 menus** in total (some may be hidden depending on permissions). Menu labels match the stg live screen. The mapping from each menu to its manual chapter is below.

| Group | Menu | Manual Chapter |
|---|---|---|
| Users / Access Control | User Management | [User Management · User List & Approval](21-user-management.md#user-list) |
| Users / Access Control | Role / Permission | [Role / Permission · Permission Model / Roles](22-role-permission.md#permission-model) |
| Users / Access Control | Login Management | [User Management · Login Management](21-user-management.md) |
| Agent Operations | Agent Management | [Agent Operations · Agent Management (Deployment Approval)](32-agent-operations.md#agent-mgmt-deploy-approval) |
| Agent Operations | Chat Monitoring | [Agent Operations · Chat Monitoring](32-agent-operations.md#chat-monitoring) |
| Agent Operations | User Tokens | [Agent Operations · User Tokens](32-agent-operations.md) |
| Agent Operations | Node Management | [Node List](32a-node-list.md) |
| Agent Operations | Prompt Templates | [Agent Operations · Prompt Templates](32-agent-operations.md) |
| Agent Operations | User Feedback | [Agent Operations · User Feedback](32-agent-operations.md#user-feedback) |
| Agent Operations | Response Quality Evaluation | [Agent Operations · Response Quality Evaluation](32-agent-operations.md) |
| Agent Operations | Agent Retention Analysis | [Agent Operations · Retention Analysis](32-agent-operations.md) |
| Agent Operations | Task Planning | [Agent Operations · Task Planning](32-agent-operations.md#task-planning) |
| AI Governance | AI Risk Assessment | [AI Governance · Risk Review](29-governance-dashboard.md#risk-review) |
| AI Governance | Inspection History | [AI Governance · Inspection](29-governance-dashboard.md#inspection) |
| AI Governance | Service Change History | [AI Governance · AI Service Change History](29-governance-dashboard.md#audit-tracking) |
| AI Governance | Control Policy Management | [AI Governance · Control Policy](29-governance-dashboard.md#control-policy), [PII Policy](25-pii-policy.md) |
| Environment | General | [General · Environment Overview](#env-overview) |
| Environment | LLM | [LLM Settings](23-llm-settings.md) |
| Environment | Infrastructure | [Infrastructure · Environment Overview](#env-overview) |
| Environment | Search / Embedding | [Embedding Settings](24-embedding-settings.md) |
| Environment | Audio | [Audio · Environment Overview](#env-overview) |
| Environment | Guardrail | [Guardrail Model Setup](25b-guardrail-model.md) |
| Environment | Sidebar | [Sidebar · Environment Overview](#env-overview) |
| System Status | System Monitoring | [System Monitor · System Monitoring](26-system-monitor.md) |
| System Status | System Inspection | [System Monitor · System Inspection](26-system-monitor.md#system-query-log) |
| System Status | Log Viewer | [System Monitor · Log Viewer](26-system-monitor.md#system-query-log) |
| Data Management | Database | [Data Management · Database](33-data-management.md) |
| Data Management | DB Connection | [Data Management · DB Connection](33-data-management.md) |
| Data Management | Batch Jobs | [Data Management · Batch Jobs](33-data-management.md) |
| Data Management | Data Audit Log | [Audit Log · Data Audit Log](27-audit-log.md) |
| MCP Management | MCP Library | [MCP Library · MCP Library](28-mcp-market.md) |
| MCP Management | MCP Operations & Monitoring | [MCP Library · MCP Operations / Monitoring](28-mcp-market.md#mcp-station) |
| Service Operations | Announcement Board | [Tech Support Handling · Announcement Board](31-tech-support-handling.md) |
| Service Operations | FAQ | [Tech Support Handling · FAQ](31-tech-support-handling.md) |
| Service Operations | 1:1 Admin Inquiry | [Tech Support Handling · 1:1 Admin Inquiry](31-tech-support-handling.md) |
| Knowledge Operations | Collection Management | [Knowledge Operations · Collection Management](34-knowledge-operations.md) |

### Environment Overview — Menus Without a Dedicated Chapter { #env-overview }

Four Environment menus — **General / Infrastructure / Audio / Sidebar** — do not have a dedicated chapter in this manual. Each screen is *one-time installation- or tenant-level setup*, so the quickest path is to operate them directly on stg.

| Menu | Where to enter | Screen role |
|---|---|---|
| General | Admin → Environment → General (`admin?view=admin-system-config`) | A unified, advanced view that lets you read/edit *every* system configuration value from a single screen. Day-to-day operations should rely on the individual menus (*LLM / Search / Embedding / Guardrail*); this screen is the *key-value precision-edit* entry point. (See *General screen in detail* below.) |
| Infrastructure | Admin → Environment → Infrastructure | API server, Agent engine, model-serving *endpoints* and infrastructure parameters. Typically configured once at install time. |
| Audio | Admin → Environment → Audio | STT/TTS voice-model integration. Only meaningful when voice features are enabled. |
| Sidebar | Admin → Environment → Sidebar | Toggle visibility of individual sidebar menus per organization, used to hide selected menus from users. |

Dedicated chapters are planned as follow-up work; until then, use the entry paths above to inspect or change these settings directly on stg.

#### General screen in detail

The *General* screen (`admin?view=admin-system-config`) exposes **every environment variable** the solution uses on a single page. The page header reads *"General — Inspect and edit every system configuration value."* The body has three areas:

1. **Three top stat cards** — total settings / *configured* (different from default) / still on default. Example: *Total 184 / Configured 57 / Default 127* (numbers vary by environment).
2. **Category tabs** — left to right *All / Node / Workflow / Application / Vector DB / OpenAI / Gemini / Anthropic / …* each showing its count. Categories may grow with the environment; the tab strip is horizontally scrollable.
3. **Setting cards** — within each category, keys are listed as cards. Each card shows:
    - **Key + dotted path** — e.g., `IS_AVAILABLE_TTS` with `tts.is_available_tts`
    - **Current value** / **Default** side by side. Cards carry a *Default* badge when the two match, or a *Configured* badge when they differ.
    - **Type badge** — `Bool` / `Json` / `Str` / `Int`, etc.

!!! warning "Verify impact before editing"
    *General* exposes keys that directly affect LLM / Embedding / TTS / Node / Workflow behavior. The same keys are editable from individual menus (*LLM / Search·Embedding / Guardrail*), so keep a consistent record of *which screen* a change was made from. Invalid values affect in-flight chats and executions immediately — review with the [audit log](27-audit-log.md) before changes.

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
