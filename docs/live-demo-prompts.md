# Live Demo Prompts

These prompts are meant to be replayed after the workshop.

They are written so you can use them both in rehearsal and in a live presentation.

## Prompt 1: Classify The Demo Folder

```text
Read the skill at skills/viverse-world-publishing/SKILL.md from the VIVERSE SDK Skills repository and explain whether the hide-and-seek standalone base app is a publishable app folder or just an editing folder. Keep the answer short and tell me the next step.
```

## Prompt 2: Explain Why Publish Comes First

```text
Read the VIVERSE world publishing skill and summarize why publish needs to come before auth, avatar, and leaderboard for this workshop demo. Keep it in plain language for a live audience.
```

## Prompt 3: Confirm The Publish Strategy

```text
Read the VIVERSE world publishing skill and inspect the hide-and-seek standalone base app. Tell me the exact publish strategy for this app, including whether it should publish the folder directly or publish a build output folder.
```

## Prompt 4: Publish The Baseline App

```text
Read the VIVERSE world publishing skill and publish the hide-and-seek standalone base app to VIVERSE using the safest repeatable CLI workflow. If an app does not exist yet, create a world app first. After publishing, tell me the baseline world URL and the exact App ID used.
```

## Prompt 5: Summarize The Baseline World

```text
Summarize what the current published baseline already does and what is still intentionally missing before VIVERSE integration. Keep it suitable for a 30-second live demo transition.
```

## Prompt 6: Add VIVERSE Auth

```text
Read the VIVERSE auth skill and integrate VIVERSE login into the hide-and-seek standalone base app. Preserve the current gameplay. Follow the skill's handshake delay, app ID resolution, and profile fallback rules exactly.
```

## Prompt 7: Add Authenticated Avatar

```text
Read the VIVERSE avatar SDK skill and replace the current placeholder player marker in the hide-and-seek standalone base app with the authenticated user's VIVERSE avatar. Use vrmUrl first, then avatarUrl, then keep the current placeholder as fallback. Do not disturb the main gameplay loop.
```

## Prompt 8: Add Leaderboard

```text
Read the VIVERSE leaderboard skill and add leaderboard submission and a top-10 ranking panel to the hide-and-seek standalone base app. Submit score once per completed round using an idempotent result key. Preserve local gameplay even when leaderboard data is empty or unavailable.
```

## Prompt 9: Validate The Integrated App

```text
Run the narrowest validation for the changes made in the hide-and-seek standalone base app, including build validation and any targeted checks needed for the new auth, avatar, and leaderboard paths. Summarize any blockers before publish.
```

## Prompt 10: Republish The Upgraded App

```text
Read the VIVERSE world publishing skill and republish the upgraded app to the same VIVERSE app used for the baseline publish. After publish, give me the final world URL and confirm that the same App ID was reused.
```

## Prompt 11: Compare Before And After

```text
Compare the baseline published world and the upgraded published world for this workshop demo. Summarize the product-level differences in plain language, focusing on login, player identity, avatar presence, and leaderboard behavior.
```