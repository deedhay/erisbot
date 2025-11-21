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
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Discord API error:", response.status, errorData);
      return NextResponse.json({ 
        error: "Need to re-login to access servers", 
        reason: "Missing guilds permission" 
      }, { status: 403 });
    }

    const userGuilds = await response.json();
    
    // Try to fetch bot's guilds from the stats endpoint
    let botGuildIds: string[] = [];
    try {
      const statsUrl = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/stats` : "http://localhost:5000/api/stats";
      const statsResponse = await fetch(statsUrl);
      
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        botGuildIds = stats.guild_ids || [];
      }
    } catch (statsError) {
      console.warn("Could not fetch bot stats:", statsError);
    }
    
    // If we have bot guild IDs, filter for mutual servers; otherwise return all user servers
    const mutualGuilds = botGuildIds.length > 0 
      ? userGuilds.filter((guild: any) => botGuildIds.includes(guild.id))
      : userGuilds;
    
    return NextResponse.json(mutualGuilds);
  } catch (error) {
    console.error("Guilds endpoint error:", error);
    return NextResponse.json({ error: "Failed to fetch guilds" }, { status: 500 });
  }
}
