"use client"

import { History } from "lucide-react"
import type { RouletteNumber } from "@/types/roulette"

interface ResultsHistoryProps {
  history: RouletteNumber[]
}

export default function ResultsHistory({ history }: ResultsHistoryProps) {
  const getNumberColor = (number: number): string => {
    if (number === 0) return "bg-green-600"

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    return redNumbers.includes(number) ? "bg-[#b22222]" : "bg-[#1e1e1e]"
  }

  return (
    <div className="w-full bg-[#0d1e3a] bg-opacity-90 p-1.5 rounded-md shadow-md border border-[#1a2b47]">
      <h3 className="text-center mb-1 font-bold text-white flex items-center justify-center gap-1 text-xs">
        <History className="text-yellow-400" size={10} />
        Últimos Resultados
      </h3>
      <div className="flex justify-center gap-1 flex-wrap">
        {history.length === 0 ? (
          <div className="text-gray-300 text-xs">Aún no hay resultados</div>
        ) : (
          history.map((number, index) => (
            <div
              key={index}
              className={`${getNumberColor(number)} w-6 h-6 rounded-sm flex items-center justify-center text-white font-bold shadow-sm ${index === 0 ? "animate-pulse" : ""} text-xs`}
            >
              {number}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
