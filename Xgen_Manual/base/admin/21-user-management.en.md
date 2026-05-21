# User Management

This chapter covers procedures for **approving, modifying, and deactivating** system user accounts. **New users are added through the user-side self-signup flow → Pending-Approval queue → SuperUser approval.** *The "+ Add User" button (admin directly creating an account) is not exposed on the current stg build.*

## User List { #user-list }

Select **Admin → Users / Access Control → User Management** in the left sidebar.

![User Management screen — top *Total Users / Pending Approval* stats, the *Pending Approval Users* queue, and the full user table with search and pagination, all on one screen](images/admin-users.png)

The screen has four areas:

| Area | Contents |
|---|---|
| Top stats | **Total Users** count and **Pending Approval** count |
| Search box | Filter users by email, username, or display name |
| Pending Approval Users queue | New applicants from self-signup — handle each row with the **Activate / Delete** buttons |
| Full user table | Every account — each row has **Edit / Delete** action buttons |

Columns in the full user table (headers are clickable to toggle sort):

| Column | Description |
|---|---|
| ID | Internal system identifier |
| Username | Login ID (the English ID or display name the user entered during signup) |
| Email | Address for notifications and password reset |
| Status | Active / Inactive / Pending |
| Permission (Role) | `superuser` / `standard` tier badge plus assigned role labels (e.g., *System Administrator(DJ)*, *Agent Developer(DJ)*) |
| Last Login | Most recent access time |
| Last Login IP | Source IP |
| Registered | Signup or creation time |
| Actions | **Edit / Delete** buttons |

## Adding a New User — Self-Signup + SuperUser Approval { #user-add }

New users **sign up themselves on the public signup page**, after which their account enters the *Pending Approval Users* queue. A SuperUser must hit *Activate* on that row before the user can log in.

### Step 1 — Self-signup (user-side action)

The user takes the following path on their own:

1. On the login page (`https://<domain>/login`), click the **Sign up** link at the bottom.
2. On the signup page (`/signup`), fill in email, password, display name, etc.
3. Click **Sign up** — the account is created in *Pending* state; the user cannot log in yet.

### Step 2 — SuperUser approval (admin-side action)

A SuperUser reviews and activates pending applicants from the *Pending Approval Users* area in User Management.

1. Open **Admin → Users / Access Control → User Management**.
2. Check the **Pending Approval** counter at the top of the screen (in the screenshot example, `1` pending).
3. Inspect the *Pending Approval Users* table — ID / Username / Email / Status (Pending) / Registered date.
4. After reviewing the applicant's info, use the row's action buttons:
    - **Activate** → status flips to *Active*; the user can log in immediately.
    - **Delete** → the signup is rejected and the account is removed. The user must sign up again to retry.

!!! note "SuperUser privileges required"
    Approving / rejecting pending accounts, changing permission tiers, and resetting passwords all require **SuperUser** privileges. Standard Users do not see this screen at all.

!!! info "No direct admin-side user creation on stg today"
    The *"+ Add User"* button mentioned in earlier versions of this manual is not exposed on the current stg build. New users *must* go through self-signup; the SuperUser takes over from the *Activate* step (permission tier, role assignment, etc.). For bulk onboarding (e.g., a new-hire group), contact operations for a separate API or script.

## Password Reset

An administrator can directly reset another user's password.

1. Click **Edit** on the target user in the user list
2. Expand the **Change Password** section at the bottom of the modal
3. Enter a new password → **Save**

> **Recommended:** Deliver the new password through a separate channel and instruct the user to change it on first login.

## Deactivating a User

Use this when blocking a user temporarily without removing them from the system.

1. Click **Edit** on the target user
2. Change status to **Inactive**
3. **Save**

Inactive users cannot log in, but their agentflows, collections, and chat history are preserved as-is.

!!! warning "Delete vs. Deactivate"
    Prefer **Deactivate** whenever possible. **Delete** permanently removes user data and cannot be undone. For departures or transfers, deactivation is appropriate.

## Permission Tier Changes

There are two permission tiers. Toggle them through the **User Type** select in the user-edit modal (`Standard` ↔ `Superuser`).

| Direction | Required Privilege |
|---|---|
| Standard User → SuperUser (promote) | SuperUser |
| SuperUser → Standard User (demote) | SuperUser |

All permission tier changes are recorded in the audit log. If you are the last remaining SuperUser, demoting yourself will leave the system with no one able to access the Admin Center — confirm at least one other SuperUser exists before demoting.

## Operational Recommendations

- **Unify password policy** — Apply organizational password policy when adding users. Manage minimum length, complexity, and rotation period from system settings.
- **Clean up dormant accounts** — Review accounts whose last login is older than 90 days for deactivation each quarter.
- **Forbid shared accounts** — Multiple people using one account makes audit log tracking meaningless. Enforce one-person-one-account.

## Contact

For questions about user management, please contact {{vars.support_email}}.
