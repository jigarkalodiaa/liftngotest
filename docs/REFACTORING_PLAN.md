# Large File Refactoring Plan

## Completed Refactoring

### `/hyperlocal-delivery-service/page.tsx` (577 → 75 lines)

**Components Created:**
- `HyperlocalHero.tsx` (49 lines)
- `HyperlocalUseCases.tsx` (52 lines)
- `HyperlocalProseContent.tsx` (57 lines)
- `HyperlocalInternalLinks.tsx` (45 lines)
- `HyperlocalCta.tsx` (46 lines)

**Constants Extracted:**
- `/lib/constants/hyperlocalDelivery.ts`

**Shared Components Created:**
- `/components/seo-pages/StatsStrip.tsx`
- `/components/seo-pages/BenefitsGrid.tsx`
- `/components/seo-pages/HowItWorks.tsx`
- `/components/seo-pages/FaqSection.tsx`
- `/components/seo-pages/CoverageAreas.tsx`
- `/components/seo-pages/CtaSection.tsx`
- `/components/seo-pages/ProseContent.tsx`
- `/components/seo-pages/SeoPageHero.tsx`
- `/components/seo-pages/InternalLinksSection.tsx`

---

## Pending Refactoring

### 1. `/contact/page.tsx` (534 lines)

**Recommended Structure:**
```
/contact/
├── page.tsx (~80 lines)
├── ContactHero.tsx
├── ContactChannelCards.tsx
├── BusinessEnquirySection.tsx
├── GrievanceSection.tsx
├── SocialLinksSection.tsx
├── CorridorsSection.tsx
├── SelfServeSection.tsx
└── ContactFaqSection.tsx
```

**Note:** This page has complex UI with many unique elements. Consider keeping some inline if they're not reused.

---

### 2. `/fare-calculator/page.tsx` (501 lines)

**Recommended Structure:**
```
/fare-calculator/
├── page.tsx (~100 lines)
├── FareCalculatorHero.tsx
├── VehicleSelector.tsx
├── DistanceInput.tsx
├── FareBreakdown.tsx
├── PricingTable.tsx
├── FareCalculatorFaq.tsx
└── constants/fareCalculator.ts
```

---

### 3. `/fleet-branding-rajasthan/page.tsx` (546 lines)

**Can Reuse:**
- `StatsStrip`
- `BenefitsGrid`
- `HowItWorks`
- `FaqSection`
- `CtaSection`

**New Components:**
```
/fleet-branding-rajasthan/
├── page.tsx (~80 lines)
├── FleetBrandingHero.tsx
├── FleetBrandingUseCases.tsx
├── FleetBrandingProseContent.tsx
├── FleetBrandingInternalLinks.tsx
└── constants/fleetBrandingRajasthan.ts
```

---

### 4. `/restaurant-delivery-partner/page.tsx` (527 lines)

**Can Reuse:**
- `StatsStrip`
- `BenefitsGrid`
- `HowItWorks`
- `FaqSection`
- `CtaSection`

**New Components:**
```
/restaurant-delivery-partner/
├── page.tsx (~80 lines)
├── RestaurantHero.tsx
├── RestaurantUseCases.tsx
├── RestaurantProseContent.tsx
├── RestaurantInternalLinks.tsx
└── constants/restaurantDelivery.ts
```

---

### 5. `/hotel-logistics-partner/page.tsx` (518 lines)

**Can Reuse:**
- `StatsStrip`
- `BenefitsGrid`
- `HowItWorks`
- `FaqSection`
- `CtaSection`

**New Components:**
```
/hotel-logistics-partner/
├── page.tsx (~80 lines)
├── HotelHero.tsx
├── HotelUseCases.tsx
├── HotelProseContent.tsx
├── HotelInternalLinks.tsx
└── constants/hotelLogistics.ts
```

---

## Shared Component Library

All SEO landing pages can now use these shared components from `/components/seo-pages/`:

| Component | Props | Usage |
|-----------|-------|-------|
| `SeoPageHero` | badge, title, description, CTAs | Hero sections |
| `StatsStrip` | stats[], accentColor | Key metrics |
| `BenefitsGrid` | title, benefits[], columns | Feature grids |
| `HowItWorks` | title, steps[] | Process steps |
| `FaqSection` | faqs[] | FAQ accordions |
| `CoverageAreas` | title, areas[] | Location coverage |
| `CtaSection` | title, whatsappLink, phone | Call-to-action |
| `InternalLinksSection` | links[] | Related pages |
| `ProseContent` | children | Long-form content |

---

## Benefits of This Architecture

1. **Maintainability**: Each component < 60 lines
2. **Reusability**: Shared components across 8+ SEO pages
3. **Testability**: Isolated components are easier to test
4. **Performance**: Smaller bundles per route
5. **Consistency**: Unified UI patterns across pages
6. **SEO**: Constants files make metadata updates easy

---

## Implementation Priority

1. ✅ `/hyperlocal-delivery-service/` — DONE
2. 🔲 `/fleet-branding-rajasthan/` — Similar structure, quick win
3. 🔲 `/restaurant-delivery-partner/` — Similar structure
4. 🔲 `/hotel-logistics-partner/` — Similar structure
5. 🔲 `/fare-calculator/` — More complex, needs custom components
6. 🔲 `/contact/` — Most complex, many unique elements
