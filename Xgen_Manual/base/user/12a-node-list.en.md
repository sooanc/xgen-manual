# Agent Node List

This chapter covers the full **node catalog** you can use when building an agentflow on the canvas, along with the input/output and parameter **detailed specs** for each node. Every node (agentflow building block) registered in the platform is listed by category, so reading it alongside the [Creating an Agent](12-agentflow-create.md) node-adding steps helps you quickly decide which node to pick and how to wire it.

> For the actual procedure of adding nodes to the canvas, see [Creating an Agent · Adding Nodes](12-agentflow-create.md#add-node). This chapter is the reference for the nodes you choose there.

## Node Categories

The root category **XGen** contains 10 function groups, each composed of the nodes listed below. Drag any node onto the canvas to add it to an agentflow.

> Environment-specific agents may appear under the *Agent* group, so the exact list can vary slightly by environment. The catalog below reflects the standard solution environment.

### MCP (`mcp`)
| Node | ID | Description |
|---|---|---|
| MCP Tool Loader | `mcp/MCPLoader` | Connect to any MCP (Model Context Protocol) server and load all its tools at once. Pick an active MCP session |
| Tavily Search MCP | `mcp/tavily_search_mcp` | Search the web with Tavily — AI-optimized search returning structured results. Domain filter, summary, raw content |
| Brave Search MCP | `mcp/brave_search_mcp` | Real-time web search via Brave Search API. Filter by country and period (day/week/month/year), adjust result count |
| EPG DAUM MCP | `mcp/epg_daum_mcp` | Fetch Korean home-shopping TV schedules from DAUM. Broadcast times, program names, channel info (cache-supported) |
| EPG NAVER MCP | `mcp/epg_naver_mcp` | Fetch Korean home-shopping TV schedules from NAVER. Same features as DAUM EPG, NAVER data source |
| GitHub MCP | `mcp/github_mcp` | Manage GitHub repos via natural language — repos, issues, PRs, code search. App auth |
| GitLab MCP | `mcp/gitlab_mcp` | Manage GitLab projects via natural language — projects, branches, files, issues, merge requests |
| Meta Search MCP | `mcp/meta_search_mcp` | AI auto-finds and crawls relevant sites for comprehensive info. No API key needed |
| Naver Datalab MCP | `mcp/naver_datalab_mcp` | Search trend analytics and shopping insights. Popular terms, search-volume trends, shopping category insights |
| Naver News MCP | `mcp/naver_news_mcp` | Korean news search via Naver News API. Sort by relevance/date. Requires Naver Open API auth |
| PostgreSQL MCP | `mcp/postgresql_mcp` | Direct read-only connection to a PostgreSQL DB. Enter host, port, user, password, DB name |
| Database Loader | `mcp/DatabaseLoader` | Load a pre-configured DB connection. AI auto-uses list_tables / get_schema / query tools |
| Product Search MCP | `mcp/product_search_mcp` | Product search with filters — popular, upcoming broadcasts, past broadcasts, currently selling |
| Slack MCP | `mcp/slack_mcp` | Connect AI to Slack workspace — send messages, manage channels, search conversations. Slack User Token required |
| Nano Banana MCP | `mcp/nano_banana_mcp` | Generate/edit images via Google Gemini. Flash and Pro models, 1K~4K resolution |
| Atlassian MCP | `mcp/atlassian_mcp` | Manage Jira issues and Confluence docs via natural language. Cloud and On-premise supported |
| Microsoft 365 MCP | `mcp/ms365_mcp` | Connect AI to Microsoft 365 — Outlook Mail, Calendar, Teams, OneDrive, Planner, Excel |
| API Collection Loader | `mcp/APICollectionLoader` | Load admin-registered API collection (ToolGraph). AI auto-uses search_tools / call_tool |
| Web Automation (Playwright) | `mcp/WebAutomationMCP` | Web-task automation via Playwright browser control. Excel-to-form auto-input with pre-save confirmation |
| Database Reader | `mcp/DatabaseReader` | Run fixed SQL queries against a pre-configured DB connection. PostgreSQL, Oracle, Informix |

### Agent (`agents`)
| Node | ID | Description |
|---|---|---|
| Agent Planflow | `agents/planflow` | Deterministic Plan-and-Execute agent. Intent parsing → graph-based plan → sequential execution → natural-language response |
| Agent Xgen | `agents/xgen` | The core AI brain of a workflow. Auto tool selection. OpenAI, Anthropic, Google, AWS models |
| Agent Harness | `agents/run_harness` | Run a saved Harness workflow as a single agent step (system_prompt, tools, strategies, RAG, DB, MCP) |

### API Loader (`api_loader`)
| Node | ID | Description |
|---|---|---|
| API Calling Tool | `api_loader/APICallingTool` | Build a custom REST API tool and connect it to the Agent. Response-data filtering supported |
| API Tool Loader | `api_loader/APIToolLoader` | Load admin-registered API tools from a dropdown instantly |

### Document Loader (`document_loaders`)
| Node | ID | Description |
|---|---|---|
| Search Context | `document_loaders/VectorDBContext` | Unified document search. Select search mode to configure vector-DB retrieval. Connect to Agent RAG Context |
<!-- require_view_start: node-ontology-search -->
| Ontology Search | `document_loaders/OntologySearch` | Graph-based ontology search using SPARQL + SCS context. Returns relevant triples and source chunks |
<!-- require_view_end -->
| Search Context (260517) | `document_loaders/VectorDBContextV2` | Search Context redesign (2026-05-17). Only essential options exposed, advanced tuning uses best-practice defaults |

### File System (`file_system`)
| Node | ID | Description |
|---|---|---|
| Table Data MCP | `file_system/table_data_mcp` | Give AI the ability to work with tabular data (Excel, CSV). Natural-language read, analyze, transform |
| FileSystem Storage | `file_system/filesystem_storage` | Give AI access to a file system. Browse, read, create, modify files in a designated storage area |
| Document Adapter | `file_system/document_adapter` | Edit form documents (DOCX/PPTX/HWPX). 9 tools (inspect_document / get_cell / get_shapes / render_template …) |

### Memory (`memory`)

| Node | ID | Description |
|---|---|---|
| DB Memory (Smart) | `memory/db_memory_v3` | The smartest conversation memory. Filters unreliable AI responses, time-based decay, smart selection of related past chats |

### Router (`router`)

| Node | ID | Description |
|---|---|---|
| Router | `router/Router` | Branch data into different paths by key value. Output handles dynamically generated per key value |

### Tool (`tools`)
| Node | ID | Description |
|---|---|---|
| A2UI v0.9 Tools | `tools/a2ui_v0_9` | A2UI v0.9 UI-spec authoring tools. Catalog browse, component inspect, spec validation → safe UI JSON |
| Certificate PDF Tool | `tools/Certificate PDF Tool` | Auto-generate certificate PDFs from provided data — certificates, awards, completion forms |
| Hierarchy Tools | `tools/hierarchy_tools` | Manager-worker Agent hierarchy. Manager delegates subtasks to specialist workers + combines results |
| Image Loader | `image_loader` | Load images (URL or upload) into Agent images input for visual analysis |
| Input Files | `input_files` | Receive user file uploads. Workflow starting point for processing documents, spreadsheets, images |
| Input Template | `input_template` | Dynamic prompts using `{{variable}}` placeholders. Reusable prompt patterns |
| Local CLI Tool | `tools/local_cli_tool` | Run pre-approved CLI commands on the local machine (Tauri desktop only). Git, Node.js, Python safe execution |
| Agent Planner | `tools/agent_planner` | Step-by-step work plan generation. Decompose complex tasks → connect plan output to Agent plan input |
| Sandbox Code Executor | `tools/sandbox_exec` | Run code in an isolated throwaway KVM VM. Calculation, data transformation, logic validation |
| Schema Provider (Input) | `input_schema_provider` | Define input JSON schema for the AI. Connect to nodes that need structured input |
| Schema Provider (Output) | `output_schema_provider` | Define output JSON schema. AI structures responses accordingly for consistent, parseable answers |
| Value Processor | `tools/value_processor` | Extract/transform values from structured input (JSON, XML, YAML, CSV, text, regex) |
| Workbench Prompt | `tools/workbench_prompt` | Pull centrally-managed, versioned prompts from Workbench Prompt Studio (dev/stg/prd stages) |
| Workflow Tool | `tools/workflow_tool` | Use another saved workflow as a tool. Agent can call sub-workflows — modular workflow design |

### Start Node (`startnode`)

| Node | ID | Description |
|---|---|---|
| Input String | `input_string` | Receive user text input or set a fixed text value. Starting point for text-input workflows |

### End Node (`endnode`)
| Node | ID | Description |
|---|---|---|
| Print Agent Output | `tools/print_agent_output` | Display Agent output in the workflow UI. Connect to Agent output to surface responses |
| Print Format | `tools/print_format` | Custom-templated formatted output. Scores, timestamps, iteration details, to-do lists in structured layout |
| Send Email | `tools/send_email` | Give AI email-sending capability. Configure SMTP → Agent composes and sends emails as part of the workflow |

## Start / End Node Detailed Spec { #node-io-spec }

The **start node** and **end nodes** that handle a workflow's I/O have a fairly fixed port/parameter layout, so their detailed specs are listed below. The *Item* column distinguishes **Input** (data coming into the node), **Output** (data the node emits), and **Parameter** (values set directly in the node's settings panel). Parameters marked "Optional" fall back to their default behavior when left blank.

