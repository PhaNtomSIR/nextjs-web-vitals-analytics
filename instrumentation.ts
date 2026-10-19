// instrumentation.ts - Next.js 15 Web Vitals & Telemetry Hook
import type { NextWebVitalsMetric } from 'next/app';

export function register() {
  // Server-side initialization (e.g., OpenTelemetry, PostHog Node SDK)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Telemetry] Node server runtime instrumentation initialized.');
  }
}

/**
 * onWebVitals - Captured automatically by Next.js 15
 * Tracks INP (Interaction to Next Paint), LCP (Largest Contentful Paint),
 * CLS (Cumulative Layout Shift), FCP, and TTFB.
 */
export function onWebVitals(metric: NextWebVitalsMetric) {
  const payload = JSON.stringify({
    name: metric.name,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    id: metric.id,
    navigationType: metric.navigationType,
    url: typeof window !== 'undefined' ? window.location.pathname : '',
    timestamp: Date.now()
  });

  // Non-blocking transmission via navigator.sendBeacon
  // This ensures zero main-thread blockage and guarantees delivery on page exit/navigation
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/telemetry', payload);
  } else {
    // Fallback for older environments with keepalive
    fetch('/api/telemetry', {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true
    }).catch((err) => console.error('[Telemetry Error]', err));
  }
}
