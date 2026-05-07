'use client';

import { motion } from 'framer-motion';

const levels = ['A1','A2','B1','B2','C1','C2'];
const currentLevel = 'B1';

const sessionHistory = [
  { date: 'May 6', persona: 'Jamie', icon: '😊', duration: '8:32', fluency: 78, confidence: 82 },
  { date: 'May 5', persona: 'Alex', icon: '💼', duration: '12:15', fluency: 72, confidence: 70 },
  { date: 'May 4', persona: 'Rosa', icon: '✈️', duration: '6:45', fluency: 81, confidence: 85 },
  { date: 'May 3', persona: 'Marcus', icon: '⚡', duration: '10:20', fluency: 65, confidence: 60 },
  { date: 'May 2', persona: 'Sophie', icon: '☕', duration: '9:10', fluency: 70, confidence: 75 },
  { date: 'May 1', persona: 'Jamie', icon: '😊', duration: '7:00', fluency: 68, confidence: 72 },
  { date: 'Apr 30', persona: 'Dr. Chen', icon: '🎓', duration: '11:30', fluency: 62, confidence: 58 },
];

const weaknesses = [
  { category: 'Verb Tenses', count: 12, color: 'bg-red-400' },
  { category: 'Articles (a/an/the)', count: 8, color: 'bg-orange-400' },
  { category: 'Prepositions', count: 6, color: 'bg-amber-400' },
  { category: 'Subject-Verb Agreement', count: 4, color: 'bg-yellow-400' },
];

export default function ProgressPage() {
  return (
    <div className="space-y-8 pb-20">
      <h1 className="font-serif text-3xl text-warm-100">Your Progress</h1>

      {/* Level Journey */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-serif text-xl text-warm-100 mb-6">Level Journey</h2>
        <div className="flex items-center justify-between gap-2">
          {levels.map((level, i) => {
            const isCurrent = level === currentLevel;
            const isPast = levels.indexOf(level) < levels.indexOf(currentLevel);
            return (
              <div key={level} className="flex items-center gap-2 flex-1">
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:i*0.1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                    ${isCurrent ? 'bg-amber-400 text-midnight-900 amber-glow-strong' : isPast ? 'bg-amber-400/20 text-amber-400' : 'bg-midnight-700 text-warm-400'}`}>
                  {level}
                </motion.div>
                {i < levels.length - 1 && (
                  <div className={`h-1 flex-1 rounded ${isPast ? 'bg-amber-400/40' : 'bg-midnight-700'}`}/>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Trends (bar chart) */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-serif text-xl text-warm-100 mb-4">Score Trends</h2>
        <div className="h-[200px] flex items-end gap-3 px-2">
          {sessionHistory.slice().reverse().map((s,i) => (
            <div key={i} className="flex-1 h-full flex flex-col justify-end items-center">
              <motion.div initial={{ height: 0 }} animate={{ height: `${s.fluency}%` }}
                transition={{ delay: i * 0.06, duration: 0.6 }}
                className="w-full rounded-t bg-amber-400/30 hover:bg-amber-400/50 transition-colors relative group"
                style={{ minHeight: 4 }}>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-amber-400 opacity-0 group-hover:opacity-100 whitespace-nowrap">{s.fluency}</div>
              </motion.div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-warm-400 mt-2 px-2">
          {sessionHistory.slice().reverse().map((s) => (<span key={s.date}>{s.date.split(' ')[1]}</span>))}
        </div>
      </div>

      {/* Session History Table */}
      <div className="glass-card rounded-2xl p-6 overflow-x-auto">
        <h2 className="font-serif text-xl text-warm-100 mb-4">Session History</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-warm-400 border-b border-warm-400/10">
              <th className="text-left py-3">Date</th><th className="text-left py-3">Persona</th>
              <th className="text-left py-3">Duration</th><th className="text-right py-3">Fluency</th>
              <th className="text-right py-3">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {sessionHistory.map((s,i) => (
              <motion.tr key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.05 }}
                className="border-b border-warm-400/5 hover:bg-midnight-700/50 transition-colors">
                <td className="py-3 text-warm-300">{s.date}</td>
                <td className="py-3"><span className="mr-2">{s.icon}</span><span className="text-warm-100">{s.persona}</span></td>
                <td className="py-3 text-warm-300">{s.duration}</td>
                <td className="py-3 text-right font-mono text-amber-400">{s.fluency}</td>
                <td className="py-3 text-right font-mono text-amber-300">{s.confidence}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Weakness Analysis */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-serif text-xl text-warm-100 mb-4">Most Common Errors</h2>
        <div className="space-y-4">
          {weaknesses.map((w,i) => (
            <div key={w.category} className="flex items-center gap-4">
              <span className="text-sm text-warm-200 w-48 shrink-0">{w.category}</span>
              <div className="flex-1 h-4 bg-midnight-700 rounded-full overflow-hidden">
                <motion.div initial={{ width:0 }} animate={{ width:`${(w.count/12)*100}%` }}
                  transition={{ delay:i*0.1, duration:0.5 }}
                  className={`h-full rounded-full ${w.color} opacity-60`}/>
              </div>
              <span className="text-sm font-mono text-warm-400 w-8 text-right">{w.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-serif text-xl text-warm-100 mb-4">You vs. Your First Session</h2>
        <div className="grid grid-cols-2 gap-8 text-center">
          <div>
            <p className="text-sm text-warm-400 mb-2">First Session</p>
            <p className="text-4xl font-bold text-warm-300">52</p>
            <p className="text-xs text-warm-400">Fluency Score</p>
          </div>
          <div>
            <p className="text-sm text-warm-400 mb-2">Latest Session</p>
            <p className="text-4xl font-bold text-amber-400">78</p>
            <p className="text-xs text-warm-400">Fluency Score</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm">↑ 50% improvement!</span>
        </div>
      </div>
    </div>
  );
}
