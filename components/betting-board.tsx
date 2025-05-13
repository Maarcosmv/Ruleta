"use client"

import type { Bet, GameView } from "@/types/roulette"

interface BettingBoardProps {
  onPlaceBet: (type: string, value: string | number) => void
  currentBets: Bet[]
  view: GameView
}

export default function BettingBoard({ onPlaceBet, currentBets, view }: BettingBoardProps) {
  // Obtener cantidad apostada para una apuesta específica y si fue actualizada recientemente
  const getBetAmount = (type: string, value: string | number): { amount: number; justUpdated: boolean } => {
    const bet = currentBets.find((b) => b.type === type && b.value === value)
    return bet ? { amount: bet.amount, justUpdated: bet.justUpdated || false } : { amount: 0, justUpdated: false }
  }

  // Renderizar ficha de apuesta en números
  const renderBetChip = (type: string, value: string | number) => {
    const { amount, justUpdated } = getBetAmount(type, value)
    if (amount <= 0) return null

    // Calcular cuántas fichas mostrar basado en la cantidad
    const chipCount = Math.min(5, Math.ceil(amount / 5))

    return (
      <div
        className={`absolute -top-1 -right-1 flex flex-col items-center z-10 ${justUpdated ? "animate-bounce" : ""}`}
        style={{ transform: `translateY(-${(chipCount - 1) * 2}px)` }}
      >
        {Array.from({ length: chipCount }).map((_, index) => {
          // Determinar el valor de cada ficha para visualización
          let chipValue = 0.1
          let chipColor = "bg-white"

          if (amount >= 50 && index === chipCount - 1) {
            chipValue = 50
            chipColor = "bg-yellow-400"
          } else if (amount >= 10 && index === chipCount - 1) {
            chipValue = 10
            chipColor = "bg-purple-500"
          } else if (amount >= 5 && index === chipCount - 1) {
            chipValue = 5
            chipColor = "bg-black text-white"
          } else if (amount >= 2 && index === chipCount - 1) {
            chipValue = 2
            chipColor = "bg-green-500"
          } else if (amount >= 1 && index === chipCount - 1) {
            chipValue = 1
            chipColor = "bg-red-500"
          } else if (amount >= 0.5 && index === chipCount - 1) {
            chipValue = 0.5
            chipColor = "bg-blue-500"
          }

          return (
            <div
              key={index}
              className={`${chipColor} text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white shadow-sm mb-[-6px] ${justUpdated && index === chipCount - 1 ? "ring-2 ring-yellow-300" : ""}`}
              style={{ zIndex: chipCount - index }}
            >
              {index === chipCount - 1 ? chipValue : ""}
            </div>
          )
        })}
        <div className="text-[8px] font-bold bg-black bg-opacity-70 text-white rounded-full px-1 mt-1">{amount}</div>
      </div>
    )
  }

  // Verificar si un número es rojo
  const isRedNumber = (num: number): boolean => {
    return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num)
  }

  // Renderizar un número individual
  const renderNumber = (num: number) => {
    return (
      <div
        key={`number-${num}`}
        className={`relative ${
          isRedNumber(num) ? "bg-[#b22222]" : "bg-[#1e1e1e]"
        } text-white font-bold text-center py-1 text-xs border-[0.5px] border-[#1a2b47] cursor-pointer transition-all hover:opacity-90 active:opacity-75`}
        onClick={() => onPlaceBet("number", num)}
      >
        {renderBetChip("number", num)}
        {num}
      </div>
    )
  }

  return (
    <div className="w-full rounded-md overflow-hidden border border-[#1a2b47] bg-[#0d1e3a] shadow-md">
      {/* Cero */}
      <div
        className="w-full bg-green-600 text-white font-bold text-center py-1 text-sm border-b border-[#1a2b47] relative"
        onClick={() => onPlaceBet("number", 0)}
      >
        {renderBetChip("number", 0)}0
      </div>

      {/* Números 1-36 */}
      <div className="grid grid-cols-3 w-full">
        {/* Primera fila: 1-12 */}
        {renderNumber(1)}
        {renderNumber(2)}
        {renderNumber(3)}
        {renderNumber(4)}
        {renderNumber(5)}
        {renderNumber(6)}
        {renderNumber(7)}
        {renderNumber(8)}
        {renderNumber(9)}
        {renderNumber(10)}
        {renderNumber(11)}
        {renderNumber(12)}

        {/* Segunda fila: 13-24 */}
        {renderNumber(13)}
        {renderNumber(14)}
        {renderNumber(15)}
        {renderNumber(16)}
        {renderNumber(17)}
        {renderNumber(18)}
        {renderNumber(19)}
        {renderNumber(20)}
        {renderNumber(21)}
        {renderNumber(22)}
        {renderNumber(23)}
        {renderNumber(24)}

        {/* Tercera fila: 25-36 */}
        {renderNumber(25)}
        {renderNumber(26)}
        {renderNumber(27)}
        {renderNumber(28)}
        {renderNumber(29)}
        {renderNumber(30)}
        {renderNumber(31)}
        {renderNumber(32)}
        {renderNumber(33)}
        {renderNumber(34)}
        {renderNumber(35)}
        {renderNumber(36)}
      </div>

      {/* Apuestas de columna (2:1) */}
      <div className="grid grid-cols-3 w-full">
        {[1, 2, 3].map((col) => (
          <div
            key={`col-${col}`}
            className="bg-[#0d1e3a] text-white font-bold text-center py-1 text-[10px] border-[0.5px] border-[#1a2b47] cursor-pointer hover:bg-[#162a4a]"
            onClick={() => onPlaceBet("column", col)}
          >
            {renderBetChip("column", col)}
            2:1
          </div>
        ))}
      </div>

      {/* Apuestas externas en formato compacto */}
      <div className="grid grid-cols-3 w-full">
        {/* Primera docena */}
        <div
          className="bg-[#0d1e3a] text-white font-bold text-center py-1 text-[10px] border-[0.5px] border-[#1a2b47] cursor-pointer hover:bg-[#162a4a]"
          onClick={() => onPlaceBet("dozen", 1)}
        >
          {renderBetChip("dozen", 1)}
          1-12
        </div>

        {/* Segunda docena */}
        <div
          className="bg-[#0d1e3a] text-white font-bold text-center py-1 text-[10px] border-[0.5px] border-[#1a2b47] cursor-pointer hover:bg-[#162a4a]"
          onClick={() => onPlaceBet("dozen", 2)}
        >
          {renderBetChip("dozen", 2)}
          13-24
        </div>

        {/* Tercera docena */}
        <div
          className="bg-[#0d1e3a] text-white font-bold text-center py-1 text-[10px] border-[0.5px] border-[#1a2b47] cursor-pointer hover:bg-[#162a4a]"
          onClick={() => onPlaceBet("dozen", 3)}
        >
          {renderBetChip("dozen", 3)}
          25-36
        </div>
      </div>

      {/* Apuestas simples */}
      <div className="grid grid-cols-6 w-full">
        {/* 1-18 */}
        <div
          className="bg-[#0d1e3a] text-white font-bold text-center py-1 text-[10px] border-[0.5px] border-[#1a2b47] cursor-pointer hover:bg-[#162a4a]"
          onClick={() => onPlaceBet("range", "low")}
        >
          {renderBetChip("range", "low")}
          1-18
        </div>

        {/* Par */}
        <div
          className="bg-[#0d1e3a] text-white font-bold text-center py-1 text-[10px] border-[0.5px] border-[#1a2b47] cursor-pointer hover:bg-[#162a4a]"
          onClick={() => onPlaceBet("parity", "even")}
        >
          {renderBetChip("parity", "even")}
          Par
        </div>

        {/* Rojo */}
        <div
          className="bg-[#b22222] text-white font-bold text-center py-1 text-[10px] border-[0.5px] border-[#1a2b47] cursor-pointer hover:opacity-90 relative"
          onClick={() => onPlaceBet("color", "red")}
        >
          {renderBetChip("color", "red")}
          <span className="relative z-0">R</span>
        </div>

        {/* Negro */}
        <div
          className="bg-[#1e1e1e] text-white font-bold text-center py-1 text-[10px] border-[0.5px] border-[#1a2b47] cursor-pointer hover:opacity-90 relative"
          onClick={() => onPlaceBet("color", "black")}
        >
          {renderBetChip("color", "black")}
          <span className="relative z-0">N</span>
        </div>

        {/* Impar */}
        <div
          className="bg-[#0d1e3a] text-white font-bold text-center py-1 text-[10px] border-[0.5px] border-[#1a2b47] cursor-pointer hover:bg-[#162a4a]"
          onClick={() => onPlaceBet("parity", "odd")}
        >
          {renderBetChip("parity", "odd")}
          Imp
        </div>

        {/* 19-36 */}
        <div
          className="bg-[#0d1e3a] text-white font-bold text-center py-1 text-[10px] border-[0.5px] border-[#1a2b47] cursor-pointer hover:bg-[#162a4a]"
          onClick={() => onPlaceBet("range", "high")}
        >
          {renderBetChip("range", "high")}
          19-36
        </div>
      </div>
    </div>
  )
}
