# Hide and Seek Game Spec

## Status

Draft for review. This is the game-first spec, not the later template spec.

## Working Title

Hide and Seek

## Product Goal

Build a browser-based 3D multiplayer prop-hunt hide-and-seek game using Three.js and VIVERSE services. Players enter a shared arena as their own VIVERSE avatar when available, then play short rounds as hiders or seekers.

The intended feel is a social metaverse game: easy to join, avatar-forward in the lobby, object-disguise-focused during the round, readable from third-person camera, and tense without becoming a shooter or combat game.

## Reference Notes

- Cluster worlds are naturally multiplayer spatial experiences where multiple players can enter the same space instance, and Cluster Creator Kit supports game logic through Trigger/Gimmick or scripting.
- Cluster supports user avatars and game-like worlds. The useful takeaway is not a one-to-one clone, but the format: social avatar play inside a shared 3D world.
- Japanese hide-and-seek rules commonly use one seeker and multiple hiders, a hiding phase, a seeking phase, a fixed field, and hiders winning by surviving until time expires.
- The primary game twist is prop-hunt style hiding: hiders transform into arena objects, then blend into the environment while seekers inspect suspicious props.
- The Japan Kakurenbo Association's standard reference uses `1 seeker / 9 hiders`, a hiding period, then a search period. For our game, those durations should be compressed for browser play.

Sources:
- https://docs.cluster.mu/creatorkit/en/world/
- https://help.cluster.mu/hc/ja/articles/4427741277465-%E3%83%AF%E3%83%BC%E3%83%AB%E3%83%89%E3%82%AF%E3%83%A9%E3%83%95%E3%83%88%E3%81%AE%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F
- https://japan-kakurenbo.com/about/
- https://orecen.com/x-reality/metaverse-cluster/

## Target Platform

- Desktop browser first.
- Mobile browser later if input and performance allow.
- VIVERSE Worlds iframe compatibility required.

## Tech Direction

- Rendering: vanilla Three.js.
- Build tool: Vite.
- VIVERSE SDK: hosted UMD script tag.
- Multiplayer: VIVERSE Matchmaking + Play SDK.
- Auth/profile: VIVERSE Login SDK.
- Avatar: VIVERSE Avatar SDK, reading 3D model URLs from authenticated profile data.

Relevant local skill guidance:
- `/Users/casper_wang/Projects/AI/viverse-sdk-skills/skills/viverse-threejs-vanilla-foundation/SKILL.md`
- `/Users/casper_wang/Projects/AI/viverse-sdk-skills/skills/viverse-auth/SKILL.md`
- `/Users/casper_wang/Projects/AI/viverse-sdk-skills/skills/viverse-avatar-sdk/SKILL.md`
- `/Users/casper_wang/Projects/AI/viverse-sdk-skills/skills/viverse-multiplayer/SKILL.md`

## Core Loop

1. Player opens game.
2. Game starts immediately in guest/local preview mode while VIVERSE auth resolves.
3. Player signs in or continues as guest.
4. Player creates or joins a multiplayer room.
5. Lobby waits for enough players.
6. Host starts match.
7. Roles are assigned: one seeker, remaining players are hiders.
8. Arena is selected.
9. Hiding phase begins. Seeker is locked, blinded, or held in a start room.
10. Hiders transform into arena props and position themselves.
11. Seeking phase begins. Seeker searches the arena.
12. Seeker uses inspection, tag, and limited tools to identify fake props.
13. Hiders use movement, placement, decoys, and limited counter-tools to survive.
14. Hider is caught when seeker correctly reveals or tags the disguised player.
15. Round ends when all hiders are caught or time expires.
16. Scores are shown, then next round starts with rotated seeker or a new arena.

## Game Modes

### MVP Mode: Public Room Hide and Seek

- 2-10 players.
- 1 seeker.
- All other players are hiders.
- Hiders disguise as arena props.
- Hiders win if at least one hider remains uncaught when time expires.
- Seeker wins if all hiders are caught.

### Later Mode: Rotation Set

- Every player becomes seeker once.
- Final winner is based on combined hide score and seek score.
- This follows the competition-style rotation idea from Japanese hide-and-seek rules.

### Later Mode: Reverse Hide and Seek

