# Pathfinder (XGEN Pathfinder)

This chapter covers how to install, connect, and use the Chrome browser extension **Pathfinder (XGEN Pathfinder)**. Pathfinder analyzes the screen you are currently viewing or your workflow to suggest *which agent you should build*, and helps you create an agent quickly from a recommended template.

!!! note "A helper tool for creating agents"
    Pathfinder is not a menu inside the XGEN screen — it is a **browser extension** installed separately in Chrome. It works while you are logged in to XGEN and helps you start [Creating an Agent](12-agentflow-create.md) faster.

## 1. Download and prepare the Pathfinder plugin

Purpose — prepare the files needed to install the Pathfinder plugin.

1. Download the provided **Pathfinder archive file (.zip)**.
2. Extract the archive **into a folder** — extraction is required.

!!! warning "Notes on extraction"
    - The plugin cannot be installed while still in the compressed (.zip) state — you must extract it into a folder.
    - The extracted folder must contain a **`manifest.json`** file for the installation to work correctly.

## 2. Add it to Chrome extensions

Purpose — add Pathfinder to the browser and connect it to XGEN.

1. Enter the following in the Chrome address bar to open the extensions management page.

    ```
    chrome://extensions/
    ```

2. Turn on **Developer mode** in the top-right corner.
3. Click **Load unpacked**.
4. Select the **folder** you extracted in step 1.

When the installation completes, **"XGEN Pathfinder"** appears in the extensions list. Once it is listed, the installation was successful.

!!! warning "Common errors"
    - **Selecting a zip file instead of a folder** causes the installation to fail — make sure you extracted it into a folder in step 1.
    - If **Developer mode is off**, the *Load unpacked* button is not shown.

## 3. Run Pathfinder and connect to XGEN

Purpose — connect to the XGEN platform through the extension.

1. Click the **extensions icon** (puzzle shape) in the top-right of Chrome.
2. Select **XGEN Pathfinder** from the list.
3. Move to the XGEN screen, and the connection is confirmed automatically.

Signs it is working

- A **side panel** or popup UI activates on the right side of the screen.
- **"Agent creation / recommendation"** features are shown.

## 4. How to use Pathfinder

Purpose — quickly create an AI agent that automates your work.

Pathfinder analyzes your current screen or workflow and suggests *an appropriate way to create an agent*. The agent built from the suggestion is composed visually on the canvas as a Flow.

Steps

1. Answer the **"What kind of Agent would you like to build?"** prompt with the task you want.
2. Select a recommended **template** and proceed with creation.

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
