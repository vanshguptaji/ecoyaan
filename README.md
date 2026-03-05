# 🌿 Ecoyaan — Checkout Flow

A simplified checkout flow for [Ecoyaan](https://ecoyaan.com), built as a frontend engineering assignment. The application guides a user from reviewing their cart → entering shipping details → confirming & simulating payment.

---

## 🏗 Architecture & Design Decisions

### Tech Stack

| Layer              | Choice                                |
| ------------------ | ------------------------------------- |
| Framework          | **Next.js 16** (App Router)           |
| Language           | **TypeScript**                        |
| Styling            | **Tailwind CSS v4**                   |
| State Management   | **React Context API**                 |
| Data Fetching      | **Server Components (SSR)**           |
| Mock Backend       | **Next.js API Route** (`/api/cart`)   |

### Folder Structure

```
ecoyaan/
├── app/
│   ├── api/cart/route.ts          # Mock API endpoint
│   ├── checkout/
│   │   ├── layout.tsx             # Shared checkout layout (Header + Footer + Provider)
│   │   ├── cart/page.tsx          # Step 1 — Server Component (SSR)
│   │   ├── shipping/page.tsx      # Step 2
│   │   ├── payment/page.tsx       # Step 3
│   │   └── success/page.tsx       # Order confirmation
│   ├── globals.css
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Redirects to /checkout/cart
├── components/
│   ├── cart/                      # Cart-specific components
│   ├── shipping/                  # Shipping form
│   ├── payment/                   # Payment review
│   ├── success/                   # Success screen
│   ├── layout/                    # Header, Footer
│   └── ui/                        # Shared UI (StepIndicator)
├── context/
│   └── CheckoutContext.tsx        # Global checkout state (Context API)
├── lib/
│   ├── mock-data.ts               # Mock cart JSON
│   └── utils.ts                   # Formatters & validators
└── types/
    └── index.ts                   # Shared TypeScript interfaces
```

### Key Architectural Choices

1. **Server-Side Rendering (SSR)**
   - The **Cart page** is a Next.js **Server Component** that fetches mock data asynchronously on the server before rendering. This demonstrates SSR best practices with the App Router.
   - A dedicated **API route** (`/api/cart`) also serves the same data, showing how a real backend integration would work.

2. **State Management — Context API**
   - A `CheckoutProvider` wraps the entire `/checkout` route group via a shared layout, persisting cart data and shipping address across all steps without prop drilling.
   - The context is lightweight and purpose-built; no need for heavier libraries like Redux for this scope.

3. **Form Validation**
   - Real-time validation on blur + on change (after first blur) for a smooth UX.
   - Validates email format, 10-digit Indian phone numbers, 6-digit PIN codes, and required fields.

4. **Responsive Design**
   - Fully responsive using Tailwind's mobile-first utility classes.
   - Grid layout adapts from single-column (mobile) to multi-column (desktop).

5. **Separation of Concerns**
   - **Server Components** handle data fetching.
   - **Client Components** handle interactivity (forms, navigation, state).
   - Components are organized by feature domain (`cart/`, `shipping/`, etc.).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** or **yarn** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/vanshguptaji/ecoyaan.git
cd ecoyaan

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to the checkout cart.

### Build for Production

```bash
npm run build
npm start
```

---

## 📱 Checkout Flow

1. **Cart** (`/checkout/cart`) — View items, subtotal, shipping & grand total. Proceed to checkout.
2. **Shipping** (`/checkout/shipping`) — Fill in name, email, phone, PIN code, city, state with live validation.
3. **Payment** (`/checkout/payment`) — Review order summary & shipping address. Click "Pay Securely" to simulate payment.
4. **Success** (`/checkout/success`) — Order confirmation with a summary and a link to continue shopping.

---

## 🌐 Deployment

Deployed on **Vercel**: _[Add your Vercel link here after deploying]_

To deploy yourself:

```bash
npx vercel
```

---

Built with 💚 for the planet.
