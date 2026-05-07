import { Session } from '@/types/session';

export function calculateTrend(
  sessions: { date: string; score: number }[]
): { date: string; score: number }[] {
  return sessions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14);
}

export function calculateAverageScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function getSessionStats(sessions: Session[]) {
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
  const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
  const fluencyScores = sessions
    .filter((s) => s.fluencyScore !== undefined)
    .map((s) => s.fluencyScore!);
  const avgFluency = calculateAverageScore(fluencyScores);
  const bestScore = fluencyScores.length > 0 ? Math.max(...fluencyScores) : 0;

  return {
    totalSessions,
    totalDuration,
    avgDuration,
    avgFluency,
    bestScore,
  };
}

export function getWeaknessAnalysis(
  grammarFixes: { original: string; corrected: string; explanation: string }[]
): { category: string; count: number }[] {
  const categories: Record<string, number> = {};

  for (const fix of grammarFixes) {
    const explanation = fix.explanation.toLowerCase();
    if (explanation.includes('tense')) {
      categories['Verb Tenses'] = (categories['Verb Tenses'] || 0) + 1;
    } else if (explanation.includes('article') || explanation.includes('a/an/the')) {
      categories['Articles'] = (categories['Articles'] || 0) + 1;
    } else if (explanation.includes('preposition')) {
      categories['Prepositions'] = (categories['Prepositions'] || 0) + 1;
    } else if (explanation.includes('subject') || explanation.includes('verb agreement')) {
      categories['Subject-Verb Agreement'] = (categories['Subject-Verb Agreement'] || 0) + 1;
    } else {
      categories['Other'] = (categories['Other'] || 0) + 1;
    }
  }

  return Object.entries(categories)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
