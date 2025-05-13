export type RouletteNumber = number // 0-36

export type ChipValue = 0.1 | 0.5 | 1 | 2 | 5 | 10 | 50

export type GameView = "classic" | "compact" | "dark"

export interface Bet {
  type: string // "number", "color", "parity", "dozen", etc.
  value: string | number // El valor específico sobre el que se apuesta
  amount: number // Cantidad en WLD
  justUpdated?: boolean // Indica si la apuesta se acaba de actualizar
}
