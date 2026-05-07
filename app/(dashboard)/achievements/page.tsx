'use client';

import { motion } from 'framer-motion';
import { achievementDefinitions } from '@/lib/gamification';

const unlockedIds = ['first_session', 'streak_3', 'streak_7'];

export default function AchievementsPage() {
  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="font-serif text-3xl text-warm-100">Achievements</h1>
        <p className="text-warm-300 mt-1">{unlockedIds.length}/{achievementDefinitions.length} unlocked</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {achievementDefinitions.map((a, i) => {
          const unlocked = unlockedIds.includes(a.id);
          return (
            <motion.div key={a.id} initial={{ opacity:0,scale:0.8 }} animate={{ opacity:1,scale:1 }}
              transition={{ delay:i*0.05 }}
              className={`glass-card rounded-2xl p-5 text-center flex flex-col items-center gap-3
                ${!unlocked ? 'opacity-40 grayscale' : ''}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl
                ${unlocked ? 'bg-amber-400/10 amber-glow' : 'bg-midnight-700'}`}>
                {unlocked ? a.icon : '🔒'}
              </div>
              <h3 className="font-semibold text-warm-100 text-sm">{a.title}</h3>
              <p className="text-xs text-warm-400">{a.description}</p>
              {unlocked && <span className="text-xs text-green-400">✓ Unlocked</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
