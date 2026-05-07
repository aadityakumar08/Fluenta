'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface SessionData {
  persona: { name: string; icon: string; role: string; color: string };
  transcript: { role: string; text: string }[];
  duration: number;
  startedAt: string;
}

interface FeedbackData {
  overallScore: number;
  fluencyScore: number;
  confidenceScore: number;
  grammarScore: number;
  vocabLevel: string;
  hesitationCount: number;
  fillerCount: number;
  fillerWords: Record<string, number>;
  grammarFixes: { original: string; corrected: string; explanation: string }[];
  vocabUpgrades: { basic: string; upgraded: string; context: string }[];
  recommendations: { title: string; description: string }[];
}

function ScoreRing({ value, max, label, size = 90, delay = 0 }: {
  value: number; max: number; label: string; size?: number; delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const radius = (size - 8) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / max) * circ;

  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.5 }} className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(232,184,109,0.1)" strokeWidth="4"/>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E8B86D" strokeWidth="4"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={isInView ? offset : circ}
            style={{ transition: `stroke-dashoffset 1.2s ease-out ${delay}s` }}/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-warm-100">{value}</span>
        </div>
      </div>
      <span className="text-xs text-warm-300 uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

function getGrade(s: number) { return s >= 85 ? 'A' : s >= 70 ? 'B' : s >= 50 ? 'C' : 'D'; }
function getGradeColor(g: string) {
  return g === 'A' ? 'text-green-400' : g === 'B' ? 'text-amber-400' : g === 'C' ? 'text-orange-400' : 'text-red-400';
}

const mockFeedback: FeedbackData = {
  overallScore: 72, fluencyScore: 68, confidenceScore: 75, grammarScore: 65,
  vocabLevel: 'B1', hesitationCount: 4, fillerCount: 6,
  fillerWords: { um: 3, like: 2, 'you know': 1 },
  grammarFixes: [
    { original: 'I go yesterday', corrected: 'I went yesterday', explanation: 'Use past tense for completed actions' },
    { original: "She don't like", corrected: "She doesn't like", explanation: "Third-person singular requires doesn't" },
  ],
  vocabUpgrades: [
    { basic: 'good', upgraded: 'excellent', context: 'Describing performance' },
    { basic: 'said', upgraded: 'mentioned', context: 'Referring to speech' },
    { basic: 'big', upgraded: 'significant', context: 'Describing importance' },
  ],
  recommendations: [
    { title: 'Practice Past Tense', description: 'Focus on irregular past tense verbs in daily conversations' },
    { title: 'Reduce Filler Words', description: 'Pause instead of saying "um" — silence sounds confident' },
    { title: 'Expand Vocabulary', description: 'Learn 5 new formal synonyms each day' },
  ],
};

