# Getting Started

This chapter is for first-time users of the {{product.name}} solution.

## Accessing the Solution

In a web browser, navigate to:

```
https://{{product.domain}}
```

Log in with the employee ID (or email) and password provided by your organization. See the [Login](11-login.md) chapter for procedure details.

![Main screen — top header, left sidebar, and content area (work planning)](images/main-planning.png)

## Screen Layout

After login, the following areas are visible.

| Area | Description |
|---|---|
| Top header | Logo, search, notifications, user profile |
| Left sidebar | Main feature menus (Agent Workspace, Tool Integration, Knowledge, etc.) |
| Content | Work area for the selected feature |
| Right panel (when present) | Auxiliary area for help, chat, etc. |

## Sidebar Menus

The left sidebar of User Mode (Agent Workspace) is organized into 6 sections.

| Section | Main Menus | Manual Chapter |
|---|---|---|
| Analysis / Planning | Task Planning | (not covered) |
| Agent Chat | Start Chat, Current Chat, Chat History | [Using Chat](14-chat.md) |
| Agent Creation | Agent Creation Intro, Agent Design, Agent List, Agent Operation, Agent Quality Evaluation, Agent Prompts | [Creating an Agent](12-agentflow-create.md), [Agent Operations](13-agentflow-operations.md), [Prompt Management](16-prompt.md) |
| Tool Integration | API Tools, Authentication Profiles | [Authentication Profile](17-auth-profile.md) |
| Knowledge Management | Knowledge Collections, File Storage, DB Integration, Upload History | [Knowledge Management](15-knowledge.md) |
| Technical Support (pinned bottom) | Announcements, FAQ, 1:1 Admin Inquiry | — |

![Left sidebar — six sections expanded: Agent Creation, Tool Integration, Knowledge Management, Technical Support, etc.](images/main-sidebar.png)

!!! info "Two Modes in the Header"
    The solution header exposes 2 work areas:
    
    - **Agent Workspace** — the default work area for end users and Agent developers (the sidebar above)
    - **Admin** — area for system administrators and governance officers
    
    Some areas may be hidden depending on your permission tier and role.

## Recommended Path for New Users

For first-time users:

1. [Login](11-login.md) — understand the authentication flow
2. [Creating an Agent](12-agentflow-create.md) — build your first agent on the agentflow canvas
3. [Using Chat](14-chat.md) — converse with your agent
4. [Knowledge Management](15-knowledge.md) — add document collections to improve answer quality

The **FAQ** menu at the bottom of the sidebar contains frequently asked questions.

## When the Screen Does Not Display Correctly

Try the following in order.

1. Update your browser to the latest version (Chrome or Edge recommended)
2. Clear browser cache/cookies and reconnect
3. Try Incognito mode to determine if the issue is environment-specific
4. If problems persist, contact {{vars.support_email}} with a screenshot

## Contact

For technical support, please contact {{vars.support_email}}.
