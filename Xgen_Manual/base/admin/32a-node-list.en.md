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

> Environment-specific agents may appear under the *Agent* group, so the exact list can vary slightly by environment. The catalog below reflects the stg standard environment.

### MCP (`mcp`) — 20
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

### Agent (`agents`) — 3
| Node | ID | Description |
|---|---|---|
| Agent Planflow | `agents/planflow` | Deterministic Plan-and-Execute agent. Intent parsing → graph-based plan → sequential execution → natural-language response |
| Agent Xgen | `agents/xgen` | The core AI brain of a workflow. Auto tool selection. OpenAI, Anthropic, Google, AWS models |
| Agent Harness | `agents/run_harness` | Run a saved Harness workflow as a single agent step (system_prompt, tools, strategies, RAG, DB, MCP) |

### API Loader (`api_loader`) — 2
| Node | ID | Description |
|---|---|---|
| API Calling Tool | `api_loader/APICallingTool` | Build a custom REST API tool and connect it to the Agent. Response-data filtering supported |
| API Tool Loader | `api_loader/APIToolLoader` | Load admin-registered API tools from a dropdown instantly |

### Document Loader (`document_loaders`) — 3
| Node | ID | Description |
|---|---|---|
| Search Context | `document_loaders/VectorDBContext` | Unified document search. Select search mode to configure vector-DB retrieval. Connect to Agent RAG Context |
| Ontology Search | `document_loaders/OntologySearch` | Graph-based ontology search using SPARQL + SCS context. Returns relevant triples and source chunks |
| Search Context (260517) | `document_loaders/VectorDBContextV2` | Search Context redesign (2026-05-17). Only essential options exposed, advanced tuning uses best-practice defaults |

### File System (`file_system`) — 3
| Node | ID | Description |
|---|---|---|
| Table Data MCP | `file_system/table_data_mcp` | Give AI the ability to work with tabular data (Excel, CSV). Natural-language read, analyze, transform |
| FileSystem Storage | `file_system/filesystem_storage` | Give AI access to a file system. Browse, read, create, modify files in a designated storage area |
| Document Adapter | `file_system/document_adapter` | Edit form documents (DOCX/PPTX/HWPX). 9 tools (inspect_document / get_cell / get_shapes / render_template …) |

### Memory (`memory`) — 1

| Node | ID | Description |
|---|---|---|
| DB Memory (Smart) | `memory/db_memory_v3` | The smartest conversation memory. Filters unreliable AI responses, time-based decay, smart selection of related past chats |

### Router (`router`) — 1

| Node | ID | Description |
|---|---|---|
| Router | `router/Router` | Branch data into different paths by key value. Output handles dynamically generated per key value |

### Tool (`tools`) — 14
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

### Start Node (`startnode`) — 1

| Node | ID | Description |
|---|---|---|
| Input String | `input_string` | Receive user text input or set a fixed text value. Starting point for text-input workflows |

### End Node (`endnode`) — 3
| Node | ID | Description |
|---|---|---|
| Print Agent Output | `tools/print_agent_output` | Display Agent output in the workflow UI. Connect to Agent output to surface responses |
| Print Format | `tools/print_format` | Custom-templated formatted output. Scores, timestamps, iteration details, to-do lists in structured layout |
| Send Email | `tools/send_email` | Give AI email-sending capability. Configure SMTP → Agent composes and sends emails as part of the workflow |

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
- [MCP Library](28-mcp-market.md) — Manage MCP nodes that appear under the MCP category

## Contact

For inquiries about the Node Management screen, contact {{vars.support_email}}.
