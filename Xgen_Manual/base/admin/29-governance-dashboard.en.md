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

1. **Entry into the queue** — Once the System Administrator approves the deployment, the agent shows up in the *Pending / Approved / Rejected* stat cards and table at the top of this screen. Items pushed in by a risk-threshold breach in Risk Review also join the same queue.
2. **Open the detail** — Click a row to inspect node layout, author, inputs/outputs, parameters, and category.
3. **Approve / Reject** — Use the action buttons on the right and fill in a comment. Approving writes `is_governance_accepted: true`; rejecting writes `is_governance_accepted: false` along with `governance_reviewed_by` and `governance_review_comment`.
4. **Outcome propagation** — Approved agents flip to servable immediately and become visible in user search/execution. Rejected agents return to the author with the comment and must re-enter the pipeline from stage 1 after fixes.

Every approve/reject action is recorded in the [audit log](27-audit-log.md); the reviewer (`governance_reviewed_by`), comment (`governance_review_comment`), and timestamp are retained permanently.

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
