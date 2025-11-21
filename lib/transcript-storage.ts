import type { Transcript } from "@/types/transcript";
import fs from "fs";
import path from "path";

const STORAGE_DIR = path.join(process.cwd(), ".transcripts");

function ensureStorageDir(): void {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

function getTranscriptPath(id: string): string {
  return path.join(STORAGE_DIR, `${id}.json`);
}

export function storeTranscript(id: string, transcript: Transcript): void {
  ensureStorageDir();
  const filePath = getTranscriptPath(id);
  fs.writeFileSync(filePath, JSON.stringify(transcript, null, 2), "utf-8");
}

export function getTranscript(id: string): Transcript | undefined {
  const filePath = getTranscriptPath(id);
  
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as Transcript;
  } catch (error) {
    console.error(`Error reading transcript ${id}:`, error);
    return undefined;
  }
}

export function getAllTranscripts(): Transcript[] {
  ensureStorageDir();
  
  try {
    const files = fs.readdirSync(STORAGE_DIR);
    const transcripts: Transcript[] = [];
    
    for (const file of files) {
      if (file.endsWith(".json")) {
        const id = file.replace(".json", "");
        const transcript = getTranscript(id);
        if (transcript) {
          transcripts.push(transcript);
        }
      }
    }
    
    return transcripts;
  } catch (error) {
    console.error("Error reading transcripts:", error);
    return [];
  }
}

export function deleteTranscript(id: string): boolean {
  const filePath = getTranscriptPath(id);
  
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting transcript ${id}:`, error);
    return false;
  }
}
