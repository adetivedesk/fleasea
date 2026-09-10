# Fleasea — B2B Wholesale Fish Trading Platform

Frontend-only **V1 functional prototype**. Fleasea is a bulk fish trading marketplace
connecting approved wholesale fish buyers / distributors with a platform administrator.

> This is **not** a consumer store. Quantities are in **KG / TON**, prices are wholesale,
> merchants must be **approved**, and orders move through **negotiation → payment terms →
> shipment → delivery**.

There is **no backend** in V1 — all data is mock data held in React state and
`localStorage`. The service layer (`src/services/`) is written so the mock
implementations can later be swapped for real REST/GraphQL calls without touching the UI.

---

## Technology stack

| Concern        | Choice                     |
| -------------- | -------------------------- |
| Framework      | React 18 + TypeScript      |
| Build tool     | Vite 6                     |
| Styling        | Tailwind CSS 3             |
| Routing        | React Router 6             |
| Icons          | lucide-react               |
| State          | React Context + localStorage |

No state-management or UI-kit dependencies — components are hand-built and reusable.

---

## Installation

```bash
npm install
```

## Commands

```bash
npm run dev       # start dev server (http://localhost:5173/fleasea/)
npm run build     # typecheck + production build to dist/
npm run preview   # preview the production build
npm run lint      # tsc --noEmit typecheck
```

> The app is configured for **GitHub Pages** deployment under a base path:
> `vite.config.ts` sets `base: '/fleasea/'`, `public/404.html` + a snippet in
> `index.html` handle SPA deep-link redirects, and `BrowserRouter` uses
> `basename={import.meta.env.BASE_URL}`. Change `base` (and the repo name) if you
> deploy elsewhere.

---

## Demo accounts (mock, no passwords)

| Role              | Email                   | Lands on                        |
| ----------------- | ----------------------- | ------------------------------- |
| Admin             | `admin@fleasea.demo`    | `/admin`                        |
| Approved merchant | `merchant@fleasea.demo` | `/merchant`                     |
| Pending merchant  | `pending@fleasea.demo`  | `/merchant/application-status`  |

## Prototype role switching

A **Prototype Mode** bar is fixed to the top of every screen (spec §52). Use
**Preview As** to instantly switch between _Visitor_, _Pending Merchant_,
_Approved Merchant_ and _Admin_ — no login needed. The same bar carries the
**Language**, **Currency** and **Reset Demo Data** controls.

Everything prototype-only lives in `src/components/prototype/` and can be deleted
wholesale when real authentication arrives.

---

## Mock data / service architecture

```
src/services/
  mock/db.ts          localStorage-backed collection helpers + fake latency
  currencyService.ts  example service (list / updateRate / setActive)
  ...                 productService, merchantService, orderService … (later phases)
```

Components call `someService.method()` and never read `localStorage` directly.
`localStorage` keys are centralised in `src/constants/index.ts` (`STORAGE_KEYS`).

Persisted state (spec §53): language, currency, demo role, cart, merchant/product/
price/inventory changes, negotiations, orders, payments, shipment status,
notifications. **Reset Demo Data** clears all of it except language/currency/role.

---

## Routes

**Public** `/` · `/products` · `/products/:id` · `/about` · `/contact` · `/login` · `/register`

**Pending merchant** `/merchant/application-status`

**Merchant** `/merchant` · `/merchant/products` · `/merchant/products/:id` ·
`/merchant/cart` · `/merchant/checkout` · `/merchant/orders` · `/merchant/orders/:id` ·
`/merchant/negotiations` · `/merchant/shipments` · `/merchant/shipments/:id` ·
`/merchant/documents` · `/merchant/payments` · `/merchant/profile` · `/merchant/notifications`

**Admin** `/admin` · `/admin/products` · `/admin/products/new` · `/admin/products/:id` ·
`/admin/pricing` · `/admin/inventory` · `/admin/merchants` · `/admin/merchants/:id` ·
`/admin/negotiations` · `/admin/orders` · `/admin/orders/:id` · `/admin/payments` ·
`/admin/shipments` · `/admin/shipments/:id` · `/admin/delivery` · `/admin/users` ·
`/admin/reports` · `/admin/settings` · `/admin/settings/currencies`

Access is gated in the UI only (`src/layouts/*` + `AccessGate`). **This is not real
security** — real authorization is a V2 backend responsibility (spec §59).

---

## Folder structure

```
src/
  components/
    ui/          Button, Card, Badge, StatusBadge, form controls, states
    layout/      Header, Footer, DashboardShell, Logo, Selectors
    common/      AccessGate, Placeholder, ScrollToTop
    prototype/   PrototypeBar (dev-only role switcher)
  layouts/       PublicLayout, PendingLayout, MerchantLayout, AdminLayout
  pages/         public/ merchant/ admin/ + placeholders
  routes/        AppRoutes, navigation config
  services/      mock service layer
  data/          currencies, categories, images (seed data)
  types/         domain interfaces (spec §49)
  constants/     status definitions (spec §58) + storage keys
  i18n/          centralised EN / AR translations + provider
  store/         AppContext (language, currency, role, price conversion)
  utils/         currency, quantity (KG/TON), formatting, storage
```

---

## Theme, bilingual & currency

### Theme

`brand` = **ocean teal** (`#2b7d99` family) · `sea` = a same-hex alias of `brand`
· `ink` = neutral greys · `accent` = orange (unused reserve). Defined in
`tailwind.config.js`. Professional, commercial, seafood-trading tone — strong
whitespace, cards and tables, minimal decoration.

### Bilingual + currency

- **EN / AR** with automatic **RTL** when Arabic is selected (`<html dir>` is switched).

  Translations are centralised in `src/i18n/translations.ts`.
- **Currencies**: SAR (base), USD, EUR, AED, GBP. The product **base price never
  changes** — only the displayed conversion does, always shown with its unit
  (`SAR 28.00 / KG`) and the disclaimer _"Indicative converted price…"_.

---

## Build phases

| Phase | Scope | Status |
| ----- | ----- | ------ |
| 1 | Setup, theme, layout, routing, responsive nav, language, currency, role switcher | ✅ done |
| 2 | Public site, product preview, product detail, registration + result, mock login | ✅ done |
| 3 | Merchant dashboard, catalog + filters, product detail (KG/TON), cart, negotiation, profile | ✅ done |
| 4 | Checkout, 3 payment terms + simulator, orders + detail, shipment tracking, documents (70% lock), payments | ✅ done |
| 5 | Admin dashboard + charts, merchant approvals + detail tabs, product mgmt + public cap, daily pricing, inventory | ✅ done |
| 6 | Admin negotiations (counter/accept/reject), orders + status, payments, shipments (create/assign/track), delivery + POD + variance | ✅ done |
| 7 | Notification center + header bell, reports + CSV export, settings, currency mgmt, users & roles | ✅ done |
| 8 | Error boundary, responsive tables (min-width + scroll), RTL icon flips, i18n chrome, cleanup | ✅ done |

---

## Future backend integration notes

1. Replace each `src/services/*Service` mock body with API calls — keep signatures.
2. Remove `src/components/prototype/` and wire `AppContext` role to a real session.
3. Replace `AccessGate` UI gating with server-enforced authorization + route guards.
4. Move seed data (`src/data/`) and image URLs to backend storage.
5. Swap `localStorage` persistence for server state; keep only UI prefs local.
