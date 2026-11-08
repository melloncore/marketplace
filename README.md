# Mellon Strata Core Marketplace

Next.js (App Router) + TypeScript + Tailwind + React Query + react-icons +
react-toastify.

    npm install
    npm run dev          # http://localhost:3002
    npm test             # run all tests
    npm run test:watch
    npm run test:coverage
    npm run typecheck

- Products and stock are loaded from the backend; initial products are seeded
  by `backend/prisma/seed.ts`. Per-category display labels are in `lib/products.ts`.
- Checkout rules (delivery fee, validation): `lib/checkout.ts`
- `lib/payment.ts` starts a Paystack transaction through the backend. Configure
  `PAYSTACK_SECRET_KEY`, `MARKETPLACE_URL`, and `PAYSTACK_CALLBACK_URL` on the
  backend; the secret must never be exposed to the browser.
- Payment card fields are entered on Paystack-hosted checkout, not this site.
  Orders and stock are persisted and checked by the backend; the cart is local.
- Anonymous page views and click labels are sent only after analytics consent.
- Set `NEXT_PUBLIC_API_URL` (see `.env.example`) for the backend API base URL.
- Use `.env` for local development and `.env.production` for production builds.
  Production API calls use same-origin `/api/v1`, proxied by `next.config.mjs`
  to the origin configured in `BACKEND_URL`.
- The client, admin, and marketplace use localhost ports 3000, 3001, and 3002,
  respectively. Same-origin API proxies keep cookies first-party and available
  across all three ports.
- The marketplace and client share analytics consent; set
  `NEXT_PUBLIC_COOKIE_DOMAIN` to the bare shared production parent domain (for
  example, `.melloncore.com`, without a URL scheme or path) so consent persists
  across their subdomains. Leave it unset for localhost.
- API modules are grouped in `lib/api/` by concern (`marketplace`, `analytics`,
  and `landing`); shared request handling is in `http.ts`. React Query powers
  product queries and checkout, consent, and analytics mutations.
- Tests live in `__tests__/`
