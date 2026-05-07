# Srđan Janeković — Interactive CV

An interactive, scroll-driven CV rendered with PixiJS over a Vue 3 shell.
A z-axis "timeline" of career milestones reads as a 3D fly-through
backed by a procedural starfield, with a static printable CV view on demand.

## Stack

- **Vue 3** + `<script setup>` for the UI shell and overlays
- **PixiJS 8** for the WebGL canvas, timeline nodes, and starfield
- **TypeScript** end-to-end
- **Vite** for dev server and bundling

## Architecture

```
src/
├── App.vue                     # top-level shell, overlay state
├── components/
│   ├── PixiCanvas.vue          # mounts PixiApp into a div
│   ├── OverlayUI.vue           # selected-experience detail card
│   └── StaticCV.vue            # printable CV overlay
├── data.ts                     # experience + full résumé content
├── pixi/
│   ├── PixiApp.ts              # ticker, layout, scene composition
│   ├── ScrollController.ts     # scroll-z model, snap points, lerps
│   ├── InputManager.ts         # wheel/touch/tap input
│   ├── TimelineNode.ts         # per-experience visual + interaction
│   ├── Starfield.ts            # background particle field
│   ├── constants.ts            # tunables (camera, scroll, node, etc.)
│   └── types.ts
└── style.css
```

## Scripts

```bash
npm start       # Vite dev server
npm run build   # Type-check (vue-tsc) and production build
npm run preview # Preview the production build
npm run ncu     # Bump dependency versions via npm-check-updates
```

## Deployment

Configured for GitHub Pages via `base: '/resume/'` in `vite.config.ts`.
Adjust the base path to match your hosting setup before building.
