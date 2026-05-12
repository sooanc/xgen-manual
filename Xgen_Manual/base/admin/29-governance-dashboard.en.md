# AI Governance Dashboard

This chapter covers the **AI Governance Insight Dashboard** — a single view of AI usage, risk, and compliance state.

## What the Governance Dashboard Provides

The governance dashboard visualizes operational metrics that answer:

- How and how much is the organization using AI?
- Are there risky usage patterns (PII exposure, forbidden-word violations, etc.)?
- What is our compliance status against regulations and internal policy?
- Which users or departments are most active?

## Accessing the Screen

Select **AI Governance** in the left sidebar, or the **AI Governance Insight Dashboard** widget at the top of the dashboard.

![AI Governance Monitoring — combined dashboard organized as a widget grid](images/admin-gov-monitoring.png)

## Main Widgets

### Usage

| Widget | Shows |
|---|---|
| DAU / WAU / MAU | Active users by daily, weekly, monthly cadence |
| Chat message count | Daily/weekly/monthly trends |
| Agentflow execution count | Invocation count of deployed flows |
| Token consumption | Cumulative input/output tokens of LLM calls (for cost tracking) |

### Risk

| Widget | Shows |
|---|---|
| Risk level distribution | Recent event ratios by risk level (Low/Medium/High/Critical) |
| PII detection frequency | Per-policy detection counts over time |
| Forbidden-word violations | Count of blocked inputs and responses |
| Suspicious patterns | Off-hours access, mass downloads, etc. |

### Compliance

| Widget | Shows |
|---|---|
| Policy enablement | Number of active vs. inactive policies |
| Audit log retention coverage | Actual retained data vs. required window |
| Permission review status | Last permission review (warns when >90 days old) |
| Data classification coverage | Ratio of collections with classification labels |

![AI Risk Assessment — risk-category widget grid and trend charts](images/admin-gov-risk.png)

Additionally, the Control Policy Management screen surfaces the status of active policies.

![Control Policy Management — active / inactive policy counts and violation trends](images/admin-gov-control-policy.png)

## Risk Assessment Categories

The categories used for risk assessment have configurable weights.

| Category | Korean | Description |
|---|---|---|
| PII Exposure | PII 노출 | PII masking failures or bypasses |
| Data Exfiltration | 데이터 외부 반출 | Mass downloads, external emails |
| Privilege Misuse | 권한 오용 | Use of abnormally elevated privileges |
| Abnormal Access | 비정상 접근 | Off-hours or foreign-IP access |
| Policy Violation | 정책 위반 | Forbidden-word usage, calls to blocked tools |

Each category carries a **weight** that contributes to the aggregate risk score.

## Adjusting Weights

Risk priorities differ by organization, so the weights are adjustable.

1. Click **Settings (⚙)** at the top right of the governance dashboard
2. Use the per-category weight sliders (0–10)
3. The total is auto-normalized
4. **Save**

!!! note "Weight-adjustment screen screenshot pending"
    A screenshot of the per-category weight sliders opened by Settings (⚙) will be added in a future manual update.

!!! info "Recommended Weights (Financial Sector Example)"
    - PII Exposure: 10 (highest priority)
    - Data Exfiltration: 9
    - Privilege Misuse: 8
    - Policy Violation: 6
    - Abnormal Access: 5

## Period Comparison

Most widgets support a **comparison** mode.

- This month vs. last month
- This week vs. last week
- This quarter vs. last quarter

The comparison shows percentage change (↑↓ %), making trend shifts easy to spot.

## Alerts

Receive notifications when a metric crosses a threshold.

1. Click **Alert Settings** at the top right of a widget
2. Enter a threshold (e.g., "PII detections ≥ 100 per day")
3. Choose notification channels (email, webhook, Slack, etc.)
4. **Save**

## Exporting Reports

Export monthly or quarterly reports as PDF or Excel.

1. Click **Export Report** at the top right
2. Choose format (PDF / Excel)
3. Choose period
4. **Download**

!!! note "Report-export options screenshot pending"
    A screenshot of the format / period selection modal opened by "Export Report" will be added in a future manual update.

The service-change history lives on a separate screen.

![Service Change History — tracks governance-policy and service-configuration changes](images/admin-gov-audit-tracking.png)

## Operational Recommendations

- **Monthly review** — Operations and security teams review the dashboard together each month and address anomalies.
- **Quarterly weight recalibration** — Adjust weights to reflect external regulatory changes and internal incidents.
- **Environment-appropriate thresholds** — As users grow, consider relative thresholds (e.g., "≥1% of total messages") instead of absolute counts.
- **Automate reports** — Schedule quarterly reports through the scheduler for automatic delivery.

## Contact

For questions about the governance dashboard, please contact {{vars.support_email}}.
