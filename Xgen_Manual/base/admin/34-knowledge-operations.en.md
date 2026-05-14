# Knowledge Operations

This chapter covers organization-wide **TTL and retention policies** for knowledge collections. The single menu **Admin Settings → Knowledge Operations → Collection Management** is in scope.

> For *creating* collections, uploading documents, and running embeddings, see the user-side [Knowledge Management](../user/15-knowledge.md) chapter. This chapter is the admin lens for fleet-wide **lifecycle policy**.

## Accessing the Screen

Select **Admin Settings → Knowledge Operations → Collection Management** in the left sidebar.

![Collection Management — TTL policy inputs (max TTL / default TTL / trash grace period) at the top, full collection table below (name / owner / status / expiry / scheduled permanent deletion)](images/admin-knowledge-collection.png)

## Layout

### Top — TTL Policy

Applies to the entire organization.

| Field | Default | Meaning |
|---|---|---|
| Max TTL (days) | `90` | Cap on the expiry users can set when creating a collection |
| Default TTL (days) | `30` | Default value suggested in the create-collection UI |
| Trash grace period (days) | `14` | Window between expiry and permanent deletion (recoverable) |

Policy changes apply to **new** collections only; existing collections keep their original expiry. To re-apply, run a dedicated batch.

### Bottom — All Collections

Every collection in the organization, row by row.

| Column | Content |
|---|---|
| Name | Collection name (with internal ID) |
| Owner | Creator (individual) or `Shared` (organization-wide) |
| Status | Active / Permanent / Expired / Scheduled-for-deletion |
| Expiry | Auto-expiry date per TTL |
| Scheduled deletion | End of trash grace period (D-day for permanent removal) |
| Actions | Toggle **Mark Permanent** / **Reset Permanent** |

Toggling **Mark Permanent** removes the collection from TTL enforcement. Grant Permanent status only after explicit approval from the data owner.

## Operational Recommendations

- **Decide TTL once, review semi-annually** — Too short ⇒ repeated re-uploads (operational burden); too long ⇒ disk cost grows. Typically 30–90 days.
- **Trash grace ≥ 7 days** — Leaves room for users to recover after accidental expiry.
- **Approval required for Permanent** — Indiscriminate Permanent flagging undermines the TTL policy itself. Define an explicit request-and-review flow.
- **Pre-expiry notification** — Ensure owners receive a notice at D-7 before expiry.
- **Orphaned collections** — Define a separate hand-over / hard-delete policy for collections whose owners have been deactivated.

## Related Chapters

- [Knowledge Management](../user/15-knowledge.md) — user perspective on creating collections and uploading documents
- [Embedding / Search Settings](24-embedding-settings.md) — embedding model and vector DB configuration that drives retrieval quality

## Contact

For questions on Knowledge Operations, please contact {{vars.support_email}}.
