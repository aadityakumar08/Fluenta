'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-midnight-900 flex items-center justify-center px-6">
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl gradient-text-amber">Fluenta</Link>
          <p className="text-warm-300 mt-2">Create your free account</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {!sent ? (
            <>
              <button className="w-full py-3 border border-warm-400/20 text-warm-200 rounded-xl
                               hover:border-amber-400/30 hover:text-amber-300 transition-all flex items-center justify-center gap-3 mb-6">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Sign up with Google
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-warm-400/20"/><span className="text-xs text-warm-400">or</span><div className="flex-1 h-px bg-warm-400/20"/>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-sm text-warm-300 block mb-2">Email address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full px-4 py-3 bg-midnight-700 border border-warm-400/20 rounded-xl text-warm-100
                              focus:border-amber-400/50 focus:outline-none transition-colors"
                    placeholder="you@example.com"/>
                </div>
                <button type="submit" className="w-full py-3 bg-amber-400 text-midnight-900 font-semibold rounded-xl hover:bg-amber-300 transition-colors">
                  Create Account
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="font-serif text-xl text-warm-100 mb-2">Check your inbox</h2>
              <p className="text-warm-300 text-sm">We sent a magic link to <strong className="text-amber-400">{email}</strong></p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-warm-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-400 hover:text-amber-300 transition-colors">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
