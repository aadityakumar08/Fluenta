'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { personas } from '@/lib/personas';

/* ═══════════════════════════════════════════════════
   ANIMATED COUNTER — counts up numbers on scroll
   ═══════════════════════════════════════════════════ */

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      className="text-4xl md:text-5xl font-bold gradient-text-amber font-serif"
    >
      {isInView ? (
        <CountUpNumber target={target} />
      ) : (
        '0'
      )}
      {suffix}
    </motion.span>
  );
}

function CountUpNumber({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  if (typeof window !== 'undefined' && ref.current && !counted.current) {
    counted.current = true;
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (ref.current) {
        ref.current.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }

  return <span ref={ref}>0</span>;
}

/* ═══════════════════════════════════════════════════
   SCORE RING — animated SVG circle
   ═══════════════════════════════════════════════════ */

function ScoreRing({
  score,
  label,
  size = 100,
  delay = 0,
}: {
  score: number;
  label: string;
  size?: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center gap-2"
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(232,184,109,0.1)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8B86D"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={isInView ? offset : circumference}
          style={{
            transition: `stroke-dashoffset 1s ease-out ${delay}s`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-xl font-bold text-warm-100">{score}</span>
      </div>
      <span className="text-xs text-warm-300 uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   HERO WAVEFORM
   ═══════════════════════════════════════════════════ */

function HeroWaveform() {
  const bars = 20;
  const heights = [40, 60, 35, 80, 55, 90, 45, 70, 95, 50, 85, 65, 75, 42, 88, 58, 72, 48, 82, 62];

  return (
    <div className="flex items-center justify-center gap-[3px] h-[100px] md:h-[140px]">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="waveform-bar bg-amber-400"
          style={{
            height: `${heights[i]}%`,
            animationDelay: `${i * 0.07}s`,
            opacity: 0.6 + (heights[i] / 100) * 0.4,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION ANIMATIONS
   ═══════════════════════════════════════════════════ */

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.15 } },
  viewport: { once: true },
};

/* ═══════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-midnight-900 overflow-hidden">
      {/* ─── HERO SECTION ─── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,184,109,0.08)_0%,_transparent_70%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Waveform */}
          <div className="mb-10">
            <HeroWaveform />
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-warm-100 mb-6 tracking-tight leading-[1.1]">
            Talk. Get better.
            <br />
            <span className="gradient-text-amber">Repeat.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-warm-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI that listens, responds, and helps you speak English with confidence.
            No judgment. No textbooks. Just real conversation.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding/welcome"
              className="px-8 py-4 bg-amber-400 text-midnight-900 font-semibold rounded-full text-lg
                         hover:bg-amber-300 transition-all duration-300 animate-pulse-glow"
            >
              Start Speaking Free
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 border border-warm-400/30 text-warm-200 rounded-full text-lg
                         hover:border-amber-400/50 hover:text-amber-300 transition-all duration-300"
            >
              See how it works
            </a>
          </div>

          {/* No signup note */}
          <p className="text-sm text-warm-400 mt-6">
            No sign-up required for your first session
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-warm-400/30 rounded-full flex items-start justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── SOCIAL PROOF STRIP ─── */}
      <section className="py-16 border-y border-warm-400/10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <p className="text-warm-300 text-lg">
              Trusted by learners building confidence worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { target: 10000, suffix: '+', label: 'Active Learners' },
              { target: 40, suffix: '+', label: 'Countries' },
              { target: 50000, suffix: '+', label: 'Sessions Completed' },
              { target: 92, suffix: '%', label: 'Feel More Confident' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                <span className="text-sm text-warm-300">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Testimonial Avatars */}
          <div className="flex items-center justify-center mt-10 -space-x-3">
            {['MK', 'JS', 'AL', 'RP', 'TN'].map((initials, i) => (
              <div
                key={initials}
                className="w-10 h-10 rounded-full bg-midnight-600 border-2 border-midnight-800
                           flex items-center justify-center text-xs text-warm-200 font-medium"
                style={{ zIndex: 5 - i }}
              >
                {initials}
              </div>
            ))}
            <div className="ml-4 text-sm text-warm-300">
              &quot;Finally, an app that gets it.&quot;
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-warm-100 mb-4">
              Three steps to confidence
            </h2>
            <p className="text-warm-300 text-lg max-w-xl mx-auto">
              No complicated setup. No downloads. Just start talking.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '🎭',
                title: 'Choose your AI partner',
                description:
                  'Pick from 8 unique personas — a job interviewer, a casual friend, a debate partner, and more. Each one adapts to your level.',
              },
              {
                step: '02',
                icon: '🎤',
                title: 'Have a real conversation',
                description:
                  'Speak naturally. The AI listens, responds, and keeps the conversation flowing. It feels like talking to a real person.',
              },
              {
                step: '03',
                icon: '📊',
                title: 'Get detailed feedback',
                description:
                  'After every session, see your fluency score, grammar fixes, vocabulary upgrades, and personalized practice tips.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-card rounded-2xl p-8 text-center group hover:border-amber-400/20 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-amber-400 font-mono text-sm mb-2">{item.step}</div>
                <h3 className="font-serif text-2xl text-warm-100 mb-3">{item.title}</h3>
                <p className="text-warm-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PERSONA SHOWCASE ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-warm-100 mb-4">
              Meet your AI conversation partners
            </h2>
            <p className="text-warm-300 text-lg max-w-xl mx-auto">
              Each persona has a unique personality, conversation style, and teaching approach.
            </p>
          </motion.div>

          <div className="horizontal-scroll flex gap-6 pb-4">
            {personas.map((persona, i) => (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card glass-card-hover rounded-2xl p-6 min-w-[280px] max-w-[280px] cursor-pointer
                           flex flex-col gap-4 shrink-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${persona.color}15` }}
                  >
                    {persona.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-warm-100">{persona.name}</h3>
                    <p className="text-sm text-warm-300">{persona.role}</p>
                  </div>
                </div>
                <p className="text-sm text-warm-300 leading-relaxed flex-1">
                  {persona.description}
                </p>
                <div className="pt-2 border-t border-warm-400/10">
                  <p className="text-xs text-warm-400 italic">
                    &quot;{persona.topicSeeds[0]}&quot;
                  </p>
                </div>
                <Link
                  href="/onboarding/welcome"
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors mt-auto"
                >
                  Practice with {persona.name} →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEEDBACK PREVIEW ─── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-warm-100 mb-4">
              This is what you get after every session
            </h2>
            <p className="text-warm-300 text-lg max-w-xl mx-auto">
              Detailed, actionable feedback that shows you exactly how to improve.
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="glass-card rounded-3xl p-8 md:p-12"
          >
            {/* Score Rings */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 mb-12">
              {[
                { score: 78, label: 'Fluency' },
                { score: 82, label: 'Confidence' },
                { score: 71, label: 'Grammar' },
                { score: 85, label: 'Vocabulary' },
                { score: 3, label: 'Hesitations' },
                { score: 5, label: 'Fillers' },
              ].map((item, i) => (
                <div key={item.label} className="relative flex flex-col items-center">
                  <ScoreRing score={item.score} label={item.label} size={80} delay={i * 0.12} />
                </div>
              ))}
            </div>

            {/* Grammar Fix Example */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-warm-100 mb-4">Grammar Corrections</h3>
              {[
                {
                  wrong: 'I go to the meeting yesterday',
                  right: 'I went to the meeting yesterday',
                  why: 'Use past tense for completed actions',
                },
                {
                  wrong: 'She don\'t understand the problem',
                  right: 'She doesn\'t understand the problem',
                  why: 'Third-person singular requires "doesn\'t"',
                },
              ].map((fix, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex flex-col gap-1 p-4 rounded-xl bg-midnight-800/50"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✕</span>
                    <span className="text-warm-300 line-through">{fix.wrong}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="text-warm-100">{fix.right}</span>
                  </div>
                  <p className="text-xs text-warm-400 ml-6">📖 {fix.why}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── EMOTIONAL CTA ─── */}
      <section className="relative py-32 px-6">
        {/* Amber gradient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,184,109,0.06)_0%,_transparent_70%)]" />

        <motion.div
          {...fadeInUp}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-warm-100 mb-8 leading-tight">
            Your next job interview.
            <br />
            Your next presentation.
            <br />
            Your next conversation.
            <br />
            <span className="gradient-text-amber">Practice it here.</span>
          </h2>

          <Link
            href="/onboarding/welcome"
            className="inline-block px-10 py-5 bg-amber-400 text-midnight-900 font-semibold
                       rounded-full text-lg hover:bg-amber-300 transition-all duration-300
                       animate-pulse-glow"
          >
            Begin your first session
          </Link>

          <p className="text-sm text-warm-400 mt-6">No email required. Start speaking in 60 seconds.</p>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-6 border-t border-warm-400/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl gradient-text-amber">Fluenta</span>
          </div>
          <p className="text-sm text-warm-400">
            © 2025 Fluenta. Built for learners who want to speak without fear.
          </p>
        </div>
      </footer>
    </main>
  );
}
