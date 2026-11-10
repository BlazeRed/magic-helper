# Phase 1 — Restyle the base

Context: `docs/redesign-plan.md`. Tokens: `src/styles/tokens.css`.
Goal: v1.0 features, Grimoire look, no Vuetify. No new data fields.

Work one step per commit. Each step must leave `npm run build` green.

## Step 1 — Dependencies and foundation

- [ ] `npm rm vuetify vite-plugin-vuetify @mdi/font`
- [ ] `npm i reka-ui vue-router @fontsource-variable/cormorant-garamond @fontsource-variable/inter`
- [ ] `vite.config.ts`: remove the vuetify plugin.
- [ ] Delete `src/plugins/vuetify.ts`. `DEFAULT_ACCENT` import in `settingsStore.ts` goes with it.
- [ ] `src/styles/base.css`: reset, `html/body` (bg `--hx-bg`, color `--hx-ink`, serif, `touch-action: manipulation`, no overscroll), `.hx-frame` (double frame), `.hx-label` (12px Inter uppercase tracked `--hx-ink-faint`), `.hx-rule` (fading rule).
- [ ] `main.ts`: import fonts, `tokens.css`, `base.css`; install pinia + router.
- [ ] `public/_redirects`: `/*  /index.html  200`.
- [ ] `settingsStore.ts`: drop `accentColor`; keep `playerColors`; ignore legacy `accentColor` on load. Make default player colors distinct per seat (red, blue, green, black, white, silver) instead of all `#1e88e5`.

## Step 2 — UI primitives (`src/components/ui/`)

Build in this order, each used by the next steps:

- [ ] `HxIcon.vue` (inline stroke SVG, path map: back, settings, reset, plus, minus, skull, crown, check)
- [ ] `HxButton.vue` (primary | secondary | icon)
- [ ] `HxFrame.vue`, `HxOrnament.vue`
- [ ] `HxDialog.vue` (Reka `DialogRoot/Portal/Overlay/Content/Title`; prop `rotation` 0|90|180|270 to face a seat)
- [ ] `HxConfirm.vue` (Reka `AlertDialog`)
- [ ] `HxSegmented.vue` (Reka `ToggleGroup`, single, no empty selection)
- [ ] `HxSwitch.vue` (Reka `Switch`, diamond thumb)
- [ ] `HxStepper.vue` (−/value/+, 56px buttons, long-press repeat, props: `modelValue`, `min`, `max`, `step`)
- [ ] `HxSwatches.vue` (Reka `RadioGroup`, diamond swatches, selected = outline)

Done when: every primitive renders in a throwaway `/_kit` route (remove before merge) and is keyboard operable.

## Step 3 — Layout without DOM hacks

Replaces `onMounted` transforms in `LifeCounter.vue`, the `gameTimestamp` remount in `App.vue`, and the root-level resize listener.

- [ ] `src/utils/gridLayout.ts`: keep per-count config (2–6). Each seat: `area`, `rotation` (0 | 90 | 180 | 270).
- [ ] `GameBoard.vue`: CSS grid with named areas. Seats at 90°/270° sit in a cell that swaps width and height with a rotated inner wrapper (`inline-size`/`block-size` swapped + `rotate`), pure CSS, no JS measuring.
- [ ] Container-query units (`cqw`/`cqh`) for the life number font size so it scales with the card.
- [ ] Verify at 2, 3, 4, 5, 6 players, portrait and landscape, on a tablet viewport and a phone viewport.

## Step 4 — Game screen

- [ ] `PlayerCard.vue` (rename from `LifeCounter.vue`): name (inline edit via `PlayerNameEdit`), serif life, faint −/+ zones, delta, dead state, starting-player crown, commander damage chips (`CommanderDamageGrid`).
- [ ] Tap zones: left/right half ±1, long-press ±10 (keep current behavior, add hold repeat). Pointer events, no `contextmenu` reliance.
- [ ] Center bar: settings, reset. Reset uses `HxConfirm`.
- [ ] `StartingPlayerOverlay.vue`: restyle (diamond highlight cycling), same 3 s animation.
- [ ] Remove all `v-*` Vuetify components from `App.vue`.

## Step 5 — Commander damage dialog

- [ ] `CommanderDamageDialog.vue` on `HxDialog`, rotated toward the player.
- [ ] One row per opponent: diamond in their color, name, `HxStepper`, progress bar to 21 with "21 lethal" label.
- [ ] Rename field and `HxSwatches` (player indicator color).
- [ ] Keep rule: 21 from one source kills; damage also lowers life (`adjustCommanderDamage` unchanged).

## Step 6 — Pages and router

- [ ] `router.ts`: `/` Home, `/new` NewGame, `/game` Game. Guard: `/game` without players redirects to `/`.
- [ ] `HomeView.vue`: logo, ornament, Resume card (only if a game exists), New game. Tool tiles come in later phases, so none now.
- [ ] `NewGameView.vue`: `HxSegmented` players (2–6) and life (20/30/40/50/custom), names and swatches, random-start switch, Start/Cancel. Replaces `GameSettingsDialog.vue`.
- [ ] `GameView.vue`: hosts `GameBoard`; opens Home on a back action.
- [ ] `VictoryView.vue` (or overlay on `/game`): winner name, Rematch / New game / Home. Replaces the snackbar. Standings come in Phase 2.
- [ ] Delete `GameSettingsDialog.vue` and the first-launch splash.

## Step 7 — Cleanup and checks

- [ ] No `vuetify`/`mdi` references: `grep -rE "vuetify|mdi-|v-btn|v-dialog" src`.
- [ ] `npm run build` passes (`vue-tsc -b` included).
- [ ] Manual pass, v1.0 checklist: tap/long-press life, delta fade, commander 21 kills, revive by raising life, winner appears, starting-player animation, reset, rename, color change, reload restores the game.
- [ ] Update `README.md` (features, tech stack, no Vuetify).
- [ ] Contrast check on `--hx-ink-faint` at real device brightness.

## Risks

- 90°/270° seats with pure CSS can be fiddly; if Step 3 stalls, fall back to a fixed transform per layout with known sizes, not runtime measuring.
- Reka `Dialog` rotation: rotating the content wrapper must not break focus trapping or scroll lock. Test on a touch device.
- Saved v1.0 state in `localStorage` must still load (same keys, no new required fields).
