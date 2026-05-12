# Dashboard

The first screen shown immediately after login. The URL path is `{{product.domain}}/dashboard`. It collects quick-jump shortcuts to frequently used screens and widgets summarizing your activity.

## Layout

The dashboard has three parts: the **greeting card** at the top, the **left widget grid**, and the **right fixed support panel**.

![Dashboard overview — greeting card, left widget grid, and right fixed panel in one view](images/dashboard-overview.png)

> The governance widgets (Risk Policy, Forbidden-Word Policy) shown above only appear for accounts with admin permissions. End users see only personal-activity widgets like "Top 3 Frequent Agents" and "Popular Agent Templates".

### Greeting Card and Quick Navigation

The card opens with "Welcome, OOO! Which Agent would you like to start today's tasks with?" Of the four quick-jump buttons below, only **Agent Workspace** (`/main?view=agentflows`) is meaningful for end users. The other three (AI Model Management, AI Governance, Admin Settings) require admin permissions.

### Left Widget Grid

The following widgets surface based on your permissions and usage history.

| Widget | Contents |
|---|---|
| Top 3 Frequent Agents | Top 3 agents you call most often |
| Popular Agent Templates | Templates with the most views / clones |

### Right Fixed Panel

Always shown in the same position regardless of widget grid customization.

| Panel | Source | More link |
|---|---|---|
| Latest Updates | 3 most recent notices | `/main?view=support-notices` |
| FAQ | Top 3 by views | `/main?view=support-faq` |
| Recent Service Requests TOP 3 | 3 most recent service requests | `/main?view=support-qna&intent=service-request` |
| My Inquiries | Your 3 most recent 1:1 inquiries | `/main?view=support-qna` |

Use the **More >** link in each panel header to navigate to the full list.

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
- **My layout differs from a colleague's** — widget visibility, order, and hidden state are saved per user, so this is expected.
- **Last login time is missing** — the **Last login** indicator left of your username should show your previous session. If it is missing or doesn't match your memory, contact an administrator immediately (potential security incident).

## Inquiries

For dashboard-related questions, email <{{vars.support_email}}> or open a ticket via sidebar **Technical Support → 1:1 Admin Inquiry**.
