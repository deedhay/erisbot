"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DiscordRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to Discord server
    const discordServer = process.env.NEXT_PUBLIC_DISCORD_SERVER || "https://discord.gg/w5qKuKnGVp"
    window.location.href = discordServer
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Redirecting to Discord server...</p>
      </div>
    </div>
  )
}
