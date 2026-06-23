# AI IDE Integration Guide

This guide shows the fastest way to start the workshop flow in an AI IDE such as VS Code with GitHub Copilot.

The goal is to make the AI work with the right context from the beginning:

1. the workshop app repository
2. the official skills repository
3. a clear prompt order

## What You Need First

Prepare these items before you start:

1. VS Code or another repo-aware AI IDE
2. GitHub Copilot Chat or an equivalent coding agent experience
3. Node.js and npm
4. a local clone of the workshop repository
5. a local clone of the official skills repository
6. VIVERSE CLI access if you want to perform the publish steps yourself

Recommended local folder layout:

```text
your-workspace/
  viverse-sdk-skills/
  viverse-sdk-skills-workshop/
```

## Step 1: Clone Both Repositories

The AI needs both repositories because the workshop app lives in the workshop repo, but the integration rules live in the official skills repo.

```bash
git clone git@github.com:viverseofficial/viverse-sdk-skills.git
git clone git@github.com:viverseofficial/viverse-sdk-skills-workshop.git
```

If you already have one of them, only clone the missing repository.

## Step 2: Open Both Repositories In VS Code

Open VS Code with both folders in the same workspace.

Why this matters:

1. the AI can inspect the demo app in the workshop repo
2. the AI can read the canonical `SKILL.md` files from the skills repo
3. your prompts can refer to both repositories without copy-pasting skill text manually

In VS Code, use:

1. `File`
2. `Add Folder to Workspace...`
3. add both repositories

At the end of this step, your Explorer should show both folders:

1. `viverse-sdk-skills`
2. `viverse-sdk-skills-workshop`

## Step 3: Start From The Baseline App

The workshop app starts here:

- [../apps/hide-and-seek-standalone-base](../apps/hide-and-seek-standalone-base)

This app is intentionally runnable before any VIVERSE integration. That is important because it gives the AI a clean before-state.

## Step 4: Run The Baseline App Locally

Open a terminal in the app folder and run:

```bash
cd apps/hide-and-seek-standalone-base
npm install
npm run dev
```

Confirm these facts before you involve the AI:

1. the app starts locally
2. the base gameplay works
3. login, avatar, and leaderboard are still not integrated

If the baseline is not stable, do not start the integration prompts yet.

## Step 5: Tell The AI What Repositories Are Open

Your first AI prompt should establish the working context.

Use a prompt like this:

```text
You have two repositories open in this workspace:
1. viverse-sdk-skills-workshop, which contains the demo app
2. viverse-sdk-skills, which contains the official VIVERSE SDK skill definitions

The app to modify is apps/hide-and-seek-standalone-base in the workshop repo.
Before making changes, always read the relevant SKILL.md file from the skills repo and follow it exactly.
Keep changes minimal and preserve the current gameplay loop.
```

This prevents the AI from treating the workshop repo as if it already contains the skill source.

## Step 6: Ask The AI To Classify The App First

Do not jump straight into auth or avatar integration.

Start with a short grounding prompt:

```text
Read the skill at skills/viverse-world-publishing/SKILL.md from the VIVERSE SDK Skills repository and inspect apps/hide-and-seek-standalone-base in the workshop repo. Tell me whether this is a publishable app folder, what output should be published, and what the next safest step is.
```

What you want back from the AI:

1. confirmation that it inspected the app folder
2. confirmation that it read the publishing skill
3. the exact publish strategy for this app

## Step 7: Publish The Baseline Before Feature Integration

The workshop flow is publish first, then integrate.

Use a prompt like this:

```text
Read the VIVERSE world publishing skill and publish the baseline app in apps/hide-and-seek-standalone-base using the safest repeatable workflow. If an app does not exist yet, create one first. After publish, tell me the App ID, the world URL, and whether future publishes should reuse the same App ID.
```

Why this comes first:

1. VIVERSE is the target runtime
2. auth and leaderboard behavior are more meaningful after you have a real world
3. the publish skill teaches the AI the app lifecycle and App ID rules

## Step 8: Integrate One Skill At A Time

After the baseline publish succeeds, move through the skills in this order:

1. `viverse-auth`
2. `viverse-avatar-sdk`
3. `viverse-leaderboard`

Do not ask for all integrations in one large prompt. Keep the work segmented.

Recommended prompt pattern:

```text
Read the skill for viverse-auth from the VIVERSE SDK Skills repository, then integrate that capability into apps/hide-and-seek-standalone-base in the workshop repo. Preserve the existing gameplay. After the edit, run the narrowest validation for the touched area and summarize the result.
```

Then repeat the same pattern for avatar and leaderboard.

## Step 9: Require Validation After Every Edit

Your AI IDE should validate each slice before moving on.

Ask for:

1. the narrowest build or test relevant to the change
2. a short summary of what changed
3. any blocker that must be resolved before the next skill

Good follow-up prompt:

```text
Before proceeding to the next skill, run the narrowest validation for the current changes in apps/hide-and-seek-standalone-base and tell me whether the app is ready for the next integration step.
```

## Step 10: Republish The Upgraded App

Once the integrations are validated locally, ask the AI to republish.

```text
Read the VIVERSE world publishing skill and republish the upgraded app to the same VIVERSE app used for the baseline publish. Confirm that the same App ID is reused and give me the final world URL.
```

## Step 11: Compare The Before And After States

Close the workflow with a comparison prompt:

```text
Compare the baseline published world and the upgraded published world for this app. Summarize the differences in login, player identity, avatar presence, and leaderboard behavior in plain language.
```

This final step turns the technical integration into a product-level demo.

## Recommended Reading Order In This Repository

Use these files in order:

1. [../apps/hide-and-seek-standalone-base/README.md](../apps/hide-and-seek-standalone-base/README.md)
2. [student-replay-guide.md](student-replay-guide.md)
3. [live-demo-prompts.md](live-demo-prompts.md)

## Common Mistakes To Avoid

1. Opening only the workshop repo and not the skills repo
2. Asking the AI to integrate everything in one prompt
3. Skipping the baseline local run
4. Treating publish as a final deployment detail instead of an early workshop step
5. Forgetting to tell the AI to read the relevant `SKILL.md` first

## If You Are Not Using VS Code

The same workflow still applies in another AI IDE.

The key requirements are:

1. both repositories must be visible to the AI
2. the AI must be able to inspect files before editing
3. you should keep the prompts skill-by-skill instead of asking for a full rewrite