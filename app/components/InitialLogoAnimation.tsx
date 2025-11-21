"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export default function InitialLogoAnimation() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if animation has been shown before
    const hasSeenAnimation = sessionStorage.getItem("hasSeenLogoAnimation")

    if (hasSeenAnimation) {
      setIsVisible(false)
      return
    }

    const timer = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem("hasSeenLogoAnimation", "true")
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Logo container */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.34, 1.56, 0.64, 1],
              type: "spring",
              stiffness: 100,
            }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 blur-3xl bg-white/20 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Logo */}
            <motion.img
              src="/eris-logo.png"
              alt="Eris Bot"
              className="w-48 h-48 relative z-10 drop-shadow-2xl"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Text below logo */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-4xl font-bold text-white mb-2">Eris</h1>
              <p className="text-gray-300 text-lg">Systematically does it all</p>
            </motion.div>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
