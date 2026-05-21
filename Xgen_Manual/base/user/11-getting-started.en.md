# Agent Workspace Overview

This chapter covers what end users and Agent developers need to know upon first logging into the solution. Detailed feature usage is covered in subsequent chapters.

## Access

Agent Workspace is the default work area you land in immediately after login. At the top-left, the **Agent Workspace** button — one of the two mode-switch buttons (**Agent Workspace** / **Admin Center**) — is shown active.

1. In a web browser, navigate to the address provided by your organization:

    ```
    https://{{product.domain}}
    ```

2. Log in with your organization email and password — see [Login](10-login.md) for procedure details
3. After login you land on the [Dashboard](18-dashboard.md) automatically; the top-left **Agent Workspace** mode is selected

![Dashboard — top header, left sidebar, and content area](images/dashboard-overview.png)

The screen is composed of the following areas.

| Area | Description |
|---|---|
| Top header | Logo, the 2 mode-switch buttons (**Agent Workspace** / **Admin Center**) at the top-left, search, notifications, user profile |
| Left sidebar | Main feature menus for user mode (6 sections — see [Agent Workspace Layout](#agent-workspace-layout) below) |
| Content | Work area for the selected feature |
| Right panel (when present) | Auxiliary area for help, chat, etc. |

!!! info "Top-left mode switch — Agent Workspace vs Admin Center"
    The solution exposes 2 mode-switch buttons at the top-left.

    - **Agent Workspace** — the default work area for end users and Agent developers. This is the area this manual covers.
    - **Admin Center** — a dedicated administration area for system administrators and governance officers. By default it is hidden or disabled for standard users and Agent developers; only menus permitted by the role / permission policy become accessible. For that area, see the [Admin Manual](../admin/index.md).

    Some menus may be hidden depending on your permission tier.

## User Types in Agent Workspace { #user-types }

The menu scope shown in the Agent Workspace sidebar varies by user type.

| Tier | Korean | What you can do in Agent Workspace |
|---|---|---|
| Standard User | 일반 사용자 | Use the **Agent Chat / Technical Support / Dashboard** areas. Chat with agents the company has deployed; view announcements/FAQ; submit 1:1 inquiries |
| Agent Developer | Agent 개발자 | All of the above plus **Agent Creation / Tool Integration / Knowledge Management / Analysis & Planning** areas. Design, deploy, and operate your own agents (permission tier stays Standard User — granted as a separate role) |

The solution uses a **two-tier permission model** — Standard User and SuperUser. The "Agent Developer" category is operated as additional menu permissions granted on top of Standard User. To upgrade from Standard User to Agent Developer, request the permissions from a SuperUser. Per-role entry points and workflows are summarized in the [Task Guide](../tasks/index.md).

## Agent Workspace Layout

The left sidebar of user mode (Agent Workspace) is organized into 6 sections (some may be hidden depending on your permissions). Each menu maps to the corresponding chapter in this manual as follows.

| Section | Menu | Permission | Manual Chapter |
|---|---|---|---|
| Analysis / Planning | Task Planning | Agent Developer | [Task Planning](11a-task-planning.md) |
| Agent Chat | Start Chat | Standard User | [Using Chat · Starting Chat](14-chat.md#new-chat) |
| Agent Chat | Current Chat | Standard User | [Using Chat · Current Chat](14-chat.md#current-chat) |
| Agent Chat | Chat History | Standard User | [Using Chat · Chat History](14-chat.md#chat-history) |
| Agent Creation | Agent Creation Intro | Agent Developer | [Creating an Agent](12-agentflow-create.md) |
| Agent Creation | Agent Design | Agent Developer | [Creating an Agent · Entering Agent Workspace](12-agentflow-create.md#agent-작업실-진입) |
| Agent Creation | Agent List | Agent Developer | [Agent Operations](13-agentflow-operations.md) |
| Agent Creation | Agent Operation | Agent Developer | [Agent Operations · Scheduled Automatic Runs](13-agentflow-operations.md#scheduler) |
| Agent Creation | Agent Quality Evaluation | Agent Developer | [Agent Operations · Execution and Debugging](13-agentflow-operations.md#testing) |
| Agent Creation | Agent Prompts | Agent Developer | [Prompt Management](16-prompt.md) |
| Tool Integration | API Tools | Agent Developer | [API Tools](17a-api-tools.md) |
| Tool Integration | Authentication Profile | Agent Developer | [Authentication Profile](17-auth-profile.md) |
| Knowledge Management | Knowledge Collections | Agent Developer | [Knowledge Management · Collection List](15-knowledge.md#knowledge-collection) |
| Knowledge Management | File Storage | Agent Developer | [Knowledge Management · File Storage and DB Integration](15-knowledge.md#storage-database) |
| Knowledge Management | DB Integration | Agent Developer | [Knowledge Management · File Storage and DB Integration](15-knowledge.md#storage-database) |
| Knowledge Management | Upload History | Agent Developer | [Knowledge Management · Upload History](15-knowledge.md#upload-history) |
| Technical Support (pinned bottom) | Announcements | Standard User | [Technical Support · Notice Board](19-tech-support.md#notices) |
| Technical Support (pinned bottom) | FAQ | Standard User | [Technical Support · FAQ](19-tech-support.md#faq) |
| Technical Support (pinned bottom) | 1:1 Admin Inquiry | Standard User | [Technical Support · 1:1 Admin Inquiry](19-tech-support.md#qna) |

![Agent Workspace intro screen — left sidebar (Agent Chat, Technical Support) with STEP 1 *Understanding work areas* + STEP 2 *Pick a main menu* cards on the right](images/main-sidebar-v2.png)

!!! info "About menu names"
    Menu names on the screen may differ slightly depending on the solution version and your permissions. This manual is based on {{product.name}} {{product.version}}. If a menu is not visible, your assigned permission may not enable it — contact your system administrator.

The Dashboard is not a separate sidebar item: you reach it automatically after login or by clicking the **XGEN** logo at the top-left. Per-role widget layout is covered in the [Dashboard](18-dashboard.md) chapter.

## First-Time Checklist

A short checklist to run through the first time you use the solution. Each item links to the relevant chapter for the full procedure.

- [ ] **Verify login** — confirm you can sign in with your organization email. If not, request account activation from a system administrator.
- [ ] **Check your assigned permissions** — by looking at which sections appear in the sidebar, determine whether you are a Standard User or an Agent Developer (see the [User Types in Agent Workspace](#user-types) table).
- [ ] **Inspect the dashboard** — on the [Dashboard](18-dashboard.md) shown right after login, check that the widgets matching your role (frequently used agents, shared agents, my agents, etc.) appear.
- [ ] **Review announcements and FAQ** — open [Technical Support](19-tech-support.md) from the bottom of the left sidebar to check the latest announcements and frequently asked questions.
- [ ] **Try your first chat** — in the Agent Chat area, try your [first conversation](14-chat.md) with an agent the company has deployed.

## Operating Principles

General principles to follow when working in Agent Workspace.

1. **Trust deployed agents** — agents the company has deployed have passed governance review. If an answer is inaccurate or needs further verification, leave feedback via the star icon at the bottom of the response.
2. **Protect your work** — chats, prompts, and knowledge assets are tied to your account. Do not share your account or password.
3. **Be careful with sensitive data** — before entering personal information (resident IDs, account numbers, etc.) or confidential company data in chat, review your internal information-protection policy. PII auto-masking is applied, but policy review is the user's responsibility.
4. **Report issues via 1:1 inquiry** — screen errors, feature restrictions, and data anomalies should be filed via [1:1 Admin Inquiry](19-tech-support.md) so the system administrator can respond.

## When the Screen Does Not Display Correctly

Try the following in order.

1. Update your browser to the latest version (Chrome or Edge recommended)
2. Clear browser cache/cookies and reconnect
3. Try Incognito mode to check if the issue is environment-specific
4. If problems persist, contact {{vars.support_email}} with a screenshot

## Contact

For technical support, please contact {{vars.support_email}}.
