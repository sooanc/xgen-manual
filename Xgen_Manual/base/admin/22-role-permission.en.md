# Role / Permission Management

This chapter covers procedures for defining and assigning **roles** and **permissions**.

> **SuperUser** — an administrator account that can enter the top-left *Admin Center* mode. The sidebar menu scope (System Administrator, Governance Officer, etc.) varies by the **role** assigned. SuperUser is granted in [User Management](21-user-management.md) by setting **User Type** to `Superuser` in the user-edit modal.

## Permission Model — Two Layers { #permission-model }

XGEN's permission model has two layers — *Role / Permission*.

| Layer | Question it answers | Shape of the value | Defined by | Examples | Where it bites |
|---|---|---|---|---|---|
| **Role** | Which admin menus does this user see? | Multi-label array | Your organization | System Administrator, Governance Officer, Analyst, Operator | Menu scope shown in the sidebar |
| **Permission** | Can this user use each section / tab / button inside a screen? | ABAC key array | Permission catalog → mapped to a role or to a user | `admin.user:read`, `main.agentflow:manage` | Section / tab / button-level gates inside a screen |

Permissions are **bundled into roles** or **granted directly to individual users**. The recommended pattern is to bundle by role first, then reinforce only edge cases with direct grants.

### How Permissions Are Checked

The menus and buttons a user can see are controlled automatically by the system based on the user's permissions. The check proceeds in the order below.

**1. Check whether the user is an administrator (SuperUser)**

The system first checks whether the account is a SuperUser. SuperUser accounts have access to every administrative function by default.

Note that menu access for *System Administrators* and *Governance Officers* may be partially separated according to internal operational policy.

**2. Check the user's permissions**

If the user is not a SuperUser, the system determines accessible menus based on the permissions granted to that user.

Examples:

- Has *User Management* permission → User Management menu is shown
- Has *Agent Creation* permission → Agent Creation menu is shown
- Has *Knowledge Management* permission → Knowledge Management menu is shown

**3. Features without permission are hidden automatically**

Menus and buttons for which the user lacks the required permission are not shown. Users only see the features available to them; everything else is hidden silently.

### Three Ways to Grant Permissions { #grant-paths }

An administrator (SuperUser) can grant permissions to a user through the three paths below (multi-select and combinations allowed).

| # | How permissions are granted | Where to do it | Typical use |
|---|---|---|---|
| 1 | **Role + permissions bound to the role** | This chapter → *Role* tab → Create Role → *Permissions* button | An "Analyst" role bundling `main.knowledge:read` and similar |
| 2 | **Role-to-role inheritance (Supervision)** | This chapter → *Permission Hierarchy* tab → add a relation | "Team Lead ← Team Member" so the lead inherits all member permissions |
| 3 | **Direct grant to an individual user** | [User Management](21-user-management.md) → user edit → *Direct Permissions* | Temporarily granting or denying a single permission to one user |

## Role List { #role-list }

Select **Admin Center → Users / Access Control → Role / Permission Management** in the left sidebar (view ID `admin-role-management`).

![Role / Permission Management — registered roles and the number of users assigned to each](images/admin-roles.png)

### Screen at a glance

The page header has **2 tabs** + **2 action buttons** + **search**.