- One player hides.
- Seekers who find the hider quietly join the hiding group.
- Last seeker loses.
- This should be treated as a future variant, not MVP.

## Player Roles

### Hider

Objectives:
- Choose a believable prop disguise.
- Place that prop in a believable location.
- Avoid seeker inspection, scan tools, and tag range.
- Survive until round timer ends.

Abilities:
- Move.
- Jump or mantle if map supports it.
- Crouch/sneak.
- Transform into allowed props from the current arena.
- Rotate and settle into place.
- Lock pose for a camouflage bonus.
- Use hider tools such as decoys, scramble, blink shift, or scan shield.

Constraints:
- Cannot leave playable bounds.
- Cannot enter seeker-only areas.
- Cannot transform into every object; each arena exposes an approved prop pool.
- Large/small props have different movement and hiding tradeoffs.
- After being caught, becomes spectator or ghost.

### Seeker

Objectives:
- Search the map.
- Tag all hiders before time expires.

Abilities:
- Move.
- Sprint with stamina.
- Inspect suspicious props.
- Tag or reveal hiders within close range.
- Use seeker tools such as laser eyes, reveal pulse, footprint ping, or object scanner.

Constraints:
- Locked during hiding phase.
- Starts with delayed release.
- Tools have charge time, cooldown, range, and counterplay to avoid unfair finding.

## Prop Transformation

### Prop Pool

Each arena defines its own approved prop pool. A prop entry includes:

- `id`: stable object id.
- `displayName`: UI label.
- `model`: Three.js asset or procedural model reference.
- `bounds`: gameplay capsule/box used for hit checks.
- `themeTags`: arena tags such as `festival`, `school`, `office`, `garden`.
- `rarity`: common, uncommon, risky, special.
- `mobility`: full, slow, locked, or hop-only.
- `scanSignature`: how strongly seeker tools detect it.
- `allowedSurfaces`: floor, table, shelf, wall, roof.

### Hider Transform Rules

- During hiding phase, hiders can choose from a carousel of nearby or arena-valid props.
- Hiders can re-transform a limited number of times during hiding phase.
- During seeking phase, re-transforming is either disabled or consumes a rare tool charge.
- Hiders can rotate their prop to match the scene.
- Settling in place for several seconds grants a camouflage stability bonus.
- Moving while disguised creates stronger audio/visual tells.

### Fairness Rules

- Very small props are easier to detect or slower to move.
- Very large props are easier to see but can block line-of-sight.
- Props cannot clip deeply into walls or other props.
- Props must stay on valid surfaces.
- Duplicate props are allowed, but too many duplicates in one area should become suspicious by design, not by hidden rules.

## Avatar Requirements

### Authenticated Player

- Use the player's VIVERSE avatar when profile provides a 3D avatar URL.
- Prefer `activeAvatar.vrmUrl` before `activeAvatar.avatarUrl`.
- Normalize avatar height after load.
- Force visibility on all loaded meshes.
- Disable frustum culling on skinned meshes if animation retargeting is used.

### Guest or Failed Avatar Load

- Use a stylized fallback avatar.
- Fallback must be game-readable by role:
  - Hider: warm jacket or neutral silhouette.
  - Seeker: brighter vest, lantern, or armband.

### Avatar Gameplay Fairness

- Gameplay collision capsule must be fixed size across avatars.
- Visual avatar height can vary, but tag and visibility logic should use the normalized capsule.
- Cosmetics must not create smaller hitboxes.

## Multiplayer Model

### Room Flow

- Manual controls are required:
  - Create room.
  - Join room.
  - Leave room.
  - Start match.
- Auto-match can exist later, but manual room lifecycle should remain available for testing.

### Authority

- Host is authoritative for gameplay-critical state.
- Clients send movement snapshots and intent messages.
- Host validates:
  - Role changes.
  - Round phase.
  - Tag events.
  - Score changes.
  - Timer transitions.
- Host publishes canonical state to all players.

### Late Join

- Late joiners enter lobby if match has not started.
- If match is active, late joiners become spectators until next round.
- Host sends current authoritative state on request.

### Reconnect

- Reconnected players can reclaim their actor if account/session mapping is still valid.
- If reclaim fails, join as spectator until next round.

## State Machine

### Phases

