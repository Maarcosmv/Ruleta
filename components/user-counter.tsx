"use client"

import { Users } from "lucide-react"

interface UserCounterProps {
  count: number
}

export default function UserCounter({ count }: UserCounterProps) {
  return (
    <div className="flex items-center gap-1 bg-[#1a2b47] text-white px-2 py-1 rounded-full shadow-lg border border-[#2a3b57] text-xs">
      <Users size={12} className="text-yellow-400" />
      <span className="font-medium">{count}</span>
    </div>
  )
}
