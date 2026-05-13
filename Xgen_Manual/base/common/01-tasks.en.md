# Task Guide

This page helps you navigate the manual by **what you want to do**, not by menu names. Pick your role and your task — no need to memorize menus.

> For menu-structure reference, use the [User](../user/) / [Admin](../admin/) tabs above.

## What's Your Role?

| Role | Concerns | Jump |
|---|---|---|
| Standard User | Run agents, chat, use knowledge | [↓ Standard User](#standard-user) |
| Agent Developer | Design, deploy, get approval | [↓ Agent Developer](#agent-developer) |
| System Administrator | Users, permissions, LLM, infrastructure | [↓ System Administrator](#system-administrator) |
| Governance Officer | Approval, control policy, audit | [↓ Governance Officer](#governance-officer) |

---

## Standard User

> Users who **consume** the agents the organization has already deployed, via chat. Available menus are limited to **Agent Chat / Technical Support / Dashboard (personal view)**. Anything else (Agent Creation, Tool Integration, Knowledge Management) requires Agent Developer privileges.

### I want to chat with an agent
- Start: left sidebar **Agent Chat → New Chat**
- Procedure: [Chat](../user/14-chat.md)

### Open the main screen after login (Dashboard)
- Start: automatic redirect right after login (or click the **XGEN** logo at the top-left)
- Procedure: [Dashboard](../user/18-dashboard.md)
- Scope: the main screen shown to every account with standard-user permission. Aggregates notices, FAQ, and other base-tier content. Governance and system-operations widgets render for users who hold the corresponding permission.

### I want to find notices, FAQ, or submit an inquiry
- Start: left sidebar **Technical Support**
- Procedure: [Technical Support](../user/19-tech-support.md)

### This is my first time, where do I start?
- [Getting Started](../user/10-getting-started.md) → [Login](../user/11-login.md)

> To **build** agents or manage knowledge, prompts, or auth profiles, see the [Agent Developer](#agent-developer) section.

---

## Agent Developer

> Users who **design and deploy** agents to automate their own work. On top of the standard-user menus, they get access to **Agent Creation, Tool Integration, and Knowledge Management** areas.

### End-to-end flow: build → deploy → approve

1. **Enter workspace** — Agent Workspace → Agent Design → [Enter Agent Workspace](../user/12-agentflow-create.md#agent-작업실-진입)
2. **Compose nodes** — add and connect nodes on the canvas starting from the Start Node → [Create an Agentflow](../user/12-agentflow-create.md)
3. **Connect external tools** — register API Tools / MCP nodes → [Add Nodes](../user/12-agentflow-create.md#노드-추가)
4. **Quality evaluation** — verify response quality with test data → [Agentflow Operations - Quality](../user/13-agentflow-operations.md#에이전트-품질-분석)
5. **Deploy** — push to production → [Agentflow Operations](../user/13-agentflow-operations.md)
6. **Approval queue** (when over the risk threshold) — wait for governance approval → [AI Governance - Risk Review](../admin/29-governance-dashboard.md#ai-위험도-평가-및-심사)

### I want the agent to consult internal documents (RAG)
- Start: left sidebar **Knowledge → Collection**
- Procedure: [Knowledge Management](../user/15-knowledge.md)

### I want to save and share frequently-used prompts
- Start: left sidebar **Agent Creation → Agent Prompts**
- Procedure: [Prompt Management](../user/16-prompt.md)

### I want to manage credentials for external systems safely
- Start: left sidebar **Tool Integration → Auth Profile**
- Procedure: [Auth Profile](../user/17-auth-profile.md)

### My agent is pending governance approval
- Start: Admin Settings → AI Governance → Agent Approval
- Procedure: [AI Governance - Risk Review](../admin/29-governance-dashboard.md#ai-위험도-평가-및-심사)
- Note: if you don't have approval rights yourself, ask the governance officer to review

### I want to register an external API / MCP server as a tool
- Start: left sidebar **Tool Integration → API Tool**
- Procedure: [Create an Agentflow - Add Nodes](../user/12-agentflow-create.md#노드-추가)

### I want to see call statistics and failure rate for my deployed agents
- Start: header **Dashboard** or sidebar **Agent Operations**
- Procedure: [Agentflow Operations](../user/13-agentflow-operations.md)

---

## System Administrator

> Operators of solution infrastructure, users, authentication, and LLM connections. They use most of Admin Settings.

### I just received a fresh deployment, what should I check first?
- [Admin Console Overview - First-Time Checklist](../admin/20-admin-overview.md#첫-사용-시-점검-체크리스트)
- Essentials: enable superuser → register LLM provider → connect embedding/vector DB → define roles

### Add or deactivate a user
- Start: Admin Settings → Users / Access Control → User Management
- Procedure: [User Management](../admin/21-user-management.md)

### Adjust user permissions (add/assign roles)
- Start: Admin Settings → Users / Access Control → Role / Permission Management
- Procedure: [Role / Permission Management](../admin/22-role-permission.md)

### Register an LLM provider (OpenAI / Anthropic / internal vLLM)
- Start: Admin Settings → Environment → LLM
- Procedure: [LLM Settings](../admin/23-llm-settings.md)

### Connect embedding model + vector DB (enable knowledge search)
- Start: Admin Settings → Environment → Search / Embedding
- Procedure: [Embedding / Search Settings](../admin/24-embedding-settings.md)

### Monitor CPU / memory / disk health
- Start: Admin Settings → System Status → System Monitoring
- Procedure: [System Monitor](../admin/26-system-monitor.md)
- Recommended: configure alert thresholds

### Register and operate MCP servers
- Start: Admin Settings → MCP Management → MCP Library
- Procedure: [MCP Library](../admin/28-mcp-market.md)

### A user posted on the support board / FAQ / 1:1 inquiry — how do I respond?
- Start: Admin Settings → Service Operations
- Procedure: [Tech Support Handling](../admin/31-tech-support-handling.md)

---

## Governance Officer

> Users responsible for **risk, control, and audit** of AI usage. Usually a different role from the system administrator.

### Review and approve pending agents
- Start: Admin Settings → AI Governance → Risk Review → Agent Approval
- Procedure: [AI Governance - Risk Review](../admin/29-governance-dashboard.md#ai-위험도-평가-및-심사)
- Review items: node configuration, permission scope, PII impact

### Tune risk-category weights
- Start: Admin Settings → AI Governance → Control Policy
- Procedure: [AI Governance - Control Policy](../admin/29-governance-dashboard.md#ai-통제-정책-관리)
- Recommended: re-tune quarterly

### Add or adjust PII masking rules
- Start: Admin Settings → AI Governance → Control Policy → PII Policy
- Procedure: [PII Policy](../admin/25-pii-policy.md)

### Trace user actions (login, system-setting changes, etc.)
- Start: Admin Settings → Security & Audit → Audit Log
- Procedure: [Audit Log](../admin/27-audit-log.md)
- General-purpose system action audit

### Trace governance policy / approval changes
- Start: Admin Settings → AI Governance → Audit & Tracking
- Procedure: [AI Governance - Audit & Tracking](../admin/29-governance-dashboard.md#ai-감사추적-관리)
- Scoped to governance events (separate from the general system audit log)

### Register and manage scheduled inspections
- Start: Admin Settings → AI Governance → Inspection
- Procedure: [AI Governance - Inspection](../admin/29-governance-dashboard.md#ai-점검-이력-및-계획)

### Show me the governance overview dashboard
- Start: Admin Settings → AI Governance (default landing)
- Procedure: [AI Governance](../admin/29-governance-dashboard.md)

---

## Didn't Find It?

If your task isn't listed above, walk the menu structure directly:

- [User Manual](../user/) — what end users and developers see
- [Admin Manual](../admin/) — every Admin Settings menu
- [Glossary](02-glossary.md) — terminology used throughout the manual
- Still missing — contact {{vars.support_email}}
