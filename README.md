# Next.js 15 Web Vitals & Non-Blocking Telemetry Starter

Starter repository for the YouTube video: **"Why Your Next.js App Loses 40% of Users"** by [PHANTOM (@phantom-4769)](https://www.youtube.com/@phantom-4769).

---

## ⚡ The Problem
Traditional analytics scripts (like standard Google Analytics 4 tags) fire on page load and miss client-side routing interactions. Synchronous event tracking inside button handlers blocks the browser's main thread, spiking **Interaction to Next Paint (INP)** past 200ms and driving bounce rates up to 40%.

## 🛠️ The 3-File Solution
1. `instrumentation.ts`: Hooks directly into Next.js 15 `onWebVitals` and dispatches INP, LCP, and CLS via `navigator.sendBeacon`.
2. `lib/telemetry.ts`: Lightweight, non-blocking custom event dispatcher that never freezes React state transitions.
3. `app/api/telemetry/route.ts`: Edge route that handles beacon payloads with zero server cold-start latency and routes them to PostHog.

## 🚀 Quickstart
```bash
# Clone the repository
git clone https://github.com/phantom-dev/nextjs-web-vitals-analytics.git

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Profile the checkout button in Chrome DevTools under **Performance > Interactions** to inspect the live INP trace.
