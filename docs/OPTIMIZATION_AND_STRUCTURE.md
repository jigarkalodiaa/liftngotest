# Optimization & structure notes

## Config and keys (done)

- **Auth token**: API client uses `getAuthToken()` from `@/lib/storage` (which uses `STORAGE_KEYS.AUTH_TOKEN`) instead of a hardcoded `liftngo_token` key.
- **Env-driven config** in `src/config/env.ts`:
  - `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_MAP_KEY`, `NEXT_PUBLIC_API_TIMEOUT_MS`
  - `NEXT_PUBLIC_DEMO_OTP`, `NEXT_PUBLIC_SUPPORT_PHONE` (demo/contact)
  - `NEXT_PUBLIC_TWITTER_HANDLE`, `NEXT_PUBLIC_SOCIAL_*` (Twitter + social links)
- **Site / layout**: Twitter creator and footer social links read from env (see `.env.example`).
- **Booking contact**: Driver/support “Call” link uses `NEXT_PUBLIC_SUPPORT_PHONE` when set.
- **API paths**: Centralized in `src/config/api.ts` (`API_PATHS`); used by `bookingService` and `driverService`.

## Project structure

```
src/
├── app/                 # Next.js App Router pages and layouts
├── components/          # UI (landing, booking, auth, layout, ui)
├── config/              # Env, theme, API paths – single source of truth
│   ├── env.ts           # Env vars and derived config
│   ├── api.ts           # API path constants
│   ├── theme.ts         # Design tokens
│   └── index.ts         # Re-exports
├── data/                # Static/mock data (FAQ, cities, good types, trips, etc.)
├── hooks/               # React hooks
├── lib/                 # Shared utilities and app constants
│   ├── constants.ts     # STORAGE_KEYS, ROUTES, getValidOtp, placeholder phone
│   ├── site.ts          # Brand/SEO copy (could be env-driven later)
│   ├── storage.ts       # localStorage helpers using STORAGE_KEYS
│   └── ...
├── services/            # API client and service layer (booking, driver)
├── types/               # Shared TS types
└── utils/               # Error handling, validations, etc.
```

## Further optimizations (optional)

1. **Site/brand from env**: Move `SITE_URL`, `SITE_NAME`, meta titles/descriptions in `lib/site.ts` to env (e.g. `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`) for multi-environment or white-label.
2. **Mock/demo data**: `data/defaultTrips.ts`, `data/mockLocations.ts`, `data/rideHistory.ts` use fixed phones/addresses; could use `SUPPORT_PHONE` or a single “demo contact” constant from config.
3. **Image domains**: `next.config.ts` remote patterns are hardcoded; add env-driven hostnames if you need different CDNs per environment.
4. **Constants vs config**: `constants/index.ts` re-exports from `lib/constants`. Keeping app constants in `lib/constants.ts` and env/runtime in `config/` is consistent; optionally consolidate under `config/` if you prefer a single config surface.
