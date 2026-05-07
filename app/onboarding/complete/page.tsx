'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface LevelResult {
  level: string;
  strengths: string[];
  focusAreas: string[];
  recommendations: string[];
}

const levelNames: Record<string, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper Intermediate',
  C1: 'Advanced',
  C2: 'Proficient',
};

export default function CompletePage() {
  const [result, setResult] = useState<LevelResult | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Load result from localStorage
    const stored = localStorage.getItem('fluenta_level');
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      setResult({
        level: 'B1',
        strengths: ['Good communication basics', 'Willing to practice', 'Clear speech'],
        focusAreas: ['Grammar accuracy', 'Vocabulary range', 'Confidence'],
        recommendations: ['Start with the Friend persona', 'Practice daily for 10 minutes', 'Focus on speaking freely'],
      });
    }

    // Confetti!
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E8B86D', '#F2CC8A', '#F8E4BB', '#4ADE80'],
      });
      setShowContent(true);
    }, 600);
  }, []);

  if (!result) return null;

  return (
    <div className="text-center">
      {/* Level Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-400/10 border-2 border-amber-400/30">
          <span className="text-5xl font-serif gradient-text-amber">{result.level}</span>
          <div className="text-left">
            <span className="text-sm text-warm-400">Your level</span>
            <p className="text-lg text-warm-100 font-semibold">
              {levelNames[result.level] || 'Intermediate'}
            </p>
          </div>
        </div>
      </motion.div>

      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Strengths */}
          <div className="mb-8">
            <h2 className="font-serif text-xl text-warm-100 mb-3">Your strengths 💪</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {result.strengths.map((s, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm border border-green-500/20"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>

          {/* What we'll work on */}
          <div className="mb-10">
            <h2 className="font-serif text-xl text-warm-100 mb-4">Here&apos;s what we&apos;ll work on</h2>
            <div className="space-y-3 max-w-md mx-auto text-left">
              {result.recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-midnight-800/50"
                >
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span className="text-warm-200">{rec}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 text-midnight-900
                       font-semibold rounded-full text-lg hover:bg-amber-300 transition-all duration-300
                       animate-pulse-glow"
          >
            Start your first session
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
