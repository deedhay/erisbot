"use client"

import { useState } from "react"
import Navigation from "../components/Navigation"
import { motion } from "framer-motion"
import Link from "next/link"

export default function PrivacyPage() {
  const [isDark, setIsDark] = useState(true)

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <Navigation isDark={isDark} setIsDark={setIsDark} />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl font-bold mb-2">Privacy Policy</h1>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-12`}>Last Updated: October 28, 2025</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <section>
            <h2 className="text-2xl font-bold mb-3">1. WHAT WE COLLECT</h2>
            <p className={`mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              We collect data necessary for the bot to work:
            </p>
            <ul className={`list-disc pl-6 space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <li>Server and user IDs</li>
              <li>Command usage</li>
              <li>Server configurations you set up</li>
              <li>Content for features like custom commands, warnings, levels, and reminders</li>
              <li>Temporary message data for snipe commands</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. HOW WE USE IT</h2>
            <p className={`mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>We use your data only to:</p>
            <ul className={`list-disc pl-6 space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <li>Make the bot work</li>
              <li>Save your server settings</li>
              <li>Execute commands and features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. DATA SHARING</h2>
            <p className={`mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              We do NOT sell or share your data with anyone except:
            </p>
            <ul className={`list-disc pl-6 space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <li>Discord (required for bot functionality)</li>
              <li>When required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. DATA SECURITY</h2>
            <p className={isDark ? "text-gray-300" : "text-gray-700"}>
              We store data securely and protect it with reasonable security measures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. DATA RETENTION</h2>
            <ul className={`list-disc pl-6 space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <li>Data stays while the bot is in your server</li>
              <li>Temporary data (like snipe) is deleted automatically</li>
              <li>Remove the bot to delete your server data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. YOUR RIGHTS</h2>
            <p className={`mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>You can:</p>
            <ul className={`list-disc pl-6 space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <li>Remove the bot anytime to delete server data</li>
              <li>Contact us with questions through our support server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. UPDATES</h2>
            <p className={isDark ? "text-gray-300" : "text-gray-700"}>
              We may update this policy. Continued use means you accept changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. CHILDREN</h2>
            <p className={isDark ? "text-gray-300" : "text-gray-700"}>The bot is not for users under 13.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">9. CONTACT</h2>
            <p className={isDark ? "text-gray-300" : "text-gray-700"}>
              Questions? Contact us through our support server.
            </p>
          </section>

          <section
            className={`p-6 rounded-lg ${isDark ? "bg-gray-900/50 border-white/10" : "bg-gray-100/50 border-black/10"} border`}
          >
            <p className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
              By using Eris, you agree to this Privacy Policy.
            </p>
          </section>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`mt-12 pt-8 border-t ${isDark ? "border-white/10" : "border-black/10"} text-center`}
        >
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Read our{" "}
            <Link href="/tos" className="underline hover:no-underline">
              Terms of Service
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
