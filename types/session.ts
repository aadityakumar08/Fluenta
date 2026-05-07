export interface Turn {
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export type SessionState = 'idle' | 'user_speaking' | 'ai_thinking' | 'ai_speaking' | 'paused' | 'ended';

export interface Session {
  id: string;
  userId: string;
  personaId: string;
  transcript: Turn[];
  duration: number;
  startedAt: string;
  endedAt: string | null;
  fluencyScore?: number;
  confidenceScore?: number;
}
