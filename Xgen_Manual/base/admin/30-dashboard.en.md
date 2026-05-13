# Dashboard (Admin View)

The `/dashboard` screen you land on after login is shared by all users, but accounts with admin permissions see additional governance/operations widgets and have all four quick-jump buttons enabled.

> Refer to [User Manual · Dashboard](../user/18-dashboard.md) first for layout fundamentals and widget customization. This chapter covers the **admin-only additions** and **operational usage** that build on top of that.

![/dashboard as seen by an admin — greeting subtitle "System Operations & Deployment Dashboard" and admin-only governance/forbidden-word widgets rendered alongside common widgets](images/admin-dashboard-view.png)

## What Changes for Administrators

### Greeting Card Subtitle

For system administrators (`system_admin` role), the greeting subtitle reads **"System Operations & Deployment Dashboard"** with the helper text "Continuously monitors AI platform health and operational status, supporting reliable service delivery."

### All Four Quick-Jump Buttons Enabled

| Button | Destination | Purpose |
|---|---|---|
| Agent Workspace | `/main?view=agentflows` | Operate agentflows (same as user) |
| AI Model Management | `/admin?view=admin-ml-model-control` | LLM / embedding model management |
| AI Governance | `/admin?view=admin-gov-risk-management` | Risk-grade and forbidden-word policies |
| Admin Settings | `/admin?view=admin-role-management` | Users, roles, permissions |

### Admin-Only Widgets (requires `admin.governance:*`)

| Widget | Contents |
|---|---|
| Risk Policy | Active status · grade ranges (critical/high/medium/low) · evaluation category and check-item counts |
| Forbidden-Word Policy | Total / enabled / disabled rule counts · top 5 rules |

These two widgets only appear in the widget grid for accounts with `admin.governance:*`. Without the permission they are not even listed — when someone reports "I can't see the widget," check permission grants first.

### Right-Panel Interpretation Differs

The four items in the right fixed panel are the same as the user view, but **Recent Service Requests TOP 3** and **My Inquiries (1:1 Admin)** mean "items to handle" for admins.

## Operational Usage

1. **Verify policy reflection immediately after changes** — After editing a risk-grade or forbidden-word policy, confirm the dashboard **Risk Policy** / **Forbidden-Word Policy** widgets update instantly. If they do not, suspect a cache or permission-sync issue.
2. **Shortcut entries reduce task friction** — Use **AI Governance** for policy edits and **Admin Settings** for permission grants. No need to click through the sidebar each time.
3. **Catch high-impact issues quickly** — Scan the right panel's **Latest Updates** (all-user notices) and **Recent Service Requests TOP 3** at least once daily to surface user-impacting issues.
4. **Share a recommended widget layout** — When onboarding a new admin, recommend: in their account, **Reset** → arrange the recommended widget configuration → screenshot it into operations docs (widget settings are per-user; forced sync is not supported).
5. **Verify widgets per role** — After creating a new role, log in as that role and inspect the visible widgets on the dashboard (visual verification of role/permission grant results).

## Common Operational Issues

| Symptom | Cause / What to Check |
|---|---|
| Governance widgets are not visible | Confirm the account has `admin.governance:*` |
| **Risk Policy** widget shows "Inactive" | The policy itself is disabled. Use **AI Governance** to enable it |
| **Forbidden-Word Policy** widget shows 0 rules | New environment with no rules registered. Adding rules reflects automatically |
| Right-panel **Recent Service Requests** is empty | No user-side requests, or the admin lacks permissions for the relevant categories |
| New admin sees a different widget layout | Widget settings are per-user. Guide them to **Reset** to start from default |

## Related Chapters

- [User Manual · Dashboard](../user/18-dashboard.md) — layout fundamentals and widget customization
- [AI Governance](29-governance-dashboard.md) — risk review, inspection, audit, and control-policy menus
- [Roles & Permissions](22-role-permission.md) — how to grant permissions like `admin.governance:*`

## Inquiries

For dashboard permission / widget visibility questions, email <{{vars.support_email}}>.
