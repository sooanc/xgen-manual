# Role / Permission Management

This chapter covers the **overall structure of the permission model** and the procedures for defining and assigning **roles** that match organizational job functions.

## Permission Model — Three Independent Layers { #permission-model }

XGEN's permission model is split into three layers — *Tier / Role / Permission* — that operate **independently**. People often lump them together as "permissions," but they differ in meaning, scope, and how they are managed. The single matrix below captures everything.

| # | Layer | Question it answers | Shape of the value | Defined by | Examples | Where it bites |
|---|---|---|---|---|---|---|
| **1** | **Tier** | Can this user enter the top-left **Admin Center** mode? | Single boolean flag (`is_superuser`) | System (fixed 2 levels) | Standard User / SuperUser | Visibility of the top-left **Admin Center** mode switch |
| **2** | **Role** | Among SuperUsers, which admin menus does this user see? | Multi-label array | Your organization | System Administrator, Governance Officer, Analyst, Operator, Compliance Officer, … | Menu scope inside a SuperUser's admin sidebar |
| **3** | **Permission** | Can this user use each screen / section / tab / button? | ABAC key array | Permission catalog (fixed) → mapped to a role or to an individual user | `admin.user:read`, `main.agentflow:manage`, `admin.governance-pii:*` | Section / tab / button-level gates inside a screen |

**How the layers depend on each other**

- **2 → 1**: A *role* only has meaning on top of the SuperUser tier. Granting a *System Administrator* role to a Standard User has no effect — they cannot enter Admin Center mode at all.
- **3 → 1**: *Permissions* can be granted to a Standard User. For example, an *Agent Developer* is a Standard User who has `main.agentflow:*` / `main.tool:*` / `main.knowledge:*` permissions on top.
- **3 → 2**: *Permissions* are bundled into roles, or granted directly to individual users. The recommended pattern is to bundle by role first, then reinforce only edge cases with direct grants.

### Boundaries that get confused

