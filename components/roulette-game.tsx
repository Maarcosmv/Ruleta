"use client"

import { useState, useEffect } from "react"
import BettingBoard from "./betting-board"
import RouletteWheel from "./roulette-wheel"
import ChipSelector from "./chip-selector"
import ResultsHistory from "./results-history"
import UserCounter from "./user-counter"
import ViewToggle from "./view-toggle"
import StatsPanel from "./stats-panel"
import TutorialModal from "./tutorial-modal"
import MobileControls from "./mobile-controls"
import { useUserCounter } from "@/context/user-counter-context"
import type { Bet, ChipValue, GameView, RouletteNumber } from "@/types/roulette"
import { Coins, Sparkles, HelpCircle, Volume2, VolumeX, BarChart3, Menu } from "lucide-react"
import { playChipSound, playSpinSound, playWinSound } from "@/lib/audio"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function RouletteGame() {
  const [selectedChip, setSelectedChip] = useState<ChipValue>(1)
  const [bets, setBets] = useState<Bet[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastResult, setLastResult] = useState<RouletteNumber | null>(null)
  const [resultsHistory, setResultsHistory] = useState<RouletteNumber[]>([])
  const [balance, setBalance] = useState(100) // Saldo inicial en WLD
  const [view, setView] = useState<GameView>("classic")
  const [winAmount, setWinAmount] = useState<number | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showStats, setShowStats] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const { userCount } = useUserCounter()
  const [onSpinCompleteCallback, setOnSpinCompleteCallback] = useState<(() => void) | null>(null)

  // Calcular cantidad total apostada
  const totalBetAmount = bets.reduce((total, bet) => total + bet.amount, 0)

  // No mostrar tutorial automáticamente

  // Realizar apuesta con animación de fichas
  const placeBet = (betType: string, value: string | number, amount: number) => {
    if (isSpinning) return
    if (balance < amount) return // Fondos insuficientes

    // Reproducir sonido de ficha
    if (soundEnabled) {
      playChipSound()
    }

    // Verificar si la apuesta ya existe
    const existingBetIndex = bets.findIndex((bet) => bet.type === betType && bet.value === value)

    if (existingBetIndex >= 0) {
      // Actualizar apuesta existente con animación
      const updatedBets = [...bets]
      updatedBets[existingBetIndex] = {
        ...updatedBets[existingBetIndex],
        amount: updatedBets[existingBetIndex].amount + amount,
        // Añadir flag para animar
        justUpdated: true,
      }
      setBets(updatedBets)

      // Quitar el flag de animación después de un tiempo
      setTimeout(() => {
        setBets((bets) =>
          bets.map((bet) => (bet.type === betType && bet.value === value ? { ...bet, justUpdated: false } : bet)),
        )
      }, 500)
    } else {
      // Añadir nueva apuesta con animación
      setBets([...bets, { type: betType, value, amount, justUpdated: true }])

      // Quitar el flag de animación después de un tiempo
      setTimeout(() => {
        setBets((bets) =>
          bets.map((bet) => (bet.type === betType && bet.value === value ? { ...bet, justUpdated: false } : bet)),
        )
      }, 500)
    }

    // Deducir del saldo
    setBalance((prev) => prev - amount)

    // Resetear mensaje de ganancia
    setWinAmount(null)
  }

  // Limpiar todas las apuestas
  const clearBets = () => {
    if (isSpinning) return
    setBalance((prev) => prev + totalBetAmount)
    setBets([])
    setWinAmount(null)

    // Reproducir sonido de ficha
    if (soundEnabled) {
      playChipSound()
    }
  }

  // Girar la ruleta
  const spinWheel = async () => {
    if (isSpinning || bets.length === 0) return

    setIsSpinning(true)
    setWinAmount(null)

    // Reproducir sonido de giro
    if (soundEnabled) {
      playSpinSound()
    }

    // Esperar a que la animación termine
    await new Promise<void>((resolve) => {
      const handleSpinComplete = () => {
        // Determinar el resultado basado en la posición final de la bola
        const result = Math.floor(Math.random() * 37) // 0-36
        setLastResult(result)

        // Actualizar historial
        const newHistory = [result, ...resultsHistory].slice(0, 10)
        setResultsHistory(newHistory)

        // Procesar ganancias
        const winnings = processWinnings(result)

        // Reproducir sonido de victoria si hay ganancias
        if (winnings > 0 && soundEnabled) {
          playWinSound()
        }

        setIsSpinning(false)
        resolve()
      }

      // Pasar el callback al componente de la ruleta
      setOnSpinCompleteCallback(() => handleSpinComplete)
    })
  }

  // Procesar ganancias basadas en el resultado
  const processWinnings = (result: number): number => {
    let winnings = 0

    bets.forEach((bet) => {
      if (bet.type === "number" && bet.value === result) {
        // Apuesta directa paga 35:1
        winnings += bet.amount * 36
      } else if (bet.type === "color") {
        const resultColor = getNumberColor(result)
        if (bet.value === resultColor) {
          // Apuesta a color paga 1:1
          winnings += bet.amount * 2
        }
      } else if (bet.type === "parity") {
        if (result !== 0) {
          const resultParity = result % 2 === 0 ? "even" : "odd"
          if (bet.value === resultParity) {
            // Apuesta a paridad paga 1:1
            winnings += bet.amount * 2
          }
        }
      } else if (bet.type === "dozen") {
        if (result !== 0) {
          let dozen = 0
          if (result >= 1 && result <= 12) dozen = 1
          else if (result >= 13 && result <= 24) dozen = 2
          else dozen = 3

          if (bet.value === dozen) {
            // Apuesta a docena paga 2:1
            winnings += bet.amount * 3
          }
        }
      } else if (bet.type === "column") {
        if (result !== 0) {
          // Determinar la columna del resultado
          const column = result % 3 === 0 ? 3 : result % 3

          if (bet.value === column) {
            // Apuesta a columna paga 2:1
            winnings += bet.amount * 3
          }
        }
      } else if (bet.type === "range") {
        if (result !== 0) {
          const isLow = result >= 1 && result <= 18
          if ((bet.value === "low" && isLow) || (bet.value === "high" && !isLow)) {
            // Apuesta a rango paga 1:1
            winnings += bet.amount * 2
          }
        }
      }
    })

    // Añadir ganancias al saldo
    if (winnings > 0) {
      setBalance((prev) => prev + winnings)
      setWinAmount(winnings)
    }

    return winnings
  }

  // Obtener color de un número
  const getNumberColor = (number: number): "red" | "black" | "green" => {
    if (number === 0) return "green"

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    return redNumbers.includes(number) ? "red" : "black"
  }

  // Efecto para limpiar las apuestas después de un giro
  useEffect(() => {
    if (!isSpinning && lastResult !== null) {
      // Limpiar apuestas después de mostrar el resultado
      const timeout = setTimeout(() => {
        setBets([])
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [isSpinning, lastResult])

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-1 bg-[#0d1e3a]">
      {/* Cabecera móvil */}
      <div className="w-full flex justify-between items-center mb-1 sticky top-0 z-30 bg-[#0d1e3a] bg-opacity-95 p-1 border-b border-[#1a2b47]">
        <div className="text-base font-bold flex items-center gap-1">
          <Sparkles className="text-yellow-400" size={14} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-300">
            Ruleta Casino
          </span>
        </div>

        <div className="flex items-center gap-2">
          <UserCounter count={userCount} />

          <Sheet>
            <SheetTrigger asChild>
              <button className="bg-[#1a2b47] text-white p-1 rounded-full hover:bg-[#2a3b57] transition-all">
                <Menu size={16} className="text-yellow-400" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0d1e3a] border-l border-[#1a2b47] p-4">
              <div className="flex flex-col gap-4 mt-6">
                <h3 className="text-lg font-bold text-yellow-400">Opciones</h3>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="flex items-center gap-2 p-3 rounded-lg bg-[#1a2b47] text-white"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 size={18} className="text-green-400" /> Sonidos activados
                    </>
                  ) : (
                    <>
                      <VolumeX size={18} className="text-red-400" /> Sonidos desactivados
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowTutorial(true)}
                  className="flex items-center gap-2 p-3 rounded-lg bg-[#1a2b47] text-white"
                >
                  <HelpCircle size={18} className="text-blue-400" /> Tutorial
                </button>

                <button
                  onClick={() => setShowStats(!showStats)}
                  className="flex items-center gap-2 p-3 rounded-lg bg-[#1a2b47] text-white"
                >
                  <BarChart3 size={18} className="text-purple-400" />
                  {showStats ? "Ocultar estadísticas" : "Mostrar estadísticas"}
                </button>

                <ViewToggle currentView={view} onViewChange={setView} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-2 relative">
        <div className="flex items-center gap-2 bg-[#1a2b47] p-1 rounded-full shadow-md z-10 w-full justify-center">
          <div className="text-xs font-semibold flex items-center gap-1">
            <Coins className="text-yellow-400" size={12} />
            <span>
              Saldo: <span className="text-yellow-300">{balance.toFixed(2)} WLD</span>
            </span>
          </div>
          <div className="text-xs font-semibold">
            Apuesta: <span className="text-green-300">{totalBetAmount.toFixed(2)} WLD</span>
          </div>
        </div>

        {winAmount !== null && (
          <div className="text-xs font-semibold animate-pulse bg-[#1a2b47] px-2 py-0.5 rounded-full z-10">
            ¡Ganancia: <span className="text-yellow-300">{winAmount.toFixed(2)} WLD</span>!
          </div>
        )}

        <div className="flex flex-col w-full gap-2 items-center justify-center z-10">
          {/* Ruleta */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[250px]">
              <RouletteWheel 
                isSpinning={isSpinning} 
                lastResult={lastResult} 
                onSpinComplete={onSpinCompleteCallback || (() => {})} 
                view={view} 
              />
            </div>
          </div>

          {/* Historial de resultados */}
          <ResultsHistory history={resultsHistory} />

          {/* Tablero de apuestas */}
          <div className="w-full">
            <BettingBoard
              onPlaceBet={(type, value) => placeBet(type, value, selectedChip)}
              currentBets={bets}
              view={view}
            />
          </div>
        </div>

        {showStats && <StatsPanel history={resultsHistory} />}

        <div className="w-full flex flex-col gap-2 z-10 sticky bottom-0 bg-[#0d1e3a] bg-opacity-95 p-1 border-t border-[#1a2b47]">
          <ChipSelector selectedChip={selectedChip} onSelectChip={setSelectedChip} view={view} />

          <MobileControls
            onClearBets={clearBets}
            onSpin={spinWheel}
            isSpinning={isSpinning}
            hasBets={bets.length > 0}
          />
        </div>
      </div>

      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  )
}
