"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Navigation from "./components/Navigation"
import InitialLogoAnimation from "./components/InitialLogoAnimation"
import Link from "next/link"
import { useSiteConfig } from "@/lib/site-config"

export default function Home() {
  const { data: session } = useSession()
  const { config, loading: configLoading } = useSiteConfig()
  const [isDark, setIsDark] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)
  const [guilds, setGuilds] = useState<any[]>([])
  const [loadingGuilds, setLoadingGuilds] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  const [floatingElements, setFloatingElements] = useState<
    Array<{
      id: number
      left: string
      top: string
      duration: number
      delay: number
    }>
  >([])

  useEffect(() => {
    // Generate random positions for floating elements on client side only
    setFloatingElements(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2,
      })),
    )
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    if (session) {
      setLoadingGuilds(true)
      fetch("/api/guilds")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setGuilds(data)
          }
        })
        .catch((err) => console.error("Failed to fetch guilds:", err))
        .finally(() => setLoadingGuilds(false))
    }
  }, [session])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Show and hide the logo based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowLogo(true)
      } else {
        setShowLogo(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Comprehensive list of bot features that rotate
  const allFeatures = [
    { text: "Moderation Tools", desc: "Ban, kick, timeout, warn, and manage your server" },
    { text: "Anti-Nuke Protection", desc: "Advanced security against server raids and attacks" },
    { text: "Auto-Moderation", desc: "Automated spam and content filtering" },
    { text: "Custom Roles", desc: "Reaction roles, self-roles, and role management" },
    { text: "Leveling System", desc: "XP tracking and rank progression for members" },
    { text: "Giveaway System", desc: "Create and manage server giveaways" },
    { text: "Welcome Messages", desc: "Customizable greetings for new members" },
    { text: "Auto Responses", desc: "Set up automated replies to keywords" },
    { text: "Server Logging", desc: "Track all server events and changes" },
    { text: "Utility Commands", desc: "Over 100 utility commands for server management" },
    { text: "Custom Tags", desc: "Create custom command shortcuts" },
    { text: "Suggestion System", desc: "Let members submit and vote on ideas" },
    { text: "Auto Purge", desc: "Automated message cleanup and channel management" },
    { text: "Sticky Messages", desc: "Keep important messages at the bottom of channels" },
    { text: "Custom embeds", desc: "Create custom embeds with ease." },
    { text: "Emoji Management", desc: "Emojiboard and emoji statistics" },
    { text: "Security Features", desc: "Comprehensive server protection tools" },
    { text: "Channel Controls", desc: "Lock, unlock, and manage channel permissions" },
  ]

  // Rotate through features every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % allFeatures.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Display 3 features at a time
  const displayedFeatures = [
    allFeatures[currentFeatureIndex],
    allFeatures[(currentFeatureIndex + 1) % allFeatures.length],
    allFeatures[(currentFeatureIndex + 2) % allFeatures.length],
  ]

  return (
    <>
      <InitialLogoAnimation />

      <div
        className={`min-h-screen relative overflow-hidden ${isDark ? "bg-black text-white" : "bg-white text-black"}`}
      >
        {/* Animated minimal background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${isDark ? "bg-white" : "bg-black"}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-transparent via-black/30 to-black/50" : "bg-gradient-to-b from-transparent via-white/30 to-white/50"} pointer-events-none`}
        />

        <Navigation isDark={isDark} setIsDark={setIsDark} />

        {/* Floating bot logo */}
        <motion.div
          className="fixed pointer-events-none z-50"
          initial={{ bottom: "-200px", left: "50%", x: "-50%", opacity: 0 }}
          animate={{
            bottom: showLogo ? "50%" : "-200px",
            y: showLogo ? "-50%" : "0",
            opacity: showLogo ? 1 : 0,
            scale: showLogo ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            scale: {
              duration: 2,
              repeat: showLogo ? Number.POSITIVE_INFINITY : 0,
              repeatType: "reverse",
            },
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-purple-500/30 rounded-full animate-pulse" />
            <img src={config.botLogo} alt="Bot Logo" className="w-32 h-32 relative z-10 drop-shadow-2xl" />
          </div>
        </motion.div>

        <main className="relative max-w-7xl mx-auto px-6 py-16 min-h-screen flex items-center">
          <div className="w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Main content */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
              >
                <motion.h1
                  className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.span
                    className="block"
                    animate={{
                      textShadow: isDark
                        ? ["0 0 20px rgba(0, 0, 0, 0.5)", "0 0 40px rgba(0, 0, 0, 0.8)", "0 0 20px rgba(0, 0, 0, 0.5)"]
                        : [
                            "0 0 20px rgba(255, 255, 255, 0.5)",
                            "0 0 40px rgba(255, 255, 255, 0.8)",
                            "0 0 20px rgba(255, 255, 255, 0.5)",
                          ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {config.botName}
                  </motion.span>
                  <motion.span
                    className={`block ${isDark ? "text-white" : "text-black"}`}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {config.tagline}
                  </motion.span>
                </motion.h1>

                <motion.p
                  className={`text-lg md:text-xl ${isDark ? "text-gray-400" : "text-gray-600"} mb-8 max-w-xl`}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  400+ commands across 30+ categories to entertain your server
                </motion.p>

                <motion.div
                  className="flex gap-4"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href={config.inviteLink}
                      className={`group px-6 py-3 ${isDark ? "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border-white/10" : "bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 border-black/10"} rounded-lg transition-all duration-300 font-medium flex items-center gap-2 border`}
                    >
                      Invite to Discord
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/commands"
                      className={`px-6 py-3 border ${isDark ? "border-white/20 hover:border-white/50 hover:bg-white/5" : "border-black/20 hover:border-black/50 hover:bg-black/5"} rounded-lg transition-all duration-300 font-medium flex items-center gap-2`}
                    >
                      View Commands
                      <motion.span
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right side - Rotating feature badges */}
              <div className="relative h-[500px] hidden lg:block">
                {displayedFeatures.map((feature, index) => (
                  <motion.div
                    key={`${feature.text}-${currentFeatureIndex}`}
                    className="absolute"
                    style={{
                      left: `${30 + index * 20}%`,
                      top: `${20 + index * 25}%`,
                    }}
                    initial={{ x: 100, opacity: 0, rotate: -10 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      rotate: 0,
                      y: [0, -20, 0],
                    }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.1,
                      y: {
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.5,
                      },
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <motion.div
                      className={`px-6 py-4 ${isDark ? "bg-gradient-to-br from-gray-900/90 to-black/90 border-white/10" : "bg-gradient-to-br from-gray-100/90 to-white/90 border-black/10"} backdrop-blur-sm rounded-xl border shadow-2xl`}
                      animate={{
                        boxShadow: isDark
                          ? [
                              "0 0 20px rgba(255, 255, 255, 0.1)",
                              "0 0 40px rgba(255, 255, 255, 0.2)",
                              "0 0 20px rgba(255, 255, 255, 0.1)",
                            ]
                          : [
                              "0 0 20px rgba(0, 0, 0, 0.1)",
                              "0 0 40px rgba(0, 0, 0, 0.2)",
                              "0 0 20px rgba(0, 0, 0, 0.1)",
                            ],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
                    >
                      <div className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-black"}`}>
                        {feature.text}
                      </div>
                      <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{feature.desc}</div>
                    </motion.div>
                  </motion.div>
                ))}

                {/* Animated connecting lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <motion.path
                    d="M 200 150 Q 300 200 400 250"
                    stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  />
                </svg>
              </div>
            </div>

            {/* Mutual Servers Section */}
            {session && (
              <motion.div
                className="mt-16"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-6">Your Servers</h2>
                {loadingGuilds ? (
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading servers...</p>
                ) : guilds.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {guilds.map((guild) => (
                      <motion.div
                        key={guild.id}
                        className={`p-4 rounded-lg ${isDark ? "bg-gray-900/50 border-white/10" : "bg-gray-100/50 border-black/10"} border text-center`}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        {guild.icon ? (
                          <img
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`}
                            alt={guild.name}
                            className="w-16 h-16 rounded-full mx-auto mb-2"
                          />
                        ) : (
                          <div
                            className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
                          >
                            <span className="text-2xl font-bold">{guild.name[0]}</span>
                          </div>
                        )}
                        <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-black"}`}>
                          {guild.name}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>No mutual servers found</p>
                )}
              </motion.div>
            )}

            {/* Feature highlights - no emojis */}
            <motion.div
              className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {[
                { title: "Moderation", desc: "Advanced anti-nuke and auto-moderation systems" },
                { title: "Engagement", desc: "Giveaways, leveling, and custom interactive features" },
                { title: "Management", desc: "Comprehensive server control with 269 commands" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className={`group p-6 rounded-xl ${isDark ? "bg-gradient-to-br from-gray-900/50 to-black/50 border-white/10 hover:border-white/30" : "bg-gradient-to-br from-gray-100/50 to-white/50 border-black/10 hover:border-black/30"} border transition-all duration-300`}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <h3
                    className={`text-xl font-bold mb-2 ${isDark ? "text-white group-hover:text-gray-200" : "text-black group-hover:text-gray-800"} transition-colors`}
                  >
                    {feature.title}
                  </h3>
                  <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </>
  )
}
