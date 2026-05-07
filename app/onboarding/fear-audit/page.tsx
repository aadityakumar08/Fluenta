'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const fears = [
  { id: 'judged', icon: '👀', label: 'Being judged by others' },
  { id: 'forgetting', icon: '🧠', label: 'Forgetting words mid-sentence' },
  { id: 'accent', icon: '🗣️', label: 'My accent or pronunciation' },
  { id: 'slow', icon: '🐢', label: 'Speaking too slowly' },
  { id: 'grammar', icon: '📝', label: 'Making grammar mistakes' },
  { id: 'understanding', icon: '👂', label: 'Not understanding the response' },
];

export default function FearAuditPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleFear = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    // Store in localStorage for now, will sync to Supabase after auth
    if (typeof window !== 'undefined') {
      localStorage.setItem('fluenta_fears', JSON.stringify(selected));
    }
  };

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-serif text-3xl md:text-4xl text-warm-100 mb-3">
          What makes you most nervous when speaking English?
        </h1>
        <p className="text-warm-300 mb-10">Select all that apply — this helps us personalize your experience.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {fears.map((fear, i) => {
          const isSelected = selected.includes(fear.id);
          return (
            <motion.button
              key={fear.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => toggleFear(fear.id)}
              className={`p-5 rounded-2xl text-left flex items-center gap-4 transition-all duration-300
                ${
                  isSelected
                    ? 'bg-amber-400/10 border-2 border-amber-400 scale-[1.02]'
                    : 'glass-card border-2 border-transparent hover:border-warm-400/20'
                }`}
            >
              <span className="text-3xl">{fear.icon}</span>
              <span className={`text-base font-medium ${isSelected ? 'text-amber-300' : 'text-warm-200'}`}>
                {fear.label}
              </span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-midnight-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/onboarding/level-check"
            onClick={handleContinue}
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 text-midnight-900
                       font-semibold rounded-full text-lg hover:bg-amber-300 transition-all duration-300"
          >
            Continue
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
