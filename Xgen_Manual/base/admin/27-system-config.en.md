# All Settings

This chapter explains, area by area, the system environment variables managed on the **Admin Center → Environment → All Settings** screen. This screen is an advanced view that lets you review and edit **every environment variable** the solution uses from a single page.

!!! info "Use the dedicated menus first"
    For day-to-day configuration, the **dedicated menus** — *LLM*, *Search / Embedding*, *Guardrail* — are easier to use. The All Settings screen is for when you need to review or edit the same values precisely at the *key-value level*.

## Screen Layout

Select **Admin Center → Environment → All Settings** in the left menu to open the screen. A search box at the top (*"Search by variable name, path, value..."*) lets you filter instantly by key name, dotted path, or value.

Each setting is listed as a card showing the following.

| Element | Meaning |
|---|---|
| **Variable name** | Upper-case key (e.g., `EMBEDDING_PROVIDER`) |
| **Path** | Dotted configuration path (e.g., `embedding.provider`) |
| **Type badge** | Value format — `Str` / `Num` / `Bool` / `Json` / `Enum` (fixed choices) / `Array` |
| **Set / Default badge** | *Set* means it has been changed from the factory default, *Default* means it is unchanged |
| **Current value / Default** | The currently applied value alongside the factory default |

Some items also show a description of what the setting does and the available choices. Sensitive values such as passwords and API keys are masked as `********`.

!!! warning "Confirm the blast radius before changing"
    All Settings exposes keys that **directly affect how the solution behaves** — LLM, embedding, guardrail, workflow, and more. A wrong value can immediately affect in-progress chats, agent runs, and knowledge search. Review changes with your operations team beforehand, and since the same key can also be edited from a dedicated menu, record *which screen* you changed it on.

## Areas at a Glance

The category tabs may vary by environment, but they generally cover the following areas. Most are easier to configure from a dedicated menu, noted alongside.

