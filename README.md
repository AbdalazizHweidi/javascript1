# Frontend Checkout Flow

A polished responsive checkout flow built with React, Vite, and Tailwind CSS.

## Features

- Multi-step checkout flow
- Checkout summary
- Personal/contact information form
- Billing/shipping address form
- Credit/debit card form
- Inline validation errors
- Loading state during payment submission
- Success and failure states
- Responsive layout for mobile, tablet, and desktop
- Accessible labels, focus states, and semantic structure
- Mock payment submission only — no real payment processing

## Tech Stack

- React
- Vite
- Tailwind CSS
- Lucide React icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the project locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Notes

This project intentionally mocks payment processing on the frontend. Real payment applications should use a PCI-compliant provider such as Stripe, Adyen, Braintree, or Checkout.com and should never store raw card data directly in frontend code.