| Area | Content |
|---|---|
| Tab — *Role* | Role list / create / edit / grant permissions / assign users |
| Tab — *Permission Hierarchy* | Set supervisor / target relationships between roles ([Permission Hierarchy](#supervision)) |
| Button — *Inspect Permissions* | Look up a user's *composed* permissions — only visible to SuperUsers who hold the `admin.permission:*` permission |
| Button — *Create Role* | Open the new-role modal ([Creating a Role](#role-create)) |
| Search | Filter the list instantly by role name / display name |

### Columns in a role row

| Column | Description |
|---|---|
| **Role name (English)** | System identifier — kebab-case recommended (e.g., `analyst`, `content-manager`) |
| **Display name** | Korean or screen-facing name (e.g., "분석가", "콘텐츠 관리자") |
| **Permission count** | Number of permissions bound to this role |
| **Description** | One-line description (`-` if empty) |
| **Actions** | Four buttons per row — **Users** / **Permissions** / **Edit** / **Delete** |

## Creating a Role { #role-create }

Role creation is a **two-step** process — register the role first, then click the *Permissions* button on the role row to grant the permission checklist.

### Step 1 — Register the role

1. Click **Create Role** at the top right of the role list
2. Fill in the modal:
    - **Role name (English)** — e.g., `content-manager` (must be unique)
    - **Display name** — e.g., `콘텐츠 관리자`
    - **Description** — (optional)
3. Once all required fields are filled, the **Create** button at the bottom right activates. Clicking it registers the role with 0 permissions.

![Create-role modal — fields for English role name / display name / description with Cancel and Create buttons](images/admin-role-create.png)

### Step 2 — Grant permissions

To grant permissions, click the **Permissions** button on the role row. A category-grouped permission checklist (admin / main scopes) expands; check the needed permissions and save.

!!! note "Permission checklist screenshot deferred"
    A screenshot of the *permission category checklist* (shown when clicking the **Permissions** button on a role row) will be added in a later revision.

### Common scenarios { #scenarios }

**Case 1 — A new job function needs its own role** (example: "Compliance Officer")

1. *Role* tab → **Create Role**
2. Modal fields: role name `compliance-officer` / display name `컴플라이언스 담당` / description "AI usage risk review and routine audit-log inspection"
3. **Permissions** button on the row → check `admin.governance:*` + `admin.audit:read` + `admin.user:read` → save
4. **Users** button on the row → multi-select compliance team members → bulk assign

**Case 2 — Team-level permission bundle** (example: "EC Development Team")

1. On the *Role* tab, click **Permissions** on the existing *EC Development Team 1* row to inspect the bundle
2. When a new team member joins, click **Users** on the same row and add them — permissions follow automatically
3. When the team takes on a new responsibility, check the new permission via the **Permissions** button — it applies to the whole team instantly

**Case 3 — One-off temporary permission** (for a single user only)

- Do this in the user-edit modal in [User Management](21-user-management.md), under the *Direct Permissions* section — Grant or Deny
- Creating a *role* for a temporary permission affects other users too; *Direct Permissions* is safer for a single-user scope

## Permission Hierarchy (Supervisor / Target) { #supervision }

In complex organizations you can define supervisor / target relationships between roles so that *a supervisor role inherits its target role's permissions automatically*.

- **Supervisor Role**: holds the larger permission set
- **Target Role**: holds the smaller permission set

Example: if a "Team Lead" role supervises a "Team Member" role, the lead receives *team-member permissions + team-lead-specific permissions*. Any later change to team-member permissions propagates to the lead automatically.

### Workflow

1. Enter the *Permission Hierarchy* tab
2. **+ Add Relation** (or *Bulk Create*) → pick 1 supervisor role + N target roles
3. Fill in a description (optional) and **Save**

Users assigned to the supervisor role hold the inherited permissions immediately — no re-login required (the sidebar refreshes on the next navigation).

## Assigning Roles to Users { #user-assignment }

**Option A — From the role screen (one role → many users)**

1. Expand the **Assigned Users** section on the role detail screen
2. Click **+ Add User** → search and select users
3. **Save**

**Option B — From the user screen (one user → many roles)**

1. Open the **Roles** section in the user-edit modal
2. Select roles (multi-select allowed)
3. **Save**

## Revoking Permissions

| Action | Procedure |
|---|---|
| Remove a user from a role | Role detail → **Assigned Users** → click **× Remove** next to the user |
| Delete the role itself | Click **Delete** in the role list — blocked if any user is still assigned to this role |

!!! warning "Check before deleting a role"
    Confirm the **assigned user count** before deletion. If it is not zero, revoke the role from those users first.

## Operational Recommendations

**Role naming (creation)**

- [ ] English identifier (`name`) — *kebab-case* (e.g., `content-manager`). It becomes a DB key and is preserved permanently, so consistency matters.
- [ ] Display name (`display_name`) — align with your organization's job-title / department naming so user management and audits are intuitive.
- [ ] Description — keep it to one line. "What does this role do?" is decisive for handover and search.

**Granting permissions (role operations)**

- [ ] *Least-privilege principle* — start narrow, add as needed. Broad permissions (e.g., `*:*`) should only ever be granted to SuperUsers.
- [ ] *Group temporary permissions into a separate role* — collect volatile temporary permissions into a *temporary role* so that you can revoke them in one go. *Direct Permissions* on a user is for single-user cases only.
- [ ] *Direct Deny is for exceptions* — use only when a user must be blocked from a permission they would otherwise receive via a role. Frequent use makes permission flow untraceable.

**Periodic review (quarterly recommended)**

- [ ] Roles with 0 assigned users — decide whether they are intentional *containers* or cleanup leftovers; delete or annotate accordingly.
- [ ] Roles with 0 permissions — same review.
- [ ] Supervision graph — remove unnecessary inheritance relationships. If the depth exceeds 3, consider whether *direct permission grants* would be simpler.

## Common Issues { #troubleshooting }

| Symptom | Cause / what to check |
|---|---|
| "I have the permission but the sidebar menu doesn't appear" | Sidebar visibility is decided by *permission prefix matching*. Example: holding only `admin.user:read` shows the *User Management* sidebar but not *AI Governance*. |
| "The role is assigned but the menu doesn't open" | The user may need to *re-login or refresh the token*. Or it may be a menu that requires SuperUser privilege (e.g., the entire Admin Center mode) — change **User Type** to `Superuser` in [User Management](21-user-management.md). |
| "Role delete says 'X users are assigned and it cannot be deleted'" | This is the intended safety check. Click the **Users** button on the row, reduce the assigned count to 0, and try again. |
| "I want to temporarily turn off a permission for one user only" | Go to [User Management](21-user-management.md) → edit → *Direct Permissions* and set the permission to **Deny**. When *role → grant* and *direct → deny* both exist, deny wins. |
| "The Inspect Permissions button is not visible" | *Inspect Permissions* is exposed only to SuperUsers who hold `admin.permission:*`. Verify whether this permission is included in your role. |

## Contact

For role / permission inquiries, contact the Xgen Solution Administrator.
