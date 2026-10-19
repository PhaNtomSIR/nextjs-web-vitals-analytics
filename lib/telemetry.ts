// lib/telemetry.ts - Production Client Telemetry & Non-Blocking Event Ingest

export interface CustomEventPayload {
  eventName: string;
  properties?: Record<string, unknown>;
  sessionId?: string;
  timestamp?: number;
}

/**
 * trackEvent - Sends custom events without blocking the React render cycle or main thread.
 * Replaces heavy third-party client trackers with a 15-line native beacon dispatcher.
 */
export function trackEvent(eventName: string, properties: Record<string, unknown> = {}) {
  const payload = JSON.stringify({
    eventName,
    properties: {
      ...properties,
      pathname: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0
    },
    timestamp: Date.now()
  });

  // Use sendBeacon to avoid blocking synchronous UI interactions (INP preservation)
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const queued = navigator.sendBeacon('/api/telemetry', payload);
    if (!queued) {
      console.warn('[Telemetry] sendBeacon buffer full, falling back to background fetch');
      sendFetchFallback(payload);
    }
  } else {
    sendFetchFallback(payload);
  }
}

function sendFetchFallback(payload: string) {
  if (typeof fetch === 'function') {
    fetch('/api/telemetry', {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true
    }).catch((err) => console.error('[Telemetry Fallback Error]', err));
  }
}
