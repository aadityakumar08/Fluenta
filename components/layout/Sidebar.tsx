'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/session', label: 'Session', icon: '🎤' },
  { href: '/progress', label: 'Progress', icon: '📈' },
  { href: '/scenarios', label: 'Scenarios', icon: '🎭' },
  { href: '/achievements', label: 'Badges', icon: '🏆' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-screen sticky top-0 bg-midnight-800 border-r border-warm-400/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-warm-400/10">
        <Link href="/dashboard" className="font-serif text-2xl gradient-text-amber">
          Fluenta
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-warm-400/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30
                          flex items-center justify-center text-amber-400 font-semibold">
            U
          </div>
          <div>
            <p className="text-sm text-warm-100 font-medium">Learner</p>
            <p className="text-xs text-warm-400">B1 — Intermediate</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                         transition-all duration-200
                ${
                  isActive
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                    : 'text-warm-300 hover:text-warm-100 hover:bg-midnight-700'
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Streak */}
      <div className="p-4 border-t border-warm-400/10">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-midnight-700">
          <span className="text-xl">🔥</span>
          <div>
            <p className="text-sm font-semibold text-warm-100">7 day streak</p>
            <p className="text-xs text-warm-400">Keep it going!</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