| Area | What it configures | Dedicated menu / chapter |
|---|---|---|
| Embedding / Search | The embedding model and reranker that turn documents and queries into vectors | [Embedding & Vector Search](24-embedding-settings.md) |
| Vector DB | Connection to the vector database that stores and searches embedding vectors | [Embedding & Vector Search](24-embedding-settings.md) |
| LLM providers | The language models used for chat and inference (OpenAI / Anthropic / Gemini / vLLM, etc.) | [LLM Settings](23-llm-settings.md) |
| Guardrail | Harmful-content, forbidden-word, and personal-information (PII) filters | [Guardrail Model](25b-guardrail-model.md), [PII Policy](25-pii-policy.md) |
| Vision-language | Models that understand images and documents (OCR) | — |
| Document processing | Extracting text from images inside uploaded documents | — |
| Audio (STT / TTS) | Speech-to-text and text-to-speech | — |
| Application | Operating policies: deployment approval, sharing, sessions, security | (see [Application](#application) below) |
| Approval integration | Integration with an external e-approval system | — | <!-- require_view: gs-cert-config-exclude -->
| Knowledge retention (TTL) | Automatic expiry period for knowledge | — |
| Notification | Slack, email, and system alerts | — |
| GPU infrastructure | On-demand GPU rental and model serving | — |
| Training / experiments | Training server and experiment tracking | — |

Each area's key settings are explained below. Typing a *variable name* into the search box jumps straight to that item.

## Embedding / Search

This area turns documents and queries into vectors for knowledge search (RAG). For registration steps, see [Embedding & Vector Search](24-embedding-settings.md).

| Variable | Meaning |
|---|---|
| `EMBEDDING_PROVIDER` | Embedding provider — an external API (e.g., OpenAI) or a self-hosted server (custom). |
| `CUSTOM_EMBEDDING_URL` / `CUSTOM_EMBEDDING_MODEL_NAME` | Address and model identifier of a self-hosted embedding server. |
| `OPENAI_EMBEDDING_MODEL_NAME`, `VOYAGE_*` | Model, key, and URL when using an external provider such as OpenAI or Voyage. |
| `AUTO_DETECT_EMBEDDING_DIM` | Whether to auto-detect the vector dimension the model outputs. |
| `EMBEDDING_RERANKER_PROVIDER` / `EMBEDDING_RERANKER_MODEL` | Method and model of the reranker that reorders first-pass search results. |

!!! warning "Embedding dimension must match the vector DB dimension"
    If the vector dimension produced by the embedding model differs from the vector DB's `vector_dimension`, ingestion and search fail. When changing the embedding model, check the dimension too, and re-embed existing collections if needed.

## Vector DB

Connection details for the vector database that stores vectors and performs similarity search.

| Variable | Meaning |
|---|---|
| `QDRANT_HOST` / `QDRANT_PORT` | Vector database host and port. |
| `QDRANT_VECTOR_DIMENSION` | Dimension of stored vectors. **Must match the embedding model's output dimension.** |
| `QDRANT_USE_GRPC` / `QDRANT_GRPC_PORT` | Whether to use gRPC, and its port. |
| `QDRANT_API_KEY` | Access key when authentication is enabled. |

## LLM Providers { #llm }

Settings for the language models used in chat and inference. Each provider repeats the same set of items — *API key / default model / base URL / temperature / max tokens / request timeout*. For registration, see [LLM Settings](23-llm-settings.md).

| Variable | Meaning |
|---|---|
| `DEFAULT_LLM_PROVIDER` | The LLM provider used by default (OpenAI / Anthropic / Gemini / vLLM, etc.). |
| `LLM_AUTO_FALLBACK` | Whether to switch automatically to another provider if the default call fails. |
| `LLM_CONNECTION_TIMEOUT` / `LLM_MAX_RETRIES` | Connection wait time (seconds) and retry count. |
| `OPENAI_*` / `ANTHROPIC_*` / `GEMINI_*` / `VLLM_*` | Each provider's API key, default model, base URL, temperature, max tokens, and timeout. |

`temperature` controls how varied responses are (closer to 0 = more consistent, closer to 1 = more diverse); `max_tokens` caps the length of a single generated response.

## Guardrail / Safety

This area inspects the risk of LLM inputs and outputs. For details, see [Guardrail Model](25b-guardrail-model.md) and [PII Policy](25-pii-policy.md).

| Variable | Meaning |
|---|---|
| `GUARDER_PROVIDER` | Guard model method (none / external / self-hosted, etc.). |
| `GUARDER_API_BASE_URL` / `GUARDER_MODEL_NAME` | Guard model server address and model name. |
| `IS_AVAILABLE_GUARDER` | Whether harmful-content guarding is enabled. |
| `IS_AVAILABLE_PIIS` | Whether personal-information (PII) detection/masking is enabled. |
| `IS_AVAILABLE_FORBIDDEN_WORDS` | Whether the forbidden-word filter is enabled. |
| `GUARDER_FAIL_OPEN` | Behavior when the guard model fails. `true` keeps serving despite a failure; `false` blocks. |
| `GUARDER_RIGOROUS` | Strict mode — judges more conservatively. |

!!! note "Guard connection and enablement are separate"
    Even when a guard model server (`GUARDER_*`) is configured, no checks run if `IS_AVAILABLE_GUARDER`, `IS_AVAILABLE_PIIS`, and `IS_AVAILABLE_FORBIDDEN_WORDS` are all off. To enforce control policies, enable both the model connection and each toggle.

## Vision-Language Models

Settings for models that understand images and scanned documents, or extract text via OCR.

| Variable | Meaning |
|---|---|
| `VISION_LANGUAGE_MODEL_PROVIDER` | The vision provider to use (none / OpenAI / Anthropic / Gemini / vLLM / AWS, etc.). |
| `VISION_LANGUAGE_<provider>_*` | Each provider's API key, base URL, model name, temperature, image quality, and batch size. |
| `VISION_LANGUAGE_VLLM_MODEL_TYPE` | The type of self-served (vLLM) model; the type auto-applies sampling defaults and OCR prompts. |
| `VISION_LANGUAGE_VLLM_OCR_INSTRUCTION` | The OCR instruction prompt sent to the vision model (uses the default when blank). |

## Document Processing

Settings for extracting text from images inside uploaded documents. Choose the model provider with `DOCUMENT_PROCESSOR_IMAGE_TEXT_MODEL_PROVIDER`, then set the provider's base URL, key, and model name. Leave it as `no_model` if unused.

## Audio (STT / TTS)

| Variable | Meaning |
|---|---|
| `IS_AVAILABLE_STT` / `STT_PROVIDER` | Whether speech-to-text (STT) is enabled, and its provider. |
| `IS_AVAILABLE_TTS` / `TTS_PROVIDER` | Whether text-to-speech (TTS) is enabled, and its provider. |

Each provider also offers model-name and device (cpu/gpu) items. Turn the toggles off in environments that do not use audio.

## Application { #application }

This area sets operating policies — deployment approval, sharing, sessions, security — and **directly affects governance and security**. Take particular care when changing it.

| Variable | Meaning |
|---|---|
| `DEPLOYMENT_MODE` | Approval procedure for external agent deployment: *immediate / admin one-step / admin + governance two-step*. The two-step flow is covered in [Agent Operations](32-agent-operations.md#agent-mgmt-deploy-approval) and [AI Governance](29-governance-dashboard.md#agent-approval). |
| `REQUIRE_RE_DEPLOY_ACCEPT` | Whether editing/saving a workflow invalidates the existing deployment approval and requires re-approval. |
| `SHARE_POLICY` | How sharing relates to deployment: *independent*, or *sharing takes effect only once deployed*. | <!-- require_view: gs-cert-config-exclude -->
| `SHARE_PERMISSION_MODE` | Scope of share permissions: *read/run only*, or *read-write allowed per role*. | <!-- require_view: gs-cert-config-exclude -->
| `SHARE_ON_UNDEPLOY` | How existing shares are handled when deployment is removed: *suspend / revoke / retain*. | <!-- require_view: gs-cert-config-exclude -->
| `AGENT_DEV_PLAN_REQUIRED` | Whether selecting an Agent development plan is mandatory at deployment (request) time. |
| `ADMIN_IP_ACL` | IP whitelist allowed for super-admin login and requests. No IP check is performed when empty. |
| `ACCESS_TOKEN_EXPIRE_MIN` | Maximum session lifetime (minutes) after which the session auto-expires. |
| `INACTIVITY_TIMEOUT_MIN` | Inactivity timeout (minutes) that force-expires a session after no activity. `0` disables it. |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Period (days) during which auto re-login is possible; once expired, the user must log in again. |
| `WORKFLOW_MAX_WORKERS` | Cap on concurrent workflow executions. |
| `SIDEBAR_CONFIG` | Sidebar menu composition (JSON), usually managed via *Environment → Sidebar*. |
| `PATHFINDER_DOWNLOAD_URL` | Download link opened from the Pathfinder banner on the Agent design start screen. | <!-- require_view: gs-cert-config-exclude -->

<!-- require_view_start: gs-cert-config-exclude -->
## Approval Integration

Settings to integrate agent deployment approval with an external e-approval system.

| Variable | Meaning |
|---|---|
| `APPROVAL_ENABLED` | Whether external approval integration is used. When off, only the solution's internal approval works. |
| `APPROVAL_HOST` | Approval API base URL. |
| `APPROVAL_CLIENT_ID` / `APPROVAL_CLIENT_SECRET` | Pre-issued integration credentials (the secret is sensitive). |
| `APPROVAL_CALLBACK_BASE_URL` | Base URL that receives approval results. |
| `APPROVAL_ADMIN_APPROVERS` | Candidate email list for first-step approvers (platform admins). |
| `APPROVAL_GOVERNANCE_APPROVERS` | Candidate email list for second-step approvers (governance), used in two-step mode. |
<!-- require_view_end -->

## Knowledge Retention (TTL)

Automatic-expiry policy for uploaded knowledge.

| Variable | Meaning |
|---|---|
| `KNOWLEDGE_TTL_MAX_DAYS` | Maximum number of days that can be set as a retention period. |
| `KNOWLEDGE_TTL_DEFAULT_DAYS` | Default retention days for new knowledge. |
| `KNOWLEDGE_TTL_GRACE_PERIOD_DAYS` | Grace period (days) between expiry and actual deletion. |

## Notification

Settings to notify external channels of system events and alerts.

| Variable | Meaning |
|---|---|
| `NOTIFICATION_ENABLED` | Master switch for sending notifications. |
| `SLACK_WEBHOOK_URL` | Slack notification destination. |
| `EMAIL_SMTP_HOST` / `EMAIL_SMTP_PORT` / `EMAIL_USERNAME` | SMTP server details for email sending. |
| `CPU_ALERT_THRESHOLD` / `MEMORY_ALERT_THRESHOLD` | Resource-usage alert thresholds (%). | <!-- require_view: gs-cert-config-exclude -->
| `NOTIFICATION_*` (unified messaging) | Integration details for an in-house unified messaging system (host, client, interface identifiers, etc.). |

## GPU Infrastructure · Model Serving

Automation for renting external GPUs to serve models, plus connections to additional inference servers. These are configured by infrastructure staff during installation and operations.

| Variable | Meaning |
|---|---|
| `VAST_*` | On-demand GPU rental (VAST) settings — container image to use, instance selection criteria such as price cap, disk, and GPU RAM, plus auto-destroy and timeout. |
| `VLLM_*` (vast) | Options for the vLLM server launched on the rented GPU — served model, max context length, GPU memory utilization, parallelism. |
| `SGL_*` | SGLang inference server connection. | <!-- require_view: gs-cert-config-exclude -->
| `SESSION_STATION_*` | Connection and retention time for the session/conversation-state store. |
| `WORKFLOW_EXECUTION_TIMEOUT` | Time limit (seconds) for a single workflow execution. |

## Training · Experiments · External Integrations

| Variable | Meaning |
|---|---|
| `TRAINER_HOST` / `TRAINER_PORT` | Connection details for the model training service. |
| `MLFLOW_*` | Experiment/model tracking (MLflow) connection — tracking URL, default experiment, cache location. |
| `HF_TOKEN` / `IS_AVAILABLE_HUGGINGFACE` / `HUGGINGFACE_*` | HuggingFace model hub integration — token, enablement, API, cache, offline mode. |
| `AWS_*` | Credentials, region, and endpoint for calling AWS Bedrock. |

## Operating Recommendations

- **Prefer the dedicated menus** — LLM, embedding, guardrail, and others provide input validation and connection tests. Use All Settings for precise review and exceptional edits.
- **Back up and record before changing** — note the current value before changing it, and record the reason and the screen used. All changes are written to the audit log.
- **Handle sensitive values carefully** — deliver API keys, secrets, and tokens only through a secure channel, and avoid exposing them during screen sharing or captures.
- **Check the enable toggles** — guardrail, audio, notification, and others only work once their *enablement* flags (`IS_AVAILABLE_*`, `*_ENABLED`) are turned on, even if the model/connection is set.

## Contact

For questions about All Settings, please contact the Xgen Solution Administrator.
