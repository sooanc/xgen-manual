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

## Role List

Select **Admin → Users / Access Control → Role / Permission Management** in the left sidebar.

![Role / Permission Management — list of roles with assigned-user counts](images/admin-roles.png)

Each role has the following attributes.

| Item | Description |
|---|---|
| Role Name | English identifier (e.g., `analyst`, `operator`) |
| Display Name | Localized name (e.g., "Analyst", "Operator") |
| Permissions | List of feature access permissions this role holds |
| Supervisor Role | (Optional) The parent role above this one |
| Assigned Users | Users currently holding this role |

## Creating a Role

1. Click the **+ Add Role** button at the top right of the role list
2. Enter:
    - Role name (English, unique)
    - Display name (localized)
    - Description (optional)
3. Check the desired permissions in the **Permissions** section
4. **Save**

!!! note "Add-role screen screenshot pending"
    A screenshot of the permissions-checklist screen opened by "+ Add Role" will be added in a future manual update.

## Permission Hierarchy (Supervisor / Target)

Complex organizations can define hierarchical relationships between roles.

- **Supervisor Role**: A role with the larger permission set
- **Target Role**: A role with the smaller permission set

Example: A "Team Lead" role contains all permissions of "Team Member" plus additional "Member Activity Monitoring." Users assigned to a supervisor role automatically inherit the target role's permissions.

## Assigning Roles to Users

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

- **Keep the role count small** (5–10). Too many roles inflate management overhead.
- **Match names to org structure** — Aligning role names with job titles or department names is intuitive.
- **Use a separate "temporary" role** — Volatile temporary permissions should not be granted directly to users; instead, group them in a "Temporary" role that can be revoked all at once.

## Contact

For questions about roles and permissions, please contact {{vars.support_email}}.