### Input String (`input_string`)

The starting point of a workflow — receive text input from the user or set a fixed text value. It works in two modes: the user types a question directly, or a predefined text is passed through.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Input format | InputSchema | — | The input-schema definition passed when the node runs. Forwarded automatically from connected nodes. |
| Output | Text | STR | — | Emits the entered text as a string (STR). Can then be connected to agent, transform, and other nodes. |
| Parameter | Input value | STR | Optional | Enter text to fix in advance. Leave blank to let the user type it at runtime. |
| Parameter | Use voice input | BOOL | Optional | Whether to enable speech-to-text (STT). `true` → a voice-file attach button appears in the prompt UI. `false` → voice input disabled, text input only. |

### Print Agent Output (`tools/print_agent_output`)

Displays an agent's output on the workflow UI screen. Connect it to an agent node's output port to show the final response directly to the user — an end_node.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Output | STREAM \| STR | Required / Multiple | Receives output from an agent or text node. The STREAM type handles real-time streaming output; STR handles a completed string. |
| Output | — | — | — | No output. A display-only end node. |
| Parameter | — | — | — | No parameters. |

### Print Format (`tools/print_format`)

Renders data on screen in a readable format using a customizable template. An end_node that displays scores, timestamps, iteration counts, to-do lists, and the like in a structured layout.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Output | FeedbackDICT | Required | Feedback data in dictionary (DICT) form. Must be structured data containing scores, timestamps, iteration info, TODO items, etc. |
| Output | — | — | — | No output. A display-only end node. |
| Parameter | Use formatted output | BOOL | Optional | Whether to use a styled template. `true` → formatting settings such as Format Style apply. `false` → emits raw data as-is. |
| Parameter | Output style | STR | Optional | Choose the output style. `default` → plain text, `cards` → card UI, `timeline` → chronological list, `summary only` → compact single line. |
| Parameter | Show score | BOOL | Optional | Whether to show the result's relevance score. `true` → score next to each result / `false` → hide score. |
| Parameter | Show time | BOOL | Optional | Whether to show timestamps. `true` → creation time next to each result / `false` → hide timestamp. |
| Parameter | Max iterations shown | INT | Optional | Set the maximum number of iterations to display on screen, as an integer. |
| Parameter | Show to-do details | BOOL | Optional | Whether to show Todo/Task details. `true` → expand details / `false` → summary only. |

### Send Email (`tools/send_email`)

The agent composes and sends email automatically within the workflow. Once SMTP settings are configured, the AI handles the rest — an end_node used for notifications, reports, and similar deliveries.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Content | ANY | Required | The content sent as the email body. The ANY type allows various formats — text, dictionary, agent output, etc. |
| Output | — | — | — | No output. An email-sending-only end node. |
| Parameter | SMTP server address | STR | Required | SMTP server address. e.g., `smtp.gmail.com`, `smtp.naver.com` |
| Parameter | SMTP port | INT | Required | SMTP server port number. e.g., `587` (TLS), `465` (SSL), `25` (unencrypted) |
| Parameter | Sender email (ID) | STR | Required | The sender's email account address. e.g., `yourname@gmail.com` |
| Parameter | Sender password | STR | Required | The sender account password or an app-specific password. For Gmail, an App Password is recommended. |
| Parameter | Recipient email | STR | Required | Recipient email address(es). Separate multiple addresses with a comma (,) or semicolon (;). e.g., `a@x.com, b@x.com; c@x.com` |
| Parameter | Include full output | BOOL | Optional | Whether to include the workflow's full output data in the email. `true` → full output data is appended to the body. `false` → send only the Content input. |

## Tool Node Detailed Spec { #tool-node-spec }

