export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  id: string;
  email: string;
  name: string;
  level: CEFRLevel;
  userLevel: UserLevel;
  fears: string[];
  createdAt: string;
  avatarUrl?: string;
}

export interface UserProgress {
  userId: string;
  xp: number;
  streak: number;
  lastSessionDate: string | null;
  freezeTokens: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}
