import { Suspense } from "react"
import RouletteGame from "@/components/roulette-game"
import WorldCoinAuth from "@/components/worldcoin-auth"
import { UserCounterProvider } from "@/context/user-counter-context"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900">
      <UserCounterProvider>
        <Suspense
          fallback={
            <div className="w-full h-screen flex items-center justify-center text-white text-xl">Cargando...</div>
          }
        >
          <WorldCoinAuth>
            <RouletteGame />
          </WorldCoinAuth>
        </Suspense>
      </UserCounterProvider>
    </main>
  )
}
