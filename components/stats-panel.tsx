"use client"

import { useState } from "react"
import { BarChart3, Flame, Snowflake, PieChart, History } from "lucide-react"
import type { RouletteNumber } from "@/types/roulette"

interface StatsPanelProps {
  history: RouletteNumber[]
}

export default function StatsPanel({ history }: StatsPanelProps) {
  const [activeTab, setActiveTab] = useState<"hot" | "cold" | "stats">("hot")

  // Calcular frecuencia de números
  const calculateFrequency = () => {
    const frequency: Record<number, number> = {}

    // Inicializar todos los números con 0
    for (let i = 0; i <= 36; i++) {
      frequency[i] = 0
    }

    // Contar ocurrencias
    history.forEach((num) => {
      frequency[num]++
    })

    return frequency
  }

  const frequency = calculateFrequency()

  // Obtener números calientes (más frecuentes)
  const getHotNumbers = () => {
    if (history.length === 0) return []

    return Object.entries(frequency)
      .map(([num, freq]) => ({ number: Number.parseInt(num), frequency: freq }))
      .filter((item) => item.frequency > 0)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5)
  }

  // Obtener números fríos (menos frecuentes)
  const getColdNumbers = () => {
    if (history.length === 0) return []

    return Object.entries(frequency)
      .map(([num, freq]) => ({ number: Number.parseInt(num), frequency: freq }))
      .filter((item) => Number.parseInt(item.number.toString()) <= 36) // Solo números válidos de la ruleta
      .sort((a, b) => a.frequency - b.frequency)
      .slice(0, 5)
  }

  // Calcular estadísticas generales
  const calculateStats = () => {
    if (history.length === 0) {
      return {
        redCount: 0,
        blackCount: 0,
        greenCount: 0,
        evenCount: 0,
        oddCount: 0,
        lowCount: 0,
        highCount: 0,
        redPercent: 0,
        blackPercent: 0,
        greenPercent: 0,
      }
    }

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

    let redCount = 0
    let blackCount = 0
    let greenCount = 0
    let evenCount = 0
    let oddCount = 0
    let lowCount = 0
    let highCount = 0

    history.forEach((num) => {
      // Color
      if (num === 0) greenCount++
      else if (redNumbers.includes(num)) redCount++
      else blackCount++

      // Paridad
      if (num !== 0) {
        if (num % 2 === 0) evenCount++
        else oddCount++
      }

      // Rango
      if (num >= 1 && num <= 18) lowCount++
      else if (num >= 19 && num <= 36) highCount++
    })

    const total = history.length

    return {
      redCount,
      blackCount,
      greenCount,
      evenCount,
      oddCount,
      lowCount,
      highCount,
      redPercent: Math.round((redCount / total) * 100),
      blackPercent: Math.round((blackCount / total) * 100),
      greenPercent: Math.round((greenCount / total) * 100),
    }
  }

  const hotNumbers = getHotNumbers()
  const coldNumbers = getColdNumbers()
  const stats = calculateStats()

  const getNumberColor = (number: number): string => {
    if (number === 0) return "bg-gradient-to-r from-green-600 to-green-500"

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    return redNumbers.includes(number)
      ? "bg-gradient-to-r from-red-700 to-red-600"
      : "bg-gradient-to-r from-gray-900 to-gray-800"
  }

  return (
    <div className="w-full bg-black bg-opacity-40 p-2 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <h3 className="text-center font-bold text-white flex items-center gap-1 text-xs">
          <BarChart3 className="text-yellow-400" size={12} />
          Estadísticas
        </h3>

        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("hot")}
            className={`px-2 py-1 rounded-md flex items-center gap-1 text-xs ${
              activeTab === "hot" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Flame size={10} />
            <span>Calientes</span>
          </button>

          <button
            onClick={() => setActiveTab("cold")}
            className={`px-2 py-1 rounded-md flex items-center gap-1 text-xs ${
              activeTab === "cold" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Snowflake size={10} />
            <span>Fríos</span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`px-2 py-1 rounded-md flex items-center gap-1 text-xs ${
              activeTab === "stats" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <PieChart size={10} />
            <span>General</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-800 bg-opacity-50 rounded-lg p-2">
        {activeTab === "hot" && (
          <div>
            <div className="text-xs text-gray-300 mb-2 flex items-center gap-1">
              <Flame className="text-red-400" size={12} />
              Números más frecuentes
            </div>

            {history.length === 0 ? (
              <div className="text-gray-400 text-center py-2 text-xs">No hay datos suficientes</div>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center">
                {hotNumbers.map((item) => (
                  <div key={item.number} className="flex flex-col items-center">
                    <div
                      className={`${getNumberColor(item.number)} w-6 h-6 rounded-full flex items-center justify-center text-white font-bold border border-yellow-300 shadow-md text-xs`}
                    >
                      {item.number}
                    </div>
                    <div className="text-[10px] text-white mt-1">{item.frequency}x</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "cold" && (
          <div>
            <div className="text-xs text-gray-300 mb-2 flex items-center gap-1">
              <Snowflake className="text-blue-400" size={12} />
              Números menos frecuentes
            </div>

            {history.length === 0 ? (
              <div className="text-gray-400 text-center py-2 text-xs">No hay datos suficientes</div>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center">
                {coldNumbers.map((item) => (
                  <div key={item.number} className="flex flex-col items-center">
                    <div
                      className={`${getNumberColor(item.number)} w-6 h-6 rounded-full flex items-center justify-center text-white font-bold border border-yellow-300 shadow-md text-xs`}
                    >
                      {item.number}
                    </div>
                    <div className="text-[10px] text-white mt-1">{item.frequency}x</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div>
            <div className="text-xs text-gray-300 mb-2 flex items-center gap-1">
              <History className="text-purple-400" size={12} />
              Distribución de resultados
            </div>

            {history.length === 0 ? (
              <div className="text-gray-400 text-center py-2 text-xs">No hay datos suficientes</div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white">
                  <span>Colores:</span>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      Rojo: {stats.redPercent}%
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-black"></div>
                      Negro: {stats.blackPercent}%
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      Verde: {stats.greenPercent}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="flex h-1.5 rounded-full">
                    <div className="bg-red-600 h-1.5 rounded-l-full" style={{ width: `${stats.redPercent}%` }}></div>
                    <div className="bg-black h-1.5" style={{ width: `${stats.blackPercent}%` }}></div>
                    <div
                      className="bg-green-600 h-1.5 rounded-r-full"
                      style={{ width: `${stats.greenPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-white">
                  <span>Paridad:</span>
                  <div className="flex gap-2">
                    <span>Pares: {stats.evenCount}</span>
                    <span>Impares: {stats.oddCount}</span>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-white">
                  <span>Rango:</span>
                  <div className="flex gap-2">
                    <span>1-18: {stats.lowCount}</span>
                    <span>19-36: {stats.highCount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
