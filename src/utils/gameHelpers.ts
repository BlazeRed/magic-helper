import type { Player } from '../stores/gameStore'

export function isDeadByLife(player: Player): boolean {
  return player.life <= 0
}

export function isDeadByCommanderDamage(player: Player): boolean {
  return Object.values(player.commanderDamage).some(d => d >= 21)
}

export function getCommanderDamageFrom(player: Player, sourceId: number): number {
  return player.commanderDamage[sourceId] ?? 0
}

export function getAlivePlayers(players: Player[]): Player[] {
  return players.filter(p => !p.isDead)
}

export function getWinner(players: Player[]): Player | null {
  const alive = getAlivePlayers(players)
  return alive.length === 1 ? alive[0]! : null
}

export function formatDelta(delta: number | null): string {
  if (delta === null || delta === 0) return ''
  return delta > 0 ? `+${delta}` : `${delta}`
}
