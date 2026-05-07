import { CEFRLevel } from './user';

export interface FeedbackReport {
  id: string;
  sessionId: string;
  overallScore: number;
  overallGrade: 'A' | 'B' | 'C' | 'D';
  fluencyScore: number;
  confidenceScore: number;
  grammarScore: number;
  vocabLevel: CEFRLevel;
  hesitationCount: number;
  fillerCount: number;
  fillerWords: Record<string, number>;
  grammarFixes: GrammarFix[];
  vocabUpgrades: VocabUpgrade[];
  recommendations: Recommendation[];
  xpEarned: number;
  achievementsUnlocked: string[];
}

export interface GrammarFix {
  original: string;
  corrected: string;
  explanation: string;
}

export interface VocabUpgrade {
  basic: string;
  upgraded: string;
  context: string;
}

export interface Recommendation {
  title: string;
  description: string;
  scenarioId?: string;
}
