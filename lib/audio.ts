// Funciones para manejar efectos de sonido
let audioContext: AudioContext | null = null

// Inicializar el contexto de audio (debe ser llamado después de una interacción del usuario)
export function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

// Reproducir sonido de giro de ruleta
export function playSpinSound() {
  const context = initAudio()
  if (!context) return

  // Crear oscilador para el sonido de giro
  const oscillator = context.createOscillator()
  const gainNode = context.createGain()

  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(300, context.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(100, context.currentTime + 2)

  gainNode.gain.setValueAtTime(0.1, context.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 2)

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)

  oscillator.start()
  oscillator.stop(context.currentTime + 2)
}

// Reproducir sonido de ficha
export function playChipSound() {
  const context = initAudio()
  if (!context) return

  // Crear buffer para el sonido de ficha
  const bufferSize = context.sampleRate * 0.1
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate)
  const data = buffer.getChannelData(0)

  // Generar sonido de "clic" para la ficha
  for (let i = 0; i < bufferSize; i++) {
    if (i < 0.1 * bufferSize) {
      data[i] = Math.random() * 0.5
    } else {
      data[i] = Math.random() * 0.5 * (1 - i / bufferSize)
    }
  }

  const source = context.createBufferSource()
  source.buffer = buffer

  const gainNode = context.createGain()
  gainNode.gain.value = 0.2

  source.connect(gainNode)
  gainNode.connect(context.destination)

  source.start()
}

// Reproducir sonido de victoria
export function playWinSound() {
  const context = initAudio()
  if (!context) return

  // Crear secuencia de notas para victoria
  const notes = [440, 554, 659, 880]
  const noteDuration = 0.15

  notes.forEach((freq, index) => {
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.type = "sine"
    oscillator.frequency.value = freq

    gainNode.gain.setValueAtTime(0, context.currentTime + index * noteDuration)
    gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + index * noteDuration + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + (index + 1) * noteDuration)

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.start(context.currentTime + index * noteDuration)
    oscillator.stop(context.currentTime + (index + 1) * noteDuration)
  })
}
