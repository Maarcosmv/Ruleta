"use client"

import { useState, useEffect, useRef } from "react"
import type { GameView, RouletteNumber } from "@/types/roulette"
import { Sparkles } from "lucide-react"

interface RouletteWheelProps {
  isSpinning: boolean
  lastResult: RouletteNumber | null
  onSpinComplete: () => void
  view: GameView
}

export default function RouletteWheel({ isSpinning, lastResult, onSpinComplete, view }: RouletteWheelProps) {
  // Estados para animación de giro
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [targetRotation, setTargetRotation] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 })
  const requestRef = useRef<number | null>(null)

  // Números de la ruleta en orden
  const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29,
    7, 28, 12, 35, 3, 26,
  ]

  // Colores de los números
  const getNumberColor = (number: number): string => {
    if (number === 0) return "#008000" // Verde para el 0
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    return redNumbers.includes(number) ? "#C70039" : "#000000" // Rojo o negro
  }

  // Ajustar tamaño del canvas cuando cambia el tamaño de la ventana
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        // Hacer que el canvas sea cuadrado y se ajuste al contenedor
        const size = Math.min(containerWidth, window.innerHeight * 0.4)
        setCanvasSize({ width: size, height: size })
      }
    }

    // Actualizar tamaño inicial
    updateCanvasSize()

    // Actualizar cuando cambie el tamaño de la ventana
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [])

  // Iniciar animación de giro cuando isSpinning y lastResult cambian
  useEffect(() => {
    if (isSpinning && lastResult !== null) {
      const segmentAngle = 360 / numbers.length
      const resultIndex = numbers.indexOf(lastResult)
      const centerOfSegment = resultIndex * segmentAngle + segmentAngle / 2
      const target = 360 - (centerOfSegment % 360) + 5 * 360
      setTargetRotation(target)
      setRotation(0)
      // dispara tu bucle animationFrame
      setSpinning(true)
    }
  }, [isSpinning, lastResult])

  // Animar la ruleta
  useEffect(() => {
    if (!isSpinning) return;
    let start: number | null = null;
    const duration = 4000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setRotation(targetRotation * eased);
      if (t < 1) {
        requestRef.current = requestAnimationFrame(step);
      } else {
        setSpinning(false); 
        onSpinComplete();
        setSpinning(false);
      }
    };
    requestRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isSpinning, targetRotation, onSpinComplete]);

  // Función para dibujar la ruleta y la bola
  const drawRouletteWheel = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    // Limpiar el canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Dibujar el borde exterior con degradado
    const outerBorderGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.95,
      centerX,
      centerY,
      radius * 1.05,
    )
    outerBorderGradient.addColorStop(0, "#8B4513") // Marrón oscuro
    outerBorderGradient.addColorStop(0.5, "#A0522D") // Marrón medio
    outerBorderGradient.addColorStop(1, "#8B4513") // Marrón oscuro

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 1.02, 0, 2 * Math.PI)
    ctx.fillStyle = outerBorderGradient
    ctx.fill()

    // Dibujar el borde interior con textura de madera
    const innerBorderGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.9,
      centerX,
      centerY,
      radius * 0.98,
    )
    innerBorderGradient.addColorStop(0, "#5d3a1a") // Marrón oscuro
    innerBorderGradient.addColorStop(0.5, "#8B4513") // Marrón medio
    innerBorderGradient.addColorStop(1, "#A0522D") // Marrón claro

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.98, 0, 2 * Math.PI)
    ctx.fillStyle = innerBorderGradient
    ctx.fill()

    // Dibujar el fondo de la ruleta con textura de fieltro
    const feltGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.9)
    feltGradient.addColorStop(0, "#0a3b1a") // Verde oscuro
    feltGradient.addColorStop(1, "#0d4a22") // Verde medio

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.9, 0, 2 * Math.PI)
    ctx.fillStyle = feltGradient
    ctx.fill()

    // Guardar el estado actual
    ctx.save()

    // Mover al centro del canvas
    ctx.translate(centerX, centerY)

    // Rotar el canvas según la rotación actual
    ctx.rotate((rotation * Math.PI) / 180)

    // Dibujar los segmentos de la ruleta
    const segmentAngle = (2 * Math.PI) / numbers.length
    numbers.forEach((number, index) => {
      const startAngle = index * segmentAngle
      const endAngle = (index + 1) * segmentAngle

      // Dibujar el segmento con degradado
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius * 0.9, startAngle, endAngle)
      ctx.closePath()

      // Crear degradado para el segmento
      const baseColor = getNumberColor(number)
      const segmentGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.9)

      if (baseColor === "#008000") {
        // Verde (0)
        segmentGradient.addColorStop(0, "#006400") // Verde oscuro
        segmentGradient.addColorStop(0.7, "#008000") // Verde medio
        segmentGradient.addColorStop(1, "#009900") // Verde claro
      } else if (baseColor === "#C70039") {
        // Rojo
        segmentGradient.addColorStop(0, "#8B0000") // Rojo oscuro
        segmentGradient.addColorStop(0.7, "#C70039") // Rojo medio
        segmentGradient.addColorStop(1, "#FF0044") // Rojo claro
      } else {
        // Negro
        segmentGradient.addColorStop(0, "#000000") // Negro
        segmentGradient.addColorStop(0.7, "#1a1a1a") // Negro medio
        segmentGradient.addColorStop(1, "#333333") // Negro claro
      }

      ctx.fillStyle = segmentGradient
      ctx.fill()

      // Borde del segmento
      ctx.strokeStyle = "#ddd"
      ctx.lineWidth = 1
      ctx.stroke()

      // Dibujar el número con sombra y brillo
      ctx.save()
      ctx.rotate(startAngle + segmentAngle / 2)
      ctx.translate(radius * 0.7, 0)
      ctx.rotate(Math.PI / 2)

      // Sombra para el texto
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 3
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      // Texto del número
      ctx.fillStyle = "#fff"
      ctx.font = `bold ${radius * 0.08}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(number.toString(), 0, 0)

      // Quitar sombra
      ctx.shadowColor = "transparent"

      // Añadir brillo al texto
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.font = `bold ${radius * 0.08}px Arial`
      ctx.fillText(number.toString(), -1, -1)

      ctx.restore()
    })

    // Restaurar el estado
    ctx.restore()

    // Dibujar el centro de la ruleta con efecto metálico
    const centerGradient = ctx.createRadialGradient(
      centerX - radius * 0.05,
      centerY - radius * 0.05,
      0,
      centerX,
      centerY,
      radius * 0.15,
    )
    centerGradient.addColorStop(0, "#FFD700") // Dorado claro
    centerGradient.addColorStop(0.5, "#D4AF37") // Dorado medio
    centerGradient.addColorStop(1, "#B8860B") // Dorado oscuro

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI)
    ctx.fillStyle = centerGradient
    ctx.fill()

    // Borde del centro
    ctx.strokeStyle = "#8B4513"
    ctx.lineWidth = 2
    ctx.stroke()

    // Dibujar detalles del centro
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.12, 0, 2 * Math.PI)
    ctx.fillStyle = "#8B4513"
    ctx.fill()

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.08, 0, 2 * Math.PI)
    ctx.fillStyle = "#D4AF37"
    ctx.fill()

    // Dibujar reflejo en la ruleta (efecto de brillo)
    ctx.beginPath()
    ctx.ellipse(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.6, radius * 0.2, Math.PI / 4, 0, 2 * Math.PI)
    const reflectionGradient = ctx.createRadialGradient(
      centerX - radius * 0.3,
      centerY - radius * 0.3,
      0,
      centerX - radius * 0.3,
      centerY - radius * 0.3,
      radius * 0.6,
    )
    reflectionGradient.addColorStop(0, "rgba(255, 255, 255, 0.2)")
    reflectionGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
    ctx.fillStyle = reflectionGradient
    ctx.fill()
  }

  // Dibujar la ruleta en el canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Ajustar el tamaño del canvas
    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.9

    // Dibujar la ruleta
    drawRouletteWheel(ctx, centerX, centerY, radius)

    // Configurar un intervalo para redibujar la ruleta durante la animación
    const intervalId = setInterval(() => {
      if (ctx) {
        drawRouletteWheel(ctx, centerX, centerY, radius)
      }
    }, 16) // Aproximadamente 60 FPS

    return () => clearInterval(intervalId)
  }, [rotation, isSpinning, lastResult, numbers, canvasSize])

  return (
    <div className="relative w-full aspect-square" ref={containerRef}>
      <div className="w-full h-full rounded-full overflow-hidden shadow-lg relative"
        style={{
          boxShadow: "0 0 30px rgba(255, 215, 0, 0.3), 0 0 15px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Canvas para dibujar la ruleta */}
        <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} className="w-full h-full" />
        {/* Decoración central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-600 to-amber-700 z-20 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
            <Sparkles className="text-amber-900" size={12} />
          </div>
        </div>
        {/* Flecha fija a la derecha */}
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-30">
          <svg width="32" height="32" viewBox="0 0 32 32">
            <polygon points="0,16 32,8 32,24" fill="#ffffff" stroke="#afafaf" strokeWidth="2" />
          </svg>
        </div>
      </div>
      {spinning && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-sm font-bold text-white bg-black bg-opacity-70 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Sparkles className="animate-spin text-yellow-400" size={14} />
            ¡Girando!
          </div>
        </div>
      )}
      {!spinning && lastResult !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-black bg-opacity-70 px-3 py-1.5 rounded-full shadow-lg animate-pulse">
          <span className="text-sm text-white font-bold flex items-center gap-1">
            <Sparkles className="text-yellow-400" size={14} />
            Resultado: {lastResult}
          </span>
        </div>
      )}
    </div>
  )
}