- `boot`: local runtime initializing.
- `auth`: VIVERSE auth/profile resolving in background.
- `menu`: player can enter room flow.
- `lobby`: players are in room, waiting for host start.
- `assignRoles`: host selects seeker.
- `hide`: hiders move, seeker locked.
- `seek`: seeker released.
- `roundEnd`: result shown.
- `matchEnd`: optional full rotation result.

### Default Timing

- Lobby countdown: 5 seconds after host start.
- Hiding phase: 45 seconds.
- Seeking phase: 3 minutes.
- Round-end screen: 12 seconds.

These values are intentionally shorter than physical hide-and-seek to fit browser sessions.

## Arena System

The game should support multiple arenas with different themes. An arena is a data-driven package containing:

- Scene layout.
- Spawn points.
- Seeker start room.
- Hider spawn areas.
- Prop pool.
- Tool availability rules.
- Lighting/audio theme.
- Bounds and nav/collision data.
- Optional arena-specific events.

### Arena Selection

- MVP can rotate arenas randomly.
- Lobby host can later choose arena.
- The same gameplay rules should work across all arenas.
- Each arena should have different prop logic, not only different visuals.

### Arena Themes

#### Festival Town

- Props: lanterns, crates, signs, benches, masks, food stalls, barrels, planters.
- Special effect: lantern flicker can hide minor movement.
- Seeker risk: many repeated props create false positives.

#### School After Hours

- Props: chairs, desks, bags, lockers, cleaning buckets, posters, traffic cones.
- Special effect: bell pulse briefly reveals recent movement trails.
- Seeker risk: classrooms create dense object clusters.

#### Arcade Mall

- Props: prize boxes, trash cans, standees, vending machines, stools, capsule machines.
- Special effect: neon interference weakens laser-eye scans in marked zones.
- Seeker risk: visual noise and moving screens.

#### Garden Shrine

- Props: stones, shrubs, fox statues, offering boxes, bamboo lights, umbrellas.
- Special effect: wind can create natural prop movement.
- Seeker risk: organic props have irregular silhouettes.

#### Space Station

- Props: cargo pods, oxygen tanks, terminals, toolboxes, drones, floor cones.
- Special effect: low-gravity event briefly shifts loose props.
- Seeker risk: metallic surfaces create scan reflections.

## Map Spec

### MVP Map: Compact Festival Town

Theme:
- Japanese-inspired small town or festival street at dusk.
- Cozy, legible, colorful, not horror-first.

Core areas:
- Central plaza.
- Narrow alley loop.
- Shrine or small park.
- Shopfront row.
- Elevated balcony or footbridge.
- Indoor-looking but simple occluder spaces.

Gameplay requirements:
- Multiple loops, not one linear corridor.
- At least 30 believable prop placements for 10 players.
- At least 3 high-risk/high-reward hiding spots near central routes.
- Clear boundary treatment.
- No dead zones where seeker cannot reach.
- Prop density should be high enough that fake props can blend in, but not so high that seeking becomes random.

### Hiding Spot Types

- Physical occlusion: behind crates, stalls, trees, walls.
- Prop disguise positions: among repeated objects, beside plausible scenery, on shelves/tables, in display rows.
- Interactable concealment spots: curtains, lockers, bushes, photo booths.
- Vertical spots: balcony, roof edge, raised platform.
- Social camouflage: NPC/statue clusters or festival mannequin props, optional later.

## Tool and Effect System

Tools are modular abilities that can be assigned by arena, role, match rules, or pickup. The goal is to let future tools be added without rewriting core round logic.

### Tool Data Model

Each tool should define:

- `id`: stable tool id.
- `role`: seeker, hider, or both.
- `activation`: button, passive, pickup, timed, or arena event.
- `targeting`: self, cone, ray, area, prop, player, or world point.
- `duration`: active effect length.
- `cooldown`: reuse delay.
- `charges`: limited count if applicable.
- `range`: maximum effect distance.
- `counterTags`: effects that block or weaken it.
- `networkPolicy`: host-validated event, local-only VFX, or replicated state.

### Seeker Tool Examples

#### Laser Eyes

