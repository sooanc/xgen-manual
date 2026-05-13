# Governance Officer

> Users responsible for **risk, control, and audit** of AI usage. Usually a different role from the system administrator.

## Review and approve pending agents
- Start: Admin Settings → AI Governance → Risk Review → Agent Approval
- Procedure: [AI Governance - Risk Review](../admin/29-governance-dashboard.md#ai-위험도-평가-및-심사)
- Review items: node configuration, permission scope, PII impact

## Tune risk-category weights
- Start: Admin Settings → AI Governance → Control Policy
- Procedure: [AI Governance - Control Policy](../admin/29-governance-dashboard.md#ai-통제-정책-관리)
- Recommended: re-tune quarterly

## Add or adjust PII masking rules
- Start: Admin Settings → AI Governance → Control Policy → PII Policy
- Procedure: [PII Policy](../admin/25-pii-policy.md)

## Trace user actions (login, system-setting changes, etc.)
- Start: Admin Settings → Security & Audit → Audit Log
- Procedure: [Audit Log](../admin/27-audit-log.md)
- General-purpose system action audit

## Trace governance policy / approval changes
- Start: Admin Settings → AI Governance → Audit & Tracking
- Procedure: [AI Governance - Audit & Tracking](../admin/29-governance-dashboard.md#ai-감사추적-관리)
- Scoped to governance events (separate from the general system audit log)

## Register and manage scheduled inspections
- Start: Admin Settings → AI Governance → Inspection
- Procedure: [AI Governance - Inspection](../admin/29-governance-dashboard.md#ai-점검-이력-및-계획)

## Show me the governance overview dashboard
- Start: Admin Settings → AI Governance (default landing)
- Procedure: [AI Governance](../admin/29-governance-dashboard.md)
