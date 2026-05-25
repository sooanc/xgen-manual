# System Monitor

This chapter describes how to monitor the resource state (CPU, memory, disk, network, etc.) of the solution server and configure thresholds. (Depending on the operational environment, a Grafana-based integrated monitoring view may also be available.)

## System Overview

Select **Admin → System Status → System Monitoring** in the left sidebar.

![System Monitoring — CPU / Memory / Disk / Network metric cards and time-series charts](images/admin-system-monitor.png)

The following information is displayed in real time.

| Metric | Korean | Items Shown |
|---|---|---|
| CPU | CPU | Per-core utilization (%), average, peak |
| Memory | 메모리 | Used / free / total (GB), utilization (%) |
| Disk | 디스크 | Per-partition used / free / utilization |
| Network | 네트워크 | Tx / Rx (MB/s), connection state |
| Uptime | 가동 시간 | Time elapsed since boot |

The **Pause** / **Resume** buttons at the top control screen refresh (server-side monitoring continues regardless).

## Utilization Levels

Each metric's utilization is color-coded into four levels.

| Level | Korean | Color | Meaning |
|---|---|---|---|
| Low | 낮음 | Green | Plenty of headroom |
| Medium | 보통 | Yellow | Normal range |
| High | 높음 | Orange | Caution |
| Critical | 위험 | Red | Immediate action required |

Default thresholds, adjustable per environment:

| Metric | Medium | High | Critical |
|---|---|---|---|
| CPU | 60% | 80% | 90% |
| Memory | 70% | 85% | 95% |
| Disk | 70% | 85% | 95% |

## Configuring Thresholds

1. Click the **Settings (⚙)** button at the top right of System Monitor
2. Adjust the per-metric threshold sliders
3. **Notification Channel** — select where to send threshold alerts (email, webhook, etc.)
4. **Save**

!!! info "The threshold-settings (⚙) button is not present on the current stg build"
    The *settings (⚙)* button mentioned in earlier versions of this manual is not exposed on the current stg System Monitoring screen (`admin?view=admin-system-monitor`). Threshold and alert-channel adjustments are expected to be managed through a separate system-config file or via *Environment → Infrastructure* during one-time operations setup. Once the UI is added, we will refresh this section with a modal screenshot.
    A screenshot of the threshold-slider and notification-channel modal (opened via the Settings ⚙ button) will be added in a future manual update.

!!! info "Ignoring Brief Spikes"
    Brief spikes from batch jobs or sudden user surges are normal. Configuring **Critical** alerts to fire only when sustained for over an hour reduces noise.

## Resource History

The **Resource History** tab shows time-series charts for past trends.

| Period Option | Data Resolution |
|---|---|
| Last 1 hour | 1-second granularity |
| Last 24 hours | 1-minute granularity |
| Last 7 days | 5-minute granularity |
| Last 30 days | 1-hour granularity |

When investigating spikes, cross-reference the audit log around the same time to infer causes.

## System Inspection & Log Viewer { #system-query-log }

The **System Status** group has two more menus alongside *System Monitoring* — **System Inspection** and **Log Viewer**. They are covered briefly here because both screens are *read-only inspection* with little user action.

| Menu | Where to enter | Purpose |
|---|---|---|
| **System Inspection** | Admin → System Status → System Inspection | Shows the *health/ping result* of connected components (API server, Agent engine, model serving) on one screen. First stop when an outage is suspected. |
| **Log Viewer** | Admin → System Status → Log Viewer | Search, filter, and download backend server logs (stdout / error). **For user actions or policy changes, refer to the [Audit Log](27-audit-log.md) chapter** — this screen contains *system-component logs*, not user-activity logs. |

!!! info "vs. Audit Log"
    - **Log Viewer**: *technical logs* from backend components (stack traces, error messages). Used by operations to chase incidents.
    - **Audit Log**: a permanent record of *who did what when* (*user activity*). Used for regulatory and internal-audit response — see the [Audit Log](27-audit-log.md) chapter.

## Operational Recommendations

- **Weekly review** — Inspect the 30-day chart on **Resource History** weekly. Disks fill gradually, so weekly checks are essential.
- **Watch for unplanned restarts** — Abnormally short uptime (e.g., under one day) suggests an unplanned restart. Check the audit log for cause.
- **Periodic threshold recalibration** — Baseline utilization rises with user growth. Reassess threshold appropriateness quarterly.

## Contact

For questions about System Monitor, please contact the Xgen Solution Administrator.
