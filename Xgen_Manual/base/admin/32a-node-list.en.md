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

## Node Categories (Tree View)

The root category **XGen** exposes the following flat categories.

| Category | Purpose |
|---|---|
| **Agent** | Invoke deployed agents as nodes. Expanding the category lists each agent deployed in the environment as an individual node |
| **MCP** | Model Context Protocol — external tool nodes |
| **API Loader** | Nodes for external API invocation |
| **Document Loader** | Nodes for loading PDF, DOCX, text, and similar documents |
| **File System** | Nodes for accessing file-system resources |
| **Memory** | Conversation / session memory nodes |
| **Router** | Branching and routing nodes |
| **Tool** | Built-in and user-defined tool nodes |
| **Start Node** | Agentflow entry point |
| **End Node** | Agentflow exit point |

Click the arrow (`›`) to the left of each category to expand its child nodes. For example, the **Agent** category lists every agent deployed in the environment so it can be invoked from another agentflow.

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
- **Tag** — labels attached to nodes

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
