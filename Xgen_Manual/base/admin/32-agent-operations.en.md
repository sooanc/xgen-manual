# Agent Operations

This chapter covers the **administrative oversight** of all agents in the organization. The **Admin Settings → Agent Operations** sidebar group exposes 9 menus covered here.

> For the *builder* perspective on creating and running agents, see the user-side [Creating an Agent](../user/12-agentflow-create.md) and [Agent Operations](../user/13-agentflow-operations.md) chapters. This chapter is the **admin-side** view of the organization's entire agent fleet.

## Accessing the Screen

Expand **Admin Settings → Agent Operations** in the left sidebar to reveal 9 submenus.

![Agent Management — card grid of all agentflows registered in the organization, filtered by status / owner. The left sidebar shows the Agent Operations group with its 9 menus expanded.](images/admin-agent-management.png)

## Menu Structure

| Menu | View ID | Purpose |
|---|---|---|
| **Agent Management** | `admin-agentflow-management` | Organization-wide agentflow card grid; filter by status / owner; search |
| **Chat Monitoring** | `admin-chat-monitoring` | Live and historical chat-session tracing — response and tool-call traces |
| **User Tokens** | `admin-user-token-dashboard` | Token-consumption dashboard by user / period, cost analysis |
| **Node Management** | `admin-node-management` | Manage reusable nodes available across agentflows |
| **Prompt Templates** | `admin-prompt-store` | Organization-shared prompt templates and their version history |
| **User Feedback** | `admin-feedback-monitoring` | User-submitted star ratings / issue categories / comments (hallucination, policy violation, data error, response failure) |
| **Response Quality Evaluation** | `admin-agentflow-tester` | Auto-score agent responses against a test dataset |
| **Agent Retention Analysis** | `admin-agent-retention` | Time-series retention curves and active-user trends per agent |
| **Task Planning** | `admin-agent-dev-plan` | Register and triage proposed new agents, manage development priority |

## Key Screens

### User Feedback

![User Feedback — summary cards (total feedback / average stars / good-answer rate) and a table of per-agent ratings and issue categories with CSV export.](images/admin-feedback-monitoring.png)

Top summary cards: total feedback count, average star rating, good-answer rate (no-issue ratio), hallucination count, policy violation count, data error count, response failure count. Use the CSV export from this screen as the source for governance reports.

### Chat Monitoring

A per-conversation trace view showing which nodes an agent traversed and the result of each tool call. The first stop when investigating or reproducing a response-quality issue.

### Task Planning

Register and rank candidate new agents the organization wants to build. Collects user requests, planner suggestions, and operational data in one place.

## Operational Recommendations

- **Weekly user-feedback review** — When hallucination / policy-violation counts exceed a threshold for the week, immediately suspend the offending agent for inspection.
- **Token-consumption alerts** — Watch the User Tokens dashboard for anomalous spikes (e.g., a user 10× their daily average) and share with the security team.
- **Pin prompt-template versions** — Agents that are live in production should reference pinned template versions. Unannounced template edits affect every consumer.
- **Periodic quality runs** — Refresh the evaluation dataset quarterly and re-run Response Quality Evaluation to catch regressions.
- **Hide internal-only agents** — Toggle private flags so internal agents do not appear in user-side search; they remain visible from this admin screen.

## Related Chapters

- [Creating an Agent](../user/12-agentflow-create.md) — designer perspective
- [Agent Operations (user-side)](../user/13-agentflow-operations.md) — designer perspective on running and testing
- [AI Governance](29-governance-dashboard.md) — risk review and approval workflow for governance officers
- [Audit Log](27-audit-log.md) — audit trail of admin actions

## Contact

For questions on Agent Operations screens, please contact {{vars.support_email}}.
