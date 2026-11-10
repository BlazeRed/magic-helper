# HelM redesign plan

Direction: **Grimoire** (see `src/styles/tokens.css`). English only. No backend: static build on Netlify, data in `localStorage`. Target: tablet/phone at the table, one shared device.

Mocks: https://claude.ai/artifact/UT7bPM7GMiDHTFQHWanRrs (private, owner only).

## Design rules

1. Primary button: solid gold, dark text, uppercase tracked. Secondary: 1px `--hx-line-strong` border only.
2. Double frame (1px border + inner 5px frame) only on important surfaces: player card, dialog, summary card.
3. Diamond ◆ is the signature: separator, bullet, selected marker, switch thumb, player marker.
4. Serif (Cormorant) for titles and numbers. Inter only for 12px uppercase labels. Never serif below 16px.
5. No shadows, no pills, radii 2–4px.
6. Touch targets 44px min, steppers 56px.
7. No app accent color setting. The UI palette is fixed (gold). User-chosen colors exist only as **player indicators** (diamond, card edge, commander-damage dots).

## Stack changes

- Remove `vuetify`, `vite-plugin-vuetify`, `@mdi/font`.
- Add `reka-ui` (headless primitives), `vue-router`, `@fontsource-variable/cormorant-garamond`, `@fontsource-variable/inter` (fonts bundled, no CDN).
- Icons: inline SVG stroke 1.5, one small `HxIcon` component with a path map. No icon font.
- Netlify: `public/_redirects` with `/*  /index.html  200`.

## Components to build (`src/components/ui/`)

| Component | Based on | Notes |
|---|---|---|
| `HxButton` | native `button` | variants: primary, secondary, icon (diamond-rotated square for bar) |
| `HxDialog` | Reka `Dialog` | double frame, rotatable toward a seat |
| `HxConfirm` | Reka `AlertDialog` | reset game, delete history |
| `HxSegmented` | Reka `ToggleGroup` (single) | players count, starting life |
| `HxSwitch` | Reka `Switch` | diamond thumb |
| `HxStepper` | custom | −/value/+ with long-press repeat, optional `max`/lethal |
| `HxFrame` | CSS | double-frame wrapper |
| `HxOrnament` | CSS | fading rule + diamond |
| `HxSwatches` | Reka `RadioGroup` | player colors |
| `HxTabs` | Reka `Tabs` | History filters, Rules sections |
| `HxToast` | Reka `Toast` | undo, export done |

## Phase 1 — Restyle the base (same features)

Goal: same behavior as v1.0, new look, solid foundation. No new data fields.

- Remove `accentColor` from `settingsStore` (keep only `playerColors`, ignore the field when loading old saved settings) and the `useTheme` sync in `App.vue`.
- Tokens + fonts + `base.css` (reset, body, `.hx-frame`, `.hx-label`).
- `HxButton`, `HxDialog`, `HxConfirm`, `HxSegmented`, `HxSwitch`, `HxStepper`, `HxSwatches`.
- **Board** (`App.vue` → `GameBoard.vue`): replace `onMounted` DOM transforms and the resize remount trick in `LifeCounter.vue` with CSS-only seat rotation (`transform` on a wrapper + `writing-mode`/swapped grid cells for ±90° seats). Keep layouts 2–6 players.
- **LifeCounter**: serif life number, tap zones with faint −/+, delta, dead overlay, crown for starting player.
- **CommanderDamageDialog**: one row per opponent, stepper, progress bar to 21, rename, color. Rotated toward the player.
- **Setup**: becomes a page (`/new`) with segmented players/life, names and colors, random-start switch.
- **Winner**: full screen "Victory" instead of snackbar (standings can be basic in this phase: winner only).
- **Home**: logo, Resume (if a game exists), New game.
- Router: `/` home, `/game`, `/new`. Persist current route intent via existing game state.

Exit check: all v1.0 features work, `vue-tsc -b` passes, no Vuetify import left.

## Phase 2 — Game depth (new data)

- Player fields: `poison`, `energy`, `experience`, `commanderTax`, `monarch`, `initiative`. Poison 10 → dead in `checkLoseCondition`. Migrate saved state (missing fields default to 0/false).
- **Counters dialog** (from card long-press or a small button): steppers + Monarch/Initiative switches. Monarch/initiative are exclusive across players.
- Turn counter and game timer in the center bar; "next turn" action.
- Elimination log: `{ playerId, turn, cause: 'life' | 'commander' | 'poison' }`.
- **Victory screen** gets full standings (roman numerals, cause, turn), Rematch (same players, reset) / New game / Home.
- Life log + undo (last N changes), toast "Undo".

## Phase 3 — History and settings

- `historyStore` (`localStorage`, key `helm-history`): on win save `{ id, date, format, players[], winnerId, turns, durationMs }`. Cap at 200 entries.
- **History page** (`/history`): stats row (games, avg turns, avg length), filter, list, delete with confirm.
- **Settings page** (`/settings`): keep screen awake, haptics, **Export / Import JSON** (needed because there is no backend), reset all data.
- Keep screen on during a game via Screen Wake Lock API (feature-detect).

## Phase 4 — Companion pages (ideas, not committed)

- **Dice** (`/dice`): coin, d4–d20, multiple dice, big result, history of last rolls.
- **Decks** (`/decks`): local list `{ name, commander, colors, notes }`; pick a deck when starting a game; per-deck win rate from History.
- **Rules** (`/rules`): static glossary (keyword abilities, commander rules, phases), searchable, bundled as JSON. Tabs: Keywords / Turn structure / Commander.
- **Commander lookup** (optional): Scryfall public API from the browser, no backend. Gives card art and color identity to auto-set the player color. Needs offline fallback.
- **Formats**: preset starting life per format (Commander 40, Standard 20, Brawl 25, Two-Headed Giant 30 shared).
- **PWA**: manifest + service worker for offline play at the table.

## Open questions

- Is Phase 4 order right? Dice is the cheapest win, Decks has the most value but needs a good pick flow.
