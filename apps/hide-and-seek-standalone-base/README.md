# Hide and Seek Standalone Base

This folder is the workshop baseline app for the VIVERSE SDK Skills demo flow.

It is intentionally runnable without VIVERSE SDK scripts, app IDs, leaderboard setup, or multiplayer services.

Use this version as the first shareable checkpoint in the workshop:

1. Share the standalone app first.
2. Demonstrate that it runs locally as a complete game.
3. Ask the AI IDE to integrate VIVERSE auth, avatar, leaderboard, or multiplayer using the skills repository.
4. Share the upgraded version as the second checkpoint.

## What Is Included

- Local single-player hide-and-seek gameplay
- Three.js scene, props, role switching, timer, and score loop
- Placeholder player marker avatar
- Leaderboard and multiplayer UI shells still visible for workshop continuity

## What Is Disabled In This Baseline

- VIVERSE login
- VIVERSE avatar loading
- VIVERSE leaderboard backend
- VIVERSE multiplayer backend

These integrations are replaced by local stub modules in:

- `src/viverseAuth.js`
- `src/viverseAvatar.js`
- `src/viverseLeaderboard.js`
- `src/viverseMultiplayer.js`

## Run Locally

```bash
npm install
npm run dev
```

## Workshop Upgrade Targets

Recommended live demo upgrades:

1. Add VIVERSE auth and replace the placeholder player marker with the authenticated avatar.
2. Enable leaderboard submission and top-10 readback.
3. Re-enable multiplayer room creation and join flow.

## Suggested Prompt Shape

Tell the AI IDE to read the relevant skills first, then implement the integration into this folder.

Example:

```text
Read the skills for viverse-auth and viverse-avatar-sdk, then integrate login and authenticated avatar loading into this standalone hide-and-seek app without changing the base gameplay loop.
```