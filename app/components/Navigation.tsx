"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState, useRef, useEffect } from "react"

interface NavigationProps {
  isDark: boolean
  setIsDark: (value: boolean) => void
}

export default function Navigation({ isDark, setIsDark }: NavigationProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const links = [
    { href: "/", label: "Home" },
    { href: "/commands", label: "Commands" },
    { href: "/embed-builder", label: "Embed Builder" },
    { href: "/status", label: "Status" },
    { href: "/discord", label: "Discord" },
    { href: "/faq", label: "FAQ" },
    { href: "/tos", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav
      className={`backdrop-blur-sm ${isDark ? "bg-black/30 border-white/10" : "bg-white/30 border-black/10"} border-b`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`flex items-center gap-3 text-2xl font-bold ${isDark ? "text-white hover:text-gray-200" : "text-black hover:text-gray-800"} transition-colors`}
            >
              <img src="/eris-logo.png" alt="Eris Bot" className="w-8 h-8" />
              Eris Bot
            </Link>
            <div className="hidden md:flex gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all duration-200 ${
                    pathname === link.href
                      ? isDark
                        ? "text-white font-semibold"
                        : "text-black font-semibold"
                      : isDark
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`px-4 py-2 rounded-lg border ${isDark ? "border-white/20 hover:border-white/50 hover:bg-white/5" : "border-black/20 hover:border-black/50 hover:bg-black/5"} transition-all duration-200 text-sm`}
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/50 transition-all duration-200"
                >
                  <img
                    src={
                      (session.user as any)?.image ||
                      `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5) || "/placeholder.svg"}.png`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
                {showDropdown && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${isDark ? "bg-gray-900 border-white/10" : "bg-white border-black/10"} border overflow-hidden`}
                  >
                    <div className={`px-4 py-3 border-b ${isDark ? "border-white/10" : "border-black/10"}`}>
                      <p className={`text-sm font-medium ${isDark ? "text-white" : "text-black"}`}>
                        {(session.user as any)?.name || "User"}
                      </p>
                      <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {(session.user as any)?.email || ""}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        signOut()
                        setShowDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${isDark ? "text-white hover:bg-white/5" : "text-black hover:bg-black/5"} transition-all duration-200`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn("discord")}
                className={`px-5 py-2 ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} rounded-lg transition-all duration-200 text-sm font-medium`}
              >
                Login with Discord
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
