'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSessionStore } from '@/stores/sessionStore';
import { personas, getPersonaById, buildSystemPrompt } from '@/lib/personas';
import { generateConversationResponse } from '@/lib/gemini';
import { createSpeechRecognition, isSpeechRecognitionSupported, createUtterance, isSpeechSynthesisSupported } from '@/lib/speech';
import { Persona } from '@/types/persona';
import { Suspense } from 'react';

/* ═══════════════════════════════════════════════════
   WAVEFORM COMPONENT
   ═══════════════════════════════════════════════════ */

function Waveform({ state, audioLevel }: { state: string; audioLevel: number }) {
  const bars = 30;

  return (
    <div className="flex items-center justify-center gap-[3px] h-[120px] md:h-[180px]">
      {Array.from({ length: bars }).map((_, i) => {
        const baseHeight = 20 + Math.sin(i * 0.5) * 15;
        const dynamicHeight =
          state === 'user_speaking' || state === 'ai_speaking'
            ? baseHeight + audioLevel * 60 + Math.random() * 20
            : baseHeight;

        const color =
          state === 'ai_speaking'
            ? '#E8B86D'
            : state === 'user_speaking'
            ? '#F0EBE3'
            : 'rgba(232,184,109,0.3)';

        return (
          <div
            key={i}
            className={`rounded-full transition-all ${
              state === 'idle' || state === 'paused' ? 'waveform-bar' : ''
            }`}
            style={{
              width: '4px',
              height: `${Math.min(95, dynamicHeight)}%`,
              backgroundColor: color,
              animationDelay: `${i * 0.06}s`,
              transition: 'height 0.1s ease-out, background-color 0.3s ease',
            }}
          />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PERSONA AVATAR
   ═══════════════════════════════════════════════════ */

function PersonaAvatar({ persona, state }: { persona: Persona; state: string }) {
  return (
    <motion.div
      animate={{
        rotate: state === 'ai_thinking' ? [0, 5, -5, 0] : 0,
        scale: state === 'ai_speaking' ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: state === 'ai_thinking' ? 0.3 : 1.5,
        repeat: state === 'ai_thinking' || state === 'ai_speaking' ? Infinity : 0,
      }}
      className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl
                  transition-shadow duration-500
                  ${state === 'ai_speaking' ? 'amber-glow-strong' : ''}`}
      style={{ backgroundColor: `${persona.color}20`, border: `2px solid ${persona.color}40` }}
    >
      {persona.icon}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   SUBTITLES
   ═══════════════════════════════════════════════════ */

function Subtitles({
  userText,
  aiText,
  state,
}: {
  userText: string;
  aiText: string;
  state: string;
}) {
  return (
    <div className="min-h-[80px] max-w-2xl mx-auto text-center px-4">
      <AnimatePresence mode="wait">
        {state === 'user_speaking' && userText && (
          <motion.p
            key="user"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-lg text-warm-100"
          >
            {userText}
          </motion.p>
        )}
        {(state === 'ai_speaking' || state === 'ai_thinking') && aiText && (
          <motion.p
            key="ai"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-lg text-amber-400"
          >
            {aiText}
          </motion.p>
        )}
        {state === 'ai_thinking' && !aiText && (
          <motion.p
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-lg text-warm-400"
          >
            {/* Thinking animation */}
            ● ● ●
          </motion.p>
        )}
        {state === 'idle' && (
          <motion.p
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-warm-400"
          >
            Tap the microphone to speak
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PERSONA SELECTOR MODAL
   ═══════════════════════════════════════════════════ */

function PersonaSelector({ onSelect }: { onSelect: (p: Persona) => void }) {
  return (
    <div className="min-h-screen bg-midnight-900 flex flex-col items-center justify-center px-6">
      <h1 className="font-serif text-3xl md:text-4xl text-warm-100 mb-3 text-center">
        Choose your conversation partner
      </h1>
      <p className="text-warm-300 mb-10 text-center">Each persona has a unique style and approach.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl w-full">
        {personas.map((persona) => (
          <motion.button
            key={persona.id}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(persona)}
            className="glass-card rounded-2xl p-5 text-left transition-all duration-300
                       hover:border-amber-400/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${persona.color}15` }}
              >
                {persona.icon}
              </div>
              <div>
                <p className="font-semibold text-warm-100">{persona.name}</p>
                <p className="text-xs text-warm-400">{persona.role}</p>
              </div>
            </div>
            <p className="text-xs text-warm-300 line-clamp-2">{persona.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN SESSION PAGE CONTENT
   ═══════════════════════════════════════════════════ */

function SessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useSessionStore();
  const [elapsed, setElapsed] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const lastAiTextRef = useRef('');

  // Auto-select persona from query param
  useEffect(() => {
    const personaId = searchParams.get('persona');
    if (personaId && !store.persona) {
      const p = getPersonaById(personaId);
      if (p) store.startSession(p);
    }
  }, [searchParams, store]);

  // Session timer
  useEffect(() => {
    if (store.persona && store.state !== 'ended') {
      const timer = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [store.persona, store.state]);

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start listening (speech recognition)
  const startListening = useCallback(() => {
    if (!isSpeechRecognitionSupported()) return;

    const recognition = createSpeechRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    store.setState('user_speaking');
    store.setMicActive(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      let interimText = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      store.setCurrentUserText(interimText || finalText);

      if (finalText) {
        handleUserFinished(finalText);
      }
    };

    recognition.onerror = () => {
      store.setState('idle');
      store.setMicActive(false);
    };

    recognition.onend = () => {
      store.setMicActive(false);
    };

    recognition.start();
  }, [store]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    store.setMicActive(false);
  }, [store]);

  // Handle when user finishes speaking
  const handleUserFinished = useCallback(
    async (text: string) => {
      stopListening();
      store.addUserTurn(text);
      store.setState('ai_thinking');
      store.setCurrentAiText('');

      try {
        const systemPrompt = buildSystemPrompt(
          store.persona!,
          store.userLevel,
          store.userFears
        );

        const allTurns = [
          ...store.conversationHistory,
          { role: 'user' as const, text, timestamp: Date.now() },
        ];

        const response = await generateConversationResponse(
          allTurns.map((t) => ({ role: t.role, text: t.text })),
          systemPrompt
        );

        store.addAiTurn(response);
        store.setState('ai_speaking');
        lastAiTextRef.current = response;

        // Speak the response
        if (isSpeechSynthesisSupported()) {
          const utterance = createUtterance(response, store.persona!.voiceConfig);
          utterance.onend = () => {
            store.setState('idle');
          };
          utterance.onerror = () => {
            store.setState('idle');
          };
          window.speechSynthesis.speak(utterance);
        } else {
          // No TTS — just show text
          setTimeout(() => store.setState('idle'), 2000);
        }
      } catch (error) {
        console.error('AI response failed:', error);
        store.setCurrentAiText("Sorry, I'm having trouble connecting. Let's try again.");
        store.setState('idle');
      }
    },
    [store, stopListening]
  );

  // Replay last AI sentence
  const replayLast = useCallback(() => {
    if (lastAiTextRef.current && isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
      const utterance = createUtterance(lastAiTextRef.current, store.persona!.voiceConfig);
      store.setState('ai_speaking');
      utterance.onend = () => store.setState('idle');
      window.speechSynthesis.speak(utterance);
    }
  }, [store]);

  // End session
  const handleEndSession = useCallback(() => {
    stopListening();
    window.speechSynthesis?.cancel();
    store.endSession();

    // Save session data and redirect to feedback
    const sessionId = Date.now().toString();
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `fluenta_session_${sessionId}`,
        JSON.stringify({
          persona: store.persona,
          transcript: store.transcript,
          duration: elapsed,
          startedAt: store.sessionStartTime?.toISOString(),
        })
      );
    }
    router.push(`/feedback/${sessionId}`);
  }, [store, stopListening, elapsed, router]);

  // Toggle mic
  const toggleMic = useCallback(() => {
    if (store.state === 'user_speaking') {
      stopListening();
      store.setState('idle');
    } else if (store.state === 'idle') {
      startListening();
    }
  }, [store, startListening, stopListening]);

  // Persona selection screen
  if (!store.persona) {
    return (
      <PersonaSelector
        onSelect={(p) => {
          store.startSession(p);
          // Trigger AI greeting
          setTimeout(async () => {
            store.setState('ai_thinking');
            try {
              const systemPrompt = buildSystemPrompt(p, store.userLevel, store.userFears);
              const greeting = await generateConversationResponse([], systemPrompt);
              store.addAiTurn(greeting);
              store.setState('ai_speaking');
              lastAiTextRef.current = greeting;

              if (isSpeechSynthesisSupported()) {
                const utterance = createUtterance(greeting, p.voiceConfig);
                utterance.onend = () => store.setState('idle');
                window.speechSynthesis.speak(utterance);
              } else {
                setTimeout(() => store.setState('idle'), 3000);
              }
            } catch {
              store.setCurrentAiText(`Hi there! I'm ${p.name}. How are you today?`);
              store.addAiTurn(`Hi there! I'm ${p.name}. How are you today?`);
              store.setState('idle');
            }
          }, 500);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-midnight-900 flex flex-col">
      {/* ─── TOP BAR ─── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-warm-400/10">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${store.persona.color}15` }}
          >
            {store.persona.icon}
          </div>
          <div>
            <span className="text-sm font-medium text-warm-100">{store.persona.name}</span>
            <span className="text-xs text-warm-400 ml-2">{store.persona.role}</span>
          </div>
        </div>

        <div className="text-lg font-mono text-warm-300">{formatTime(elapsed)}</div>

        <button
          onClick={handleEndSession}
          className="px-4 py-2 text-sm text-warm-400 border border-warm-400/20 rounded-full
                     hover:text-red-400 hover:border-red-400/30 transition-colors"
        >
          End Session
        </button>
      </div>

      {/* ─── MAIN AREA ─── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
        {/* Avatar */}
        <PersonaAvatar persona={store.persona} state={store.state} />

        {/* Waveform */}
        <Waveform state={store.state} audioLevel={store.audioLevel} />

        {/* Subtitles */}
        <Subtitles
          userText={store.currentUserText}
          aiText={store.currentAiText}
          state={store.state}
        />
      </div>

      {/* ─── BOTTOM CONTROLS ─── */}
      <div className="flex items-center justify-center gap-6 pb-10 pt-4">
        {/* Pause */}
        <button
          onClick={() => store.togglePause()}
          className="w-12 h-12 rounded-full bg-midnight-700 border border-warm-400/20
                     flex items-center justify-center text-warm-300 hover:text-warm-100
                     hover:border-warm-400/40 transition-all"
          title="Pause"
        >
          {store.state === 'paused' ? '▶' : '⏸'}
        </button>

        {/* Mic Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMic}
          disabled={store.state === 'ai_speaking' || store.state === 'ai_thinking'}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center
                     transition-all duration-300
            ${
              store.state === 'user_speaking'
                ? 'bg-amber-400/20 border-4 border-amber-400'
                : store.state === 'ai_speaking' || store.state === 'ai_thinking'
                ? 'bg-midnight-700 border-4 border-warm-400/20 opacity-50 cursor-not-allowed'
                : 'bg-midnight-700 border-4 border-warm-400/30 hover:border-amber-400/50'
            }`}
        >
          {store.state === 'user_speaking' && (
            <div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping opacity-20" />
          )}
          <svg
            className={`w-8 h-8 ${store.state === 'user_speaking' ? 'text-amber-400' : 'text-warm-200'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </motion.button>

        {/* Replay */}
        <button
          onClick={replayLast}
          className="w-12 h-12 rounded-full bg-midnight-700 border border-warm-400/20
                     flex items-center justify-center text-warm-300 hover:text-warm-100
                     hover:border-warm-400/40 transition-all"
          title="Replay last"
        >
          🔄
        </button>
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-midnight-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      </div>
    }>
      <SessionContent />
    </Suspense>
  );
}
