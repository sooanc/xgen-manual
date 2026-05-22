# Creating an Agent

This chapter covers building an **Agentflow** — the core deliverable of the solution.

## What Is an Agentflow

An agentflow is an AI workflow composed by visually connecting multiple **nodes**. The entire execution path — from the start node, through intermediate steps (LLM calls, tool execution, conditional branching, etc.), to the final response — is represented in a single diagram.

| Term | Description |
|---|---|
| Agentflow | The entire flow composed of nodes (the unit of deployment) |
| Node | A single step in the flow (LLM, tool, branch, etc.) |
| Canvas | The area for visually editing nodes |

See [Glossary](../common/01-glossary.md) for full terminology.

## Entering Agent Workspace { #agent-작업실-진입 }

!!! note "Agent-build permission required"
    The steps in this section assume an account with the **Agent Developer** role (or a comparable permission). Standard User accounts do not see the **Agent Creation** area in the left sidebar, and even when reached via the dashboard or [Agent Workspace shortcut](18-dashboard.md), the related screens may not appear or access may be restricted.

Select **Agent Creation → Agent Design** in the left sidebar. From the canvas intro screen you can pick **Start from blank canvas / Start with chat / Continue** as the entry mode.

![Agent Workspace — list of registered agentflows with the create button](images/agentflow-list.png)

## Creating a New Agentflow

1. Click the **+ New Agentflow** button at the top right
2. Enter:
    - **Name**: an identifiable name (Korean or English)
    - **Description** (optional): one-line summary of what it does
3. Create — an empty canvas opens; clicking **Start Agent** automatically places the **XGEN Agent** node.

![Canvas editor — clicking "Start Agent" on the empty canvas auto-places the XGEN Agent node](images/canvas-editor.gif)

## Adding Nodes

Clicking the **Node Search** button at the bottom right of the canvas opens the list of available nodes, grouped by category.

| Category | Example Nodes |
|---|---|
| LLM | Model invocation, response generation |
| Knowledge Retrieval | Collection search, citation insertion |
| Tools | External APIs, MCP tools |
| Branching | Conditional, loop |
| I/O | Receive input, return output |

> The full node catalog (categories, tags, detailed specs, etc.) is available in the [Admin Center > Node List](../admin/32a-node-list.md) chapter. Node registration and management features are also provided in the same chapter.

To add:

1. Expand a node category in the sidebar
2. **Drag and drop** a node card onto the canvas
3. The node is placed on the canvas

!!! info "Drag motion"
    Drag a node card from the left palette and drop it onto the canvas.

    ![Node drag-and-drop motion](gif/10 canvas dragdrop.gif)

## Connecting Nodes

Drag from a node's output port (right side) to the next node's input port (left side).

- Valid connections show as arrowed lines
- Invalid connections (type mismatch) appear gray and warn at execution time

## Configuring Nodes

Clicking a node opens the detail panel on the right. Configure:

| Item | Description |
|---|---|
| Model (LLM node) | Which LLM model to use (chosen from admin-registered models) |
| Prompt | System Prompt, User Prompt |
| Collection (search node) | Target collection for retrieval |
| Tool (tool node) | The external API or MCP tool to invoke |
| Variables | Variable names passed between nodes |

!!! info "Node detail panel"
    Clicking an individual node opens a detail panel on the right. Field composition differs per node type (LLM / Tool / Search / Branch, etc.); two representative examples are cycled below.

    ![Node detail panel — field layouts vary by node type (two examples cycled)](images/canvas-node.gif)

External APIs and MCP tools referenced by Tool nodes are registered and managed on a separate screen, under **Agent Workspace → Tool Integration** in the left sidebar.

![API Tools — manage external APIs and MCP tools called by Tool nodes](images/tools.png)

### Tool Integration · API Tools

Register tools from **Agent Workspace → Tool Integration → API Tools**. Click **+ New Tool** at the top right of the list to open the registration form; switch between *Easy Mode* and *Developer Mode* to define your API endpoint.

![API Tools — clicking "New Tool" on the list opens the registration form](images/tool-new.gif)

### Tool Integration · Auth Profiles

Credentials used by API tools to call external systems (Bearer Token, OAuth, etc.) are managed separately under **Agent Workspace → Tool Integration → Auth Profiles**. Click **+ New Profile** at the top right of the list to open the *Create Auth Profile* form, where you fill in basic info (Service ID, Name, Auth Type, TTL) plus Auth API and Extract/Inject Rules tabs.

![Auth Profiles — clicking "New Profile" on the list opens the create form](images/auth-profile-new.gif)

## Tutorials

When you're new or want to pick up a new pattern quickly, click the **▶ Tutorial** button in the canvas header to open the *Select Tutorial* panel. The panel has two tabs.

### Basic Tutorials

A set of scenarios pre-registered with the solution; they run without any setup. Examples shipped today:

- Basic Chatbot — simplest chatbot configuration
- Translation Bot — multilingual translation
- Email Writer — email draft generation
- Prompt Template — using prompt templates
- Internal RAG QA — Q&A over internal documents
- Multilingual Support — multilingual responses
- Daily News Briefing Mailer — news summary mailer
- News Analysis with Self-Eval — news analysis with self-evaluation

Each card shows the step count and tags. You can run it two ways.

| Button | Behavior |
|---|---|
| **▶** (virtual cursor) | A virtual cursor demonstrates the flow automatically — adding, connecting, and saving nodes step by step |
| **📄** (step-by-step guide) | You operate the canvas yourself while step hints walk you through it |

### Template Tutorials

Only items you explicitly added from the **Agentflow Library (Store)** via *Register Virtual Tutorial* appear here. Bundling templates you reuse often as virtual tutorials lets you replay the build pattern step by step in your own workspace later.

How to register:

1. Open **Agent Workspace → Library** in the left sidebar
2. On the card you want to turn into a virtual tutorial, click **Register Virtual Tutorial**
3. Return to the canvas and verify it under **Tutorial → Template Tutorials**

To remove it, use the **Unregister Virtual Tutorial** button on the same card.

!!! note "Empty agentflows cannot be registered"
    An agentflow with zero nodes has nothing to demonstrate and cannot be registered as a virtual tutorial.

## Auto Layout

When nodes become densely arranged, use the **Auto Layout** feature at the bottom right of the canvas to tidy the structure.

## Saving

Click **Save** at the top right of the canvas to persist changes. Each save creates a new version.

## Next Steps

For executing, deploying, and sharing the agent (agentflow) you've built, see [Agent Operations](13-agentflow-operations.md).

## Contact

For questions about creating agentflows, please contact **XGen Administrator**({{vars.support_email}}).
