
"use client"

import { useEffect } from 'react'
import { useSiteConfig } from '@/lib/site-config'

export default function DynamicFavicon() {
  const { config } = useSiteConfig()

  useEffect(() => {
    // Update favicon
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link')
    link.type = 'image/png'
    link.rel = 'icon'
    link.href = config.favicon
    document.head.appendChild(link)

    // Update title
    document.title = `${config.botName} - ${config.tagline}`
  }, [config])

  return null
}
