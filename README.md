# GadgetHub

Next.js 14 (App Router) + TypeScript + Tailwind + react-icons + react-toastify.

    npm install
    npm run dev          # http://localhost:3000
    npm test             # run all tests
    npm run test:watch
    npm run test:coverage
    npm run typecheck

- Products and per-category specs: `lib/products.ts` (types in `lib/types.ts`)
- Checkout rules (delivery fee, validation): `lib/checkout.ts`
- Payment is SIMULATED in `lib/payment.ts` - swap for Paystack/Flutterwave
- Cart and orders live in localStorage
- Tests live in `__tests__/`
