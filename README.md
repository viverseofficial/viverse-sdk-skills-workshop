# VIVERSE SDK Skills Workshop

## 繁體中文

這個 repository 是 VIVERSE SDK Skills workshop 的單一入口。

它整合了：

- 現場 demo 用的 standalone baseline app
- Polygon Streaming SDK 延伸 demo 用的 base source
- 提供給學生的 workshop 文件
- 課後重播用的 prompt sequence
- 給 NotebookLM 使用的 slide draft

官方 VIVERSE SDK Skills repository 在這裡：

- https://github.com/viverseofficial/viverse-sdk-skills

### Workshop 目標

這場 workshop 展示一個完整的 AI IDE workflow：

1. 從一個可獨立執行的 app 開始
2. 將 baseline app 發布到 VIVERSE
3. 透過 skills 整合 VIVERSE 平台能力
4. 重新發布升級後的 app
5. 對照整合前後的差異

### 從這裡開始

如果你是學生，建議依照這個順序閱讀：

1. [docs/resources.md](docs/resources.md)
2. [docs/ai-ide-integration-guide.md](docs/ai-ide-integration-guide.md)
3. [apps/hide-and-seek-standalone-base/README.md](apps/hide-and-seek-standalone-base/README.md)
4. [docs/student-replay-guide.md](docs/student-replay-guide.md)
5. [docs/live-demo-prompts.md](docs/live-demo-prompts.md)

如果你要用 NotebookLM 生成投影片，可使用：

- [docs/notebooklm-slide-draft.md](docs/notebooklm-slide-draft.md)

如果你要使用包含 Polygon Streaming SDK 延伸段落的版本，可使用：

- [docs/notebooklm-slide-draft-with-ps.md](docs/notebooklm-slide-draft-with-ps.md)
- [apps/flight-simulator-ps-base/README.md](apps/flight-simulator-ps-base/README.md)

### Repository 結構

```text
apps/
  hide-and-seek-standalone-base/
  flight-simulator-ps-base/
docs/
  ai-ide-integration-guide.md
  resources.md
  student-replay-guide.md
  live-demo-prompts.md
  notebooklm-slide-draft.md
  notebooklm-slide-draft-with-ps.md
  ps-sdk-extension-demo.md
```

### Demo App

baseline app 位於：

- [apps/hide-and-seek-standalone-base](apps/hide-and-seek-standalone-base)

這個版本刻意保留為可在沒有 VIVERSE login、avatar loading、leaderboard submission 或 multiplayer services 的情況下直接執行。

這使它很適合作為 workshop 的 pre-integration checkpoint。

如果你要補 Polygon Streaming SDK 延伸段，repo 內的 base source 位於：

- [apps/flight-simulator-ps-base](apps/flight-simulator-ps-base)

### Workshop 使用的 Skill 順序

這場 workshop 依照以下順序介紹 skills：

1. `viverse-world-publishing`
2. `viverse-auth`
3. `viverse-avatar-sdk`
4. `viverse-leaderboard`

如果要加上 Polygon Streaming SDK 延伸段，則再加入：

5. `viverse-polygon-streaming-threejs`

### 相關 Repositories

- Workshop repo: https://github.com/viverseofficial/viverse-sdk-skills-workshop
- Skills repo: https://github.com/viverseofficial/viverse-sdk-skills

## English

This repository is the single access point for the VIVERSE SDK Skills workshop.

It combines:

- a standalone baseline app for the live demo
- an in-repo base source for the Polygon Streaming SDK extension segment
- workshop documents for students
- a replayable prompt sequence for post-workshop practice
- a NotebookLM slide-source draft

The official VIVERSE SDK Skills repository lives here:

- https://github.com/viverseofficial/viverse-sdk-skills

### Workshop Goal

The workshop demonstrates a full AI IDE workflow:

1. start from a standalone runnable app
2. publish the baseline app to VIVERSE
3. integrate VIVERSE platform capabilities with skills
4. republish the upgraded app
5. compare the before and after versions

### Start Here

If you are a student, use these files in order:

1. [docs/resources.md](docs/resources.md)
2. [docs/ai-ide-integration-guide.md](docs/ai-ide-integration-guide.md)
3. [apps/hide-and-seek-standalone-base/README.md](apps/hide-and-seek-standalone-base/README.md)
4. [docs/student-replay-guide.md](docs/student-replay-guide.md)
5. [docs/live-demo-prompts.md](docs/live-demo-prompts.md)

If you want to generate slides in NotebookLM, use:

- [docs/notebooklm-slide-draft.md](docs/notebooklm-slide-draft.md)

If you want the extended slide version that also covers Polygon Streaming SDK, use:

- [docs/notebooklm-slide-draft-with-ps.md](docs/notebooklm-slide-draft-with-ps.md)
- [apps/flight-simulator-ps-base/README.md](apps/flight-simulator-ps-base/README.md)

### Repository Structure

```text
apps/
  hide-and-seek-standalone-base/
  flight-simulator-ps-base/
docs/
  ai-ide-integration-guide.md
  resources.md
  student-replay-guide.md
  live-demo-prompts.md
  notebooklm-slide-draft.md
  notebooklm-slide-draft-with-ps.md
  ps-sdk-extension-demo.md
```

### Demo App

The baseline app is located at:

- [apps/hide-and-seek-standalone-base](apps/hide-and-seek-standalone-base)

This version is intentionally runnable without VIVERSE login, avatar loading, leaderboard submission, or multiplayer services.

That makes it suitable as the pre-integration checkpoint for the workshop.

If you want to add the Polygon Streaming SDK extension segment, the in-repo base source is located at:

- [apps/flight-simulator-ps-base](apps/flight-simulator-ps-base)

### Skill Order Used In The Workshop

The workshop introduces skills in this order:

1. `viverse-world-publishing`
2. `viverse-auth`
3. `viverse-avatar-sdk`
4. `viverse-leaderboard`

If you include the Polygon Streaming extension segment, then also add:

5. `viverse-polygon-streaming-threejs`

### Related Repositories

- Workshop repo: https://github.com/viverseofficial/viverse-sdk-skills-workshop
- Skills repo: https://github.com/viverseofficial/viverse-sdk-skills