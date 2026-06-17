---
require_view: pathfinder
---
# Using Pathfinder

This chapter covers how to install, connect, and use the Chrome browser extension **Pathfinder (XGEN Pathfinder)**. Pathfinder is **an assistant that helps you build AI agent workflows on the XGEN canvas**. Through conversation alone, it finds the nodes you need and assembles them on the canvas, integrates external services as tools, and even handles page actions and real-time guidance.

!!! note "A helper tool for building agents"
    Pathfinder is not a menu inside the XGEN screen — it is a **browser extension** installed separately in Chrome. It works while you are logged in to XGEN and helps you carry out [Creating an Agent](12-agentflow-create.md) faster.

## What Pathfinder can do

Pathfinder helps you with the following.

**Build workflows**

- **Create agents by chatting** — Say something like "build a Google News search agent" and Pathfinder finds the needed nodes and assembles them on the canvas.
- **Add, connect, delete nodes** — Place and connect nodes on the canvas to complete a workflow.
- **Set parameters** — Adjust the configuration values of each node.

**Integrate tools**

- **Connect external services** — Register features you use on a website as XGEN tools.
- **Auto-detect APIs** — Analyze actions such as button clicks on external sites and turn them into tools.

**Operate the page**

- **Navigate menus** — Guide you to the page you want.
- **Click buttons, enter input** — Perform UI actions on your behalf.

**Real-time support**

- **Context-aware suggestions** — Offer help suited to the task you are currently working on.
- **Answer questions** — Guide you on how to use XGEN or design workflows.

## 1. Download and prepare the Pathfinder plugin

Purpose — prepare the files needed to install the Pathfinder plugin.

1. Download the provided **Pathfinder archive file (.zip)**.
2. Extract the archive **into a folder** — extraction is required.

![The downloaded Pathfinder archive extracted into a folder](images/pathfinder-01-unzip.png)

!!! warning "Notes on extraction"
    - The plugin cannot be installed while still in the compressed (.zip) state — you must extract it into a folder.
    - The extracted folder must contain a **`manifest.json`** file for the installation to work correctly.

## 2. Add it to Chrome extensions

Purpose — add Pathfinder to the browser and connect it to XGEN.

1. Enter the following in the Chrome address bar to open the extensions management page.

    ```
    chrome://extensions/
    ```

    ![The extensions management page opened by entering chrome://extensions/ in the Chrome address bar](images/pathfinder-02-extensions-page.png)

2. Turn on **Developer mode** in the top-right corner.
3. Click **Load unpacked**.

    ![The *Load unpacked* button at the top-left of the extensions management page](images/pathfinder-03-load-unpacked.png)

4. Select the **folder** you extracted in step 1.

    ![Selecting the extracted Pathfinder folder](images/pathfinder-04-select-folder.png)

When the installation completes, **"XGEN Pathfinder"** appears in the extensions list. Once it is listed, the installation was successful.

!["XGEN Pathfinder" shown in the extensions list — installation complete](images/pathfinder-05-installed.png)

!!! warning "Common errors"
    - **Selecting a zip file instead of a folder** causes the installation to fail — make sure you extracted it into a folder in step 1.
    - If **Developer mode is off**, the *Load unpacked* button is not shown.

## 3. Run Pathfinder and connect to XGEN

Purpose — connect to the XGEN platform through the extension.

1. Click the **extensions icon** (puzzle shape) in the top-right of Chrome.
2. Select **XGEN Pathfinder** from the list.
3. Move to the XGEN screen, and the connection is confirmed automatically.

![Selecting XGEN Pathfinder from the Chrome extensions list and connecting it to the XGEN screen](images/pathfinder-06-connect.png)

Signs it is working

- A **side panel** or popup UI activates on the right side of the screen.
- **"Agent creation / recommendation"** features are shown.

## 4. How to use Pathfinder

Purpose — quickly create an AI agent that automates your work.

Tell Pathfinder the task you want to build through conversation, and it finds the needed nodes and assembles them into a workflow (Flow) on the canvas. The resulting agent is represented visually on the canvas as nodes and connections.

Steps

1. Answer the **"What kind of Agent would you like to build?"** prompt with the task you want.
2. Select a recommended **template** and proceed with creation.

The video below shows the full flow — entering a task in Pathfinder, creating an API, and creating the agent.

<video controls muted playsinline preload="metadata" width="100%" style="max-width: 960px; border-radius: 8px;">
  <source src="images/pathfinder-09-usage.mp4" type="video/mp4">
  If your browser cannot play the video, <a href="images/pathfinder-09-usage.mp4">download it here</a>.
</video>

![The Pathfinder side panel active on the right of the XGEN screen — the "Agent creation / recommendation" conversation feature](images/pathfinder-07-usage-panel.png)

![The agent created from Pathfinder's suggestion, composed visually as a Flow on the canvas](images/pathfinder-08-usage-flow.png)

> For detailed editing and node composition of the created agent, see the [Creating an Agent](12-agentflow-create.md) chapter.

## 5. Troubleshooting guide

| Symptom | Check / action |
|---|---|
| The extension is not visible | Restart Chrome, or check that the extension is **pinned**. |
| It will not connect to XGEN | Check that you are **logged in** to XGEN and **refresh** the page. |
| An agent cannot be created | Check your account **permissions** or **network status**. |

## Operating recommendations

- Pathfinder is a tool that *assists* with building agents. After creation, we recommend reviewing and reinforcing the flow with the [Creating an Agent](12-agentflow-create.md) and [Agent Node List](12a-node-list.md) chapters.
- The extension only works in the browser where it was installed. To use it on another PC or browser, install it again using the same steps.

## Contact

For questions about Pathfinder, please contact your Xgen solution administrator.
