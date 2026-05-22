---
require_view: agentflow-tester
---
# Agent Quality Evaluation

This chapter covers the screen that **measures response quality and safety in batches** for built agents. The **Agent Creation → Agent Quality Evaluation** menu in the left sidebar is in scope.

> For the single-input debugging flow inside the canvas, see [Agent Operations · Execution and Debugging](13-agentflow-operations.md#testing). This chapter focuses on batch evaluation — running many inputs at once and scoring them.

## Accessing the Screen

Select **Agent Creation → Agent Quality Evaluation** in the left sidebar. The screen has two tabs at the top.

| Tab | Covers |
|---|---|
| **품질 평가 (Quality Evaluation)** | Test execution history + start a new test (includes Harmbench safety evaluation) |
| **품질 척도 정의 (Quality Criteria)** | Manage *criteria presets* used to score responses |

Common top-right actions: **+ New Test**, **Harmbench**, Refresh.

## Quality Evaluation Tab

Narrow the history with the top status filters (All / Running / Completed / Error) and the *Search by agentflow* box. When no tests exist, the body shows an empty state — *"테스트 기록이 없습니다 — Select an agentflow and start a test"* — with a **Start New Test** button.

### Running a New Test { #new-test }

Clicking **+ New Test** at the top right opens the **Batch Test Creation** modal. Upload a dataset file (questions + expected answers) to score many cases at once.

![Quality Evaluation — clicking "+ New Test" on the list opens the Batch Test Creation modal](images/quality-new-test.gif)

| Item | Description |
|---|---|
| Dataset format | `.xlsx`, `.xls`, `.csv`, `.json` (Harmbench / OpenAI and other common formats) |
| Column structure | At minimum `question` / `expected_answer`. Extra columns (category, tags) are used in result analysis |
| Upload method | Drag-and-drop or click-to-upload |
| Quick start | Use the *Example* or *Excel* buttons at the top of the modal to download a sample dataset |

After upload, choose the **target agent** and a **criteria preset** to run. Results return to the same history list and transition from *Running → Completed* with scores filled in.

### Harmbench Safety Evaluation { #harmbench }

The **Harmbench** button at the top right triggers an immediate safety evaluation using the **public Harmbench dataset (Standard, 250 items)** — no need to prepare your own dataset. It checks *how the model reacts to harmful prompts* against a standardized baseline.

![Quality Evaluation — clicking "Harmbench" opens the public Standard 250-item evaluation modal](images/quality-harmbench.gif)

| Item | Description |
|---|---|
| Source | HarmBench: A Standardized Evaluation Framework for Automated Red Teaming and Robust Refusal |
| Dataset size | 250 items (Standard split) |
| Columns | `behavior` (harmful scenario prompt) / `category` (taxonomy) / `behavior_id` (identifier) |
| Result | Refusal rate, bypass rate, sensitive-response rate, etc. show up as safety scores on the history card |

!!! warning "Dataset contents"
    The Harmbench dataset contains **sensitive prompts** including chemical / biological / cyber risk scenarios. They are shown verbatim on screen — do not copy or redistribute beyond evaluation use.

## Quality Criteria Tab

Manage **criteria presets** used to score responses. The solution ships *official* presets (e.g., Safety, Harmfulness, Ethics/Fairness, Expression Accuracy) and your own *custom* presets side by side as cards.

### Creating a New Preset { #new-preset }

Clicking **+ New Preset** at the top right opens the preset authoring modal.

![Quality Criteria — clicking "+ New Preset" opens the authoring modal](images/quality-new-preset.gif)

| Item | Description |
|---|---|
| Preset name | A one-liner identifiable to others (e.g., "Internal FAQ response quality") |
| Description | A paragraph about when this criteria applies |
| Category | Area classification — Safety / Accuracy / Tone / etc. |
| Criteria | Detailed metrics and weights used in scoring. Multiple can be registered per area |

Saved presets show up in the **Criteria Preset** dropdown of the *Quality Evaluation → New Test* modal.

## Recommended Flow

1. **Define criteria first** — Create the criteria preset that fits your organization *before* running tests, so all subsequent tests are comparable on the same scale.
2. **Start with a small dataset** — Begin with ≤50 sample items to learn the criteria and result interpretation, then scale up.
3. **Run Harmbench regularly** — Model or prompt changes can cause safety regressions; run it before every deploy.
4. **Share results with governance** — For agents with "Org-wide" impact scope, use the evaluation score in [AI Governance](../admin/29-governance-dashboard.md) approval review.

## Related Chapters

- [Creating an Agent](12-agentflow-create.md) — Build the agent to be evaluated
- [Agent Operations · Execution and Debugging](13-agentflow-operations.md#testing) — Quick single-input run
- [AI Governance — Risk Assessment & Review](../admin/29-governance-dashboard.md#risk-review) — Use evaluation scores in approval flow

## Contact

For Agent Quality Evaluation questions, please contact the Xgen Solution Administrator.
