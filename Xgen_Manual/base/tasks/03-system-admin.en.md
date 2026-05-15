# System Administrator

> Operators of solution infrastructure, users, authentication, and LLM connections. They use most of Admin Center.

## See the main screen tailored to my role right after login
- Start: automatic redirect right after login (or click the **XGEN** logo at the top-left)
- Procedure: [Dashboard · System Administrator view](../admin/30-dashboard.md#system-administrator-view)
- System Administrators see the "System Operations & Deployment Dashboard" greeting, the **Admin Center** quick-action button enabled, and **system health / operations metrics** widgets.

## I just received a fresh deployment, what should I check first?
- [Admin Console Overview - First-Time Checklist](../admin/20-admin-overview.md#첫-사용-시-점검-체크리스트)
- Essentials: enable superuser → register LLM provider → connect embedding/vector DB → define roles

## Add or deactivate a user
- Start: Admin Center → Users / Access Control → User Management
- Procedure: [User Management](../admin/21-user-management.md)

## Adjust user permissions (add/assign roles)
- Start: Admin Center → Users / Access Control → Role / Permission Management
- Procedure: [Role / Permission Management](../admin/22-role-permission.md)

## Register an LLM provider (OpenAI / Anthropic / internal vLLM)
- Start: Admin Center → Environment → LLM
- Procedure: [LLM Settings](../admin/23-llm-settings.md)

## Connect embedding model + vector DB (enable knowledge search)
- Start: Admin Center → Environment → Search / Embedding
- Procedure: [Embedding / Search Settings](../admin/24-embedding-settings.md)

## Monitor CPU / memory / disk health
- Start: Admin Center → System Status → System Monitoring
- Procedure: [System Monitor](../admin/26-system-monitor.md)
- Recommended: configure alert thresholds

## Approve or reject deployment requests for agents built by Agent Developers (stage 1)
- Start: Admin Center → **Agent Operations → Agent Management**
- Procedure: [Agent Management — Deployment Approval (System Administrator, first approval)](../admin/32-agent-operations.md#agent-mgmt-deploy-approval)
- Key: on cards carrying the **Deployment pending** badge (`inquire_deploy: true`), open the **⋯** menu and choose **Approve** or **Reject**. Approving forwards the agent to the governance queue automatically — end-user visibility still requires governance approval.
- Widget: keep an eye on the *Deployment pending* counter in the dashboard *Agent deployment/approval status* widget.

## An already-deployed agent is misbehaving and needs an immediate cutoff
- Start: Admin Center → Agent Operations → Agent Management → **Settings** icon on the affected card
- Procedure: flip **Approval Status** to *Disabled* in the agentflow settings modal
- Effect: execution stops immediately (kill switch). Combine with the **Deploy** toggle (public/private) in the same modal to stage a partial rollback. Full details in [Agent Operations](../admin/32-agent-operations.md).

## Register and operate MCP servers
- Start: Admin Center → MCP Management → MCP Library
- Procedure: [MCP Library](../admin/28-mcp-market.md)

## A user posted on the support board / FAQ / 1:1 inquiry — how do I respond?
- Start: Admin Center → Service Operations
- Procedure: [Tech Support Handling](../admin/31-tech-support-handling.md)
