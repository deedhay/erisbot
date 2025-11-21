import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

export async function GET() {
  const session = await getServerSession() as Session;

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch guilds");
    }

    const userGuilds = await response.json();

    const statsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:5000'}/api/stats`);
    let botGuildIds: string[] = [];

    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      botGuildIds = stats.guild_ids || [];
    }

    const mutualGuilds = userGuilds.filter((guild: any) =>
      botGuildIds.includes(guild.id)
    );

    return NextResponse.json(mutualGuilds);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch guilds" }, { status: 500 });
  }
}
