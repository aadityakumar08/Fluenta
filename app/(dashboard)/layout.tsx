'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSessionPage = pathname === '/session';

  // Session page gets full-screen treatment — no sidebar
  if (isSessionPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-midnight-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-h-screen pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
