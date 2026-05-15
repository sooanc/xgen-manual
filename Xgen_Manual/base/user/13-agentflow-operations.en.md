# Agent Operations

This chapter covers executing, deploying, sharing, and version-managing your agentflows.

## Execution and Debugging

### Running Immediately from the Canvas

1. Click **Run** at the top of the canvas
2. Provide test input in the input modal
3. Execution results and logs appear in the right or bottom panel

![Agent Quality Analysis — debugging panel showing node execution order, tool calls, and citations](images/tester.png)

### Reading Execution Results

Each execution includes:

| Item | Korean | Description |
|---|---|---|
| Execution Order | 실행 순서 | Which nodes ran in what order |
| Tool Call | 도구 호출 | Arguments and responses for external tool invocations |
| Tool Result | 도구 결과 | Data returned by the tool |
| Citations | 인용 | Documents/assets the AI response referenced |
| Logs | 로그 | Step-by-step detailed logs |

When problems occur, expand the logs to find which node got stuck and what input it received.

## Deployment

After validation, deploy so other users or external systems can invoke the agentflow.

1. Click the **Deploy** button on the canvas or the agentflow list
2. Choose a deployment mode

| Mode | Description |
|---|---|
| Webpage | Chat interface accessible via browser |
| API | REST API endpoint |
| cURL | Auto-generated cURL command for invocation |
| Embed | Code snippet for embedding into external pages (popup or full-page) |

3. Configure authentication and access control (Public / Intranet only / Specific users)
4. Click **Deploy**

!!! note "Deployment-settings modal screenshot pending"
    A screenshot of the deployment modal (mode selection and embed code) will be added in a future manual update.

!!! info "A deploy request requires two approvals before the agent is served"
    Clicking **Deploy** as an Agent Developer registers a **deployment request**. The agent reaches end users only after **both** of the following approvals pass.

    1. **System Administrator — Deployment approval**: the administrator inspects node layout, author, and operational fitness, then approves (see [Admin Manual · Agent Management — Deployment Approval](../admin/32-agent-operations.md#agent-mgmt-deploy-approval)).
    2. **Governance Officer — Governance approval**: the governance reviewer inspects risk category, PII impact, and policy compliance, then approves (see [Admin Manual · Agent Approval](../admin/29-governance-dashboard.md#agent-approval)).

    The agent is visible in user search/execution only after both stages pass. Progress is visible on the [Dashboard · Agent deployment/approval status](18-dashboard.md) widget, which tracks *Deployment pending / Governance pending / Both approvals completed*.

## Deployment Status

| Status | Korean | Meaning |
|---|---|---|
| Draft | 초안 | Saved but not deployed |
| Active | 활성 | Deployed and live |
| Inactive | 비활성 | Deployment paused (by admin or owner) |
| Archived | 보관됨 | No longer used |

Status is visible at a glance in the agentflow list.

## Sharing

Grant other users access to your agentflow.

1. Click the **Share** button on the target agentflow in the list
2. Search and select users
3. Choose permission

| Permission | Allowed Actions |
|---|---|
| Read | View, run |
| Read/Write | View, run, edit |

4. **Save**

## Version Management

Each save automatically creates a version. To roll back:

1. **Version History** menu on the target agentflow
2. Click **Restore This Version** on the desired version
3. Confirm in the dialog → **Restore**

!!! note "Version-history modal screenshot pending"
    A screenshot of the version history modal with the "Restore this version" buttons will be added in a future manual update.

!!! warning "Restore Creates a New Version"
    Restoring does not overwrite — it creates a **new version** containing the content of the chosen one. Previous versions are preserved.

## Scheduled Automatic Runs

For agentflows that should run on a schedule:

1. Agentflow detail → **Scheduler** tab
2. **+ Add Schedule**
3. Choose frequency

| Frequency | Korean | Description |
|---|---|---|
| Daily | 매일 | Once per day |
| Weekly | 매주 | A specific day each week |
| Monthly | 매월 | A specific date each month |
| Cron | Cron | Complex patterns (e.g., weekdays at 9 AM) |

4. Configure start time / timezone / input
5. **Save**

To pause: click **Pause** on the schedule card. To resume: click **Resume**.

![Agent Scheduler — list of registered schedules with frequency, timezone, and pause/resume controls](images/scheduler.png)

## Operational Recommendations

- **Test thoroughly before deploying** — Run 5–10 times with varied inputs on the canvas to confirm stability
- **Monitor the first 24 hours after deployment** — Check execution logs frequently to catch anomalies early
- **Save explicit versions at meaningful moments** — Saving before/after major changes makes rollback easier

## Contact

For questions about agent operations, please contact {{vars.support_email}}.
