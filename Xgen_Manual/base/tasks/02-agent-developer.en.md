# Agent Developer

> Users who **design and deploy** agents to automate their own work. On top of the standard-user menus, they get access to **Agent Creation, Tool Integration, and Knowledge Management** areas.

## End-to-end flow: build → deploy → approve

1. **Enter workspace** — Agent Workspace → Agent Design → [Enter Agent Workspace](../user/12-agentflow-create.md#agent-작업실-진입)
2. **Compose nodes** — add and connect nodes on the canvas starting from the Start Node → [Create an Agentflow](../user/12-agentflow-create.md)
3. **Connect external tools** — register API Tools / MCP nodes → [Add Nodes](../user/12-agentflow-create.md#노드-추가)
4. **Quality evaluation** — verify response quality with test data → [Agent Operations - Quality](../user/13-agentflow-operations.md#에이전트-품질-분석)
5. **Deploy** — push to production → [Agent Operations](../user/13-agentflow-operations.md)
6. **Approval queue** (when over the risk threshold) — wait for governance approval → [AI Governance - Risk Review](../admin/29-governance-dashboard.md#ai-위험도-평가-및-심사)

## I want the agent to consult internal documents (RAG)
- Start: left sidebar **Knowledge → Collection**
- Procedure: [Knowledge Management](../user/15-knowledge.md)

## I want to save and share frequently-used prompts
- Start: left sidebar **Agent Creation → Agent Prompts**
- Procedure: [Prompt Management](../user/16-prompt.md)

## I want to manage credentials for external systems safely
- Start: left sidebar **Tool Integration → Auth Profile**
- Procedure: [Auth Profile](../user/17-auth-profile.md)

## My agent is pending governance approval
- Start: Admin Settings → AI Governance → Agent Approval
- Procedure: [AI Governance - Risk Review](../admin/29-governance-dashboard.md#ai-위험도-평가-및-심사)
- Note: if you don't have approval rights yourself, ask the governance officer to review

## I want to register an external API / MCP server as a tool
- Start: left sidebar **Tool Integration → API Tool**
- Procedure: [Create an Agentflow - Add Nodes](../user/12-agentflow-create.md#노드-추가)

## I want to see call statistics and failure rate for my deployed agents
- Start: left sidebar **Agent Operations**
- Procedure: [Agent Operations](../user/13-agentflow-operations.md)

## See the main screen tailored to my role right after login
- Start: automatic redirect right after login (or click the **XGEN** logo at the top-left)
- Procedure: [Dashboard · Agent Developer view](../user/18-dashboard.md#agent-developer-view)
- Agent Developers see all Standard-User widgets plus build/deploy widgets such as **operations metrics for my agents** and **approval queue status**.
