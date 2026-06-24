# Flight Simulator PS Base

This folder is the Polygon Streaming extension demo base source for the VIVERSE SDK Skills workshop.

Use it as the second-stage app when you want to extend the main workshop with a Polygon Streaming SDK segment.

## What This App Is For

This app is not the first workshop baseline.

The main workshop baseline is still hide-and-seek.

This app exists so the workshop repository also contains a concrete source base for the optional Polygon Streaming extension.

## Why This App Is Used For PS

This flight simulator base is a better fit for Polygon Streaming demo work because:

1. the aircraft replacement is easy to see in a live demo
2. the app already has a clear `aircraftUrl` hook for streamed asset swap
3. the app already includes the surrounding VIVERSE auth and leaderboard context
4. the before-and-after visual difference is stronger than in the hide-and-seek demo

## What It Already Includes

- Three.js flight gameplay
- VIVERSE auth integration
- VIVERSE leaderboard integration
- Polygon Streaming SDK dependency and build support
- aircraft replacement hook through runtime config

## Run Locally

```bash
npm install
npm run dev
```

## Build For Validation

```bash
npm run build
```

## Workshop Usage

Recommended usage in the workshop:

1. finish the main workshop flow with the hide-and-seek baseline first
2. switch to this app for the optional Polygon Streaming extension segment
3. ask the AI IDE to read `viverse-polygon-streaming-threejs/SKILL.md`
4. validate the aircraft replacement path, required static assets, wrapper events, and fitting behavior

## Related Documents

- [../../docs/ps-sdk-extension-demo.md](../../docs/ps-sdk-extension-demo.md)
- [../../docs/notebooklm-slide-draft-with-ps.md](../../docs/notebooklm-slide-draft-with-ps.md)