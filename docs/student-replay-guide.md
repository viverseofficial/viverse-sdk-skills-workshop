# Student Replay Guide

## What This Repository Is For

This repository lets you replay the workshop after it ends.

If you want the step-by-step setup for VS Code or another AI IDE, start with:

- [ai-ide-integration-guide.md](ai-ide-integration-guide.md)

The workflow is intentionally simple:

1. run the standalone baseline app locally
2. understand why publish comes before platform integration
3. publish the baseline app to VIVERSE
4. add auth, avatar, and leaderboard using the official skills
5. republish and compare the upgraded result

## Baseline App

The baseline app lives at:

- [../apps/hide-and-seek-standalone-base](../apps/hide-and-seek-standalone-base)

It already runs as a local app, but it intentionally disables VIVERSE platform integration.

## Why The Workshop Starts With Publish

For this demo, the real target runtime is VIVERSE.

That means publish is not treated as a final deployment detail. It is introduced first because later features such as auth, avatar, and leaderboard are more meaningful when validated in the intended platform environment.

## Recommended Skill Order

Use the official skills in this order:

1. `viverse-world-publishing`
2. `viverse-auth`
3. `viverse-avatar-sdk`
4. `viverse-leaderboard`

## Suggested Practice Flow

1. Start the baseline app locally.
2. Read the publishing skill and publish the baseline app to VIVERSE.
3. Confirm you now have a baseline world running on VIVERSE.
4. Read the auth skill and integrate login.
5. Read the avatar skill and replace the placeholder player representation.
6. Read the leaderboard skill and add score upload and ranking display.
7. Republish the upgraded app.
8. Compare the baseline world and the upgraded world.

## Where To Find The Replay Prompts

Use:

- [live-demo-prompts.md](live-demo-prompts.md)

## Where To Find The Official Skills

- https://github.com/viverseofficial/viverse-sdk-skills