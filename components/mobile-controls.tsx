"use client"

import { RotateCcw, Sparkles } from "lucide-react"

interface MobileControlsProps {
  onClearBets: () => void
  onSpin: () => void
  isSpinning: boolean
  hasBets: boolean
}

export default function MobileControls({ onClearBets, onSpin, isSpinning, hasBets }: MobileControlsProps) {
  return (
    <div className="w-full flex justify-between gap-2">
      <button
        onClick={onClearBets}
        disabled={isSpinning || !hasBets}
        className={`flex-1 py-2 rounded-md font-bold flex items-center justify-center gap-1 text-xs ${
          isSpinning || !hasBets
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-md"
        }`}
      >
        <RotateCcw size={12} />
        Limpiar
      </button>

      <button
        onClick={onSpin}
        disabled={isSpinning || !hasBets}
        className={`flex-1 py-2 rounded-md font-bold flex items-center justify-center gap-1 text-xs ${
          isSpinning || !hasBets
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-md"
        }`}
      >
        <Sparkles size={12} className={isSpinning ? "animate-spin" : ""} />
        {isSpinning ? "Girando..." : "¡GIRAR!"}
      </button>
    </div>
  )
}
