# {{product.name}} Solution Manual

**Customer:** {{customer.name}}
**Product Version:** {{product.version}}
**Manual Version:** {{manual.version}} ({{manual.released_at}})

This manual is the user and administrator guide for the {{product.name}} solution. You can navigate it in two ways.

## Quick Start — [Task Guide](tasks/index.md)

Find the right chapter by your **role and what you want to do** — no need to memorize menus. Pick one of these four roles:

- Standard User — chat with agents, technical support
- Agent Developer — design, deploy, get approval
- System Administrator — users, permissions, LLM, infrastructure
- Governance Officer — approval, control policy, audit

→ [Open the Task Guide](tasks/index.md)

## Menu Reference

Use this when you already know which menu you're after and want full detail.

- [**Common**](common/) — solution overview, terminology, shared content
- [**User**](user/) — screens used by end users and developers (Agent Workspace)
- [**Admin**](admin/) — screens used by system administrators and governance officers (Admin Center)

## Build Source

This manual was authored and verified against the following environment.

| Item | Value |
|---|---|
| Solution domain | <https://{{product.domain}}/> |
| GitLab repository | `{{build.repository}}` |
| Source branch | **`{{build.branch}}`** |
| Capture environment | {{build.environment}} (`{{build.capture_url}}`) |

Screenshots and UI strings (menu names, buttons, placeholders) reflect the branch and environment above. Other environments (Production / STG) may differ in some labels and policy defaults; build a separate manual for those environments when needed.

## Contact

- Technical support: {{vars.support_email}}