- Role: seeker.
- Targeting: forward cone or ray from seeker camera.
- Effect: highlights suspicious props by comparing scan signature against nearby real props.
- Output should not say "this is a hider" directly. It should classify confidence:
  - Normal.
  - Odd.
  - Highly suspicious.
- Counterplay:
  - Hider scan shield reduces confidence.
  - Neon/interference arena zones distort result.
  - Stable hiders with matching placement reduce confidence.
- Balance:
  - Requires charge-up.
  - Loud/visible beam warns hiders.
  - Short duration and cooldown.

#### Reveal Pulse

- Role: seeker.
- Targeting: area around seeker.
- Effect: briefly shows movement trails or shimmer from recently moved fake props.
- Counterplay: hider freeze tool or stillness bonus.

#### Object Scanner

- Role: seeker.
- Targeting: single prop.
- Effect: inspect one prop deeply after a delay.
- Counterplay: decoy props can waste scanner charge.

#### Footprint Ping

- Role: seeker.
- Targeting: world.
- Effect: shows recent movement pings, not exact player identity.
- Counterplay: hider silent step or path scramble.

### Hider Tool Examples

#### Scan Shield

- Role: hider.
- Effect: reduces laser-eye confidence for a short time.
- Tradeoff: creates a faint shimmer after it ends.

#### Decoy Prop

- Role: hider.
- Effect: places a fake suspicious prop nearby.
- Tradeoff: too many decoys create pattern tells.

#### Blink Shift

- Role: hider.
- Effect: short reposition while disguised.
- Tradeoff: leaves a visible afterimage or sound.

#### Stillness Lock

- Role: hider.
- Effect: hider cannot move, but gains stronger camouflage and weaker scan signature.
- Tradeoff: breaking lock has a short delay.

#### Prop Swap

- Role: hider.
- Effect: swap disguise with a nearby compatible prop.
- Tradeoff: limited charges and visible transition.

### Tool Balance Principles

- No tool should be a guaranteed find or guaranteed escape.
- Strong tools must be visible, audible, or delayed.
- Every seeker detection tool needs at least one hider counter.
- Every hider counter needs a readable cost or tell.
- Host validates gameplay outcomes; clients can render local VFX but cannot decide catches.

## Detection and Tagging

### MVP Tag Rule

A seeker catches a hider when:
- Distance is within tag radius.
- Hider is currently disguised as a prop or visible as avatar.
- Seeker presses tag/reveal while targeting the fake prop or hider capsule.
- Host validates target, range, phase, and any active shield/counter state.

### Line of Sight Rule

For MVP, line-of-sight can be visual only and not required for tag if close enough.

For polish:
- Require raycast from seeker eye to hider prop bounds.
- Props and walls block line of sight.
- Disguised prop bounds, not avatar bones, define hit and visibility checks.

### Prop Reveal Rule

- Hider can become a prop from the arena prop pool.
- Fake prop replaces or hides the avatar mesh during active disguise.
- Fake prop may show subtle tells:
  - Small movement.
  - Sound cue.
  - Cooldown shimmer.
- Seeker can inspect, scan, or tag a prop to reveal a hidden player.
- Incorrect seeker guesses should have a cost, such as cooldown, score penalty, brief stun, or loud alert.

## Controls

Desktop:
- WASD: move.
- Mouse: camera.
- Space: jump.
- Shift: sprint.
- Ctrl or C: crouch.
- E: interact / transform / inspect.
- F or left mouse: seeker tag.
- Q: primary tool.
- R: secondary tool or prop rotate mode.
- Tab: player list.
- Esc: settings.

Mobile later:
- Left virtual stick: move.
- Right drag: camera.
- Buttons: jump, sprint, crouch, interact/tag.

## Camera

- Third-person follow camera.
- Collision-aware camera to avoid clipping through walls.
- Seeker camera can be slightly closer and more focused.
- Hider camera should support careful peeking without seeing through walls.

## UI

Always visible:
- Role.
- Phase.
- Timer.
- Remaining hiders.
- Room/player count.

Contextual:
- Hiding prompt.
- Tag prompt.
- Seeker release countdown.
- Caught notification.
- Round result.

Lobby:
- Room code or room list.
- Create/join/leave buttons.
- Host start button.
- Player roster with ready state.

## Scoring

