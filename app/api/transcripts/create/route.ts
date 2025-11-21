import { NextResponse } from "next/server";
import type { CreateTranscriptRequest, CreateTranscriptResponse, Transcript } from "@/types/transcript";
import { storeTranscript } from "@/lib/transcript-storage";

function generateTranscriptId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    const data: CreateTranscriptRequest = await request.json();
    
    if (!data.ticket_id || !data.messages || !data.metadata) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transcriptId = generateTranscriptId();
    const now = new Date().toISOString();
    
    const transcript: Transcript = {
      id: transcriptId,
      metadata: {
        ...data.metadata,
        message_count: data.messages.length,
      },
      messages: data.messages,
      created_at: now,
    };

    storeTranscript(transcriptId, transcript);

    const baseUrl = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:5000';
    const transcriptUrl = `${baseUrl}/transcripts/${transcriptId}`;

    const response: CreateTranscriptResponse = {
      success: true,
      id: transcriptId,
      url: transcriptUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating transcript:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create transcript" },
      { status: 500 }
    );
  }
}
