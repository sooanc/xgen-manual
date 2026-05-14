# Dashboard

The first screen shown immediately after login. The URL path is `{{product.domain}}/dashboard`. It collects quick-jump shortcuts to frequently used screens and widgets summarizing your activity.

> One URL, but **the widgets and quick-action buttons differ depending on the role of the logged-in account.** Standard Users and Agent Developers see different layouts, and the System Administrator / Governance Officer variants are covered separately in the [Admin Manual · Dashboard](../admin/30-dashboard.md) chapter.

## Layout (Shared Skeleton)

The dashboard has three parts: the **greeting card** at the top, the **left widget grid**, and the **right fixed support panel**. The skeleton is the same for every role; only the widgets and buttons inside change based on permissions.

![Dashboard overview — greeting card, left widget grid, and right fixed panel in one view](images/dashboard-overview.png)

### Greeting Card and Quick Navigation

The card opens with "Welcome, OOO! Which Agent would you like to start today's tasks with?" Of the four quick-jump buttons below, only the ones your permission covers are active.

| Button | Target | Standard User | Agent Developer |
|---|---|---|---|
| Agent Workspace | `/main?view=agentflows` | Enabled (enters Chat) | Enabled (enters Build) |
| AI Model Management | `/admin?view=admin-ml-model-control` | Disabled | Disabled |
| AI Governance | `/admin?view=admin-gov-risk-management` | Disabled | Disabled |
| Admin Settings | `/admin?view=admin-role-management` | Disabled | Disabled |

> For the admin-side button states (all four active), see the [Admin Manual · Dashboard](../admin/30-dashboard.md) chapter.

### Right Fixed Panel

Always shown in the same position regardless of widget grid customization.

| Panel | Source | More link |
|---|---|---|
| Latest Updates | 3 most recent notices | `/main?view=support-notices` |
| FAQ | Top 3 by views | `/main?view=support-faq` |
| Recent Service Requests TOP 3 | 3 most recent service requests | `/main?view=support-qna&intent=service-request` |
| My Inquiries | Your 3 most recent 1:1 inquiries | `/main?view=support-qna` |

Use the **More >** link in each panel header to navigate to the full list.

## Standard User View

The main screen for users who **consume** the agents the organization has already deployed, via chat. Widgets focus on **frequently used agents and popular templates** so you can jump straight to a familiar agent.

| Widget | Contents |
|---|---|
| Top 3 Frequent Agents | Top 3 agents you call most often |
| Popular Agent Templates | Templates with the most views / clones |

If the widgets look empty they will fill in as your activity accumulates. "Top 3 Frequent Agents" requires that you have already called some agents.

## Agent Developer View

The main screen for users who **build and deploy** agents themselves. On top of the Standard User widgets, it adds widgets so you can see **operations metrics for the agents you own** and **approval queue status** at a glance.

| Widget | Contents |
|---|---|
| Top 3 Frequent Agents | (Shared) Agents you call most often |
| Popular Agent Templates | (Shared) Templates with the most views / clones |
| My Agent Operations Metrics | Call volume and failure-rate summary for agents you own |
| Pending Approval Agents | Your agents currently awaiting governance approval due to risk threshold |

The operations and approval widgets do not appear when you own no agents. Right after your first deployment, if a widget is empty, use it as a shortcut into [Agentflow Operations](13-agentflow-operations.md).

## Customizing Widgets

- **Hide**: click the **Hide** button on a card's top-right.
- **Reorder**: **drag** a card to a new position (powered by `@dnd-kit/sortable`).
- **Add widget**: open the **Add widget** dropdown at the top to bring back hidden widgets.
- **Reset**: click **Reset** at the top to restore the default widget list and order.

These settings are saved per user and do not affect other users.

A full-page scroll of the dashboard:

![Full dashboard scroll — both columns extended to the bottom](images/dashboard-full.png)

## Usage Flow

1. You land on `/dashboard` automatically after login. Click the **XGEN** logo in the top-left to return from other screens.
2. Use **Top 3 Frequent Agents** to jump straight into a familiar agent.
3. Recommended flow: scan **Latest Updates** and **FAQ** on the right panel first — you'll catch system changes and common issues before starting work.
4. Hide unused widgets via **Hide**; bring them back via **Add widget** when needed.
5. Drag cards to reorder; click **Reset** to undo all customization.

## Common Issues

- **My widgets are empty** — they fill in over time as your activity accumulates. "Top 3 Frequent Agents" only appears after you call some agents.
- **My layout differs from a colleague's** — widget visibility, order, and hidden state are saved per user. The base widget *list* itself also differs between Standard Users and Agent Developers.
- **Last login time is missing** — the **Last login** indicator left of your username should show your previous session. If it is missing or doesn't match your memory, contact an administrator immediately (potential security incident).

## Related Chapters

- [Dashboard (Admin View)](../admin/30-dashboard.md) — additional widgets and operational usage for System Administrators and Governance Officers.

## Inquiries

For dashboard-related questions, email <{{vars.support_email}}> or open a ticket via sidebar **Technical Support → 1:1 Admin Inquiry**.