Hider:
- Survive full round: +100.
- Survive longer: time-based partial score.
- Believable prop placement bonus.
- Risk bonus for hiding near seeker route.
- Tool bonus for escaping a scan without being caught.

Seeker:
- Catch hider: +25.
- Catch all hiders: +100 bonus.
- Faster clear: time bonus.
- Correct suspicious-prop inspection streak bonus.
- Wrong guess penalty if enabled by match rules.

Match:
- MVP can show per-round result only.
- Rotation mode should show cumulative score.

## Art Direction

Tone:
- Social, playful, readable.
- Light suspense through lighting and sound, not horror.

Visual priorities:
- Strong silhouettes.
- Clear walkable paths.
- Hiding spots that look intentional.
- Prop pools that feel native to each arena.
- Role color accents visible at medium distance.

Avoid:
- Overly dark scenes.
- Pure maze confusion.
- Tiny hidden spots that feel unfair.
- Visual clutter that breaks multiplayer readability.

## Audio

MVP:
- Ambient town loop.
- Footsteps.
- Countdown tick.
- Tag sound.
- Transform sound.
- Laser-eye charge and sweep sound.
- Tool activate/counter sounds.
- Round start/end stingers.

Polish:
- Directional seeker proximity heartbeat for hiders.
- Distant bell at phase transition.
- Prop movement tells.

## Performance Budget

Target:
- 60 FPS desktop on mid-range hardware.
- 30 FPS acceptable on lower-end laptop/mobile.

Budget rules:
- Use instancing or merged meshes for repeated props.
- Keep avatar animation and network interpolation lightweight.
- Object pool VFX.
- Avoid per-frame allocations in the main loop.
- Cap network send rate for movement snapshots.

## VIVERSE-Specific Technical Gates

- Canvas must be focusable with `tabindex="0"` for keyboard and mouse capture inside VIVERSE iframe.
- Game launch must not block on auth.
- Auth check should wait for VIVERSE bridge readiness and use the required auth domain.
- Multiplayer room payloads must be normalized before reading IDs.
- Host must own authoritative room/game state.
- Non-host clients must send intents instead of writing gameplay-critical room properties.
- Late join state recovery must be implemented.
- Tool activation, catches, scan confidence, and disguise state must be host-validated or host-replayed when gameplay-critical.

## MVP Build Milestones

### Milestone 1: Local Prototype

- Three.js scene.
- Third-person controller.
- Placeholder avatars.
- Compact playable map.
- Local role toggle.
- Local prop transformation.
- Local suspicious-prop detection and tagging logic.
- One seeker tool and one hider counter-tool.
- Round timer and result UI.

### Milestone 2: Avatar Integration

- VIVERSE auth starts in background.
- Profile chip.
- VIVERSE avatar load with fallback.
- Fixed gameplay capsule independent from visual avatar.

### Milestone 3: Multiplayer Room

- Create/join/leave room.
- Player roster.
- Host start.
- Role assignment.
- Authoritative phase and timer sync.

### Milestone 4: Multiplayer Gameplay

- Remote player interpolation.
- Host-authoritative tag validation.
- Host-authoritative disguise and tool state.
- Caught/spectator state.
- Round result sync.
- Late join spectator flow.

### Milestone 5: Polish Pass

- Map readability.
- Prop pools and believable placement.
- Tool VFX and counterplay readability.
- Audio.
- UI fit across desktop/mobile viewport sizes.
- VIVERSE iframe input verification.

### Milestone 6: Additional Arenas

- Add second arena with unique prop pool.
- Add arena selection in lobby.
- Verify the same tool system works without arena-specific code branches.
- Add third arena after the first two prove the data shape.

## Open Questions

- Should the MVP be 2-6 players or 2-10 players?
- Should caught hiders become spectators, helper seekers, or frozen visible players?
- Which arena should be first: festival town, school, arcade mall, garden shrine, or space station?
- Should hiders choose any prop from a list, copy only nearby props, or receive a random limited prop hand?
- Should wrong seeker guesses cost score, time, tool charge, or health?
- Should laser eyes be a default seeker skill, a pickup, or an arena-specific tool?
- How many tools should each role carry at once?
- Should we support guest multiplayer, or require VIVERSE login before joining online rooms?
- Should voice/chat/emotes be part of the target experience, or outside scope for MVP?