export default function FeedbackPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<SessionData | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const stored = localStorage.getItem(`fluenta_session_${sessionId}`);
      if (stored) {
        const sd: SessionData = JSON.parse(stored);
        setSession(sd);
        try {
          const { analyzeSession } = await import('@/lib/gemini');
          const analysis = await analyzeSession(sd.transcript, sd.persona.name);
          setFeedback(analysis as unknown as FeedbackData);
        } catch { setFeedback(mockFeedback); }
      } else {
        setSession({ persona: { name: 'Jamie', icon: '😊', role: 'Casual Friend', color: '#4ADE80' }, transcript: [], duration: 480, startedAt: new Date().toISOString() });
        setFeedback(mockFeedback);
      }
      setLoading(false);
      setTimeout(() => { confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 }, colors: ['#E8B86D', '#F2CC8A', '#4ADE80'] }); }, 1000);
    }
    load();
  }, [sessionId]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"/></div>;
  if (!feedback || !session) return null;

  const grade = getGrade(feedback.overallScore);
  const dur = `${Math.floor(session.duration/60)}:${(session.duration%60).toString().padStart(2,'0')}`;

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="text-center pt-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-2xl">{session.persona.icon}</span>
          <span className="text-warm-300">Session with {session.persona.name}</span>
          <span className="text-warm-400">•</span>
          <span className="text-warm-400">{dur}</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-warm-100 mb-6">Here&apos;s how you did</h1>
        <motion.div initial={{ opacity:0,scale:0 }} animate={{ opacity:1,scale:1 }} transition={{ type:'spring',bounce:0.5,delay:0.3 }}>
          <div className={`text-8xl font-serif ${getGradeColor(grade)}`}>{grade}</div>
          <p className="text-warm-300 mt-1">{feedback.overallScore}/100 overall</p>
        </motion.div>
      </motion.div>

      {/* Scores */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          <ScoreRing value={feedback.fluencyScore} max={100} label="Fluency" delay={0.1}/>
          <ScoreRing value={feedback.confidenceScore} max={100} label="Confidence" delay={0.2}/>
          <ScoreRing value={feedback.grammarScore} max={100} label="Grammar" delay={0.3}/>
          <div className="flex flex-col items-center gap-2">
            <div className="w-[90px] h-[90px] rounded-full border-4 border-amber-400/20 flex items-center justify-center">
              <span className="text-lg font-bold text-amber-400">{feedback.vocabLevel}</span>
            </div>
            <span className="text-xs text-warm-300 uppercase tracking-wider">Vocab</span>
          </div>
          <ScoreRing value={feedback.hesitationCount} max={20} label="Hesitations" delay={0.5}/>
          <ScoreRing value={feedback.fillerCount} max={20} label="Fillers" delay={0.6}/>
        </div>
      </div>

      {/* Grammar */}
      {feedback.grammarFixes.length > 0 && <div>
        <h2 className="font-serif text-2xl text-warm-100 mb-4">Fixes that will make you sound more natural</h2>
        <div className="space-y-3">
          {feedback.grammarFixes.map((fix,i) => (
            <motion.div key={i} initial={{ opacity:0,x:-20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }} className="glass-card rounded-xl p-5 space-y-2">
              <div className="flex items-start gap-2"><span className="text-red-400 mt-0.5 shrink-0">✕</span><span className="text-warm-300 line-through">{fix.original}</span></div>
              <div className="flex items-start gap-2"><span className="text-green-400 mt-0.5 shrink-0">✓</span><span className="text-warm-100 font-medium">{fix.corrected}</span></div>
              <p className="text-xs text-warm-400 ml-6">📖 {fix.explanation}</p>
            </motion.div>
          ))}
        </div>
      </div>}

      {/* Vocab Upgrades */}
      {feedback.vocabUpgrades.length > 0 && <div>
        <h2 className="font-serif text-2xl text-warm-100 mb-4">Level up your vocabulary</h2>
        <div className="space-y-3">
          {feedback.vocabUpgrades.map((u,i) => (
            <motion.div key={i} initial={{ opacity:0,y:10 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }} className="flex items-center gap-4 p-4 glass-card rounded-xl">
              <span className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-300 text-sm border border-red-500/20">{u.basic}</span>
              <span className="text-warm-400">→</span>
              <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-300 text-sm border border-green-500/20">{u.upgraded}</span>
              <span className="text-xs text-warm-400 ml-auto hidden sm:block">{u.context}</span>
            </motion.div>
          ))}
        </div>
      </div>}

      {/* Fillers */}
      {Object.keys(feedback.fillerWords).length > 0 && <div>
        <h2 className="font-serif text-2xl text-warm-100 mb-4">Filler word analysis</h2>
        <div className="glass-card rounded-xl p-6 flex flex-wrap items-center justify-center gap-4">
          {Object.entries(feedback.fillerWords).sort(([,a],[,b])=>b-a).map(([w,c])=>(
            <span key={w} className="px-4 py-2 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20"
              style={{ fontSize:`${Math.max(14,Math.min(28,c*8))}px` }}>&quot;{w}&quot; ×{c}</span>
          ))}
        </div>
      </div>}

      {/* Recommendations */}
      <div>
        <h2 className="font-serif text-2xl text-warm-100 mb-4">Practice these tomorrow</h2>
        <div className="space-y-3">
          {feedback.recommendations.map((r,i) => (
            <motion.div key={i} initial={{ opacity:0,x:-20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }} className="glass-card rounded-xl p-5">
              <h3 className="font-semibold text-warm-100 mb-1">{r.title}</h3>
              <p className="text-sm text-warm-300">{r.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* XP + CTAs */}
      <div className="text-center space-y-6 pt-4">
        <motion.div initial={{ opacity:0,scale:0.8 }} whileInView={{ opacity:1,scale:1 }} viewport={{ once:true }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400/10 border border-amber-400/20">
          <span className="text-2xl">⚡</span><span className="text-xl font-bold text-amber-400">+75 XP earned!</span>
        </motion.div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/session" className="px-6 py-3 bg-amber-400 text-midnight-900 font-semibold rounded-full hover:bg-amber-300 transition-colors">Practice Again</Link>
          <Link href="/session" className="px-6 py-3 border border-warm-400/30 text-warm-200 rounded-full hover:border-amber-400/50 hover:text-amber-300 transition-all">Try Different Persona</Link>
          <Link href="/progress" className="px-6 py-3 border border-warm-400/30 text-warm-200 rounded-full hover:border-amber-400/50 hover:text-amber-300 transition-all">View Progress</Link>
        </div>
      </div>
    </div>
  );
}
