# Project Audit – Flaws & Recommendations

Audit date: March 3, 2025. Scope: security, performance, accessibility, code quality, SEO, UX, and consistency.

---

## Critical / Security

### 1. **Hardcoded OTP and demo credentials**
- **Where:** `src/lib/constants.ts` – `VALID_OTP = '4768'`, `CURRENT_MOBILE_PLACEHOLDER = '9065847341'`
- **Issue:** OTP is in source and identical for every user. Not acceptable for production.
- **Fix:** Remove hardcoded OTP. Use a real auth backend (e.g. SMS/email OTP or OAuth). For local/demo only, use env vars (e.g. `NEXT_PUBLIC_DEMO_OTP`) and document clearly.

### 2. **Login state never read – no route protection**
- **Where:** `setLoggedIn(true)` is called in `LoginModal.tsx`; no `getLoggedIn()` exists in `storage.ts`. No route checks for "logged in".
- **Issue:** Dashboard, payment, booking, history, etc. are reachable without login. If the product is "login to book", app routes should be protected.
- **Fix:** Add `getLoggedIn(): boolean` in `storage.ts`. In dashboard (and optionally other app routes), redirect to home or show login when `!getLoggedIn()`.

### 3. **Google site verification placeholder**
- **Where:** `src/app/layout.tsx` – `verification: { google: "your-google-site-verification-code" }`
- **Issue:** Placeholder value; Search Console verification will fail.
- **Fix:** Replace with real meta tag value from Google Search Console or remove until you have it.

---

## High – Bugs / Data

### 4. **Login keypad layout wrong and duplicate keys**
- **Where:** `src/components/auth/LoginModal.tsx` – `keypadKeys` has:
  - Row 4: `[',', '0', '.', 'enter']` – first key should not be comma; fourth row usually has one backspace/blank and "0" and "enter".
  - Two `'backspace'` entries (rows 2 and 3); keys rendered with `key={idx}` so duplicate labels can confuse React and a11y.
- **Issue:** Wrong keys (comma, dot) and duplicate backspace; poor UX and possible focus/key handling quirks.
- **Fix:** Use a single backspace, fix row 4 to e.g. blank/minus, `'0'`, and `'enter'`. Use stable keys, e.g. `key={\`keypad-${row}-${col}\`}` or key label when unique.

### 5. **SavedLocation guard doesn't validate `contact`**
- **Where:** `src/lib/storage.ts` – `isSavedLocation()` only checks `name` and `address`; `SavedLocation` type has `contact: string`.
- **Issue:** Old or malformed data without `contact` can pass the guard; code then assumes `loc.contact` is string (e.g. `pickup.contact`, `drop.contact` in trip-options). Can be `undefined` at runtime.
- **Fix:** Either validate `contact` in `isSavedLocation` (e.g. `typeof (v as SavedLocation).contact === 'string'`) or type as `contact?: string` and handle undefined everywhere (e.g. `pickup?.contact ?? ''`).

### 6. **Dashboard "Continue" and other buttons do nothing**
- **Where:** `src/app/dashboard/page.tsx`
  - Blue "Continue" arrow button (line ~269) has no `onClick`.
  - "Add More Default Location" has no `onClick`.
  - In "Choose trip" modal, "Edit pickup", "Edit drop", "Swap" have no handlers.
- **Issue:** Dead UI; users expect actions.
- **Fix:** Wire "Continue" to e.g. trip-options or pickup flow; "Add More Default Location" to a real flow or remove; Edit/Swap to navigation or state updates.

---

## Medium – Code quality & consistency

### 7. **Lint script incomplete**
- **Where:** `package.json` – `"lint": "eslint"` with no path/args.
- **Issue:** `npm run lint` may not run on the right paths or with Next config.
- **Fix:** e.g. `"lint": "next lint"` or `"eslint . --ext .ts,.tsx"` and ensure `eslint-config-next` is applied.

### 8. **Error boundary exposes `error.message`**
- **Where:** `src/app/error.tsx` – `<p>{error.message}</p>`
- **Issue:** In production, error messages can leak stack or internal details.
- **Fix:** Show a generic message in production; log `error` server-side or to a reporting service; optionally show a digest or user-friendly text only.

### 9. **Footer links to non-existent routes**
- **Where:** `src/components/landing/Footer.tsx` – links to `/careers`, `/blog`, `/help`, `/safety`, `/contact`, `/privacy`, `/terms`
- **Issue:** Those routes don't exist → 404. Social links use `href="#"`.
- **Fix:** Add minimal placeholder pages or remove links until pages exist. Replace `#` with real social URLs or `role="button"` + handler if non-navigating.

