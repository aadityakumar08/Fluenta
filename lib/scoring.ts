const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 'right', 'so', 'well', 'I mean'];

export function countFillerWords(text: string): Record<string, number> {
  const lower = text.toLowerCase();
  const counts: Record<string, number> = {};

  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches && matches.length > 0) {
      counts[filler] = matches.length;
    }
  }

  return counts;
}

export function getTotalFillerCount(fillerWords: Record<string, number>): number {
  return Object.values(fillerWords).reduce((sum, count) => sum + count, 0);
}

export function estimateHesitations(text: string): number {
  // Count self-corrections (indicated by "I mean", dashes, or repeated words)
  let count = 0;
  const patterns = [
    /\b(\w+)\s+\1\b/gi, // repeated words
    /--/g, // dashes indicating pauses
    /\.\.\./g, // ellipsis
    /\bI mean\b/gi, // self-correction marker
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) count += matches.length;
  }

  return count;
}

export function calculateFluencyScore(data: {
  wordsPerMinute: number;
  fillerRatio: number;
  hesitations: number;
  sentenceCompletionRate: number;
}): number {
  let score = 50;

  // WPM factor (ideal: 120-150 for non-native)
  if (data.wordsPerMinute >= 100 && data.wordsPerMinute <= 170) {
    score += 20;
  } else if (data.wordsPerMinute >= 70) {
    score += 10;
  }

  // Filler word penalty
  score -= Math.min(20, data.fillerRatio * 100);

  // Hesitation penalty
  score -= Math.min(15, data.hesitations * 3);

  // Sentence completion bonus
  score += data.sentenceCompletionRate * 15;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateConfidenceScore(data: {
  averageResponseLength: number;
  responseTimeMs: number;
  fillerCount: number;
  hesitations: number;
}): number {
  let score = 50;

  // Longer responses suggest more confidence
  if (data.averageResponseLength > 20) score += 20;
  else if (data.averageResponseLength > 10) score += 10;

  // Quick responses suggest confidence
  if (data.responseTimeMs < 3000) score += 15;
  else if (data.responseTimeMs < 5000) score += 5;

  // Low filler words
  if (data.fillerCount <= 2) score += 10;
  else score -= Math.min(10, data.fillerCount * 2);

  // Low hesitations
  if (data.hesitations <= 1) score += 5;
  else score -= Math.min(10, data.hesitations * 3);

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getOverallGrade(score: number): 'A' | 'B' | 'C' | 'D' {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}
