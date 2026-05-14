# Creating an Agent

This chapter covers building an **Agentflow** — the core deliverable of the solution.

## What Is an Agentflow

An agentflow is a visual workflow connecting multiple **nodes** that defines an AI task. Start node → intermediate steps (LLM calls, tool execution, branching) → response are all represented in one diagram.

| Term | Description |
|---|---|
| Agentflow | The entire flow composed of nodes (the unit of deployment) |
| Node | A single step in the flow (LLM, tool, branch, etc.) |
| Canvas | The area for visually editing nodes |

See [Glossary](../common/01-glossary.md) for full terminology.

## Entering Agent Workspace

Select **Agent Creation → Agent Design** in the left sidebar.

![Agent Workspace — list of registered agentflows with the create button](images/agentflow-list.png)

## Creating a New Agentflow

1. Click the **+ New Agentflow** button at the top right
2. Enter:
    - **Name**: an identifiable name (Korean or English)
    - **Description** (optional): one-line summary of what it does
3. Create → an empty canvas opens with the **Start Node** automatically placed

![Canvas editor — visual workspace where nodes are added and connected, starting from the Start Node](images/canvas-editor.png)

## Adding Nodes

The left sidebar of the canvas lists node types by category.

| Category | Example Nodes |
|---|---|
| LLM | Model invocation, response generation |
| Knowledge Retrieval | Collection search, citation insertion |
| Tools | External APIs, MCP tools |
| Branching | Conditional, loop |
| I/O | Receive input, return output |

To add:

1. Expand a node category in the sidebar
2. **Drag and drop** a node card onto the canvas
3. The node is placed on the canvas

!!! note "Node-palette drag screenshot pending"
    A screenshot of dragging a node card from the left palette will be added in a future manual update. The node palette is visible on the left side of the canvas editor image above.

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

!!! note "Node detail panel screenshot pending"
    A screenshot of the per-node detail panel (right side, opens on click) will be added in a future manual update.

External APIs and MCP tools referenced by Tool nodes are registered and managed on a separate screen.

![API Tools — manage external APIs and MCP tools called by Tool nodes](images/tools.png)

## AI-Generated Agentflow

If creating a complex flow from scratch is hard, ask AI to draft it.

1. Click **Auto-Generate** at the top of the canvas
2. Describe the desired flow in natural language (e.g., "a chatbot that searches internal policy documents")
3. The AI proposes a node configuration → review and adjust

## Auto Layout

If the canvas becomes cluttered, click **Auto Layout** at the top to neatly arrange the nodes.

## Saving

Click **Save** at the top right of the canvas to persist changes. Each save creates a new version.

## Next Steps

For executing, deploying, and sharing the agent (agentflow) you've built, see [Agent Operations](13-agentflow-operations.md).

## Contact

For questions about creating agentflows, please contact {{vars.support_email}}.
