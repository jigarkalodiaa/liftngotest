<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Liftngo Next.js App Router project. The integration upgrades the existing partial setup to production-grade standards: client-side initialization is now handled by `instrumentation-client.ts` (the recommended pattern for Next.js 15.3+), analytics events flow through a first-party reverse proxy, server-side events are captured from API routes, and users are identified by phone number after OTP login.

## Summary of changes

| File | Change |
|------|--------|
| `instrumentation-client.ts` | **Created** — initializes PostHog once at app start using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `/ingest` reverse proxy, `defaults: '2026-01-30'`, and `capture_exceptions: true` |
| `src/lib/posthog.ts` | **Updated** — `initPosthog()` made a no-op (init is now owned by `instrumentation-client.ts`); exports kept for backward compatibility |
| `src/lib/posthogAnalytics.ts` | **Updated** — removed redundant `initPosthog()` guards; `trackEvent` and `identifyUser` now call posthog directly |
| `src/lib/posthog-server.ts` | **Created** — singleton `posthog-node` client for server-side event capture |
| `next.config.ts` | **Updated** — added `/ingest/static/:path*` and `/ingest/:path*` rewrites plus `skipTrailingSlashRedirect: true` for the reverse proxy |
| `src/app/api/leads/route.ts` | **Updated** — captures `lead_submitted` server-side after a lead is persisted |
| `src/app/api/razorpay/verify/route.ts` | **Updated** — captures `payment_verified` server-side after signature validation passes |
| `src/lib/auth/finalizeLoginSession.ts` | **Updated** — calls `identifyUser(phone)` after OTP success so the phone number is linked to the PostHog person |
| `src/app/plans/page.tsx` | **Updated** — captures `plan_tab_viewed` with `{ tab, from_tab }` properties when a user switches plan tabs |
| `.env.local` | **Updated** — set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`, and `NEXT_PUBLIC_POSTHOG_KEY` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `lead_submitted` | Business lead submitted via chatbot or contact form (server-side) | `src/app/api/leads/route.ts` |
| `payment_verified` | Razorpay payment signature verified server-side after a successful transaction | `src/app/api/razorpay/verify/route.ts` |
| `plan_tab_viewed` | User switches to a different plan tab on the plans hub (deliveries / vehicle / lease / custom / gst) | `src/app/plans/page.tsx` |
| `user_identified` | `posthog.identify()` called with the user's phone number after OTP verification | `src/lib/auth/finalizeLoginSession.ts` |

## Pre-existing events (already in the codebase)

| Event | File |
|-------|------|
| `login_attempt` | `src/components/auth/LoginPanel.tsx` |
| `otp_success` | `src/lib/auth/finalizeLoginSession.ts` |
| `view_price` | `src/app/trip-options/page.tsx` |
| `ride_booked` | `src/app/payment/page.tsx`, `src/app/plans/subscription/checkout/SubscriptionCheckoutClient.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

**Dashboard**
- [Analytics basics](https://us.posthog.com/project/370809/dashboard/1434552)

**Insights**
- [Booking conversion funnel](https://us.posthog.com/project/370809/insights/p8gZlE6a) — Login attempt → OTP verified → Ride booked
- [Daily bookings & leads](https://us.posthog.com/project/370809/insights/2nW6Muao) — `ride_booked` vs `lead_submitted` over time
- [Payments verified vs bookings](https://us.posthog.com/project/370809/insights/HACjgNzt) — server-side payment verification vs client-side booking completion
- [Daily active users (logins)](https://us.posthog.com/project/370809/insights/gSaTXyMX) — unique users completing OTP login per day
- [Plan tab interest breakdown](https://us.posthog.com/project/370809/insights/hoqfnXFH) — which plan tab draws the most interest, broken down by tab name

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