Nodes in the **Tool (`tools`)** category give the agent a specific capability (file generation, image analysis, CLI execution, value transformation, etc.) or assist with workflow I/O. Detailed port/parameter specs for the commonly-used nodes are listed below. The notation matches [Start / End Node Detailed Spec](#node-io-spec); a blank (—) *Required* cell means the field appears conditionally based on the selected input type or operation.

### Certificate PDF Tool (`tools/Certificate PDF Tool`)

Automatically generates certificate PDFs — completion certificates, awards, diplomas, etc. — from the provided data. The AI produces a fully-formatted certificate file.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the generated PDF tool object. Connect it to an agent node's Tools input. |
| Parameter | Company seal path | STR | Optional | Path to the company seal (stamp) image file. Used to insert the seal into the certificate. |
| Parameter | Additional parameters | STR | Optional | Extra parameter values passed when the node runs. |

### Hierarchy Tools (`tools/hierarchy_tools`)

Builds a manager-worker agent hierarchy. The manager agent delegates subtasks to specialist worker agents and combines their results. Use it for complex tasks where multiple specialist AIs must collaborate.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Tools | TOOL | Multiple | Connect (multiple) tool nodes to provide to the worker agents below. |
| Output | Tool | TOOL | — | Emits the assembled hierarchy tool object. Connect it to the manager agent's Tools input. |
| Parameter | Tool name | STR | Required | The identifier name for this hierarchy tool. Used by the AI to distinguish tools. |
| Parameter | Tool description | STR | Required | Describe when this tool should be used. The AI references this to decide when to call it. |
| Parameter | Additional parameters | STR | Optional | Extra parameter values passed when the node runs. |

### Image Loader (`image_loader`)

Loads and extracts images for the AI to analyze. Receives images via URL or file upload and passes them to the agent's images input for visual analysis and understanding.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Data source | STR | Required | Receives an image URL or file path as a string. |
| Output | Images | LIST | — | Emits the loaded images as a LIST. Connect to the agent's images input. |
| Parameter | Image key name | STR | Optional | The key name to extract the image URL/file path from the data. Default: `img_url` |
| Parameter | Allow multiple images | BOOL | Optional | Whether to process multiple images. `true` → process several images as a list. `false` → process a single image only. |
| Parameter | Additional parameters | STR | Optional | Extra parameter values passed when the node runs. |

### Input Files (`input_files`)

A workflow start node that receives file uploads from the user. Use it for workflows that process user-uploaded files such as documents, spreadsheets, and images.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | File | FILE | — | Emits the uploaded file as FILE. Connect to the next node that processes the file. |
| Parameter | File | STR | Optional | The field where the user uploads a file at runtime. You may also enter a pre-fixed file path. |

### Input Template (`input_template`)

Generates dynamic prompts using `{{variable}}` placeholders. Once you author a template, placeholders are replaced with actual values at runtime. Ideal for building reusable prompt patterns.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Variables | STR | Multiple | Receives the values (STR) that fill the template's `{{variable}}` slots. Multiple variables can be connected. |
| Output | Prompt | STR | — | Emits the completed prompt string with variables substituted. |
| Parameter | Rule input method | STR | Optional | Choose the template input method. `Direct input` → write directly in the Template field below; `Select template` → pick from the saved template list. |
| Parameter | Rule template | STR | Optional | Select from the saved template list. Only `User Prompt` type prompts are shown. |
| Parameter | Template content | STR | Required | Author the prompt template directly. Mark dynamic parts as `{{variable_name}}`. |
| Parameter | Required-input check | BOOL | Optional | Whether to error on a missing template variable. `true` → raise an error if a variable is missing. `false` → treat missing variables as empty values. |

### Local CLI Tool (`tools/local_cli_tool`)

Lets the AI run pre-approved CLI commands on the local machine (Tauri desktop app only). Define the allowed commands in Skills and the AI can safely run Git, Node.js, Python commands, and more. For security, only commands defined in Skills can be executed.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the CLI-execution tool object. Connect to the agent's Tools input to grant CLI-execution capability. |
| Parameter | Skill definition (JSON) | STR | Required | Define the allowed CLI commands as a JSON array.<br>Key fields:<br>• `id`: unique identifier (alphanumeric, underscore)<br>• `name`: tool display name<br>• `description`: tool description (used by the AI to decide when to call)<br>• `command`: base command to run<br>• `allowed_args`: list of allowed arguments (incl. type, description, required)<br>• `timeout`: execution time limit (seconds)<br>• `requires_confirmation`: if `true`, ask the user to confirm before running<br>• `risk_level`: `safe` / `moderate` / `dangerous` |
| Parameter | Skill preset | STR | Optional | Selecting a predefined Skill Preset auto-fills the Skills JSON. |

### Agent Planner (`tools/agent_planner`)

Generates a step-by-step work plan for the agent to follow. The AI decomposes a complex task into manageable steps and executes them in order. Connect the Plan output to the agent's plan input.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Plan | PLAN | Optional | Receives plan data from a previous step and continues from it. An optional connection. |
| Input | Tools | TOOL | Multiple | Connect (multiple) tool nodes the agent will use during plan execution. |
| Output | Plan | PLAN | — | Emits the generated step-by-step plan as PLAN. Connect to the agent's plan input. |
| Parameter | Plan description | STR | Optional | Describe the work plan for the agent to execute, in text. State the plan's goal and steps. |

### Schema Provider (Input) (`input_schema_provider`)

Defines the input format for the AI to follow. Generate a JSON schema specifying the expected parameters, then connect it to a node that needs structured input.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Input format | InputSchema | — | Emits the defined input schema. Connect to a node that needs schema input, such as a user-input node. |
| Parameter | kwargs (enter key names directly) | STR | Optional | Define the parameters the AI receives. Enter a key name and select a type.<br>Type options: `STRING` / `INTEGER` / `FLOAT` / `BOOLEAN` / `OBJECT` / `LIST` |

### Schema Provider (Output) (`output_schema_provider`)

Defines the output format of the AI's response. Generate a JSON schema and the AI returns a structured answer that conforms to it. Use it when you need consistent, parseable responses.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Output format | OutputSchema | — | Emits the defined output schema. Connect to an agent node's output-schema input. |
| Parameter | kwargs (enter key names directly) | STR | Optional | Define the parameters the AI receives. Enter a key name and select a type.<br>Type options: `STRING` / `INTEGER` / `FLOAT` / `BOOLEAN` / `OBJECT` / `LIST` |

### Value Processor (`tools/value_processor`)

Extracts or transforms values from structured input (JSON, XML, YAML, CSV, Text, Regex). Specify the input type, operation, and path/key to pull out the value you want. Handles both Python objects and string forms.

> Selecting the *Expected input type* first exposes only the relevant parameters. The table below is the full list aggregating parameters across all input types.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Input | ANY | Required | Receives the data to process. Supports various formats — JSON, XML, YAML, CSV, text, regex, etc. |
| Output | Output | ANY | — | Emits the extracted/transformed result. |
| Parameter | Expected input type | STR | Required | Specify the input data format. All subsequent options branch on this setting. Options: `JSON` / `XML` / `YAML` / `CSV` / `Text` / `Regex` |
| Parameter | List input | BOOL | — | Enable when the input is a list/array. `true` → apply the operation to each item and return a list. |
| Parameter | JSON operation | STR | — | The operation to perform on a JSON/dictionary input. |
| Parameter | Path | STR | — | The extraction path in dot/bracket notation. e.g., `user.name` / `items[0].title` / `items[*].id` |
| Parameter | Paths | STR | — | Multiple comma-separated paths. Rename keys with the `alias=path` form. |
| Parameter | Keys | STR | — | Top-level keys to keep, comma-separated. |
| Parameter | Keys to Omit | STR | — | Top-level keys to remove, comma-separated. |
| Parameter | Default Value | STR | Optional | The default returned when a path is missing. Auto-parsed as number/bool/JSON. |
| Parameter | Strict (raise on missing) | BOOL | Optional | Whether to error when a path/key is missing. `true` → raise an error / `false` → return the default. |
| Parameter | XML Operation | STR | — | The operation to perform on an XML input. |
| Parameter | Tag Name | STR | — | The tag name to find. Use the `{uri}local` form with namespaces. |
| Parameter | Tag@Attribute | STR | — | Extract an attribute value with the `tag@attribute_name` form. `*@attr` reads from the root. |
| Parameter | XPath | STR | — | Select elements with ElementTree-compatible XPath. e.g., `.//book[@id='1']/title` |
| Parameter | Find All Matches | BOOL | Optional | `true` → return a list of all matches / `false` → return the first match only. |
| Parameter | Text Only | BOOL | Optional | `true` → return the inner text of matched elements / `false` → return the element XML string. |
| Parameter | Namespaces (JSON) | STR | Optional | A namespace JSON map for XPath. e.g., `{"ns": "http://example.com"}` |
| Parameter | Path (for XML) | STR | — | Dot-notation path, same as XML. e.g., `a.b[0].c` / `items[*].name` |
| Parameter | Default Value (for XML) | STR | Optional | The default returned when a path is missing. |
| Parameter | Strict (for CSV) | BOOL | Optional | Whether to error when a path is missing. |
| Parameter | Has Header | BOOL | — | `true` → treat the first row as column names. |
| Parameter | Delimiter | STR | — | The field delimiter. Use `\t` for tab-separated. |
| Parameter | Column | STR | — | The column name to extract (when a header exists) or a 0-based index. Leave blank to return the whole row. |
| Parameter | Row Index | INT | Optional | The data row number to extract (0-based, excluding the header). `-1` returns all rows. |
| Parameter | Text Operation | STR | — | The operation to perform on a text input. |
| Parameter | Separator | STR | — | The delimiter string used when splitting. |
| Parameter | Index | INT | Optional | The item index to extract after splitting lines (0-based, negatives allowed). `-1` returns all. |
| Parameter | Slice Start | INT | — | The slice start index. |
| Parameter | Slice End | INT | — | The slice end index (exclusive). |
| Parameter | Substring | STR | — | The substring to check for. Returns a BOOL value. |
| Parameter | Pattern | STR | — | A Python regex pattern. Using groups `(...)` extracts the group contents. |
| Parameter | Group | INT | — | The capture-group index. `0` returns the whole match. |
| Parameter | Find All | BOOL | Optional | `true` → return a list of all matches / `false` → return the first match only. |
| Parameter | Flags | STR | Optional | Combine regex flags. `i` → ignore case / `m` → multiline / `s` → dot (.) matches newline / `x` → verbose mode. |
| Parameter | Output Format | STR | Optional | The final output format. `auto` → return as native Python types / `json_string` → always serialize to a JSON string. |
| Parameter | Wrap In Key | STR | Optional | If not empty, wraps the result in a `{key: value}` dictionary. |

### Workflow Tool (`tools/workflow_tool`)

Calls another saved workflow as a tool from within the current workflow. The agent can run sub-workflows on demand, enabling modular workflow design.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Input data | ANY | — | Receives the input data to pass to the sub-workflow. |
| Output | Result | STR | — | Emits the sub-workflow's execution result as a string (STR). |
| Parameter | Workflow to run | STR | Required | Enter the name of the workflow to run. |
| Parameter | Stream in real time | BOOL | Optional | Whether to stream in real time. `true` → forward the real-time stream to the next node (returns a Generator). `false` → collect all results, then return a string. |

## Agent Node Detailed Spec { #agent-node-spec }

Nodes in the **Agent (`agents`)** category act as the core AI brain of a workflow. Connect tools, documents, memory, and the like, and the agent uses them to answer user questions. The notation matches [Start / End Node Detailed Spec](#node-io-spec).

### Agent Planflow (`agents/planflow`)

A deterministic Plan-and-Execute agent for a single API collection. The AI parses intent, builds a plan on a graph, then executes it in order (no per-step LLM). Faster and easier to audit than a ReAct agent in API orchestration.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Text | STREAM STR \| STR | Required | Receives the user question or instruction. Supports both STREAM and STR types. |
| Input | Prior Entities | DICT \| STR | — | Receives entity information extracted in a previous step. |
| Output | Stream | STREAM STR | Stream | Emits the response as a real-time stream. |
| Output | Result | STR | — | Emits the completed response as a string. |
| Parameter | API Collection | STR | Required | Select an API collection registered in Admin. |
| Parameter | Provider | STR | Required | The LLM provider used for Stage 1 (intent parsing) and Stage 4 (response generation). |
| Parameter | OpenAI Model | STR | Required | The OpenAI model name to use. |
| Parameter | Anthropic Model | STR | Required | The Anthropic model name to use (via litellm). |
| Parameter | Streaming | BOOL | — | Deliver results to the client as a real-time stream (recommended). |
| Parameter | Top K | INT | Optional | Stage 1 catalog size — the number of candidate tools to search. |
| Parameter | Auth Token Override | STR | Optional | Override the Bearer token. Leave blank to use the collection's AuthProfile. |
| Parameter | API Base URL Override | STR | Optional | Override the collection's `base_url` (optional). |

### Agent Xgen (`agents/xgen`)

The core AI brain node of a workflow. Connect various tools — DB queries, document search, web search, etc. — and the agent auto-selects them to answer user questions. Supports OpenAI, Anthropic, Google, AWS Bedrock, and vLLM providers.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Text | STREAM STR \| STR | Multiple | User question or instruction. Supports STREAM and STR types; multiple connections allowed. |
| Input | Files | FILE | Multiple | Files for the agent to analyze. Connect with the Input Files node. |
| Input | Images | LIST | Multiple | Image list for the agent to analyze. Connect with the Image Loader node. |
| Input | Tools | TOOL | Multiple | Tools the agent uses. Connect (multiple) with Tool-family nodes. |
| Input | Memory | OBJECT | — | Conversation memory object. Connect with the DB Memory node. |
| Input | Search Context | DocsContext | Multiple | Document-search context. Connect with the Search Context node. |
| Input | Output format | OutputSchema | — | Output schema definition. Connect with the Schema Provider (Output) node. |
| Input | Plan | PLAN | — | Work plan. Connect with the Agent Planner node. |
| Output | Stream | STREAM STR | Stream | Emits the response as a real-time stream. |
| Parameter | AI engine | STR | Required | Select the AI provider: `openai` (ChatGPT), `anthropic` (Claude), `google` (Gemini), `bedrock` (AWS AI), `vllm` (self-hosted). |
| Parameter | OpenAI model | STR | Required | The OpenAI model to use. Applies when Provider is `openai`. e.g., `gpt-4.1`, `gpt-4o`, `gpt-4.1-mini` |
| Parameter | Server address | STR | Required | vLLM or custom AI server URL. Required when Provider is `vllm` or a separate server is used. |
| Parameter | Answer creativity | FLOAT | Optional | Adjust the AI creativity level. Range: 0~2. Closer to 0 = consistent, factual answers; closer to 2 = diverse, creative answers. |
| Parameter | Max answer length (max tokens) | INT | Optional | Maximum length of the AI response (tokens). Range: 1~65536 |
| Parameter | Tool-call count | INT | Optional | Max number of tool calls the AI can make in one turn. Range: 1~100. Increase for complex multi-step tasks. |
| Parameter | File processing mode | STR | Optional | Choose how uploaded files are processed. For scanned documents, `enhanced_ocr` is recommended. |
| Parameter | Max images processed | INT | Optional | Max number of images the AI can process at once. Range: 0~100 |
| Parameter | Always show sources | BOOL | Optional | Whether to always show sources when referencing documents. |
| Parameter | Prompt Source | STR | — | Choose how the system prompt is provided. `direct` → write directly in System Prompt below; `template` → pick from saved prompt templates. |
| Parameter | Template | STR | — | Select a saved prompt template. Only `System Prompt` type is shown. Enabled when `prompt_source` is `template`; content is editable after selection. |
| Parameter | System Prompt | STR | — | Write the AI's role and instructions. e.g., `You are a friendly financial advisor. Answer loan and deposit questions accurately.` |
| Parameter | Show intermediate steps | BOOL | Optional | Output the AI's reasoning process (tool calls, intermediate results, reasoning steps). Useful for debugging. |
| Parameter | Apply safety filter | BOOL | Optional | Enable a safety filter that blocks inappropriate content (profanity, harmful info). Recommended for production. |
| Parameter | Show AI typing | BOOL | Optional | Enable real-time chat-style output. `true` → text streams character by character. `false` → output the completed answer all at once. |
| Parameter | Show result immediately (multi-agent) | BOOL | Optional | Whether to display this agent's response on screen when multiple agents are connected. `false` → process internally and pass to the next agent. |
| Parameter | Answer separately | BOOL | Optional | Whether to display each agent's response in a separate area when multiple agents are connected. |

### Agent Harness (`agents/run_harness`)

Runs a saved Harness workflow as a single agent step. Uses all of the selected workflow's stage settings (system_prompt, selected tools, strategy, RAG/DB/MCP connections, etc.) as-is. The node acts as an input wrapper (one MCP).

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Text | STR | Required | The text input to pass to the Harness workflow. |
| Output | Response | STR | — | Emits the Harness workflow's execution result as a string. |
| Parameter | Harness workflow | STR | Required | Select the workflow to run from the saved Harness workflow list. The workflow's saved stage settings apply as-is. |

## API Loader Node Detailed Spec { #api-loader-node-spec }

Nodes in the **API Loader (`api_loader`)** category turn an external REST API into a tool the agent can call.

### API Calling Tool (`api_loader/APICallingTool`)

Builds a custom API tool and connects it to the agent. Once you configure the REST API endpoint, the agent calls it automatically when needed during a conversation. Response-data filtering lets you extract only the data you need.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Input format | InputSchema | — | The input schema passed on API call. Connect with the Schema Provider (Input) node to define a structured input format. |
| Output | Tool | TOOL | — | Emits the generated API tool object. Connect to the agent's Tools input. |
| Parameter | Tool name | STR | Required | The tool's unique name. The agent identifies and calls the tool by this name. |
| Parameter | Tool description | STR | Required | Describe to the AI when this tool should be used. e.g., `Use this when asked about interest rates or exchange rates.` |
| Parameter | API address | STR | Required | Enter the API URL to call. e.g., `https://api.example.com/rates` |
| Parameter | HTTP method | STR | Required | Select the HTTP method: `GET`, `POST`, `PUT`, `DELETE`, `PATCH` |
| Parameter | Response timeout (sec) | INT | — | API response timeout (seconds). Range: 1~300 |
| Parameter | Use response filtering | BOOL | — | Whether to enable response filtering that extracts only specific data. `true` → the Response Filter Path / Fields settings below apply. |
| Parameter | Response filter path | STR | — | Specify the JSON path of the data to extract. e.g., `payload.searchDataList` |
| Parameter | Response filter fields | STR | — | Enter field names to extract, comma-separated. e.g., `interestRate,productNm` |

### API Tool Loader (`api_loader/APIToolLoader`)

Quickly loads an API tool pre-registered in the admin panel. Instead of configuring API settings yourself, just pick an already-configured tool from the dropdown.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the loaded API tool object. Connect to the agent's Tools input. |
| Parameter | Select API tool | STR | Required | Select the tool to use from the list of registered API tools. |

## Document Loader Node Detailed Spec { #document-loader-node-spec }

Nodes in the **Document Loader (`document_loaders`)** category search documents from a vector DB or knowledge graph and provide them as the agent's RAG context.

### Search Context (`document_loaders/VectorDBContext`)

A unified document-search node. Select a search mode to configure how documents are retrieved from the vector database. Connect to the agent's RAG Context input.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Reference docs | DocsContext | — | Emits the retrieved document context. Connect to the agent's RAG Context input. |
| Parameter | Search mode | STR | Required | Select the search mode. `Light` / `Light+` / `Hard` → created as a tool the agent can call; `Always Search` → runs the search automatically at prep time. |
| Parameter | Collection name | STR | Required | Select the vector-DB collection to search. |
| Parameter | Tool description | STR | Required | Describe when this tool should be used. Used by the AI to decide when to call it. |
| Parameter | Top results | INT | Optional | The number of top results returned by vector search (applies in `Light`/`Light+`/`Always Search` modes). |
| Parameter | Min relevance score | FLOAT | Optional | The minimum similarity score for inclusion. Range: 0.0~1.0 |
| Parameter | Use reranking | BOOL | Optional | Whether to improve result accuracy with cross-encoder reranking. |
| Parameter | Rerank candidates | INT | Optional | The number of top candidates to rerank. |
| Parameter | Search-augmentation prompt | STR | Optional | A prompt to improve responses using the RAG context. |
| Parameter | Tool name | STR | Optional | The name identifier of the search tool (ignored in `Always Search` mode). |
| Parameter | Strict source display | BOOL | Optional | Whether to force source display when referencing documents. |

<!-- require_view_start: node-ontology-search -->
### Ontology Search (`document_loaders/OntologySearch`)

A graph-based ontology-search node using SPARQL and SCS context. Queries a pre-built knowledge graph to find relevant triples and source chunks for a structured answer.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the ontology-search tool as TOOL. Connect to the agent's Tools input. |
| Parameter | Tool name | STR | Required | The name identifier of this tool. |
| Parameter | Tool description | STR | Required | Describe when the agent should use this tool. |
| Parameter | Collection name | STR | Required | Select the collection where the ontology is built. |
| Parameter | Use hierarchy context | BOOL | Optional | Whether to enable the SCS context profile for hierarchy-aware answers. |
| Parameter | Max source chunks | INT | Optional | The maximum number of source chunks to include in the answer. |
| Parameter | Multi-turn search | BOOL | Optional | Whether to enable multi-turn ReAct graph traversal for complex multi-hop questions. |
| Parameter | Max search turns | INT | Optional | The maximum number of search turns in multi-turn mode. |
<!-- require_view_end -->

## File System Node Detailed Spec { #file-system-node-spec }

Nodes in the **File System (`file_system`)** category grant the AI the ability to handle tabular data and access a file system. Compose them by connecting *Table Data MCP*'s output to *FileSystem Storage*'s input.

### Table Data MCP (`file_system/table_data_mcp`)

Gives the AI the ability to handle tabular data (Excel, CSV). The agent can read, analyze, and transform spreadsheet data in natural language.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | FileSystem tool | FILE_SYSTEM_TOOL | — | Emits the file-system tool object. Connect to the FileSystem Storage node's input. |
| Parameter | Max rows | INT | — | Max rows returned in a single read. Default: 50, Max: 100. For large data, call multiple times with the `start_row` parameter for pagination. |
| Parameter | Max column width | INT | — | Max character width per column when displaying tabular data. Default: 100. Values exceeding this length are truncated with `...`. |

### FileSystem Storage (`file_system/filesystem_storage`)

Lets the AI access a file system to read and write files. The agent can browse, read, create, and modify files in a designated storage area.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | FileSystem tools | FILE_SYSTEM_TOOL | Multiple | Connect (multiple) outputs from file-system tool nodes such as Table Data MCP. |
| Output | Tool | TOOL | — | Emits the assembled file-system tool as TOOL. Connect to the agent's Tools input. |
| Parameter | Storage folder | STR | Required | Select the storage folder to use. The path is relative to the `file-storage/{user_id}/` subfolder. |

## Memory / Router Node Detailed Spec { #memory-router-node-spec }

The **Memory (`memory`)** category handles conversation memory, and the **Router (`router`)** category handles data-flow branching.

### DB Memory (Smart) (`memory/db_memory_v3`)

The smartest conversation-memory node. Beyond simple recall, it filters low-confidence AI responses, automatically decays the weight of older information over time, and intelligently selects the most relevant past conversations.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Current input | STR | — | Receives the current conversation input, stores it in memory, and searches for related context. |
| Output | Memory | OBJECT | — | Emits the stored memory object. Connect to the agent's memory input. |
| Output | Context | STR | — | Emits past-conversation context related to the current input as a string. |
| Parameter | Conversation session ID | STR | — | Set a unique ID to distinguish conversation sessions. The same ID groups into the same conversation. |
| Parameter | Max conversations | INT | Optional | Max messages to retain. 0 retains all. Range: 0~100 |
| Parameter | Max characters | INT | Optional | Set the maximum character count of retained conversations. |
| Parameter | Recent messages remembered | INT | Optional | The number of recent messages passed directly to the AI. Range: 2~10 |
| Parameter | Top-K similar sources | INT | Optional | The number of top related messages to include. Range: 0~20 |
| Parameter | Confidence threshold | FLOAT | Optional | The minimum confidence score for including a message. Range: 0~1 |
| Parameter | Delete old conversations | BOOL | Optional | Whether to enable time-based decay. `true` → older messages gradually lose importance. |
| Parameter | Include AI reasoning memory | BOOL | Optional | Whether to include the AI's reasoning process in memory. `true` → AI thinking content is also stored. |

### Router (`router/Router`)

Routes data to different paths based on a key value. Set the routing criteria (e.g., language, category) and an output path is dynamically created for each key value, with input data flowing into the matching path.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | Input data | ANY | Required | Receives the data to route. The ANY type accepts any format. |
| Output | — | — | — | Output handles are dynamically created per the Routing Criteria setting. A separate output port is made for each key value. |
| Parameter | Routing Criteria | STR | Required | Enter the key name to route on. The router checks this key's value in the input data and forwards to the matching output path. e.g., `language`, `category`, `action` |

## MCP Node Detailed Spec { #mcp-node-spec }

Nodes in the **MCP (`mcp`)** category turn external MCP servers and APIs into tools (TOOL) the agent can use. Most have no *Input*; you specify the connection target via parameters, then connect the output tool to the agent's Tools input — a common pattern across the category. The notation matches [Start / End Node Detailed Spec](#node-io-spec).

### MCP Tool Loader (`mcp/MCPLoader`)

Connects to an MCP server and loads all its tools at once. Instead of configuring individual MCP nodes, this single node gives access to all tools on the MCP server. Just select an active MCP session.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the loaded MCP tool object. Connect to the agent's Tools input. |
| Parameter | MCP session | STR | Required | Select the active MCP session to load tools from. |

### Tavily Search MCP (`mcp/tavily_search_mcp`)

Searches the web with Tavily, an AI-optimized search engine. Supports structured results, domain filtering, summary answers, raw content extraction, and search-depth settings. Suited for AI research tasks.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the Tavily search tool object. Connect to the agent's Tools input. |
| Parameter | Tavily API key | STR | Required | Enter the Tavily API key. |
| Parameter | Max results | INT | Optional | Set the maximum number of search results to return. |
| Parameter | Tool description | STR | Optional | Describe to the AI when to use this search tool. Leave blank to use the default behavior. |
| Parameter | Include domains | STR | Optional | Domains to include in results, comma-separated. |
| Parameter | Exclude domains | STR | Optional | Domains to exclude from results, comma-separated. |
| Parameter | Include answer | BOOL | Optional | Provide a short summary answer alongside results. `true` → include summary answer. |
| Parameter | Include raw content | BOOL | Optional | Include each result's raw HTML content. `true` → include raw HTML. |
| Parameter | Include images | BOOL | Optional | Include relevant images in results. `true` → include images. |
| Parameter | Search depth | STR | Optional | Search depth. `basic` → fast results, `advanced` → more comprehensive results. |

### Brave Search MCP (`mcp/brave_search_mcp`)

Searches the web in real time using the Brave Search API. Connect it and the AI can search the internet for up-to-date info. Supports country, period, and result-count filtering; a Brave API key is required.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the Brave search tool object. Connect to the agent's Tools input. |
| Parameter | Brave API key | STR | Required | Enter the Brave Search API key. Available from brave.com. |
| Parameter | Result count | INT | Optional | Set the maximum number of search results to return. |
| Parameter | Country | STR | Optional | Result country filter. e.g., `kr`=Korea, `us`=USA, `jp`=Japan |
| Parameter | Period filter | SELECT | Optional | Time-range filter. `Default` → all, `pd` (Past Day) → last day, `pw` (Past Week) → last week, `pm` (Past Month) → last month, `py` (Past Year) → last year. |
| Parameter | Text highlight | BOOL | Optional | Include text emphasis (bold/highlight) in results. `true` → include highlighting. |

### EPG DAUM MCP (`mcp/epg_daum_mcp`)

Fetches Korean home-shopping TV schedules from DAUM. The AI can look up broadcast times, program names, and channel info. Supports caching for repeated queries.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the DAUM EPG tool object. Connect to the agent's Tools input. |
| Parameter | Use Cache | BOOL | Optional | Whether to use cached data. `true` → use cached data for a fast response, `false` → fetch fresh data. |

### EPG NAVER MCP (`mcp/epg_naver_mcp`)

Fetches Korean home-shopping TV schedules from NAVER. Provides the same features as EPG DAUM MCP, using NAVER as the data source.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the NAVER EPG tool object. Connect to the agent's Tools input. |
| Parameter | Use Cache | BOOL | Optional | Whether to use cached data. `true` → use cached data for a fast response, `false` → fetch fresh data. |

### GitHub MCP (`mcp/github_mcp`)

Manages GitHub repositories via natural language. The AI can handle repo, issue, pull-request, and code search. Uses GitHub App authentication (App ID + Private Key).

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the GitHub management tool object. Connect to the agent's Tools input. |
| Parameter | GitHub App ID | STR | Required | Enter the GitHub App ID. |
| Parameter | GitHub App Private Key | STR | Required | Enter the GitHub App Private Key in PEM format. |
| Parameter | GitHub Repository | STR | Required | Enter the target repository. Format: `owner/repo` |

### GitLab MCP (`mcp/gitlab_mcp`)

Manages GitLab projects via natural language. The AI can search projects, manage branches, edit files, handle issues, and create Merge Requests. Supports both GitLab.com and self-hosted GitLab instances.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the GitLab management tool object. Connect to the agent's Tools input. |
| Parameter | GitLab URL | STR | Optional | Enter the GitLab instance URL. Default: `https://gitlab.com` (a self-hosted URL also works). |
| Parameter | GitLab Personal Access Token | STR | Required | Enter the GitLab Personal Access Token. Issue at: Settings > Access Tokens. |

### Meta Search MCP (`mcp/meta_search_mcp`)

The AI automatically finds and crawls relevant websites to gather comprehensive info. No API key needed; the AI decides which sites to search and aggregates results across them.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the meta-search tool object. Connect to the agent's Tools input. |
| Parameter | Max results | INT | Optional | Set the maximum number of results to return. |

### Naver Datalab MCP (`mcp/naver_datalab_mcp`)

Accesses Naver Datalab for search-trend analysis and shopping insights. The AI can look up popular search terms, search-volume trends, and shopping-category insights. Useful for market research and trend analysis.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the Naver Datalab tool object. Connect to the agent's Tools input. |
| Parameter | Description | STR | Required | Describe to the AI when to use this analytics tool. |

### Naver News MCP (`mcp/naver_news_mcp`)

Searches Korean news via the Naver News API. Connect it and the AI finds the latest Korean news articles to use in answers. Can sort by relevance or date. Requires Naver Open API credentials.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the Naver news search tool object. Connect to the agent's Tools input. |
| Parameter | Description | STR | Required | Describe to the AI when to use this news search tool. |
| Parameter | Naver Client ID | STR | Required | Enter the Naver application Client ID. |
| Parameter | Naver Client Secret | STR | Required | Enter the Naver application Client Secret. |
| Parameter | Sort | STR | Optional | Result sort order. `sim` → by relevance, `date` → by most recent. |

### PostgreSQL MCP (`mcp/postgresql_mcp`)

Connects directly to a PostgreSQL database and runs read-only queries. Connect by entering host, port, username, password, and database name. Unlike Database Loader, it connects directly without DB Connection Manager — suited for quick query setups.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the PostgreSQL query tool object. Connect to the agent's Tools input. |
| Parameter | Host | STR | Required | Enter the PostgreSQL server address. e.g., `192.168.0.10`, `localhost` |
| Parameter | Port | INT | Required | Enter the port number. Default: `5432` |
| Parameter | Username | STR | Required | Enter the database login username. |
| Parameter | Password | STR | Required | Enter the database login password. |
| Parameter | Database | STR | Required | Enter the name of the database to connect to. |
| Parameter | DB Prompt | STR | Optional | Describe the database so the AI can write better queries. e.g., `Loan DB with repayment history.` |
| Parameter | Tool Prefix | STR | Optional | A prefix to prepend to tool names when using multiple DBs at once. e.g., `hr` → `hr_list_tables`, `hr_query`. Leave blank for a single DB. |
| Parameter | Schema | STR | Optional | Enter the PostgreSQL schema name. Default: `public`. e.g., `app_main` |
| Parameter | Sample Rows | INT | Optional | The number of sample rows per table during schema inspection. `0` returns schema info only. |

### Database Loader (`mcp/DatabaseLoader`)

Loads a pre-configured database connection so the AI can query data. Select a connection in DB Connection Manager and the AI auto-uses the `list_tables`, `get_schema`, and `query` tools. Supports PostgreSQL, Oracle, Informix.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the database query tool object. Connect to the agent's Tools input. |
| Parameter | DB connection | STR | Required | Select a database connection from the DB Connection Manager list. |
| Parameter | Access password | STR | Required | Enter the password set when creating the DB connection. Required for security verification. |
| Parameter | DB description | STR | Optional | Describe the database so the AI can write better queries. e.g., `Loan DB. The loan_records table holds loan history and repayment data.` |
| Parameter | Tool prefix | STR | Optional | A prefix to prepend to tool names when using multiple DBs at once. e.g., `hr` → `hr_list_tables`, `hr_get_schema`, `hr_query`. Leave blank for a single DB. |
| Parameter | Sample rows | INT | Optional | The number of sample rows per table to show during schema inspection. Helps the AI understand the data format. `0` returns schema info only. |

### Product Search MCP (`mcp/product_search_mcp`)

Searches product info using various filters. Look up popular products, upcoming broadcasts, past broadcasts, and currently-selling products. You can control the result count and whether images are included.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the product search tool object. Connect to the agent's Tools input. |
| Parameter | Tool description | STR | Required | Describe to the AI when to use this product search tool. |
| Parameter | Search type | STR | Optional | Select the search type. `popular` → popular, `future` → upcoming broadcasts, `past` → past broadcasts, `sales` → currently selling. Leave blank to let the AI decide. |
| Parameter | Max results | INT | Optional | The maximum number of results to return. Default: 10 |
| Parameter | Include images | BOOL | Optional | Include product images in results. `true` → include images. |

### Slack MCP (`mcp/slack_mcp`)

Connects the AI to a Slack workspace. The AI can send messages, manage channels, and search conversations. A Slack User Token (`xoxp-`) is required.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the Slack management tool object. Connect to the agent's Tools input. |
| Parameter | Slack User Token | STR | Required | Enter the Slack User Token. A token starting with `xoxp-`. |

### Nano Banana MCP (`mcp/nano_banana_mcp`)

A Gemini-based image generation and editing tool (Nano Banana). Generate images from text prompts or edit existing images with AI.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the image generation/editing tool object. Connect to the agent's Tools input. |
| Parameter | Google API Key | STR | Required | Enter the Gemini API key issued from Google AI Studio. |
| Parameter | Model | SELECT | Required | Select the generation model. `Flash` → fast generation, `Pro` → high-quality generation. |
| Parameter | Image Size | SELECT | Optional | Set the output image resolution. 4K is available only on the Pro model. |
| Parameter | Response Modality | SELECT | Optional | Select the response format. |

### Atlassian MCP (`mcp/atlassian_mcp`)

Manages Jira issues and Confluence documents via natural language. The AI can create issues, manage projects, author wiki pages, and search both platforms. Supports both Cloud and On-premise Atlassian.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the Atlassian management tool object. Connect to the agent's Tools input. |
| Parameter | Atlassian URL | STR | Required | Enter the Atlassian URL. e.g., `https://your-domain.atlassian.net` |
| Parameter | Email | STR | Required | Enter the Atlassian account email. |
| Parameter | API Token | STR | Required | Enter the Atlassian API Token. Issue at: `https://id.atlassian.com/manage/api-tokens` |
| Parameter | Tools Scope | STR | Optional | Select the tool scope. `jira` → Jira tools only, `confluence` → Confluence tools only, `both` → both (default). |

### Microsoft 365 MCP (`mcp/ms365_mcp`)

Connects the AI to Microsoft 365. Supports Outlook Mail, Calendar, Teams, OneDrive, Planner, Excel, and more. Use feature presets to load only the tools you need. Initial setup requires Device Code Flow authentication in Admin > MCP Station.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the Microsoft 365 tool object. Connect to the agent's Tools input. |
| Parameter | Feature preset | STR | — | Select which MS 365 services to enable. e.g., `all`, `mail-only`, `calendar-only`, etc. |
| Parameter | Organization mode | BOOL | — | Include organizational features such as Teams, SharePoint, Planner. `true` → enable organizational features. |

### API Collection Loader (`mcp/APICollectionLoader`)

Loads a registered API collection (ToolGraph) so the AI can search and call APIs in natural language. Select a collection from the dropdown and the AI auto-uses `search_tools` and `call_tool`.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the API collection tool object. Connect to the agent's Tools input. |
| Parameter | API collection | STR | Required | Select an API collection registered in Admin. |
| Parameter | Max tools | INT | Optional | The maximum number of tools returned per search query. Default: 5 |
| Parameter | API base URL override | STR | Optional | Override the collection's `base_url` (optional). |
| Parameter | Auth token override | STR | Optional | Override the Bearer token. Leave blank to use the collection's AuthProfile (recommended). Enter a value for temporary testing only. |
| Parameter | Tool prefix | STR | Optional | A prefix to prepend to generated tool names when chaining multiple loaders. e.g., `erp` → `erp_search_tools`, `erp_call_tool` |

### Web Automation (Playwright) (`mcp/WebAutomationMCP`)

Automates web tasks via Playwright browser control. Read data from Excel to auto-fill web forms, with user confirmation before saving. Supports login automation, page navigation, and complex form workflows.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Tool | TOOL | — | Emits the web-automation tool object. Connect to the agent's Tools input. |
| Parameter | Playwright MCP session | STR | Required | Select the Playwright MCP session to use. |
| Parameter | Target website URL | STR | Required | Enter the target website URL. e.g., `https://erp.company.com` |
| Parameter | Login config (JSON) | JSON | Required | Enter the login configuration as JSON. Use environment variables in `${VAR}` form. |
| Parameter | Page config (JSON) | JSON | Required | Set page key-to-path mappings as JSON. |
| Parameter | Form config (JSON) | JSON | Required | Set form-field mappings and fixed values as JSON. |

### Database Reader (`mcp/DatabaseReader`)

Runs a fixed SQL query against a pre-configured database connection and returns the result as text. No AI needed; select a connection, enter a query, and the result flows to the next node. Supports PostgreSQL, Oracle, Informix.

| Item | Port / Parameter | Type | Required | Description & Behavior by Value |
|---|---|---|---|---|
| Input | — | — | — | No input. |
| Output | Query result | STR | — | Emits the SQL query result as a string (STR). |
| Parameter | DB Connection | STR | Required | Select a database connection from the DB Connection Manager list. |
| Parameter | Custom Password | STR | Required | Enter the password set when creating the DB connection. |
| Parameter | SQL Query | STR | Required | Enter the SQL query to run. Only `SELECT` / `WITH` queries are allowed. |
| Parameter | Max Rows | INT | Optional | The maximum number of rows to return. `0` means no limit. |

## Node Management Screen (Admin) { #node-management-screen }

A system administrator can browse and search the same node catalog from the **Admin Center → Agent Operations → Node Management** screen (view ID `admin-node-management`). The page header reads "Node Management — Manage and explore agentflow nodes."

| Area | Content |
|---|---|
| Top controls | **Table** / **Tree** view toggle; search box (partial match against category, function, node name, and tag) |
| Body | Node catalog rendered as a table or a tree depending on the selected view |

### Browse with the Tree View

1. Switch the top toggle to **Tree**
2. Expand a category in the tree on the left
3. Click an item — the right panel shows node details (I/O spec, tags, description)

### Browse with the Table View

1. Switch the top toggle to **Table**
2. Sort and filter columns to compare nodes side-by-side
3. Click a row — the right panel shows the same detail view

### Search

Typing in the top search box returns partial-match results instantly:

- **Category** — e.g., `Agent`, `Tool`
- **Function** — e.g., `search`, `invoke`
- **Node name** — e.g., `Document Loader`
- **Tag** — labels attached to nodes

## Operational Recommendations

- **Consistent category naming** — When adding custom nodes, reuse existing categories. Split into a new category only after enough nodes accumulate.
- **Use tags** — Tag each node by *function*, *domain*, and *owning department* to improve search efficiency.
- **Monitor deployed Agent nodes** — Items under the **Agent** category mirror the environment's deployed agents. Audit periodically to ensure undeployed / inactive agents do not remain exposed.

## Related Chapters

- [Creating an Agent · Adding Nodes](12-agentflow-create.md#add-node) — Procedure for adding nodes on the canvas
- [Agent Operations](../admin/32-agent-operations.md) — The admin Agent Operations group menus (Agent Management, Node Management, etc.)
- [MCP Library](../admin/28-mcp-market.md) — Manage MCP nodes that appear under the MCP category <!-- require_view: admin-mcp-market -->

## Contact

For inquiries about nodes, contact the Xgen Solution Administrator.
