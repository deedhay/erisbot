
import { useState, useEffect } from 'react';

export interface SiteConfig {
  botName: string;
  botLogo: string;
  favicon: string;
  tagline: string;
  inviteLink: string;
}

const defaultConfig: SiteConfig = {
  botName: process.env.NEXT_PUBLIC_BOT_NAME || "Eris Bot",
  botLogo: process.env.NEXT_PUBLIC_BOT_LOGO || "/eris-logo.png",
  favicon: process.env.NEXT_PUBLIC_FAVICON || "/favicon.png",
  tagline: process.env.NEXT_PUBLIC_BOT_TAGLINE || "Systematically does it all",
  inviteLink: process.env.NEXT_PUBLIC_BOT_INVITE_LINK || "https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID"
};

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/siteconfig.json')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load site config:', err);
        setLoading(false);
      });
  }, []);

  return { config, loading };
}
