export interface TranscriptMessage {
  id: string;
  author: {
    id: string;
    username: string;
    discriminator?: string;
    avatar_url: string;
    bot?: boolean;
  };
  content: string;
  timestamp: string;
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    content_type?: string;
    size?: number;
    width?: number;
    height?: number;
  }>;
  embeds?: Array<{
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    footer?: {
      text: string;
      icon_url?: string;
    };
    image?: {
      url: string;
    };
    thumbnail?: {
      url: string;
    };
    author?: {
      name: string;
      icon_url?: string;
    };
  }>;
  edited_timestamp?: string;
}

export interface TranscriptMetadata {
  ticket_id: string;
  guild_id: string;
  guild_name?: string;
  channel_id: string;
  channel_name: string;
  category?: string;
  creator: {
    id: string;
    username: string;
    discriminator?: string;
    avatar_url: string;
  };
  created_at: string;
  closed_at: string;
  closed_by?: {
    id: string;
    username: string;
    discriminator?: string;
    avatar_url: string;
  };
  participants?: Array<{
    id: string;
    username: string;
    discriminator?: string;
    avatar_url: string;
    bot?: boolean;
  }>;
  message_count: number;
}

export interface Transcript {
  id: string;
  metadata: TranscriptMetadata;
  messages: TranscriptMessage[];
  created_at: string;
}

export interface CreateTranscriptRequest {
  ticket_id: string;
  metadata: Omit<TranscriptMetadata, 'message_count'>;
  messages: TranscriptMessage[];
}

export interface CreateTranscriptResponse {
  success: boolean;
  id: string;
  url: string;
}
