export function calculateXP(sessionData: {
  durationMinutes: number;
  isChallenge: boolean;
  isPersonalBest: boolean;
}): number {
  let xp = 0;

  // Base XP for completing a session (minimum 3 minutes)
  if (sessionData.durationMinutes >= 3) {
    xp += 50;
  }

  // Bonus for challenge scenarios
  if (sessionData.isChallenge) {
    xp += 100;
  }

  // Personal best bonus
  if (sessionData.isPersonalBest) {
    xp += 75;
  }

  // Time bonus (+10 XP per minute over 5 minutes)
  if (sessionData.durationMinutes > 5) {
    xp += Math.floor(sessionData.durationMinutes - 5) * 10;
  }

  return xp;
}

export function checkStreak(lastSessionDate: string | null): {
  newStreak: number;
  streakBroken: boolean;
  currentStreak: number;
} {
  if (!lastSessionDate) {
    return { newStreak: 1, streakBroken: false, currentStreak: 1 };
  }

  const last = new Date(lastSessionDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastDay = last.toDateString();
  const todayStr = today.toDateString();
  const yesterdayStr = yesterday.toDateString();

  if (lastDay === todayStr) {
    // Already logged today
    return { newStreak: 0, streakBroken: false, currentStreak: 0 };
  }

  if (lastDay === yesterdayStr) {
    // Consecutive day
    return { newStreak: 1, streakBroken: false, currentStreak: 1 };
  }

  // Streak broken
  return { newStreak: 1, streakBroken: true, currentStreak: 1 };
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  check: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  totalSessions: number;
  streak: number;
  grammarErrors: number;
  fillerCount: number;
  uniquePersonas: number;
  confidenceScore: number;
  sessionDurationMinutes: number;
  levelUps: number;
  interviewerSessions: number;
}

export const achievementDefinitions: AchievementDef[] = [
  {
    id: 'first_session',
    title: 'First Words',
    description: 'Complete your first session',
    icon: '🎤',
    check: (s) => s.totalSessions >= 1,
  },
  {
    id: 'streak_3',
    title: 'On a Roll',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    check: (s) => s.streak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Unstoppable',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    check: (s) => s.streak >= 7,
  },
  {
    id: 'perfect_grammar',
    title: 'Grammar Guru',
    description: '0 grammar errors in a session',
    icon: '📝',
    check: (s) => s.totalSessions >= 1 && s.grammarErrors === 0,
  },
  {
    id: 'no_fillers',
    title: 'Clean Speaker',
    description: '0 filler words in a session',
    icon: '✨',
    check: (s) => s.totalSessions >= 1 && s.fillerCount === 0,
  },
  {
    id: 'all_personas',
    title: 'Social Butterfly',
    description: 'Try all 8 personas',
    icon: '🦋',
    check: (s) => s.uniquePersonas >= 8,
  },
  {
    id: 'level_up',
    title: 'Level Up',
    description: 'Advance a CEFR level',
    icon: '📈',
    check: (s) => s.levelUps >= 1,
  },
  {
    id: 'interview_ace',
    title: 'Interview Ace',
    description: 'Complete 5 interviewer sessions',
    icon: '💼',
    check: (s) => s.interviewerSessions >= 5,
  },
  {
    id: 'confident',
    title: 'Confident Speaker',
    description: 'Score 90+ confidence',
    icon: '💪',
    check: (s) => s.confidenceScore >= 90,
  },
  {
    id: 'marathon',
    title: 'Marathon',
    description: 'Complete a 30-minute session',
    icon: '🏃',
    check: (s) => s.sessionDurationMinutes >= 30,
  },
];
