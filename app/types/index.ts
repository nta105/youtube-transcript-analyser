export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

export interface TranscriptResponse {
  transcript: TranscriptSegment[];
  videoId: string;
}

export interface ErrorResponse {
  error: string;
}

export interface SavedAnalysis {
  id: string;
  userId: string;
  videoId: string;
  videoTitle: string;
  analysis: string;
  transcript: string;
  createdAt: Date;
  updatedAt: Date;
} 