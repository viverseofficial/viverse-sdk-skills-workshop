# VIVERSE SDK Skills Workshop

This repository is the single access point for the VIVERSE SDK Skills workshop.

It combines:

- a standalone baseline app for the live demo
- workshop documents for students
- a replayable prompt sequence for post-workshop practice
- a NotebookLM slide-source draft

The official VIVERSE SDK Skills repository lives here:

- https://github.com/viverseofficial/viverse-sdk-skills

## Workshop Goal

The workshop demonstrates a full AI IDE workflow:

1. start from a standalone runnable app
2. publish the baseline app to VIVERSE
3. integrate VIVERSE platform capabilities with skills
4. republish the upgraded app
5. compare the before and after versions

## Start Here

If you are a student, use these files in order:

1. [docs/resources.md](docs/resources.md)
2. [apps/hide-and-seek-standalone-base/README.md](apps/hide-and-seek-standalone-base/README.md)
3. [docs/student-replay-guide.md](docs/student-replay-guide.md)
4. [docs/live-demo-prompts.md](docs/live-demo-prompts.md)

If you want to generate slides in NotebookLM, use:

- [docs/notebooklm-slide-draft.md](docs/notebooklm-slide-draft.md)

## Repository Structure

```text
apps/
  hide-and-seek-standalone-base/
docs/
  resources.md
  student-replay-guide.md
  live-demo-prompts.md
  notebooklm-slide-draft.md
```

## Demo App

The baseline app is located at:

- [apps/hide-and-seek-standalone-base](apps/hide-and-seek-standalone-base)

This version is intentionally runnable without VIVERSE login, avatar loading, leaderboard submission, or multiplayer services.

That makes it suitable as the pre-integration checkpoint for the workshop.

## Skill Order Used In The Workshop

The workshop introduces skills in this order:

1. `viverse-world-publishing`
2. `viverse-auth`
3. `viverse-avatar-sdk`
4. `viverse-leaderboard`

## Related Repositories

- Workshop repo: https://github.com/viverseofficial/viverse-sdk-skills-workshop
- Skills repo: https://github.com/viverseofficial/viverse-sdk-skills