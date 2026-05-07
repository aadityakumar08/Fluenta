'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const scenarios = [
  { id: 'interview', title: 'Job Interview', icon: '💼', description: 'Practice answering common interview questions with a professional interviewer.', difficulty: 'Intermediate', personaId: 'interviewer', duration: '10-15 min', skills: ['Professional vocab', 'Confidence', 'Structure'] },
  { id: 'debate', title: 'Debate Club', icon: '⚡', description: 'Build persuasive arguments and practice defending your opinions.', difficulty: 'Advanced', personaId: 'debate-partner', duration: '15-20 min', skills: ['Argumentation', 'Critical thinking', 'Persuasion'] },
  { id: 'travel', title: 'Travel Day', icon: '✈️', description: 'Navigate airports, hotels, and restaurants in practical travel scenarios.', difficulty: 'Beginner', personaId: 'travel-guide', duration: '8-12 min', skills: ['Practical vocab', 'Directions', 'Ordering'] },
  { id: 'meeting', title: 'Team Meeting', icon: '👩‍💻', description: 'Practice workplace English — giving updates, brainstorming, and collaborating.', difficulty: 'Intermediate', personaId: 'team-lead', duration: '10-15 min', skills: ['Business English', 'Updates', 'Feedback'] },
  { id: 'date', title: 'Coffee Date', icon: '☕', description: 'Relaxed conversation practice for social situations and small talk.', difficulty: 'Beginner', personaId: 'date', duration: '8-12 min', skills: ['Small talk', 'Stories', 'Opinions'] },
  { id: 'pitch', title: 'Investor Pitch', icon: '🦈', description: 'Present your ideas to a seasoned investor and handle tough questions.', difficulty: 'Advanced', personaId: 'investor', duration: '15-20 min', skills: ['Pitching', 'Numbers', 'Persuasion'] },
  { id: 'lecture', title: 'Academic Discussion', icon: '🎓', description: 'Explore complex topics with a professor and build your analytical vocabulary.', difficulty: 'Advanced', personaId: 'professor', duration: '12-18 min', skills: ['Academic vocab', 'Analysis', 'Clarity'] },
  { id: 'casual', title: 'Friendly Chat', icon: '😊', description: 'Just talk! No pressure. Practice speaking naturally with a patient friend.', difficulty: 'Beginner', personaId: 'friend', duration: '5-10 min', skills: ['Natural flow', 'Relaxation', 'Fun'] },
];

const diffColor = (d: string) => d === 'Beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' : d === 'Intermediate' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : 'bg-red-500/10 text-red-400 border-red-500/20';

export default function ScenariosPage() {
  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="font-serif text-3xl text-warm-100">Scenario Library</h1>
        <p className="text-warm-300 mt-1">Choose a scenario to practice specific skills</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((sc, i) => (
          <motion.div key={sc.id} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
            transition={{ delay:i*0.06 }} className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col">
            <div className="text-4xl mb-4">{sc.icon}</div>
            <h3 className="font-serif text-xl text-warm-100 mb-2">{sc.title}</h3>
            <p className="text-sm text-warm-300 mb-4 flex-1">{sc.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {sc.skills.map((s) => (
                <span key={s} className="text-xs px-2 py-1 rounded-full bg-midnight-700 text-warm-300">{s}</span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${diffColor(sc.difficulty)}`}>{sc.difficulty}</span>
                <span className="text-xs text-warm-400">{sc.duration}</span>
              </div>
              <Link href={`/session?persona=${sc.personaId}`}
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                Start →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
