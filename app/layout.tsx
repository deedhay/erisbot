import type React from "react"
import type { Metadata } from "next"
import { Providers } from "./providers"
import "./globals.css"
import DynamicFavicon from "./components/DynamicFavicon"

// Metadata dynamically loads botName and tagline from siteconfig.json
// Static metadata for SSR - will be enhanced on client side
export const metadata: Metadata = {
  title: "Eris Bot - Discord Bot",
  description:
    "A comprehensive Discord bot for server management, moderation, and engagement with 400+ commands across 30+ categories",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/eris-logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/eris-logo.png",
  },
  openGraph: {
    title: "Eris Bot - Discord Bot",
    description: "A comprehensive Discord bot for server management, moderation, and engagement",
    type: "website",
    images: ["/eris-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eris Bot - Discord Bot",
    description: "A comprehensive Discord bot for server management, moderation, and engagement",
    images: ["/eris-logo.png"],
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <DynamicFavicon />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}