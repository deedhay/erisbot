import { NextResponse } from "next/server";

export const runtime = 'edge';

let cachedStats = {
  servers: 0,
  users: 0,
  uptime: "Offline",
  status: "Offline",
  guild_ids: [] as string[],
  lastUpdate: 0
};

export async function GET() {
  const now = Date.now();
  const timeSinceUpdate = now - cachedStats.lastUpdate;
  
  if (cachedStats.lastUpdate > 0 && timeSinceUpdate < 120000) {
    return NextResponse.json({
      ...cachedStats,
      status: "Online"
    });
  }
  
  return NextResponse.json({
    ...cachedStats,
    status: "Offline"
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    cachedStats = {
      ...data,
      guild_ids: data.guild_ids || [],
      lastUpdate: Date.now()
    };
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
