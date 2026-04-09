# MTG Helper — Commander Life Tracker

A tablet-first web app for tracking life totals, commander damage, and game state during **Magic: The Gathering** Commander (and other format) games. Place your tablet flat on the table — each player gets their own card, rotated to face them.

---

## Features

- **Life counter** — tap left/right halves to subtract/add 1 life. Right-click (or long-press on desktop) for ±10 shortcuts.
- **Delta indicator** — shows the running change (e.g. `−7`) for 2 seconds after each tap, then fades out.
- **Commander damage** — track damage dealt by each opponent's commander. Reaching 21 from a single source eliminates the player automatically.
- **Starting player animation** — a cycling highlight races around all player cards for ~3 seconds, then crowns a random starting player with a pulsing ⚜ badge.
- **Per-player colors** — each seat gets its own card border/glow. Change it anytime from the commander damage dialog using 7 MTG-inspired presets.
- **Dead state** — players at 0 life (or 21 commander damage) show a skull overlay. Life can be restored to revive them.
- **Win detection** — when only one player remains, a winner banner is shown.
- **Full persistence** — game state and settings are saved to `localStorage` on every change. Reload the page and pick up exactly where you left off.
- **Always dark** — no light mode toggle; optimized for low-light table play.

---

## Screenshots

### 4-Player Layout (default)

```
┌─────────────────┬─────────────────┐
│  Player 3  (↕)  │  Player 4  (↕)  │
│                 │                 │
│    [-]  40  [+] │    [-]  40  [+] │
│       ○ ○ ○     │       ○ ○ ○     │
├────────┬────────┴─────────────────┤
│  ⚙️    │  🔄                      │  ← center controls
├────────┴──────────────────────────┤
│  Player 1       │  Player 2       │
│    [-]  40  [+] │    [-]  40  [+] │
│       ○ ○ ○     │       ○ ○ ○     │
└─────────────────┴─────────────────┘
```

Players 3 and 4 are rotated 180° to face the players sitting across the table.

### Supported Layouts

| Players | Layout |
|---------|--------|
| 2 | Top/bottom, one each side |
| 3 | 2 bottom + 1 right side (rotated 90°) |
| 4 | 2×2 grid with controls in the center row |
| 5 | 4-player grid + 1 left side (rotated 90°) |
| 6 | 3×2 grid with controls in the center row |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| UI Library | Vuetify 3 (Material Design) |
| State Management | Pinia |
| Persistence | LocalStorage |
| Icons | MDI Icons (`@mdi/font`) |
| Build Tool | Vite |
| Language | TypeScript |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## How to Play

### 1. Start a new game

Tap the **⚙ (cog)** button in the center of the screen to open Game Settings.

- Choose the **number of players** (2–6)
- Choose the **starting life total** (20 / 25 / 30 / 40 / 60)
- Optionally change the **app accent color**
- Tap **Start Game**

A starting player animation will cycle through all cards and crown one player with a gold ⚜ badge.

### 2. Track life totals

Each player card is split into two halves:

| Action | Result |
|--------|--------|
| Tap left half | −1 life |
| Tap right half | +1 life |
| Right-click left half | −10 life |
| Right-click right half | +10 life |

A green/red delta indicator appears under the life total and disappears after 2 seconds of inactivity.

### 3. Track commander damage

Each card shows small colored dots at the bottom — one per opponent. Tap the dots (or the ⚔ icon) to open the **Commander Damage dialog**:

- Use **−/+** buttons to adjust damage dealt by each opponent's commander
- Adding damage automatically subtracts from the player's life total
- Removing damage restores life
- At **21 damage** from a single commander, the player is eliminated (skull overlay)

> **Tip:** The dots glow red when a source is at 18+ damage, warning of imminent elimination.

### 4. Change player colors

Inside the Commander Damage dialog, scroll to **Player Color** and pick one of the 7 MTG-inspired swatches. The change applies instantly to the card border and all color chips shown in opponents' dialogs.

| Color | MTG Inspiration |
|-------|----------------|
| Red `#e53935` | Mountain — Aggro/Fire |
| Blue `#1e88e5` | Island — Control/Water |
| Green `#388e3c` | Forest — Nature |
| Purple `#8e24aa` | Swamp — Darkness |
| Gold `#f9a825` | Plains — Order/Light |
| Silver `#90a4ae` | Artifact — Colorless |
| Teal `#00695c` | Eldrazi — Void |

### 5. Rename a player

**Double-tap** the player name at the top of any card to edit it inline. Press **Enter** or tap away to confirm, **Escape** to cancel.

### 6. Reset the game

Tap the **🔄 (refresh)** button in the center controls. A confirmation snackbar appears — tap **Reset** to confirm. Life totals return to the starting value and the starting player animation runs again.

---

## Project Structure

```
src/
├── components/
│   ├── LifeCounter.vue           # Main player card
│   ├── CommanderDamageGrid.vue   # Pip dots on each card
│   ├── CommanderDamageDialog.vue # Damage counters + color picker
│   ├── GameSettingsDialog.vue    # New game configuration
│   ├── StartingPlayerOverlay.vue # Animation backdrop
│   └── PlayerNameEdit.vue        # Inline name editor
├── stores/
│   ├── gameStore.ts              # Game state, life/damage logic
│   └── settingsStore.ts          # Colors, accent, persistence
├── composables/
│   └── useStartingPlayer.ts      # Animation sequence logic
├── utils/
│   └── gameHelpers.ts            # Pure helper functions
├── plugins/
│   └── vuetify.ts                # Vuetify dark theme config
├── App.vue                       # Root layout + CSS Grid
└── main.ts                       # Bootstrap
```

---

## LocalStorage Keys

| Key | Contents |
|-----|----------|
| `mtg-game-state` | Players, life totals, commander damage, game phase |
| `mtg-app-settings` | Accent color, per-player card colors |

State is saved automatically on every change. To start completely fresh, clear these keys from your browser's DevTools → Application → Local Storage.

---

## Planned Enhancements (v2)

- Poison / energy / experience counters
- Turn order tracker
- Life change history log
- Built-in dice roller (d20, coin flip)
- Scryfall card lookup
- Multiplayer sync via WebSocket/WebRTC
