# Governance Officer

> Users responsible for **risk, control, and audit** of AI usage. Usually a different role from the system administrator.

## See the main screen tailored to my role right after login
- Start: automatic redirect right after login (or click the **XGEN** logo at the top-left)
- Procedure: [Dashboard · Governance Officer view](../admin/30-dashboard.md#governance-officer-view)
- Governance Officers (with `admin.governance:*`) see governance-only widgets — **Risk-Level Policy status**, **Banned-Term Policy status**, and the **agent approval queue** — on the main screen.

## Review and approve agents that already cleared System Administrator approval (governance approval, stage 2)
- Start: Admin Center → **AI Governance → Agentflow Approval**
- Procedure: [AI Governance · Agent Approval](../admin/29-governance-dashboard.md#agent-approval)
- Flow: only agents that already passed stage 1 ([Agent Management — Deployment Approval](../admin/32-agent-operations.md#agent-mgmt-deploy-approval)) appear in this queue. Items pushed in by a risk-threshold breach in Risk Review join the same queue.
- Queue view: click any of the four stat cards (**All / Pending / Approved / Rejected**) at the top to filter instantly.
- Review items: node layout, author, department, parameters (look at PII-exposing nodes first), category.
- Decision: **Approve** (comment optional) or **Reject** (comment **required**). Both write `governance_reviewed_by` + `governance_review_comment` + timestamp to the [audit log](../admin/27-audit-log.md) and AI Audit & Tracking permanently.
- Outcome: approved agents flip to servable immediately. Rejected agents return to the author, who fixes them and resubmits from stage 0.

## The governance approval queue is piling up (find the bottleneck)
- Start: [Dashboard · Agent deployment/approval status](../user/18-dashboard.md) widget — the *Governance pending* counter
- Procedure: click the counter → open the [Agent Approval](../admin/29-governance-dashboard.md#agent-approval) queue and use the *Pending* stat card to batch-process
- Operations: a rising counter while *Deployment pending* stays normal means stage 1 is fine but governance is the bottleneck. Sweep the queue at least weekly.

## Tune risk-category weights
- Start: Admin Center → AI Governance → Control Policy
- Procedure: [AI Governance - Control Policy](../admin/29-governance-dashboard.md#ai-통제-정책-관리)
- Recommended: re-tune quarterly

## Add or adjust PII masking rules
- Start: Admin Center → AI Governance → Control Policy → PII Policy
- Procedure: [PII Policy](../admin/25-pii-policy.md)

## Trace user actions (login, system-setting changes, etc.)
- Start: Admin Center → Security & Audit → Audit Log
- Procedure: [Audit Log](../admin/27-audit-log.md)
- General-purpose system action audit

## Trace governance policy / approval changes
- Start: Admin Center → AI Governance → Audit & Tracking
- Procedure: [AI Governance - Audit & Tracking](../admin/29-governance-dashboard.md#ai-감사추적-관리)
- Scoped to governance events (separate from the general system audit log)

## Register and manage scheduled inspections
- Start: Admin Center → AI Governance → Inspection
- Procedure: [AI Governance - Inspection](../admin/29-governance-dashboard.md#ai-점검-이력-및-계획)

## Show me the governance overview
- Start: Admin Center → AI Governance (default landing)
- Procedure: [AI Governance](../admin/29-governance-dashboard.md)
