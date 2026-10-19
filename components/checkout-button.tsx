'use client';

// components/checkout-button.tsx - On-screen visual demo component
import React, { useState, useTransition } from 'react';
import { trackEvent } from '@/lib/telemetry';

export function CheckoutButton() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad');
  const [status, setStatus] = useState<string>('Ready');
  const [isPending, startTransition] = useTransition();

  // THE BAD HANDLER: Freezes main thread for ~180ms (High INP penalty)
  const handleBadCheckout = () => {
    setStatus('Processing...');
    
    // Simulate synchronous heavy computation (tax calc + cart filtering + JSON parsing)
    const start = performance.now();
    while (performance.now() - start < 180) {
      // Artificial main-thread freeze simulating unoptimized handler
    }

    // Synchronous blocking analytics call
    trackEvent('checkout_click_bad', { duration_ms: 180 });
    setStatus('Order Placed! (180ms INP Freeze)');
  };

  // THE GOOD HANDLER: Instantaneous 24ms response with non-blocking telemetry
  const handleGoodCheckout = () => {
    // 1. Immediate UI state transition
    setStatus('Processing...');
    
    // 2. Offload non-urgent state updates to React transition
    startTransition(() => {
      // Non-blocking telemetry sent via sendBeacon
      trackEvent('checkout_click_good', { optimized: true });
      setStatus('Order Placed! (24ms Clean INP)');
    });
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-white font-sans">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold tracking-tight">Checkout Interaction Demo</h3>
        <button
          onClick={() => setMode(mode === 'bad' ? 'good' : 'bad')}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
        >
          Toggle: {mode.toUpperCase()}
        </button>
      </div>

      <div className="mb-4 p-3 rounded bg-slate-950 border border-slate-800/80 font-mono text-xs">
        <div>Mode: <span className={mode === 'bad' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{mode.toUpperCase()}</span></div>
        <div>Status: <span className="text-yellow-400">{status}</span></div>
      </div>

      <button
        onClick={mode === 'bad' ? handleBadCheckout : handleGoodCheckout}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-150 ${
          mode === 'bad'
            ? 'bg-red-600 hover:bg-red-500 shadow-red-900/40'
            : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
        } shadow-lg active:scale-95`}
      >
        {mode === 'bad' ? 'Pay Now (Freeze 180ms)' : 'Pay Now (Optimized 24ms)'}
      </button>

      <p className="mt-4 text-xs text-slate-400 text-center">
        Open Chrome DevTools <span className="text-white font-mono">Performance &gt; Interactions</span> to profile INP live.
      </p>
    </div>
  );
}
