// app/api/telemetry/route.ts - Edge Telemetry Ingestion Endpoint
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Zero cold-start latency edge execution

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.text();
    if (!rawData) {
      return new NextResponse('Empty payload', { status: 400 });
    }

    const payload = JSON.parse(rawData);

    // Differentiate Web Vitals vs Custom Events
    if (payload.name && payload.value !== undefined) {
      // Core Web Vital trace (INP, LCP, CLS)
      console.log(`[Web Vitals Edge] ${payload.name}: ${payload.value}ms (${payload.rating}) on ${payload.url}`);

      // Forward to PostHog capture API
      if (process.env.POSTHOG_API_KEY) {
        await fetch('https://us.i.posthog.com/capture/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.POSTHOG_API_KEY,
            event: `$web_vitals_${payload.name.toLowerCase()}`,
            properties: {
              value: payload.value,
              rating: payload.rating,
              metric_id: payload.id,
              $current_url: payload.url,
              distinct_id: payload.id
            }
          })
        });
      }
    } else if (payload.eventName) {
      // Custom business event (e.g. checkout_initiated)
      console.log(`[Custom Event Edge] ${payload.eventName}`, payload.properties);
    }

    return new NextResponse('OK', { status: 200 });
  } catch (err) {
    console.error('[Telemetry Route Error]', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
