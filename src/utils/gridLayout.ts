export interface GridSlot {
  id: number
  area: string
  rotation: number
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
        { id: 3, area: 'p3', rotation: -90 },
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
        1: '"p5 p3 p4" "p5 p1 p2"',
        2: '"p5 p3 p4" "p5 p1 p2"',
        3: '"p2 p1 p5" "p4 p3 p5"',
        4: '"p2 p1 p5" "p4 p3 p5"',
        5: '"p4 p4 p2 p2" "p3 p3 p1 p1" "p5 p5 p5 p5"',
      },
      cols: '1fr min(min-content, 1fr) 1fr',
      rows: '1fr 1fr min(min-content, 1fr)',
      slots: [
        { id: 1, area: 'p1', rotation: 0 },
        { id: 2, area: 'p2', rotation: 0 },
        { id: 3, area: 'p3', rotation: 180 },
        { id: 4, area: 'p4', rotation: 180 },
        { id: 5, area: 'p5', rotation: 90 },
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
