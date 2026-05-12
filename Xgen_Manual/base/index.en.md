# {{product.name}} Solution Manual

**Customer:** {{customer.name}}
**Product Version:** {{product.version}}
**Manual Version:** {{manual.version}} ({{manual.released_at}})

This manual is the user and administrator guide for the {{product.name}} solution. Use the tabs at the top to navigate between sections.

## Build Source

This manual was authored and verified against the following environment.

| Item | Value |
|---|---|
| Solution domain | <https://{{product.domain}}/> |
| GitLab repository | `{{build.repository}}` |
| Source branch | **`{{build.branch}}`** |
| Capture environment | {{build.environment}} (`{{build.capture_url}}`) |

Screenshots and UI strings (menu names, buttons, placeholders) reflect the branch and environment above. Other environments (Production / STG) may differ in some labels and policy defaults; build a separate manual for those environments when needed.

## Manual Structure

- **Common**: Solution overview, terminology, and other content shared by users and administrators.
- **User**: Guide for end users who use the solution for daily work.
- **Admin**: Guide for system administrators who operate the solution.

## Contact

- Technical support: {{vars.support_email}}
