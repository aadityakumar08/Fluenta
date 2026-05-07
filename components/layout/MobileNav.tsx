'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: '📊' },
  { href: '/session', label: 'Talk', icon: '🎤' },
  { href: '/progress', label: 'Progress', icon: '📈' },
  { href: '/scenarios', label: 'Scenarios', icon: '🎭' },
  { href: '/achievements', label: 'Badges', icon: '🏆' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-midnight-800/95 backdrop-blur-lg
                    border-t border-warm-400/10 z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl min-w-[60px]
                         transition-colors
                ${isActive ? 'text-amber-400' : 'text-warm-400'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
