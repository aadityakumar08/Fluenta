'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const steps = [
  { path: '/onboarding/welcome', label: 'Welcome' },
  { path: '/onboarding/fear-audit', label: 'Fears' },
  { path: '/onboarding/level-check', label: 'Level' },
  { path: '/onboarding/complete', label: 'Done' },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = steps.findIndex((s) => s.path === pathname);

  return (
    <div className="min-h-screen bg-midnight-900 flex flex-col">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-3 pt-8 pb-4">
        {steps.map((step, i) => (
          <div key={step.path} className="flex items-center gap-3">
            <motion.div
              initial={false}
              animate={{
                scale: i === currentStep ? 1.2 : 1,
                backgroundColor:
                  i <= currentStep ? '#E8B86D' : 'rgba(138, 127, 116, 0.3)',
              }}
              className="w-3 h-3 rounded-full transition-colors"
            />
            {i < steps.length - 1 && (
              <div
                className="w-8 h-[2px] rounded"
                style={{
                  backgroundColor:
                    i < currentStep ? '#E8B86D' : 'rgba(138, 127, 116, 0.2)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
