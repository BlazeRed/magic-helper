# HelM — Commander Life Tracker

A tablet-first web app for tracking life totals, commander damage and game state in **Magic: The Gathering** Commander (and other format) games. Place the tablet flat on the table: each player gets a card rotated to face them.

The look is "Grimoire": dark parchment tones, serif type, double frames and diamond marks. Design tokens live in `src/styles/tokens.css`.

---

## Features

- **Life counter** — tap the left/right half of a card for −1/+1. Hold for ±10, repeating while held.
- **Delta indicator** — shows the running change (e.g. `−7`) for 2 seconds, then fades out.
- **Commander damage** — a dialog per player with one row per opponent: stepper, progress bar and a "21 lethal" mark. 21 from a single source eliminates the player. Damage also lowers life.
- **Starting player** — a row of diamonds cycles for about 3 seconds, then a random player gets the crown. Can be turned off when starting a game.
- **Per-player colors** — pick from 7 mana-inspired swatches when starting a game or in the commander damage dialog.
- **Dead state** — a skull overlay at 0 life or 21 commander damage. Raise life to revive.
- **Victory screen** — when one player is left: Rematch, New game or Home.
- **Persistence** — game state and settings are saved to `localStorage`. Reload and continue. Saved v1.0 games still load.
- **Always dark** — no light mode.

---

## Layouts

| Players | Layout |
|---------|--------|
| 2 | One card top, one bottom |
| 3 | 2 cards left (top rotated 180°), 1 on the right (rotated 270°) |
| 4 | 2×2 grid, top row rotated 180° |
| 5 | 2×2 grid + 1 on the right (rotated 270°) |
| 6 | 3×2 grid, top row rotated 180° |

The controls (home, settings, reset) sit in a strip between the rows. Seats rotate with CSS only (size containers, no JS measuring).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (`<script setup>`) |
| UI | Hand-written components on [Reka UI](https://reka-ui.com) primitives (`src/components/ui/`) |
| Routing | Vue Router 4 |
| State | Pinia |
| Persistence | `localStorage` |
| Fonts | Cormorant Garamond, Inter (via `@fontsource-variable`) |
| Build | Vite, TypeScript, `vue-tsc` |

---

## Getting Started

Needs Node.js 18+.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build
npm run preview
```

`public/_redirects` sends every path to `index.html` (Netlify-style SPA fallback). Other hosts need an equivalent rule.

---

## Project Structure

```
src/
├── views/            # HomeView, NewGameView, GameView
├── components/
│   ├── ui/           # Hx primitives: Button, Dialog, Confirm, Segmented, Switch, Stepper, Swatches, ...
│   ├── GameBoard.vue             # CSS grid + rotated seats
│   ├── PlayerCard.vue            # Life, name, commander chips
│   ├── CommanderDamageGrid.vue   # Chips on each card
│   ├── CommanderDamageDialog.vue
│   ├── StartingPlayerOverlay.vue
│   ├── VictoryOverlay.vue
│   └── PlayerNameEdit.vue
├── stores/           # gameStore, settingsStore
├── composables/      # useStartingPlayer, usePressHold
├── utils/            # gridLayout (seats, areas, rotations), gameHelpers
├── styles/           # tokens.css, base.css
├── router.ts         # /, /new, /game (guard: /game needs a game)
└── main.ts           # restores saved state, then starts the router
```

---

## LocalStorage Keys

| Key | Contents |
|-----|----------|
| `mtg-game-state` | Players, life totals, commander damage, game phase |
| `mtg-app-settings` | Per-player card colors (an old `accentColor` is ignored) |

To start fresh, clear these keys in DevTools → Application → Local Storage.

---

## Planned

See `docs/redesign-plan.md` for the next phases.
