import { create } from 'zustand';
import { Persona } from '@/types/persona';
import { Turn, SessionState } from '@/types/session';

interface SessionStore {
  // Session state
  state: SessionState;
  persona: Persona | null;
  conversationHistory: Turn[];
  transcript: Turn[];
  sessionStartTime: Date | null;
  sessionDuration: number;

  // Live subtitles
  currentUserText: string;
  currentAiText: string;

  // Audio
  isMicActive: boolean;
  audioLevel: number;

  // User profile
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  userFears: string[];
  streak: number;
  xp: number;

  // Actions
  startSession: (persona: Persona) => void;
  setState: (state: SessionState) => void;
  setCurrentUserText: (text: string) => void;
  setCurrentAiText: (text: string) => void;
  addUserTurn: (text: string) => void;
  addAiTurn: (text: string) => void;
  endSession: () => void;
  togglePause: () => void;
  setMicActive: (active: boolean) => void;
  setAudioLevel: (level: number) => void;
  setSessionDuration: (duration: number) => void;
  setUserProfile: (level: 'beginner' | 'intermediate' | 'advanced', fears: string[]) => void;
  addXP: (amount: number) => void;
  setStreak: (streak: number) => void;
  reset: () => void;
}

const initialState = {
  state: 'idle' as SessionState,
  persona: null,
  conversationHistory: [],
  transcript: [],
  sessionStartTime: null,
  sessionDuration: 0,
  currentUserText: '',
  currentAiText: '',
  isMicActive: false,
  audioLevel: 0,
  userLevel: 'intermediate' as const,
  userFears: [],
  streak: 0,
  xp: 0,
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  ...initialState,

  startSession: (persona: Persona) =>
    set({
      state: 'idle',
      persona,
      conversationHistory: [],
      transcript: [],
      sessionStartTime: new Date(),
      sessionDuration: 0,
      currentUserText: '',
      currentAiText: '',
      isMicActive: false,
    }),

  setState: (state: SessionState) => set({ state }),

  setCurrentUserText: (text: string) => set({ currentUserText: text }),

  setCurrentAiText: (text: string) => set({ currentAiText: text }),

  addUserTurn: (text: string) => {
    const turn: Turn = { role: 'user', text, timestamp: Date.now() };
    set((s) => ({
      conversationHistory: [...s.conversationHistory.slice(-19), turn],
      transcript: [...s.transcript, turn],
      currentUserText: '',
    }));
  },

  addAiTurn: (text: string) => {
    const turn: Turn = { role: 'ai', text, timestamp: Date.now() };
    set((s) => ({
      conversationHistory: [...s.conversationHistory.slice(-19), turn],
      transcript: [...s.transcript, turn],
      currentAiText: text,
    }));
  },

  endSession: () =>
    set({
      state: 'ended',
      isMicActive: false,
    }),

  togglePause: () =>
    set((s) => ({
      state: s.state === 'paused' ? 'idle' : 'paused',
    })),

  setMicActive: (active: boolean) => set({ isMicActive: active }),

  setAudioLevel: (level: number) => set({ audioLevel: level }),

  setSessionDuration: (duration: number) => set({ sessionDuration: duration }),

  setUserProfile: (level, fears) => set({ userLevel: level, userFears: fears }),

  addXP: (amount: number) => set((s) => ({ xp: s.xp + amount })),

  setStreak: (streak: number) => set({ streak }),

  reset: () => set(initialState),
}));
