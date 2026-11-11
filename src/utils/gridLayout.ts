export type Rotation = 0 | 90 | 180 | 270

export interface GridSlot {
  id: number
  area: string
  rotation: Rotation
}

export interface GridConfig {
  template: { [key: number]: string }
  cols: string
  rows: string
  slots: GridSlot[]
}

/**
 * Returns the CSS Grid config that matches the main page layout for a given
 * player count. Used by CommanderDamageGrid and CommanderDamageDialog to
 * position players spatially as they sit around the table.
 */
export function getGridConfig(numPlayers: number): GridConfig {
  const configs: Record<number, GridConfig> = {
    2: {
      template: {
        1: '"p2" "p1"',
        2: '"p1" "p2"',
      },
      cols: '1fr',
      rows: '1fr 1fr',
      slots: [
        { id: 1, area: 'p1', rotation: 180 },
        { id: 2, area: 'p2', rotation: 0 },
      ],
    },
    3: {
      template: {
        1: '"p3 p2" "p3 p1"',
        2: '"p1 p3" "p2 p3"',
        3: '"p2 p1" "p3 p3"',
      },
      cols: '1fr 1fr',
      rows: '1fr 1fr',
      slots: [
        { id: 1, area: 'p1', rotation: 180 },
        { id: 2, area: 'p2', rotation: 0 },
        { id: 3, area: 'p3', rotation: 270 },
      ],
    },
    4: {
      template: {
        1: '"p3 p4" "p1 p2"',
        2: '"p3 p4" "p1 p2"',
        3: '"p2 p1" "p4 p3"',
        4: '"p2 p1" "p4 p3"',
      },
      cols: '1fr 1fr',
      rows: '1fr 1fr',
      slots: [
        { id: 1, area: 'p1', rotation: 0 },
        { id: 2, area: 'p2', rotation: 0 },
        { id: 3, area: 'p3', rotation: 180 },
        { id: 4, area: 'p4', rotation: 180 },
      ],
    },
    5: {
      template: {
        1: '"p3 p4 p5" "p1 p2 p5"',
        2: '"p3 p4 p5" "p1 p2 p5"',
        3: '"p5 p2 p1" "p5 p4 p3"',
        4: '"p5 p2 p1" "p5 p4 p3"',
        5: '"p1 p1 p3 p3" "p2 p2 p4 p4" "p5 p5 p5 p5"',
      },
      cols: '1fr min(min-content, 1fr) 1fr',
      rows: '1fr 1fr min(min-content, 1fr)',
      slots: [
        { id: 1, area: 'p1', rotation: 0 },
        { id: 2, area: 'p2', rotation: 0 },
        { id: 3, area: 'p3', rotation: 180 },
        { id: 4, area: 'p4', rotation: 180 },
        { id: 5, area: 'p5', rotation: 270 },
      ],
    },
    6: {
      template: {
        1: '"p4 p5 p6" "p1 p2 p3"',
        2: '"p4 p5 p6" "p1 p2 p3"',
        3: '"p4 p5 p6" "p1 p2 p3"',
        4: '"p3 p2 p1" "p6 p5 p4"',
        5: '"p3 p2 p1" "p6 p5 p4"',
        6: '"p3 p2 p1" "p6 p5 p4"',
      },
      cols: '1fr 1fr 1fr',
      rows: '1fr 1fr',
      slots: [
        { id: 1, area: 'p1', rotation: 0 },
        { id: 2, area: 'p2', rotation: 0 },
        { id: 3, area: 'p3', rotation: 0 },
        { id: 4, area: 'p4', rotation: 180 },
        { id: 5, area: 'p5', rotation: 180 },
        { id: 6, area: 'p6', rotation: 180 },
      ],
    },
  }
  return configs[numPlayers] ?? configs[4]!
}

export interface BoardLayout {
  areas: string
  cols: string
  rows: string
  seats: GridSlot[]
}

// Main game board: seat areas plus a `controls` strip. Seats come from getGridConfig.
const BOARD_AREAS: Record<number, Pick<BoardLayout, 'areas' | 'cols'>> = {
  2: { cols: 'minmax(0, 1fr)', areas: '"p1" "controls" "p2"' },
  3: { cols: 'repeat(2, minmax(0, 1fr))', areas: '"p1 p3" "controls p3" "p2 p3"' },
  4: { cols: 'repeat(2, minmax(0, 1fr))', areas: '"p3 p4" "controls controls" "p1 p2"' },
  5: { cols: 'repeat(3, minmax(0, 1fr))', areas: '"p3 p4 p5" "controls controls p5" "p1 p2 p5"' },
  6: { cols: 'repeat(3, minmax(0, 1fr))', areas: '"p4 p5 p6" "controls controls controls" "p1 p2 p3"' },
}

export function getBoardLayout(numPlayers: number): BoardLayout {
  const n = BOARD_AREAS[numPlayers] ? numPlayers : 4
  return {
    ...BOARD_AREAS[n]!,
    rows: 'minmax(0, 1fr) auto minmax(0, 1fr)',
    seats: getGridConfig(n).slots,
  }
}
