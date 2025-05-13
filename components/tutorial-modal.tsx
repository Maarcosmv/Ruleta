"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react"

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const tutorialSteps = [
    {
      title: "Bienvenido a la Ruleta",
      content:
        "Este tutorial te guiará a través de los conceptos básicos para jugar a la ruleta. Aprenderás cómo hacer apuestas, girar la ruleta y entender los pagos.",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Selecciona tus fichas",
      content:
        "Primero, selecciona el valor de la ficha que deseas apostar. Puedes elegir entre diferentes valores, desde 0.1 hasta 50 WLD.",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Realiza tus apuestas",
      content:
        "Toca los números o secciones del tablero para colocar tus fichas. Puedes apostar a números individuales, colores, paridad o docenas.",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Tipos de apuestas",
      content:
        "Apuesta directa (un número): paga 35:1\nApuesta a color (rojo/negro): paga 1:1\nApuesta a paridad (par/impar): paga 1:1\nApuesta a docena (1-12, 13-24, 25-36): paga 2:1",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "¡Gira la ruleta!",
      content:
        "Una vez que hayas realizado tus apuestas, toca el botón '¡GIRAR!' para comenzar el juego. La ruleta girará y la bola determinará el número ganador.",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Ganancias y estadísticas",
      content:
        "Si ganas, tus ganancias se añadirán automáticamente a tu saldo. Puedes ver estadísticas de números calientes y fríos para informar tus futuras apuestas.",
      image: "/placeholder.svg?height=150&width=200",
    },
  ]

  const totalSteps = tutorialSteps.length

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2">
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-xl shadow-2xl w-full max-w-md border-2 border-yellow-500">
        <div className="flex justify-between items-center p-2 border-b border-gray-700">
          <div className="flex items-center gap-1">
            <Lightbulb className="text-yellow-400" size={16} />
            <h2 className="text-base font-bold text-white">
              Tutorial - {currentStep + 1}/{totalSteps}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-3">
          <h3 className="text-lg font-bold text-yellow-300 mb-2">{tutorialSteps[currentStep].title}</h3>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-gray-200 whitespace-pre-line text-sm">{tutorialSteps[currentStep].content}</p>
            </div>

            <div className="flex justify-center">
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={tutorialSteps[currentStep].image || "/placeholder.svg"}
                  alt={`Tutorial paso ${currentStep + 1}`}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-2 border-t border-gray-700">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
              currentStep === 0
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <ChevronLeft size={12} />
            Anterior
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${index === currentStep ? "bg-yellow-400" : "bg-gray-600"}`}
              ></div>
            ))}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500 text-black hover:bg-yellow-400 text-xs"
          >
            {currentStep === totalSteps - 1 ? "Finalizar" : "Siguiente"}
            {currentStep < totalSteps - 1 && <ChevronRight size={12} />}
          </button>
        </div>
      </div>
    </div>
  )
}
