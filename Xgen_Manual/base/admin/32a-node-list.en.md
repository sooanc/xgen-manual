# Node List

This chapter covers the **Node Management** screen (view ID `admin-node-management`) in Admin Center. It catalogs every node (agentflow building block) registered in the platform so you can browse, search, and inspect them.

> For the *builder* perspective on adding nodes from the canvas, see [Creating an Agent · Adding Nodes](../user/12-agentflow-create.md#노드-추가).

## Accessing the Screen

Go to **Admin Center → Agent Operations → Node Management** in the left sidebar. The page header reads "Node Management — Manage and explore agentflow nodes."

## Screen Layout

| Area | Content |
|---|---|
| Top controls | **Table** / **Tree** view toggle; search box (partial match against category, function, node name, and tag) |
| Body | Node catalog rendered as a table or a tree depending on the selected view |

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
| Ontology Search | `document_loaders/OntologySearch` | Graph-based ontology search using SPARQL + SCS context. Returns relevant triples and source chunks |
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

## How to Use

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
- **Tag** — labels attached to
## Operational Recommendations

- **Consistent category naming** — When adding custom nodes, reuse existing categories. Split into a new category only after enough nodes accumulate.
- **Use tags** — Tag each node by *function*, *domain*, and *owning department* to improve search efficiency.
- **Monitor deployed Agent nodes** — Items under the **Agent** category mirror the environment's deployed agents. Audit periodically to ensure undeployed / inactive agents do not remain exposed.

## Related Chapters

- [Creating an Agent · Adding Nodes](../user/12-agentflow-create.md#노드-추가) — User-side procedure for adding nodes on the canvas
- [Agent Operations](32-agent-operations.md) — Other menus in the Agent Operations group (Agent Management, Chat Monitoring, etc.)
- [MCP Library](28-mcp-market.md) — Manage MCP nodes that appear under the MCP category <!-- require_view: admin-mcp-market -->

## Contact

For inquiries about the Node Management screen, contact the Xgen Solution Administrator.
