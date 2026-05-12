# User Management

This chapter covers procedures for adding, approving, modifying, and deactivating system user accounts.

## User List

Select **Admin → Users / Access Control → User Management** in the left sidebar.

![User management list — search box, status filter, add button, and per-user columns](images/admin-users.png)

The following information is shown for each user.

| Column | Description |
|---|---|
| Username | Login ID |
| Name | Display name |
| Email | Address for notifications and password reset |
| Role | Assigned role (may be empty) |
| Permission Tier | Standard User / Administrator / Superuser |
| Status | Active / Inactive / Pending Approval |
| Last Login | Most recent access time |

Use the search box at the top to find users by name or email, and filter by status to view only "Pending Approval" entries.

## Add User

1. Click the **+ Add User** button at the top right of the user list
2. Enter the following:
    - Username (English, must be unique)
    - Name
    - Email
    - Initial password (recommend the user change it after first login)
    - Permission tier (default: Standard User)
3. Click **Save**

!!! note "Add-user modal screenshot pending"
    A screenshot of the modal opened by "+ Add User" (username, email, permission tier fields) will be added in a future manual update.

!!! note "Administrator Privileges Required"
    Adding users and changing permission tiers requires **Administrator** or higher privileges. Granting **Superuser** can be done only by another Superuser.

## Approving Pending Users

In environments where self-signup is enabled, new applicants enter the **Pending Approval** state. Administrator review and approval is required before they can log in.

1. Check applicants in the **Pending Approval** area at the top of the user list
2. Review applicant info (name, email, organization)
3. Click **Approve** → converts to active user
4. Click **Delete** to reject

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

| Direction | Required Privilege |
|---|---|
| Standard User → Administrator | Administrator or Superuser |
| Administrator → Superuser | Superuser only |
| Any tier → Standard User (downgrade) | Administrator or higher |

All permission tier changes are recorded in the audit log.

## Operational Recommendations

- **Unify password policy** — Apply organizational password policy when adding users. Manage minimum length, complexity, and rotation period from system settings.
- **Clean up dormant accounts** — Review accounts whose last login is older than 90 days for deactivation each quarter.
- **Forbid shared accounts** — Multiple people using one account makes audit log tracking meaningless. Enforce one-person-one-account.

## Contact

For questions about user management, please contact {{vars.support_email}}.
