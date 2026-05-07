'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { personas } from '@/lib/personas';

const scenarios = [
  { id: 'interview', title: 'Job Interview', icon: '💼', difficulty: 'Intermediate', personaId: 'interviewer' },
  { id: 'debate', title: 'Debate Club', icon: '⚡', difficulty: 'Advanced', personaId: 'debate-partner' },
  { id: 'travel', title: 'Travel Day', icon: '✈️', difficulty: 'Beginner', personaId: 'travel-guide' },
  { id: 'meeting', title: 'Team Meeting', icon: '👩‍💻', difficulty: 'Intermediate', personaId: 'team-lead' },
  { id: 'date', title: 'Coffee Date', icon: '☕', difficulty: 'Beginner', personaId: 'date' },
  { id: 'pitch', title: 'Investor Pitch', icon: '🦈', difficulty: 'Advanced', personaId: 'investor' },
];

const recentSessions = [
  { id: '1', persona: 'Jamie', icon: '😊', score: 78, date: 'Today', duration: '8:32' },
  { id: '2', persona: 'Alex', icon: '💼', score: 72, date: 'Yesterday', duration: '12:15' },
  { id: '3', persona: 'Rosa', icon: '✈️', score: 81, date: '2 days ago', duration: '6:45' },
];

const achievements = [
  { id: 'first_session', icon: '🎤', title: 'First Words', unlocked: true },
  { id: 'streak_3', icon: '🔥', title: 'On a Roll', unlocked: true },
  { id: 'streak_7', icon: '⚡', title: 'Unstoppable', unlocked: true },
  { id: 'perfect_grammar', icon: '📝', title: 'Grammar Guru', unlocked: false },
  { id: 'no_fillers', icon: '✨', title: 'Clean Speaker', unlocked: false },
  { id: 'all_personas', icon: '🦋', title: 'Social Butterfly', unlocked: false },
  { id: 'level_up', icon: '📈', title: 'Level Up', unlocked: false },
  { id: 'confident', icon: '💪', title: 'Confident', unlocked: false },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-warm-100">Good evening 👋</h1>
        <p className="text-warm-300 mt-1">Ready to practice today?</p>
      </div>

      {/* Hero Action Card */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
        className="glass-card rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(232,184,109,0.06)_0%,_transparent_70%)]"/>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-warm-100 mb-2">Ready for today&apos;s session?</h2>
            <p className="text-warm-300">Recommended: <span className="text-amber-400">Alex — Interviewer</span></p>
            <p className="text-sm text-warm-400 mt-1">~10 minutes · Improve your professional vocabulary</p>
          </div>
          <Link href="/session?persona=interviewer"
            className="px-8 py-4 bg-amber-400 text-midnight-900 font-semibold rounded-full text-lg hover:bg-amber-300 transition-all animate-pulse-glow shrink-0">
            Start Session
          </Link>
        </div>
      </motion.div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '🔥', label: 'Streak', value: '7 days', color: 'text-orange-400' },
          { icon: '⚡', label: 'Total XP', value: '1,240', color: 'text-amber-400' },
          { icon: '📊', label: 'Sessions', value: '23', color: 'text-blue-400' },
          { icon: '🏆', label: 'Best Score', value: '84/100', color: 'text-green-400' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.08 }}
            className="glass-card rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-warm-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Progress Chart placeholder */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-serif text-lg text-warm-100 mb-4">Fluency Trend</h3>
          <div className="h-[200px] flex items-end gap-2 px-2">
            {[45,52,48,60,55,68,72,65,78,75,80,78,82,85].map((v,i) => (
              <div key={i} className="flex-1 h-full flex flex-col justify-end items-center">
                <motion.div initial={{ height:0 }} animate={{ height:`${v}%` }}
                  transition={{ delay:i*0.05, duration:0.5 }}
                  className="w-full bg-amber-400/20 rounded-t-sm hover:bg-amber-400/40 transition-colors relative group"
                  style={{ minHeight: 4 }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{v}</div>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-warm-400 mt-2 px-2">
            <span>14 days ago</span><span>Today</span>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-serif text-lg text-warm-100 mb-4">Recent Sessions</h3>
          <div className="space-y-3">
            {recentSessions.map((s) => (
              <Link key={s.id} href={`/feedback/${s.id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-midnight-700 transition-colors">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-warm-100">{s.persona}</p>
                  <p className="text-xs text-warm-400">{s.date} · {s.duration}</p>
                </div>
                <div className="text-lg font-bold text-amber-400">{s.score}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div>
        <h3 className="font-serif text-lg text-warm-100 mb-4">Scenario Library</h3>
        <div className="horizontal-scroll flex gap-4 pb-2">
          {scenarios.map((sc) => (
            <Link key={sc.id} href={`/session?persona=${sc.personaId}`}
              className="glass-card glass-card-hover rounded-2xl p-5 min-w-[200px] shrink-0">
              <div className="text-3xl mb-3">{sc.icon}</div>
              <h4 className="font-semibold text-warm-100 mb-1">{sc.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${sc.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' : sc.difficulty === 'Intermediate' ? 'bg-amber-400/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                {sc.difficulty}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="font-serif text-lg text-warm-100 mb-4">Achievements</h3>
        <div className="horizontal-scroll flex gap-4 pb-2">
          {achievements.map((a) => (
            <div key={a.id} className={`flex flex-col items-center gap-2 min-w-[80px] shrink-0 ${!a.unlocked ? 'opacity-40 grayscale' : ''}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${a.unlocked ? 'bg-amber-400/10 amber-glow' : 'bg-midnight-700'}`}>
                {a.unlocked ? a.icon : '🔒'}
              </div>
              <span className="text-xs text-warm-300 text-center">{a.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
