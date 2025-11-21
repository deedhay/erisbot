import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions) as any;
  
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Fetch user's guilds
    const userResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.text();
      console.error("Discord API error:", userResponse.status, errorData);
      return NextResponse.json({ 
        error: "Need to re-login to access servers", 
        reason: "Missing guilds permission" 
      }, { status: 403 });
    }

    const userGuilds = await userResponse.json();
    
    // Try to fetch bot's guilds - first from stats endpoint, then from Discord API
    let botGuildIds: string[] = [];
    
    // First try: stats endpoint (if bot is online)
    try {
      const statsUrl = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/stats` : "http://localhost:5000/api/stats";
      const statsResponse = await fetch(statsUrl, { signal: AbortSignal.timeout(5000) });
      
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        botGuildIds = stats.guild_ids || [];
      }
    } catch (statsError) {
      console.warn("Bot stats endpoint unavailable, trying Discord API...");
      
      // Fallback: Query Discord API directly for bot's guilds using bot token
      if (process.env.DISCORD_BOT_TOKEN) {
        try {
          const botGuildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
            headers: {
              Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
          });
          
          if (botGuildsResponse.ok) {
            const botGuilds = await botGuildsResponse.json();
            botGuildIds = botGuilds.map((guild: any) => guild.id);
            console.log("Got bot guilds from Discord API:", botGuildIds.length);
          }
        } catch (discordError) {
          console.warn("Could not fetch bot guilds from Discord API:", discordError);
        }
      }
    }
    
    // Filter for mutual servers (where both user and bot are members)
    const mutualGuilds = botGuildIds.length > 0 
      ? userGuilds.filter((guild: any) => botGuildIds.includes(guild.id))
      : userGuilds;
    
    return NextResponse.json(mutualGuilds);
  } catch (error) {
    console.error("Guilds endpoint error:", error);
    return NextResponse.json({ error: "Failed to fetch guilds" }, { status: 500 });
  }
}