- **There is no intermediate "Administrator" tier.** Anyone who can open the top-left *Admin Center* mode has `is_superuser: true` — a **SuperUser**. Within that one tier, *System Administrator* / *Governance Officer* etc. are **roles** that split responsibilities. The full tier definition is in [Permission Tiers — Two-Level Model](20-admin-overview.md#permission-tiers); the two-role menu split is described in the *SuperUser Privileges Required* admonition at the top of [Admin Console Overview](20-admin-overview.md).
- **The "initial (root) SuperUser" is not a separate tier either.** It is just the very first SuperUser, created via the bootstrap path (`/admin/create-superuser`) while no SuperUser exists. From that point on, any additional SuperUser created through the user-management modal (with *User Type = Superuser*) has the identical data and flags. See [Admin Console Overview · Initial (root) SuperUser](20-admin-overview.md#permission-tiers).
- **"Agent Developer" is not a tier — it's a role/permission bundle.** Agent Developers stay at the Standard User tier (`is_superuser: false`); on top of that they are granted a role that bundles permissions like `main.agentflow:*` / `main.tool:*` / `main.knowledge:*`, which is what unlocks the Agent Creation / Tool / Knowledge sections in Agent Workspace. The flow is summarized in [Agent Workspace Overview · User Types](../user/10-getting-started.md#user-types).

### How the permission check actually runs

When the UI decides whether to show a menu or a button, the solution **always evaluates the layers in the same order**:

1. **If `is_superuser === true`, pass immediately.** SuperUsers are granted access to every admin area by tier alone.
2. Otherwise, look at the user's **permission array (`permissions`)** and try to match the required ABAC key. Wildcards such as `*:*` and `admin.user:*` participate in the match.
3. If nothing matches, the menu or button is **hidden silently** — it is not left in place as a click-able item that errors out later.

The same gate logic applies at *Admin Center access* ([Admin Console Overview](20-admin-overview.md)), the *AI Governance menu* ([AI Governance](29-governance-dashboard.md)), AI model management, and every other domain entry point. In other words, even within the SuperUser tier the *visible screens vary* depending on which role / permissions are bundled.

!!! info "Where to change which layer?"
    Switching a user between Standard User ↔ SuperUser is done from the **User Type** select (`Standard` ↔ `Superuser`) in the user-edit modal under [User Management](21-user-management.md). **Role assignment** happens in this chapter; **individual ABAC permission grants** happen either in the *Direct Permissions* section of the user-edit modal, or via the *role → permission* mapping in this chapter.

### Four scopes a user's permissions can apply through { #grant-paths }

An administrator (SuperUser) can grant permissions to a user through the four paths below (multi-select and combinations are allowed). Permission composition is handled automatically by the system, so the administrator only needs to choose *where* to grant from.

| # | How permissions are granted | Where to do it | Typical use |
|---|---|---|---|
| 1 | **Whole-tier grant** | [User Management](21-user-management.md) → user edit → *User Type* `Superuser` | A new System Administrator or Governance Officer |
| 2 | **Role + permissions bound to the role** | This chapter → *Role* tab → Create Role → *Permissions* button | An "Analyst" role bundling `main.knowledge:read` and similar |
| 3 | **Role-to-role inheritance (Supervision)** | This chapter → *Permission Hierarchy* tab → add a relation | "Team Lead ← Team Member" so the lead inherits all member permissions |
| 4 | **Direct grant to an individual user** | [User Management](21-user-management.md) → user edit → *Direct Permissions* | Temporarily granting or denying a single permission to one user |

!!! note "How the system computes the final permission set"
    A user's effective permission set is computed automatically by the system using the criteria below.

    **Evaluation order**

    1. **SuperUser check** — if the user is a SuperUser, every permission is granted immediately.
    2. **Role-based permissions** — the union of permissions from every role assigned to the user is applied.
    3. **Supervision-inherited permissions** — permissions inherited through the organizational or supervision hierarchy are added on top.
    4. **Per-user permissions** — permissions directly granted (Grant) or blocked (Deny) on the individual user are applied last.

    **Final formula**

    The final permission set is composed as:

    > Role permissions ∪ Inherited permissions ∪ Individual Grant − Individual Deny

    ※ Deny takes precedence over Grant.

    **Usage example**

    - Provide baseline access through a role,
    - Grant a specific user one extra capability on top, or
    - Block one specific capability for a specific user

    — combine the three for flexible permission control.

## Role List { #role-list }

Select **Admin → Users / Access Control → Role / Permission Management** (view ID `admin-role-management`) in the left sidebar.

![Role / Permission Management — list of roles with assigned-user counts](images/admin-roles.png)

### Screen at a glance

The page header has **two tabs** + **two action buttons** + **search**.

| Area | Contents |
|---|---|
| Tab — *Roles* | Role list / create / edit / grant permissions / assign users (this section and the next) |
| Tab — *Permission Hierarchy* | Set role-to-role relations (Supervision) — see [Permission Hierarchy](#supervision) |
| Button — *Permission Lookup* | Enter a user and inspect the *composed* permissions — only visible to SuperUsers who additionally hold `admin.permission:*` |
| Button — *Create Role* | Open the new-role modal — see [Creating a Role](#role-create) |
| Search | Filter roles by name or display name |

### Columns in a role row

| Column | Description |
|---|---|
| **Role Name (English)** | System identifier — kebab-case recommended (e.g., `analyst`, `content-manager`) |
| **Display Name** | Localized or user-facing name (e.g., "Analyst", "Content Manager") |
| **Permission Count** | Number of permissions bound to the role |
| **Description** | One-line description (or `-`) |
| **Actions** | Four buttons per row — **Users** / **Permissions** / **Edit** / **Delete** |

## Creating a Role { #role-create }

Creating a role is a **two-step** process — first register the role's name, then grant permissions via the *Permissions* button on that role's row.

### Step 1 — Register the role

1. Click the **Create Role** button at the top right of the role list. (Earlier versions of this manual referred to *"+ Add Role"*; the current stg label is **Create Role**.)
2. Fill in the modal:
    - **Role Name (English)** — e.g., `content-manager` (must be unique)
    - **Display Name** — e.g., `Content Manager`
    - **Description** — optional
3. Once the required fields are filled, the **Create** button at the bottom right is enabled — clicking it registers the role with zero permissions.

![Create-Role modal — Role Name (English) / Display Name / Description fields with Cancel and Create buttons](images/admin-role-create.png)

### Step 2 — Grant permissions

To grant permissions to the newly created role, click the **Permissions** button on that role's row in the table. A permission checklist organized by category (admin / main scope) opens — check the desired permissions and save.

!!! note "Permission-checklist screenshot pending"
    A screenshot of the *permission-category checklist* opened by the **Permissions** button on a role row will be added in a future manual update.

### Common scenarios { #scenarios }

**Case 1 — A new role for a new job function** (example: "Compliance Officer")

1. *Roles* tab → **Create Role**.
2. Modal fields: name `compliance-officer` / display name `Compliance Officer` / description "Reviews AI usage risk and inspects the audit log on a regular cadence."
3. Click **Permissions** on the new row → check `admin.governance:*` + `admin.audit:read` + `admin.user:read` → save.
4. Click **Users** on the same row → search and multi-select the compliance team → batch assign.

**Case 2 — Team-level permission bundle** (example: "EC Development Team 1", which already exists on stg)

1. On the *Roles* tab, click **Permissions** on the existing *EC Development Team 1* row to inspect the bundle (currently 33 permissions).
2. When a new member joins, click **Users** on the same row to add them; permissions follow automatically.
3. When team responsibilities change, edit *Permissions* once — the change applies to every team member instantly.

**Case 3 — One-off / temporary permission** (a single user, short-term)

- Do this from [User Management](21-user-management.md) → user edit → *Direct Permissions* (Grant / Deny), not from this chapter.
- Turning a temporary permission into a role spreads it to other users — *Direct Permissions* keeps the change scoped to that one user.

## Permission Hierarchy (Supervisor / Target) { #supervision }

Complex organizations can define **role-to-role inheritance (Supervision)** so that a supervisor role automatically picks up the permissions of its target roles.

- **Supervisor Role**: A role with the larger permission set
- **Target Role**: A role with the smaller permission set

Example: A "Team Lead" role that inherits from "Team Member" effectively holds *team-member permissions + extra lead permissions*. Whenever the team-member permissions change, the team lead receives the same change automatically.

### Workflow

1. Open the *Permission Hierarchy* tab.
2. Click **+ Add Relation** (or *Batch Create*) → select one supervisor role + N target roles.
3. Add an optional description and **Save**.

Users already assigned to the supervisor role gain the inherited permissions *immediately* — no logout or refresh needed (the sidebar updates on the next navigation).

!!! warning "Cyclic supervision is blocked"
    With `A ← B ← C` already in place, registering `C ← A` is rejected by the system. Only acyclic *supervisor ← target* edges are allowed.

!!! note "Supervision vs. direct permission grant"
    Two ways to achieve the same result:
    - Grant *member permissions + lead permissions* directly to the lead role.
    - One Supervision edge "Lead ← Member" + grant *only the extra lead permissions* to the lead role.
    
    In environments where the member permissions change often, the Supervision approach is easier to maintain — change member permissions once and the lead gets it automatically.

## Assigning Roles to Users { #user-assignment }

**Method A — From the role screen (assign multiple users at once)**

1. In the role detail screen, expand the **Assigned Users** section
2. Click **+ Add User** → search and select users
3. **Save**

**Method B — From the user screen (assign multiple roles to one user)**

1. The **Roles** section in the user edit modal
2. Select roles (multi-select)
3. **Save**

## Revoking Permissions

| Action | Procedure |
|---|---|
| Remove a user from a role | Role detail → **Assigned Users** → click **× Remove** beside the user |
| Delete the role itself | **Delete** in the role list — blocked if users are still assigned |

!!! warning "Check Before Deleting a Role"
    Before deleting, check the **assigned-user count**. If non-zero, you must first revoke the role from those users.

## Operational Recommendations

**Role naming (at creation)**

- [ ] English identifier (`name`) in *kebab-case* (e.g., `content-manager`) — it is persisted as a DB key, so consistent casing matters.
- [ ] Display name (`display_name`) aligned with the org's *job title / department name* makes user management and audit intuitive.
- [ ] One-line description — "what this role does" is decisive at hand-off and search time.

**Permission grants (role operation)**

- [ ] *Least privilege principle* — start narrow and add as needed. Broad grants like `*:*` or `admin.*:*` should never go beyond SuperUsers.
- [ ] *Temporary permissions belong in a separate role* — collect volatile temporary permissions in a *temporary* role so they can be revoked at once. Use *Direct Permissions* on a user only when the change must be scoped to one person.
- [ ] *Direct deny is for exceptions only* — use it only when a *specific user* must be blocked from a permission they inherit by role. Frequent use makes the permission flow untraceable.

**Periodic review (quarterly recommended)**

- [ ] Roles with zero assigned users — decide whether it is an intentional *container* or a cleanup miss; delete or document accordingly.
- [ ] Roles with zero permissions — review by the same standard.
- [ ] Supervision graph — remove unnecessary inheritance edges. If depth ≥ 3, reconsider whether *direct permission grants* would be simpler.
- [ ] Deprecated permission keys — if the catalog still contains keys the backend no longer uses, report to the operations team per the *Technical Appendix*.

## Common Issues { #troubleshooting }

| Symptom | Cause / What to check |
|---|---|
| "I have the permission but the sidebar menu doesn't show up." | Sidebar visibility uses *permission-prefix matching*. e.g., `admin.user:read` alone shows the *User Management* sidebar but not the *AI Governance* sidebar. The permission catalog ↔ sidebar mapping is grouped at the *feature unit*. |
| "I assigned the role but the menu still won't open." | The user may need to *re-login or refresh their token*. Alternatively, the menu may be *tier-gated* (e.g., the entire Admin Center mode) for non-SuperUsers — change *User Type* to `Superuser` from [User Management](21-user-management.md) in that case. |
| "Role deletion shows 'X users are assigned, cannot delete'." | Intentional safeguard. Use the **Users** button on the role row to bring assigned users to zero, then retry. |
| "I want to temporarily turn off a permission for one user only." | Go to [User Management](21-user-management.md) → edit → *Direct Permissions* and set the permission to **Deny**. When a *role → grant* coexists with a *direct → deny*, deny wins. |
| "A new feature's permission isn't in the catalog." | Permission definitions are managed in a single *permission-catalog file* bundled with the solution build (see [Technical Appendix](#technical-note)). If a new feature's permission is missing from the grant UI, contact the operations / platform team. |
| "I don't see the *Permission Lookup* button." | *Permission Lookup* is shown only to SuperUsers who additionally hold `admin.permission:*`. Verify you are a SuperUser and that this permission is bundled into your role. |

## Technical Appendix { #technical-note }

Useful background for the operations / platform team — regular admins can safely skim this section.

- **Single source of truth for permission definitions**: a single *permission-catalog file* bundled with the solution build manages every ABAC key and its sidebar / tab mapping. It must stay 1:1 in sync with the backend's `@require_perm()` decorators — *adding a new permission is a development-side task*.
- **Key format**: `{scope}.{domain}[-{subdomain}]:{action}` — e.g., `admin.user:create`, `main.agentflow:manage`, `admin.governance-pii:read`.
- **Wildcard matching**: `*:*` (all), `admin.user:*` (all actions on one resource). Matching is always *prefix startsWith*; if *any* entry in the user's permission array starts with the required prefix, the check passes.
- **Composing the user's final permission set**: the backend returns the composed result through a single API (`GET /api/admin/permissions/resolve/{userId}`). The client does not re-run composition logic — it uses the *role array, permission array, and `is_superuser` flag* it received as is.
- **Hidden (deprecated) permissions**: deprecated permissions that still exist in the DB are blocked from the UI via a *hidden-key list*. They disappear safely without runtime impact.

## Contact

For questions about roles and permissions, please contact {{vars.support_email}}.
