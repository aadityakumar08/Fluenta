'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { isSpeechRecognitionSupported, createSpeechRecognition } from '@/lib/speech';

type Stage = 'ready' | 'recording' | 'analyzing' | 'done';

export default function LevelCheckPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('ready');
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const analyzeTranscript = useCallback(async (text: string) => {
    setStage('analyzing');

    try {
      const { analyzeLevel } = await import('@/lib/gemini');
      const result = await analyzeLevel(text);

      if (typeof window !== 'undefined') {
        localStorage.setItem('fluenta_level', JSON.stringify(result));
        localStorage.setItem('fluenta_transcript', text);
      }

      router.push('/onboarding/complete');
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback: assign B1 level
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'fluenta_level',
          JSON.stringify({
            level: 'B1',
            strengths: ['Willingness to speak', 'Basic communication', 'Good effort'],
            focusAreas: ['Grammar', 'Vocabulary', 'Fluency'],
            recommendations: ['Practice daily with Friend persona', 'Focus on complete sentences', 'Try various scenarios'],
          })
        );
      }
      router.push('/onboarding/complete');
    }
  }, [router]);

  const startRecording = useCallback(() => {
    const recognition = createSpeechRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    let fullTranscript = '';

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        fullTranscript += final;
        setTranscript(fullTranscript);
      }
      setInterimText(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Restart if no speech detected
        try { recognition.start(); } catch {}
      }
    };

    recognition.onend = () => {
      // Auto-restart if still recording
      if (stage === 'recording' && timerRef.current) {
        try { recognition.start(); } catch {}
      }
    };

    recognition.start();
    setStage('recording');

    // Start countdown timer
    let remaining = 60;
    setTimeLeft(60);
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        stopRecording();
        analyzeTranscript(fullTranscript || transcript || 'The user spoke briefly.');
      }
    }, 1000);
  }, [stage, stopRecording, analyzeTranscript, transcript]);

  const handleFinishEarly = () => {
    stopRecording();
    const text = transcript || 'The user spoke briefly.';
    analyzeTranscript(text);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  if (!isSupported) {
    return (
      <div className="text-center">
        <div className="text-6xl mb-6">🎤</div>
        <h1 className="font-serif text-3xl text-warm-100 mb-4">Browser Not Supported</h1>
        <p className="text-warm-300 mb-8">
          Speech recognition requires Chrome, Edge, or Safari. Please switch browsers to continue.
        </p>
        <button
          onClick={() => router.push('/onboarding/complete')}
          className="px-6 py-3 bg-amber-400 text-midnight-900 font-semibold rounded-full hover:bg-amber-300 transition-colors"
        >
          Skip this step →
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {stage === 'ready' && (
          <>
            <h1 className="font-serif text-3xl md:text-4xl text-warm-100 mb-3">
              Tell us about yourself
            </h1>
            <p className="text-warm-300 mb-4">
              Speak freely for 60 seconds. Talk about anything — your hobbies, your day, your dreams.
            </p>
            <p className="text-sm text-warm-400 mb-10">
              We&apos;ll analyze your speech to personalize your experience.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              className="relative w-32 h-32 mx-auto rounded-full bg-midnight-700 border-4 border-amber-400/30
                         flex items-center justify-center hover:border-amber-400 transition-colors group"
            >
              {/* Breathing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 animate-breathe" />
              <svg className="w-12 h-12 text-amber-400 group-hover:text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </motion.button>
            <p className="text-sm text-warm-400 mt-4">Tap to start speaking</p>
          </>
        )}

        {stage === 'recording' && (
          <>
            <h1 className="font-serif text-3xl text-warm-100 mb-3">Listening...</h1>

            {/* Timer */}
            <div className="text-5xl font-mono text-amber-400 mb-8">
              0:{timeLeft.toString().padStart(2, '0')}
            </div>

            {/* Active mic button */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-amber-400/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </div>
            </div>

            {/* Transcript */}
            <div className="min-h-[120px] p-4 rounded-xl bg-midnight-800/50 text-left max-w-lg mx-auto">
              {transcript && <p className="text-warm-200 mb-1">{transcript}</p>}
              {interimText && <p className="text-warm-400 italic">{interimText}</p>}
              {!transcript && !interimText && (
                <p className="text-warm-400 italic">Start speaking... your words will appear here.</p>
              )}
            </div>

            <button
              onClick={handleFinishEarly}
              className="mt-6 px-6 py-3 border border-warm-400/30 text-warm-200 rounded-full
                         hover:border-amber-400/50 hover:text-amber-300 transition-all"
            >
              Finish early →
            </button>
          </>
        )}

        {stage === 'analyzing' && (
          <>
            <div className="text-6xl mb-6 animate-bounce">🔍</div>
            <h1 className="font-serif text-3xl text-warm-100 mb-3">
              Analyzing your English level...
            </h1>
            <p className="text-warm-300">This only takes a moment.</p>

            {/* Spinner */}
            <div className="mt-8 flex justify-center">
              <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
