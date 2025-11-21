"use client"

import { useState } from "react"
import Navigation from "../components/Navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface FAQItem {
  question: string
  answer: string
}

export default function FAQPage() {
  const [isDark, setIsDark] = useState(true)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: "How many commands does the bot have?",
      answer: "As of right now, 270+ commands (including aliases, both slash and prefix commands combined).",
    },
    {
      question: "Is the bot open source?",
      answer: "No, and I plan to keep it closed source for now.",
    },
    {
      question: "Support server link?",
      answer: "https://discord.gg/w5qKuKnGVp",
    },
    {
      question: "How do I change the bot's prefix?",
      answer: "Use /server prefixes add [prefix] or ?prefixes add [prefix] (requires Manage Server permission).",
    },
    {
      question: "Why isn't the bot responding to my commands?",
      answer:
        "Make sure the bot has proper permissions, you're using the correct prefix, and the command name is spelled correctly. Check /help for command info.",
    },
    {
      question: "How do I report a bug or request a feature?",
      answer: "Join our support server and create a ticket or post in the appropriate channel.",
    },
    {
      question: "Does the bot store my messages?",
      answer:
        "The bot only stores message data for specific features like snipe commands (temporarily) and moderation logs. See our Privacy Policy for details.",
    },
    {
      question: "What permissions does the bot need?",
      answer:
        "The bot needs Administrator permission for full functionality, or specific permissions based on which features you want to use.",
    },
    {
      question: "Can I customize the bot's PFP/BANNER?",
      answer: "Yes! Use ?customise pfp <icon_url> or ?customise banner <banner_url>.",
    },
    {
      question: "Is the bot free to use?",
      answer: "Yes, completely free with all features available.",
    },
    {
      question: "How do I set up auto-moderation?",
      answer: "Use /automod logchannel to set a log channel, then configure features like anti-spam, anti-raid, etc.",
    },
    {
      question: "What's the difference between ban, hardban, and softban?",
      answer:
        "Ban = Standard ban. Hardban = Only bot/server owner can unban. Softban = Ban then immediately unban to clear messages.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <Navigation isDark={isDark} setIsDark={setIsDark} />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"} mb-12`}>
            Find answers to common questions about Eris Bot
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`border ${isDark ? "border-white/10 bg-gray-900/30" : "border-black/10 bg-gray-100/30"} rounded-lg overflow-hidden`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full px-6 py-4 text-left flex justify-between items-center ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"} transition-colors`}
              >
                <span className="font-semibold text-lg pr-4">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl flex-shrink-0"
                >
                  ↓
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`px-6 py-4 border-t ${isDark ? "border-white/10 bg-black/20 text-gray-300" : "border-black/10 bg-white/20 text-gray-700"}`}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-4`}>
            Still have questions? Join our support server!
          </p>
          <Link
            href="/discord"
            className={`inline-block px-6 py-3 ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} rounded-lg transition-all duration-200 font-medium`}
          >
            Join Discord Server
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
