"use client"

import { CoinsIcon as CoinIcon } from "lucide-react"
import type { ChipValue, GameView } from "@/types/roulette"

interface ChipSelectorProps {
  selectedChip: ChipValue
  onSelectChip: (value: ChipValue) => void
  view: GameView
}

export default function ChipSelector({ selectedChip, onSelectChip, view }: ChipSelectorProps) {
  const chipValues: ChipValue[] = [0.1, 0.5, 1, 2, 5, 10, 50]

  const getChipColor = (value: ChipValue) => {
    switch (value) {
      case 0.1:
        return "bg-white border-blue-300"
      case 0.5:
        return "bg-blue-500 border-blue-300"
      case 1:
        return "bg-red-500 border-red-300"
      case 2:
        return "bg-green-500 border-green-300"
      case 5:
        return "bg-black border-gray-300 text-white"
      case 10:
        return "bg-purple-500 border-purple-300"
      case 50:
        return "bg-yellow-400 border-yellow-300"
      default:
        return "bg-gray-500 border-gray-300"
    }
  }

  const getChipClasses = (value: ChipValue) => {
    const isSelected = value === selectedChip
    const color = getChipColor(value)

    return `
      ${color} 
      w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]
      border ${isSelected ? "border-white shadow-md scale-110" : ""}
      cursor-pointer transition-all hover:scale-105
      ${isSelected ? "shadow-[0_0_5px_rgba(255,255,255,0.5)]" : ""}
      relative
    `
  }

  return (
    <div className="w-full p-1.5 rounded-md bg-[#1a2b47] border border-[#2a3b57]">
      <h3 className="text-white text-center mb-1 font-bold flex items-center justify-center gap-1 text-xs">
        <CoinIcon className="text-yellow-400" size={10} />
        Fichas (WLD)
      </h3>
      <div className="flex justify-center gap-1 flex-wrap">
        {chipValues.map((value) => (
          <div key={value} className={getChipClasses(value)} onClick={() => onSelectChip(value)}>
            {value}
            {selectedChip === value && (
              <div className="absolute inset-0 border border-white rounded-full animate-ping"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
