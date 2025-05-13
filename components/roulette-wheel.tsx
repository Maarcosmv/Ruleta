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
  const [rotation, setRotation] = useState(0)
  const [spinSpeed, setSpinSpeed] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 })
  const [ballPosition, setBallPosition] = useState({ angle: 0, radius: 0, phase: 0 })
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

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

  // Inicializar la posición de la bola cuando comienza a girar
  useEffect(() => {
    if (isSpinning) {
      // Inicializar la bola en una posición aleatoria
      setBallPosition({
        angle: Math.random() * Math.PI * 2,
        radius: 0.85, // Comienza en el borde exterior
        phase: 0, // Fase inicial
      })
    }
  }, [isSpinning])

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

    // Dibujar la bola
    if (isSpinning || lastResult !== null) {
      drawBall(ctx, centerX, centerY, radius)
    }

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

  // Función para dibujar la bola
  const drawBall = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    // Calcular la posición de la bola
    let ballX, ballY

    // Usar la posición actual de la bola, sin importar si está girando o no
    const ballRadius = radius * ballPosition.radius
    const ballAngle = ballPosition.angle - (rotation * Math.PI) / 180

    ballX = centerX + ballRadius * Math.cos(ballAngle)
    ballY = centerY + ballRadius * Math.sin(ballAngle)

    // Tamaño de la bola
    const ballSize = radius * 0.04

    // Dibujar sombra de la bola
    ctx.beginPath()
    ctx.arc(ballX + 2, ballY + 2, ballSize, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
    ctx.fill()

    // Dibujar la bola con efecto metálico
    const ballGradient = ctx.createRadialGradient(ballX - ballSize / 2, ballY - ballSize / 2, 0, ballX, ballY, ballSize)
    ballGradient.addColorStop(0, "#FFFFFF") // Blanco brillante
    ballGradient.addColorStop(0.3, "#F0F0F0") // Blanco
    ballGradient.addColorStop(1, "#D0D0D0") // Gris claro

    ctx.beginPath()
    ctx.arc(ballX, ballY, ballSize, 0, 2 * Math.PI)
    ctx.fillStyle = ballGradient
    ctx.fill()

    // Borde de la bola
    ctx.strokeStyle = "#999"
    ctx.lineWidth = 0.5
    ctx.stroke()

    // Añadir brillo a la bola
    ctx.beginPath()
    ctx.arc(ballX - ballSize / 3, ballY - ballSize / 3, ballSize / 3, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
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
  }, [rotation, isSpinning, lastResult, numbers, canvasSize, ballPosition])

  // Animación de la bola
  const animateBall = (time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time
    }

    const deltaTime = time - previousTimeRef.current
    previousTimeRef.current = time

    if (isSpinning) {
      setBallPosition((prev) => {
        let newAngle = prev.angle
        let newRadius = prev.radius
        let newPhase = prev.phase

        // Velocidad angular base
        const baseAngularVelocity = 0.004

        if (prev.phase < 1) {
          // Fase inicial: giro rápido
          const angularVelocity = baseAngularVelocity * (1 + 0.1 * Math.sin(time * 0.001))
          newAngle = prev.angle + deltaTime * angularVelocity
          newRadius = 0.85
          newPhase = Math.min(1, prev.phase + deltaTime * 0.0002)
        } else if (prev.phase < 2) {
          // Fase de desaceleración
          const angularVelocity = baseAngularVelocity * 0.6
          newAngle = prev.angle + deltaTime * angularVelocity
          newRadius = 0.85 - (prev.phase - 1) * 0.1
          newPhase = Math.min(2, prev.phase + deltaTime * 0.00015)
        } else if (prev.phase < 3) {
          // Fase de rebote
          const angularVelocity = baseAngularVelocity * 0.2
          newAngle = prev.angle + deltaTime * angularVelocity
          const bounceAmplitude = 0.03 * (1 - (prev.phase - 2))
          newRadius = 0.75 + bounceAmplitude * Math.sin(time * 0.03)
          newPhase = Math.min(3, prev.phase + deltaTime * 0.00008)
        } else {
          // Fase final: asentamiento
          const segmentAngle = (2 * Math.PI) / numbers.length
          const normalizedAngle = ((prev.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
          const segmentIndex = Math.floor(normalizedAngle / segmentAngle)
          const finalAngle = segmentIndex * segmentAngle + segmentAngle / 2

          // Suavizar la transición al ángulo final
          const angleDiff = ((finalAngle - prev.angle + Math.PI) % (2 * Math.PI)) - Math.PI
          newAngle = prev.angle + angleDiff * 0.1
          newRadius = 0.75
          newPhase = Math.min(4, prev.phase + deltaTime * 0.00005)

          if (newPhase >= 4 && prev.phase < 4) {
            newAngle = finalAngle
            if (onSpinComplete) {
              onSpinComplete()
            }
          }
        }

        return {
          angle: newAngle,
          radius: newRadius,
          phase: newPhase,
        }
      })
    }

    requestRef.current = requestAnimationFrame(animateBall)
  }

  // Iniciar y detener la animación de la bola
  useEffect(() => {
    if (isSpinning) {
      requestRef.current = requestAnimationFrame(animateBall)
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isSpinning])

  // Asegurar que la bola se posicione correctamente cuando termina el giro
  // Eliminar el efecto que fuerza la posición de la bola al resultado predeterminado
  // Eliminar o comentar este useEffect:
  /*
  useEffect(() => {
    // Solo actualizar la posición cuando cambia de spinning a no spinning
    // y tenemos un resultado
    if (!isSpinning && lastResult !== null) {
      // Usar una referencia para evitar actualizaciones innecesarias
      const resultIndex = numbers.indexOf(lastResult)
      if (resultIndex !== -1) {
        const segmentAngle = (2 * Math.PI) / numbers.length
        const finalAngle = resultIndex * segmentAngle + segmentAngle / 2

        // Verificar si la posición actual es diferente para evitar actualizaciones innecesarias
        if (
          Math.abs(ballPosition.angle - finalAngle) > 0.01 ||
          Math.abs(ballPosition.radius - 0.75) > 0.01 ||
          ballPosition.phase !== 2
        ) {
          // Establecer la posición final de la bola
          setBallPosition({
            angle: finalAngle,
            radius: 0.75,
            phase: 2, // Fase final
          })
        }
      }
    }
  }, [isSpinning, lastResult])
  */

  // Manejar animación de giro de la ruleta
  useEffect(() => {
    let animationId: number
    let startTime: number | null = null
    const spinDuration = 5000 // 5 segundos de giro

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      // Calcular la velocidad y rotación basadas en el tiempo transcurrido
      if (isSpinning) {
        // Fase inicial: aceleración
        if (elapsed < 500) {
          setSpinSpeed(40 * (elapsed / 500))
        }
        // Fase media: velocidad constante
        else if (elapsed < 3000) {
          setSpinSpeed(40)
        }
        // Fase final: desaceleración
        else if (elapsed < spinDuration) {
          const remaining = spinDuration - elapsed
          setSpinSpeed(40 * (remaining / 2000))
        }
        // Finalizar giro
        else {
          setSpinSpeed(0)

          // Determinar el resultado basado en la posición final de la bola
          const segmentAngle = (2 * Math.PI) / numbers.length
          const normalizedAngle = ((ballPosition.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
          const segmentIndex = Math.floor(normalizedAngle / segmentAngle)
          const resultNumber = numbers[segmentIndex % numbers.length]

          // Actualizar el estado del componente padre con el resultado
          if (onSpinComplete) {
            // Idealmente, deberíamos pasar el resultado al componente padre
            onSpinComplete()
          }

          return
        }

        // Actualizar rotación
        setRotation((prev) => (prev + spinSpeed) % 360)
      }

      animationId = requestAnimationFrame(animate)
    }

    if (isSpinning) {
      startTime = null
      animationId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isSpinning, spinSpeed, onSpinComplete, ballPosition.angle, numbers])

  return (
    <div className="relative w-full aspect-square" ref={containerRef}>
      <div
        className="w-full h-full rounded-full overflow-hidden shadow-lg relative"
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
      </div>

      {isSpinning && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-sm font-bold text-white bg-black bg-opacity-70 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Sparkles className="animate-spin text-yellow-400" size={14} />
            ¡Girando!
          </div>
        </div>
      )}

      {!isSpinning && lastResult !== null && (
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
