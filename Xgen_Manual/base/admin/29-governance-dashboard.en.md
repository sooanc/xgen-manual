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

### Agent Approval

Agents whose risk score exceeds the threshold are routed automatically into the **Agent Approval** queue and may not be deployed/operated without explicit governance approval.

Approval workflow:

1. Risk Review detects threshold breach → adds to queue
2. Governance reviewer is notified
3. Reviewer inspects node configuration, permission scope, and PII impact
4. **Approve / Hold / Reject** — Hold and Reject require a reason
5. Only approved agents appear in production

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