### 10. **Duplicate mock data**
- **Where:** `src/data/mockLocations.ts` – all three entries are identical (same name, address, contact).
- **Issue:** Looks like copy-paste; confusing for testing/demo.
- **Fix:** Vary at least name/address or document that it's intentional placeholder.

### 11. **Manifest references missing icons**
- **Where:** `public/manifest.json` – `icon-192.png`, `icon-512.png`
- **Issue:** If those files are missing, PWA icons break.
- **Fix:** Add the assets under `public/` or point to existing icons (e.g. favicon) and update manifest.

---

## Medium – Accessibility & semantics

### 12. **Decorative image with empty alt**
- **Where:** `src/components/landing/Features.tsx` – `alt=""` on feature icons.
- **Issue:** Fine if icons are purely decorative and adjacent text gives the same info; otherwise screen readers get no context.
- **Fix:** If the icon conveys meaning, use a short label (e.g. `alt="Delivery"`). If decorative, keep `alt=""` and ensure no information is lost.

### 13. **Dashboard "Choose trip" modal: no focus trap or Escape**
- **Where:** `src/app/dashboard/page.tsx` – custom modal (not shared `Modal`).
- **Issue:** Focus can tab out of the modal; Escape doesn't close it. Inconsistent with other modals.
- **Fix:** Use shared `Modal` or add Escape handler and focus trap (like `LoginModal` / `Modal.tsx`).

### 14. **AddressDetailsModal overlay not clickable to close**
- **Where:** `src/components/booking/AddressDetailsModal.tsx` – overlay has `aria-hidden="true"` but no `onClick={onClose}`.
- **Issue:** Users expect clicking backdrop to close; Escape was added but click wasn't.
- **Fix:** Add `onClick={onClose}` on the overlay (and ensure it's focusable or use a single "close" action for a11y).

---

## Low – Performance & SEO

### 15. **Sitemap includes authenticated-style routes**
- **Where:** `src/app/sitemap.ts` – includes `/dashboard`, `/history`
- **Issue:** If those are app-only and not useful for crawlers (or behind login), they add noise and may get indexed with thin content.
- **Fix:** Consider removing `/dashboard` and `/history` from sitemap, or noindex them in metadata, unless you want them public.

### 16. **JsonLd uses dangerouslySetInnerHTML**
- **Where:** `src/components/JsonLd.tsx` – `dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}`
- **Issue:** Standard pattern for LD+JSON; input is controlled (site config), so low risk. Still worth noting.
- **Fix:** Keep as-is but ensure `data` is never user-controlled. If you ever inject user content, sanitize or avoid.

### 17. **No loading/error for some route segments**
- **Where:** Routes like `payment`, `booking`, `trip-options`, `add-stop`, `history` have no `loading.tsx` or local `error.tsx`.
- **Issue:** Only root loading/error exist; nested navigations have no segment-level feedback.
- **Fix:** Add `loading.tsx` (and optionally `error.tsx`) for key segments to improve perceived performance and error recovery.

---

## Low – UX & copy

### 18. **Resend OTP has no handler**
- **Where:** `src/components/auth/LoginModal.tsx` – "Resend OTP" button when countdown is 0 has no `onClick`.
- **Issue:** Button does nothing; users may think the app is broken.
- **Fix:** Add handler to resend OTP (and restart countdown). In demo, can be a no-op with a toast like "Demo: use OTP 4768".

### 19. **Theme color vs primary color**
- **Where:** `public/manifest.json` – `theme_color: "#1e3a5f"`; `globals.css` – `--color-primary: #1F2456`
- **Issue:** Slight mismatch; status bar may not match app chrome.
- **Fix:** Use the same token (e.g. `#1F2456`) in manifest or document the difference.

---

## Summary table

| Severity | Count | Areas |
|----------|-------|--------|
| Critical | 3     | Auth/OTP, route protection, Google verification |
| High     | 3     | Keypad layout, storage guard, dead buttons |
| Medium   | 5     | Lint, error message, footer links, mock data, manifest icons, a11y |
| Low      | 5     | Sitemap, JsonLd, loading/error, Resend OTP, theme color |

**Suggested order of work:** (1) Fix OTP/auth and add `getLoggedIn` + optional route guard, (2) Fix keypad keys and SavedLocation guard, (3) Wire dashboard buttons and Resend OTP, (4) Add Escape/focus to dashboard modal and overlay-close to AddressDetailsModal, (5) Lint script, error message, footer/manifest, then the rest.
