"use client"

import { Eye, Moon, Sun, Zap } from "lucide-react"
import type { GameView } from "@/types/roulette"

interface ViewToggleProps {
  currentView: GameView
  onViewChange: (view: GameView) => void
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const views: GameView[] = ["classic", "compact", "dark"]

  const getViewIcon = (view: GameView) => {
    switch (view) {
      case "classic":
        return <Sun size={14} className="text-yellow-400" />
      case "compact":
        return <Zap size={14} className="text-teal-400" />
      case "dark":
        return <Moon size={14} className="text-blue-400" />
      default:
        return <Eye size={14} />
    }
  }

  const getNextView = () => {
    const currentIndex = views.indexOf(currentView)
    const nextIndex = (currentIndex + 1) % views.length
    return views[nextIndex]
  }

  const getViewName = (view: GameView): string => {
    switch (view) {
      case "classic":
        return "Clásico"
      case "compact":
        return "Compacto"
      case "dark":
        return "Oscuro"
      default:
        return view
    }
  }

  return (
    <button
      className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#1a2b47] text-white w-full"
      onClick={() => onViewChange(getNextView())}
    >
      {getViewIcon(currentView)}
      <span className="capitalize">Vista {getViewName(currentView)}</span>
    </button>
  )
}
