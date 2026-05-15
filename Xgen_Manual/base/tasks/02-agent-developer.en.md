# Agent Developer

> Users who **design and deploy** agents to automate their own work. On top of the standard-user menus, they get access to **Agent Creation, Tool Integration, and Knowledge Management** areas.

## End-to-end flow: build → deploy → approve

1. **Enter workspace** — Agent Workspace → Agent Design → [Enter Agent Workspace](../user/12-agentflow-create.md#agent-작업실-진입)
2. **Compose nodes** — add and connect nodes on the canvas starting from the Start Node → [Create an Agentflow](../user/12-agentflow-create.md)
3. **Connect external tools** — register API Tools / MCP nodes → [Add Nodes](../user/12-agentflow-create.md#노드-추가)
4. **Quality evaluation** — verify response quality with test data → [Agent Operations - Quality](../user/13-agentflow-operations.md#에이전트-품질-분석)
5. **Submit deployment request** — Agent List → card More menu → **Deploy Info** → flip the **Deploy toggle ON** → [Submit a deployment request](../user/13-agentflow-operations.md#request-deployment)
6. **Wait for System Administrator deployment approval** — once the administrator approves on Agent Management, the card badge becomes *Deployed* → [What happens next](../user/13-agentflow-operations.md#dual-approval-flow)
7. **Wait for Governance Officer governance approval** — the agent becomes visible to end users only after the governance reviewer approves it on AI Governance → Agentflow Approval (risk, PII, policy) → [What happens next](../user/13-agentflow-operations.md#dual-approval-flow)

## See the main screen tailored to my role right after login
- Start: automatic redirect right after login (or click the **XGEN** logo at the top-left)
- Procedure: [Dashboard · Agent Developer view](../user/18-dashboard.md#agent-developer-view)
- Agent Developers see all Standard-User widgets plus build/deploy widgets such as **operations metrics for my agents** and **approval queue status**.

## I want the agent to consult internal documents and data (RAG)
- Start: left sidebar **Knowledge → Collection**
- Procedure: [Knowledge Management](../user/15-knowledge.md)

## I want to save and share frequently-used prompts
- Start: left sidebar **Agent Creation → Agent Prompts**
- Procedure: [Prompt Management](../user/16-prompt.md)

## I want to manage credentials for external systems safely
- Start: left sidebar **Tool Integration → Auth Profile**
- Procedure: [Auth Profile](../user/17-auth-profile.md)

## I want to submit a deployment request for my agent
- Start: Agent Workspace → **Agent Creation → Agent List** → **⋯** menu on your card → **Deploy Info**
- Procedure: [Submit a deployment request](../user/13-agentflow-operations.md#request-deployment)
- Key: flipping the **Deploy toggle ON** in DeploymentModal is the single action that queues the request with the System Administrator. Shared deployments require selecting an *Agent Development Plan* first.

## I want to track the status of my deployment request
- Start: [Dashboard · Agent deployment/approval status](../user/18-dashboard.md) widget (Agent Developer view)
- Procedure: read the five counters — *Deployment pending / Deployment rejected / Governance pending / Governance rejected / Both approvals completed*
- Full flow: [Dual-approval flow](../user/13-agentflow-operations.md#dual-approval-flow)
- Note: the agent reaches end users only after the System Administrator (stage 1) **and** the Governance Officer (stage 2) both approve. Single-stage approval keeps it hidden.

## My agent was rejected by governance
- Start: [Dashboard · Agent deployment/approval status](../user/18-dashboard.md) → click the *Governance rejected* counter, or re-open **Deploy Info** on the card
- Procedure: read the rejection reason (`governance_review_comment`) → fix the agent → resubmit from stage 0 via [Submit a deployment request](../user/13-agentflow-operations.md#request-deployment)
- Governance reviewer's criteria: [AI Governance · Agent Approval](../admin/29-governance-dashboard.md#agent-approval)

## I want to register an external API / MCP server as a tool
- Start: left sidebar **Tool Integration → API Tool**
- Procedure: [Create an Agentflow - Add Nodes](../user/12-agentflow-create.md#노드-추가)

## I want to see call statistics and failure rate for my deployed agents
- Start: left sidebar **Agent Operations**
- Procedure: [Agent Operations](../user/13-agentflow-operations.md)
