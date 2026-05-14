# Miso Fix It — Credit Tradeline Platform

## Original Problem Statement
Build a credit fixture website similar to tradelinesupply.com/pricing for "Miso Fix It" business. Home page + customer intake form capturing name, payment history %, credit age, credit score, derogatory marks, credit utilization %, credit limit, number of accounts. Form must include credit-factors dashboard visualizations (per two reference screenshots: TU/EQ score gauges + 6 impact cards). Business offers 4 individual tradelines and 6 bundles with Amex Power Pack as MOST POPULAR. Customers pay weekly / biweekly / monthly / straight deposit. 20% partner referral program.

## Architecture
- **Frontend**: React 19 + React Router + Tailwind + Shadcn/UI + Framer Motion + Recharts
- **Backend**: FastAPI + Motor (async MongoDB)
- **Payments**: Stripe Checkout via emergentintegrations (test key `sk_test_emergent`)
- **Fonts**: Outfit (display) + Plus Jakarta Sans (body)
- **Theme**: Swiss/high-contrast light mode, Klein blue primary (#002FA7)

## Core Requirements (Static)
1. Home page — hero, value props, how-it-works, stats, CTA
2. Pricing page — tabs for Bundles/Individual; Amex Power Pack glow badge
3. Qualifier form with live dashboard (6 factor cards + 2 score gauges)
4. Stripe checkout (amount derived server-side based on schedule split)
5. Success/Cancel pages with polling status
6. FAQ page + Admin page (view submissions)
7. Partner referral info display (no signup portal)

## User Personas
- **End customer (rebuild)**: Thin-file or derogatory-heavy consumer looking for score lift before mortgage/auto
- **Affiliate/credit repair co.**: Wants easy 20% commission on referrals
- **Business owner (admin)**: Views applications via /admin

## What's Implemented (2026-02-28)
- [x] Full home/pricing/qualifier/success/cancel/faq/admin pages
- [x] Live credit-factors dashboard (updates as user types)
- [x] 4 individual tradelines + 6 bundles on `/api/packages`
- [x] `/api/applications` POST/GET + GET-by-id
- [x] Stripe checkout session creation (weekly ÷13 / biweekly ÷6 / monthly ÷3 / straight = full)
- [x] Stripe status polling + webhook endpoint
- [x] MongoDB collections: `applications`, `payment_transactions`
- [x] URL `?package=` preselect on qualifier (race-fix verified)
- [x] Admin table lists all submissions

## Prioritized Backlog
### P1 (next)
- Email notifications on new application (Resend/SendGrid) — user wanted this but didn't provide service credentials
- Admin authentication (currently open route)
- Affiliate signup flow + payout dashboard

### P2
- Weekly recurring Stripe subscription (currently schedule affects first charge amount only; recurring not auto-billed)
- Before/after score case studies (testimonials)
- Blog / educational content section
- Analytics dashboard (conversion rate per package)

## Known Mocked/Deferred Items
- **Email notifications: NOT IMPLEMENTED** — user said "both" (DB + email) but didn't provide Resend/SendGrid key. Applications currently visible only at /admin.
- **Recurring weekly billing**: Stripe session currently charges per-period amount as one-time. True subscription billing requires additional Stripe Price setup.
- Admin page has no auth (acceptable for MVP — business owner only).

## Next Tasks
1. Gather email provider choice + API key and wire up SendGrid/Resend
2. Decide on admin auth approach (simple password, magic link, or Emergent Google auth)
3. Add true recurring subscription billing for weekly/biweekly/monthly schedules
