'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="text-center relative">
      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-6xl mb-8">👋</div>

        <h1 className="font-serif text-4xl md:text-5xl text-warm-100 mb-4">
          Let&apos;s get to know you.
        </h1>

        <p className="text-lg text-warm-300 mb-12">
          This takes about 2 minutes. No forms. No typing.
        </p>

        <Link
          href="/onboarding/fear-audit"
          className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 text-midnight-900
                     font-semibold rounded-full text-lg hover:bg-amber-300
                     transition-all duration-300 animate-pulse-glow"
        >
          Let&apos;s go
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}
