# Agent Operations

This chapter covers the **administrative oversight** of all agents in the organization. The **Admin Center → Agent Operations** sidebar group exposes 9 menus covered here.

> For the *builder* perspective on creating and running agents, see the user-side [Creating an Agent](../user/12-agentflow-create.md) and [Agent Operations](../user/13-agentflow-operations.md) chapters. This chapter is the **admin-side** view of the organization's entire agent fleet.

## Accessing the Screen

Expand **Admin Center → Agent Operations** in the left sidebar to reveal 9 submenus.

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

### Agent Management — Deployment Approval (System Administrator, first approval) { #agent-mgmt-deploy-approval }

This screen is the System Administrator's surface for the **first** of two approval stages that gate whether an agent reaches end users. When an Agent Developer sends a **deployment request** from their workspace, it lands here for the System Administrator to approve or reject before it moves on to the governance reviewer.

!!! info "Dual approval — Deployment + Governance"
    A requested agentflow becomes a service for end users only after **both** of the following approvals pass.

    | Stage | Reviewer | Screen | Effect on data |
    |---|---|---|---|
    | 0. Deployment request | Agent Developer (workspace) | Agent Operations → "Request deployment" | `inquire_deploy: true` |
    | **1. Deployment approval** | **System Administrator** | This screen (Agent Management) | `is_accepted: true`, `is_deployed: true` |
    | **2. Governance approval** | **Governance Officer** | [AI Governance → Agentflow Approval](29-governance-dashboard.md#agent-approval) | `is_governance_accepted: true` |
    | ✅ Servable | — | Visible to end users only after stages 1 and 2 both pass | — |

    Stages 1 and 2 are **independent** — both must pass for the agent to appear in production. Items stuck at a single stage are surfaced on the dashboard *Agent deployment/approval status* widget under the **Deployment-pending / Governance-pending** counters.

#### Approving a deployment request

1. **Detect the request** — The card's deploy badge switches to *"Deployment pending"* (`inquire_deploy: true`), and an **Approve / Reject** entry appears in the card action menu.
2. **Open the card → inspect** — Review the node layout, author, department, and last-modified date.
3. **Approve** — Sets `enable_deploy: true, is_accepted: true`. A toast confirms "Deployment approved" and the card badge becomes *"Deployed"*. The agent is **not yet visible to end users** — it now waits for the governance approval.
4. **Reject** — Closes the request (`inquire_deploy: false`) and reverts the badge to *"Not deployed"*. Communicate the rejection reason to the author through a separate channel.

#### Kill switch while in service — Approval-status toggle

Open the card's **Settings** modal to reveal the **Approval Status** toggle. Switching it to *Disabled* immediately stops the agentflow from executing even after the deployment was approved — it is a *kill switch* for incidents in production. Combined with the **Deploy** toggle (public/private) in the same modal, you can stage a partial rollback rather than a hard removal.

#### Reading status badges

| Badge | Internal state | Meaning |
|---|---|---|
| Active | `has_startnode && has_endnode && node_count ≥ 3 && is_accepted !== false` | Runs normally |
| Inactive | Any of the above conditions failed | Node layout incomplete, or Approval Status is off |
| Deployment pending | `inquire_deploy: true` | First-stage approval pending — handled on this screen |
| Deployed | `is_deployed: true` | Deployment approval passed. Awaits governance approval before becoming visible to end users |
| Not deployed | `is_deployed: false && !inquire_deploy` | Never requested, or reverted after rejection |

### User Feedback

![User Feedback — summary cards (total feedback / average stars / good-answer rate) and a table of per-agent ratings and issue categories with CSV export.](images/admin-feedback-monitoring.png)

Top summary cards: total feedback count, average star rating, good-answer rate (no-issue ratio), hallucination count, policy violation count, data error count, response failure count. Use the CSV export from this screen as the source for governance reports.

### Chat Monitoring

A per-conversation trace view showing which nodes an agent traversed and the result of each tool call. The first stop when investigating or reproducing a response-quality issue.

### Task Planning

Register and rank candidate new agents the organization wants to build. Collects user requests, planner suggestions, and operational data in one place.

## Operational Recommendations

- **Monitor the dual-approval queue** — When the *Agent deployment/approval status* widget on the dashboard shows the **Deployment-pending** or **Governance-pending** counters drifting up, one of the two stages is the bottleneck. Both reviewers (System Administrator and Governance Officer) should sweep their queues at least weekly.
- **Deployment approval ≠ user visibility** — Approving the deployment on this screen does **not** make the agent visible to end users — that happens only after governance approval. Communicate this precisely to authors as "deployment approved, governance review pending."
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
