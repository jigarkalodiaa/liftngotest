# Liftngo — Product context for development (Cursor / contributors)

**How to use:** Point Cursor at this file (or paste its path in chat): *“Use `docs/LIFTNGO_PRODUCT_CONTEXT.md` for product decisions, copy, APIs, and UX.”*

---

## 1. Business overview

Liftngo is a **hyperlocal logistics** company: on-demand **intra-city goods transport** using **EV cargo** vehicles (not passenger cabs).

- **Primary customers:** B2B (shops, wholesalers, vendors, event organizers, construction material suppliers, temple-zone logistics).
- **Secondary:** B2C (individuals, light household goods).
- **Strategic shift:** Move from unstable B2C-heavy demand toward **structured B2B** (contracts, recurring runs, higher utilization).

**Vision:** Become the **default goods transport network** in dense hyperlocal markets, starting with the **Khatu** region (including religious / mandir-adjacent logistics).

---

## 2. What Liftngo is not

- Not a passenger cab / ride-hailing product.
- Not long-distance freight or national logistics (at least not in v1 positioning).
- Not framed as a Porter/Uber-style open marketplace unless the product explicitly evolves that way.

---

## 3. Fleet and operations (current)

| Item | Detail |
|------|--------|
| Vehicle type | EV cargo — compact **three-wheel electric cargo** (OEM-agnostic fleet) |
| Example registration | DL51EV4490 (real asset in ops; treat as example in UI if needed) |
| Focus | Last-mile / intra-city, short hops |

---

## 4. Roles

1. **Customer** — Books delivery, pays. Often a business owner (target persona).
2. **Driver** — Operates vehicle, completes rides, tracked on performance and earnings.
3. **Admin** — Oversight: rides, drivers, earnings, performance; optional manual assignment.

---

## 5. Driver compensation (source of truth for simulations and dashboards)

- **Fixed salary:** ₹15,000 / month.
- **Incentive 1:** ₹2,000 if **27 duties / month** completed (see duty definition below).
- **Incentive 2:** ₹200 for **5th completed ride in a single day**.
- **Driver pays:** Electricity (charging).
- **Company pays:** Food — **conditional on performance** (tie to rules below when building policies in product).
- **Performance gates (for incentives / food):** Maintain **performance score > 75%**, minimize cancellations, punctuality. Exact formulas can be defined later; product should allow **configurable thresholds** where possible.

---

## 6. Duty and ride definitions (critical for KPIs and incentives)

- **One ride:** At least **one completed delivery** leg (minimum viable unit for counts and revenue attribution).
- **One duty (for incentive / ops):** A day where the driver hits **3+ rides** **and** **minimum ~₹2,300 revenue** for that day (benchmark from operations — make this configurable in admin if implementing automation).
- **Benchmark:** ~**₹2,300 / day** target with **3+ rides** when discussing unit economics in UI copy or internal tools (not a hard law unless backend enforces it).

---

## 7. Revenue and pricing

- **Revenue model:** Per-trip charge based on **distance + demand** (surge/zone rules may apply later).
- **Pricing discussion:** Historical thinking **₹35/km**, considering **₹25/km** — **do not hard-code**; expose as config. Any change must preserve **driver utilization** and **margin after salary + incentives**.

---

## 8. Core business problems the product should address

- Low **rides per day per vehicle** (utilization).
- **Revenue volatility** (especially B2C-heavy mix).
- **Driver idle time**.
- Weak **repeat bookings** — B2B retention and contracts are the lever.

---

## 9. Product modules (customer / driver / admin)

### Customer (web/app)

- Booking: pickup, drop, **estimated fare**, confirm.
- Payments: cash now; **UPI / online** planned.
- **Future:** live tracking, B2B portal, subscriptions.

### Driver (app)

- Login → accept/complete rides → **end-of-day** earnings summary.
- Surfaces: rides count, daily revenue contribution, performance score.

### Admin

- All rides, driver performance, earnings dashboard.
- Optional manual assignment.
- **Future:** route optimization, automated driver payouts, performance scoring engine, WhatsApp booking handoff.

---

## 10. KPIs (use in analytics, dashboards, and feature prioritization)

| KPI | Notes |
|-----|--------|
| Rides / day / vehicle | Primary utilization metric |
| Revenue / day (per vehicle & aggregate) | Tie to duty benchmark |
| Cost / day (salary + incentives allocated) | Per-vehicle modeling |
| Profit / vehicle / day or month | North-star for ops tools |
| Driver performance score | Gated incentives |
| Cancellation rate | Service quality & reliability |

---

## 11. Tech direction (high level)

- **Frontend:** React (this repo: Next.js).
- **Backend:** May be Django or Node elsewhere — keep APIs **resource-oriented** (bookings, drivers, trips, payouts, metrics).
- **Integrations:** Maps/routing, payments (UPI), future WhatsApp.

---

## 12. Brand voice (for UI strings, marketing pages, errors)

- **Tone:** Simple, trustworthy, local-friendly, fast and reliable — **not** corporate jargon.
- **Example phrases:** “Fast goods delivery near you”, “Affordable transport in minutes”, “Reliable local delivery partner”.
- Prefer **Hindi/English mix** only if the product already localizes that way; default to clear, short English unless `locale` demands otherwise.

---

## 13. North-star for engineering

Build Liftngo as a **high-utilization logistics engine** (allocation, repeat demand, B2B workflows), not only a one-off booking form.

---

## 14. Scaling lens (5 → 50 vehicles)

- **B2B acquisition:** Daily/weekly routes, named accounts (shops, mandir zone vendors, events).
- **Subscriptions / retainers** (future) to smooth demand.
- **SOPs:** Duty completion, charging, handoff times, SLAs for B2B.
- **Pricing:** Optimize per km and **minimum order / minimum billing** for B2B, not only consumer fares.

---

*Last consolidated for development: March 2025. Update this file when fleet size, compensation, or duty rules change.*
