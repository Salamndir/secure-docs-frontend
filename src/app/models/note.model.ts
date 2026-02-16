// 1. Note Interface: Represents the data coming FROM the backend
export interface NoteResponse {
  id: number;
  title: string;
  content: string;
  imageUrl?: string; // Optional because some notes might not have an image
  createdAt: string; // ISO Date String
  updatedAt: string;
}

// 2. NoteRequest Interface: Represents the data we SEND to the backend (JSON Part)
// Note: The file is sent separately in FormData, so it's not here.
export interface NoteRequest {
  title: string;
  content: string;
}