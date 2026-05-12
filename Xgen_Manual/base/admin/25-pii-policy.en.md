# PII Protection Policy

This chapter covers automatic detection and masking policies for personally identifiable information (PII) in data the solution processes. This is a core chapter for regulated industries such as finance, public sector, and healthcare.

## What PII Is and Why It Must Be Protected

**PII (Personally Identifiable Information)** is information that can be used to identify a specific individual.

| Category | Examples |
|---|---|
| Direct identifiers | National ID number, driver's license number, passport number |
| Indirect identifiers | Phone number, email, date of birth, address |
| Financial information | Account number, card number |
| Health information | Medical records, prescriptions |
| Credentials | Passwords, API keys, access tokens |

The solution applies PII detection and masking at the following points.

| Stage | Behavior |
|---|---|
| Document upload | PII scan during embedding → mask or alert on detected items |
| Chat input | Alert or block if user message contains PII |
| AI response | Mask PII in LLM responses |
| Audit log | Apply PII masking to logs themselves |

## Accessing the Policy Screen

Select **Admin → AI Governance → Control Policy Management** in the left sidebar.

![Guardrails / PII Policies — built-in policies (ID, phone, email, etc.) with active toggles and add button](images/admin-guardrails.png)

## Default Policies (System-Provided)

The following defaults are active out of the box.

| Policy | Korean | Detection (regex example) | Default Masking |
|---|---|---|---|
| National ID | 주민등록번호 | `\d{6}-[1-4]\d{6}` | `******-*******` |
| Phone Number | 전화번호 | `01[0-9]-?\d{3,4}-?\d{4}` | `***-****-****` |
| Email | 이메일 | `[\w.+-]+@[\w-]+\.[\w.-]+` | `***@***.***` |
| Credit Card | 신용카드번호 | `\d{4}-?\d{4}-?\d{4}-?\d{4}` | `****-****-****-****` |
| Bank Account | 계좌번호 | `\d{3,6}-\d{2,6}-\d{6,8}` | `***-***-******` |

Each policy can be enabled or disabled individually.

## Adding Custom Policies

Add policies for organization-specific PII.

1. Click **+ Add Policy** at the top right of the policy list
2. Enter:
    - **Policy name**: localized or English
    - **Category**: PII / Financial / Credentials / Other
    - **Regex**: detection pattern (e.g., employee ID format `EMP\d{6}`)
    - **Masking pattern**: how to mask (e.g., `EMP******`)
    - **Enabled**: apply immediately?
3. Test in the **Test** area with sample text → confirm the regex matches only the intended portion
4. **Save**

!!! note "Add-policy modal screenshot pending"
    A screenshot of the regex-input and test modal opened by "+ Add Policy" will be added in a future manual update.

!!! info "Regex Tips"
    - Overly broad patterns produce false positives. Prefer `010-?\d{4}-?\d{4}` over `\d{10}`.
    - Patterns that are too narrow miss matches. Account for variations (with/without hyphens, whitespace).
    - Validate regexes on tools like [regex101.com](https://regex101.com) before registering.

## Forbidden Words

Beyond PII, you can register forbidden words (competitor codenames, unreleased product names, etc.).

1. **Forbidden Words** tab → **+ Add Word**
2. Enter the word (exact-match or substring-match)
3. Choose handling

| Handling | Behavior |
|---|---|
| Mask | Replace with `****` |
| Block | Halt processing and alert the user |
| Notify only | Allow processing but log to audit |

4. **Save**

## Policy Application Scope

Each policy can be configured per processing area.

| Area | Options |
|---|---|
| Document upload | Apply / Skip |
| Chat input | Apply / Skip / Notify only |
| AI response | Apply / Skip |
| Audit log | Apply / Skip |

!!! note "Policy scope settings screenshot pending"
    A screenshot of the per-area scope toggles (document upload / chat input / AI response / audit log) will be added in a future manual update.

!!! warning "Impact of Audit-Log Masking"
    Applying PII masking to the audit log itself can hinder accurate user-activity tracking. Balance against regulatory requirements. Recommended default: do not mask audit logs and instead strictly limit who can read them.

## Risk Levels

Tag detected PII with a risk level to drive different handling.

| Level | Korean | Handling |
|---|---|---|
| Low | 낮음 | Mask only |
| Medium | 보통 | Mask + record in audit log |
| High | 높음 | Mask + user notification + audit log |
| Critical | 위험 | Block processing + alert security team |

Assigning a risk level to a policy automatically applies the matching handling flow.

## Recommendations for Financial Sector

- **Add custom regexes** — In addition to defaults, recommend:
    - Employee/staff IDs (organization-specific format)
    - Customer IDs (CIF, contract numbers)
    - OCR text extracted from passbook stamp images
- **Be careful masking audit logs** — Original tracing may be required for regulatory reporting. Consider masking or deleting logs only after the retention window ends.
- **Quarterly policy review** — New PII types and internal codes appear over time. Inspect the policy list quarterly.
- **Test in staging first** — Validate new regexes on staging before applying to production.

## Contact

For questions about PII policy, please contact {{vars.support_email}}.
