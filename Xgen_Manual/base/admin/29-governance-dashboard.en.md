# AI Governance

This chapter covers the **Admin Center → AI Governance** menu and how to operate each screen. It is the area where the organization manages **risk assessment, inspection, audit, and control policies** for AI usage.

## Accessing the Screen

Enter **Admin Center** from the top-left mode switch, then expand the **AI Governance** section in the left sidebar. The page opens with the governance monitoring dashboard.

![AI Governance Monitoring — combined dashboard organized as a widget grid](images/admin-gov-monitoring.png)

## Sidebar Layout

The AI Governance menu has **four areas**.

| Area | Korean | Main Menus | Section |
|---|---|---|---|
| Risk Review | AI 위험도 평가 및 심사 | Risk Assessment, Agent Approval | [Risk Review](#risk-review) |
| Inspection | AI 점검 이력 및 계획 | Inspection Monitoring, Plan, Overdue, History | [Inspection](#inspection) |
| Service / Operation History | AI 감사·추적 관리 | Service Change History, Operation History | [Audit & Tracking](#audit--tracking) |
| Control Policy | AI 통제 정책 관리 | PII Policy, Forbidden Words, Risk Policy | [Control Policy](#control-policy) |

## Risk Review

Computes **per-category risk scores** for deployed agents; agents that exceed a threshold are routed to governance reviewers for explicit approval.

![AI Risk Assessment — risk-category widget grid and trend charts](images/admin-gov-risk.png)

### Evaluation Categories

| Category | Description |
|---|---|
| PII Exposure | Failed or bypassed personal-information masking |
| Data Exfiltration | Bulk download or outbound email of sensitive data |
| Privilege Misuse | Abnormal privilege escalation |
| Abnormal Access | Off-hours or foreign-IP access |
| Policy Violation | Use of forbidden words or blocked tools |

Each category carries a **weight**, contributing to the overall risk score.

!!! info "Suggested Weights (Financial Sector Example)"
    - PII Exposure: 10 (highest priority)
    - Data Exfiltration: 9
    - Privilege Misuse: 8
    - Policy Violation: 6
    - Abnormal Access: 5

### Agent Approval { #agent-approval }

This menu is the **second of two approval stages** required before an agentflow can be served to end users. The **first stage — deployment approval — is performed by the System Administrator** on [Agent Operations → Agent Management](32-agent-operations.md#agent-mgmt-deploy-approval); only agents that pass that stage reach this queue.

!!! info "Where Governance Approval sits — stage 2 of dual approval"
    | Stage | Reviewer | Screen | Effect on data |
    |---|---|---|---|
    | 1. Deployment approval | System Administrator | [Agent Management](32-agent-operations.md#agent-mgmt-deploy-approval) | `is_accepted: true`, `is_deployed: true` |
    | **2. Governance approval *(this screen)*** | **Governance Officer** | AI Governance → Agentflow Approval | `is_governance_accepted: true` |
    | ✅ Servable | — | Visible to end users only after both stages pass | — |

    Agents rejected at stage 1 never appear in this queue. Because governance reviewers only see agents the System Administrator has already cleared for operational fitness, their review can focus on **risk category, PII impact, and policy compliance**.

#### Approval workflow

The procedure below moves through *sidebar entry → queue overview → row inspection → decision + comment* — all inside this one screen (`gov-agentflow-approval`).

1. **Open the screen** — In **Admin Center**, expand **AI Governance → Agentflow Approval** in the left sidebar. The header is followed by a **search field** and **four stat cards**.

2. **Read the queue** — Click any of the four stat cards to filter the table to that status.

    | Stat card | Variant | Meaning |
    |---|---|---|
    | All status | info | Total items currently in the queue |
    | Pending | warning | `is_governance_accepted` not set — **items to handle on this screen** |
    | Approved | success | `is_governance_accepted: true` — agent is live |
    | Rejected | error | A reviewer is recorded but `is_governance_accepted: false` — returned to author |

    The queue contains only agents the System Administrator has approved at stage 1 (plus items force-routed in by a risk-threshold breach from Risk Review). Anything rejected at stage 1 never reaches this screen, so reviewers can focus on **risk category, PII impact, and policy compliance**.

3. **Read the table columns** — Headers sort on click.

    | Column | Sortable | Description |
    |---|---|---|
    | Agentflow | ✓ | Name. Row click = detail modal |
    | Creator | ✓ | Author ID / display name |
    | Department | — | Author's department |
    | Governance status | ✓ | Pending / Approved / Rejected badge |
    | Reviewer | — | The Governance Officer who processed the row (`-` while pending) |
    | Last modified | ✓ | Request or processing timestamp |
    | Actions | — | **View detail** / **Approve** / **Reject** — the latter two appear only on pending rows |

4. **Inspect the detail modal** — Clicking a row opens the *Agentflow Detail* modal. Verify the following in one place:

    - **Basic info**: name, creator (`<name> (<dept>)`), version `v<n>`, node/edge counts (`<n> nodes / <m> edges`)
    - **Governance status badge** and reviewer (for already-processed rows)
    - **Review comment** (for already-processed rows)
    - **Node summary table**: `nodeName / Function ID / category / parameter count / I/O` — clicking a row expands the node detail panel (parameter dict and input list)

    For nodes that could expose PII (outbound calls, mail senders, etc.), expand the parameter list and confirm the use is intentional.

5. **Decide — Approve or Reject** — The footer buttons in the detail modal, or the right-side buttons on the row, open the *comment modal*.

    | Button | Comment required? | Backend call | Result |
    |---|---|---|---|
    | **Approve** | Optional (rationale or notes) | `POST /api/admin/governance/agentflow-approval/agentflows/<id>/review` with `{ is_governance_accepted: true, comment }` | Records `is_governance_accepted: true`, `governance_reviewed_by`, `governance_review_comment`. The agent goes live immediately |
    | **Reject** | **Required** (rejection reason) | Same endpoint, `{ is_governance_accepted: false, comment }` | Records `is_governance_accepted: false`. The author reads the comment, fixes the agent, and resubmits from stage 0 |

    When the *Submitting…* state clears, the stat cards and table refresh. If the same agent reappears as *Pending*, the author has resubmitted after a fix — repeat the workflow.

Every approve/reject action is recorded in the [audit log](27-audit-log.md) and in [AI Audit & Tracking](#audit--tracking); the reviewer (`governance_reviewed_by`), comment (`governance_review_comment`), and timestamp are retained permanently.

## Inspection

Manages the **inspection schedule and history** for AI systems across the organization.

| Menu | Role |
|---|---|
| Inspection Monitoring | Card-style dashboard of in-progress and upcoming items |
| Plan | Register/adjust quarterly and annual inspection plans |
| Overdue | Track items past their due date and their owners |
| History | Results, actions, and evidence for completed inspections |

Inspection items are linked to risk-review results; completing an inspection re-computes the affected risk scores.

## Audit & Tracking

Records governance-policy changes and user operational actions.

![Service Change History — tracks governance-policy and service-configuration changes](images/admin-gov-audit-tracking.png)

| Menu | Role |
|---|---|
| Service Change History | Changes to governance policies, service configuration, and approval workflows |
| Operation History | Per-user / per-policy / per-agent action tracking (actor, approver, target, time) |

!!! note "vs. system audit log"
    Solution-wide audit (logins, system-setting changes) lives in the separate [Audit Log](27-audit-log.md) chapter. **AI Governance audit** is scoped to governance policy and approval-workflow events.

## Control Policy

Registers and manages the organization's **AI usage control policies**.

![Control Policy Management — active / inactive policy counts and violation trends](images/admin-gov-control-policy.png)

| Area | Content | Detail |
|---|---|---|
| PII Policy | Targets and rules for personal-information masking (RRN, phone, email, etc.) | [PII Policy](25-pii-policy.md) |
| Forbidden Words | Keywords/regex blocked in inputs and responses | (in PII Policy chapter) |
| Risk Policy | Risk-category weights and automatic-action thresholds | See [Risk Review](#risk-review) above |

Active-policy counts and violation trends also appear as widgets on the main governance monitoring dashboard.

## Operational Recommendations

- **Monthly review** — operations and security teams jointly review the governance dashboard and risk-review output, then act on outliers
- **Quarterly weight tuning** — reweight risk categories to reflect new external regulation and internal incidents
- **Documented approval process** — for agents over the risk threshold, document approvers, deadlines, and re-review cadence separately
- **Automated inspection planning** — register the quarterly inspection plan in the scheduler to avoid misses
- **Retention** — keep operation history for the regulatory retention period (typically 5+ years in financial sector)

## Contact

For AI Governance questions, contact {{vars.support_email}}.
