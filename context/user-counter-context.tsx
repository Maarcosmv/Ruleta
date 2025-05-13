"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface UserCounterContextType {
  userCount: number
  incrementUserCount: () => void
  decrementUserCount: () => void
}

const UserCounterContext = createContext<UserCounterContextType | undefined>(undefined)

interface UserCounterProviderProps {
  children: ReactNode
}

export function UserCounterProvider({ children }: UserCounterProviderProps) {
  const [userCount, setUserCount] = useState(0)

  // Simular cambios aleatorios en el recuento de usuarios
  useEffect(() => {
    // Recuento inicial aleatorio entre 50-200
    setUserCount(Math.floor(Math.random() * 150) + 50)

    // Ajustar periódicamente el recuento de usuarios para simular usuarios que se unen/salen
    const interval = setInterval(() => {
      setUserCount((prev) => {
        const change = Math.floor(Math.random() * 5) - 2 // -2 a +2
        const newCount = Math.max(10, prev + change) // Asegurar al menos 10 usuarios
        return newCount
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const incrementUserCount = () => {
    setUserCount((prev) => prev + 1)
  }

  const decrementUserCount = () => {
    setUserCount((prev) => Math.max(0, prev - 1))
  }

  return (
    <UserCounterContext.Provider value={{ userCount, incrementUserCount, decrementUserCount }}>
      {children}
    </UserCounterContext.Provider>
  )
}

export function useUserCounter() {
  const context = useContext(UserCounterContext)
  if (context === undefined) {
    throw new Error("useUserCounter debe usarse dentro de un UserCounterProvider")
  }
  return context
}
