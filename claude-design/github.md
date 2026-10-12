repo: joannalauu/memento
branch: main
path: frontend/src/features/graph

## Last sync
date: 2026-07-31T20:38:20Z

### Updated in this project
- Repurposed memento's GraphView.tsx approach: mounted `react-force-graph-2d` (loaded via unpkg UMD, global `ForceGraph2D`) for the portfolio's Graph view toggle.
- Ported their canvas node-drawing pattern (circle + label via `nodeCanvasObject`/`nodePointerAreaPaint`) instead of hand-rolled SVG/physics.
- Colors/sizing adapted to portfolio's palette (skill/experience/project node types) rather than memento's decision/file/pr/engineer/feature types.

## Screen map
| Screen | Source files |
|---|---|
| Graph view (skills/experience/projects network) | frontend/src/features/graph/GraphView.tsx, palette.ts, types.ts |
