"use client"

import { useState } from "react"
import Navigation from "../components/Navigation"
import { motion } from "framer-motion"
import Link from "next/link"

export default function TOSPage() {
  const [isDark, setIsDark] = useState(true)

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <Navigation isDark={isDark} setIsDark={setIsDark} />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl font-bold mb-2">Terms of Service</h1>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-12`}>Last Updated: October 28, 2025</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`prose ${isDark ? "prose-invert" : ""} max-w-none`}
        >
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. ACCEPTANCE OF TERMS</h2>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                By inviting or using the Eris Discord bot ("the Bot"), you agree to these Terms of Service. If you do
                not agree, please remove the Bot from your server.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. DESCRIPTION OF SERVICE</h2>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                Eris is a Discord bot providing moderation, utility, fun, and automation features for Discord servers.
                The Bot is provided "as is" without warranties of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. USER RESPONSIBILITIES</h2>
              <ul className={`list-disc pl-6 space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                <li>You must have proper permissions to add the Bot to a Discord server</li>
                <li>You are responsible for how the Bot is configured and used in your server</li>
                <li>You must not use the Bot to violate Discord's Terms of Service or Community Guidelines</li>
                <li>You must not attempt to exploit, abuse, or damage the Bot's functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. PROHIBITED USES</h2>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>You may not use the Bot to:</p>
              <ul className={`list-disc pl-6 space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                <li>Harass, abuse, or harm other users</li>
                <li>Spread spam, malware, or malicious content</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Circumvent Discord's rate limits or other restrictions</li>
                <li>Impersonate others or provide false information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. MODERATION AND ENFORCEMENT</h2>
              <ul className={`list-disc pl-6 space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                <li>We reserve the right to blacklist servers or users who violate these terms</li>
                <li>The Bot may be removed from servers that misuse its features</li>
                <li>We are not responsible for moderation actions taken by server administrators using the Bot</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. DATA AND PRIVACY</h2>
              <ul className={`list-disc pl-6 space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                <li>The Bot collects and stores data necessary for its functionality</li>
                <li>
                  See our{" "}
                  <Link href="/privacy" className="underline hover:no-underline">
                    Privacy Policy
                  </Link>{" "}
                  for details on data collection and usage
                </li>
                <li>We do not sell or share your data with third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. AVAILABILITY AND MODIFICATIONS</h2>
              <ul className={`list-disc pl-6 space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                <li>We do not guarantee uninterrupted availability of the Bot</li>
                <li>The Bot may be updated, modified, or discontinued at any time</li>
                <li>Features may be added, changed, or removed without notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. LIMITATION OF LIABILITY</h2>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>To the maximum extent permitted by law:</p>
              <ul className={`list-disc pl-6 space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                <li>The Bot is provided without warranty of any kind</li>
                <li>We are not liable for any damages arising from use of the Bot</li>
                <li>We are not responsible for data loss, server issues, or service interruptions</li>
                <li>
                  Maximum liability is limited to the amount you paid to use the Bot (which is zero for free users)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. INTELLECTUAL PROPERTY</h2>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                All code, features, and content related to the Bot remain the property of its developers. You may not
                copy, modify, or redistribute the Bot's code without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">10. THIRD-PARTY SERVICES</h2>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                The Bot may integrate with third-party services (Discord, APIs, etc.). We are not responsible for these
                third-party services or their terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">11. TERMINATION</h2>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                We reserve the right to terminate access to the Bot for any reason, including violation of these terms.
                You may stop using the Bot at any time by removing it from your server.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">12. CHANGES TO TERMS</h2>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                We may update these Terms of Service at any time. Continued use of the Bot after changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">13. CONTACT</h2>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                For questions about these Terms of Service, please contact us through our support server.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">14. GOVERNING LAW</h2>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                These terms are governed by applicable law. Disputes will be resolved in accordance with the laws of the
                jurisdiction where the Bot operators are located.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">15. SEVERABILITY</h2>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                If any provision of these terms is found unenforceable, the remaining provisions will continue in full
                effect.
              </p>
            </section>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`mt-12 pt-8 border-t ${isDark ? "border-white/10" : "border-black/10"} text-center`}
        >
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Read our{" "}
            <Link href="/privacy" className="underline hover:no-underline">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
