import { NextResponse } from "next/server";
import { getTranscript } from "@/lib/transcript-storage";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const transcriptId = params.id;
    const transcript = getTranscript(transcriptId);

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transcript);
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
}
