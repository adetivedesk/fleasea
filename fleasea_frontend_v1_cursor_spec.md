# FLEASEA — B2B Wholesale Fish Trading Platform
## Frontend-Only V1 Functional Prototype

Build a production-quality, responsive **frontend-only B2B wholesale fish trading web application** called **Fleasea**.

This is NOT a normal consumer e-commerce website.

Fleasea is a **bulk fish trading marketplace** connecting approved wholesale fish buyers/distributors with the platform administrator.

The application must be fully functional on the frontend using **mock data, local state, and localStorage where useful**.

Do NOT implement a real backend, database, real payment gateway, real authentication server, or real external API in V1.

However, structure the frontend cleanly so that the mock services can later be replaced with REST/GraphQL APIs and a real database without rebuilding the UI.

---

# 1. PRODUCT OBJECTIVE

Fleasea allows:

### Public visitors
- Browse the public website
- View prices for only products specifically made public by Admin
- Maximum public price visibility: 1–5 products
- Learn about Fleasea
- Register as a wholesale merchant
- Login

### Registered but unapproved merchants
- Login
- View registration status
- See a limited/pending experience
- Cannot access complete wholesale catalog
- Cannot place wholesale orders
- Cannot access restricted pricing

### Approved merchants
- Access complete fish catalog
- View current prices
- Select currency
- View available quantities
- View product details
- Add products to wholesale cart
- Request negotiations
- Negotiate product prices
- Submit wholesale orders
- Select payment terms
- View orders
- View shipments
- View delivery information
- View invoices/documents
- Manage company profile

### Admin
Admin controls the entire marketplace frontend experience:
- Dashboard
- Fish products
- Categories
- Daily prices
- Inventory
- Public product visibility
- Merchant applications
- Merchant approval/rejection/suspension
- Negotiations
- Orders
- Payments
- Shipments
- Deliveries
- Invoices
- Currencies
- Users
- Roles
- Reports
- Settings

---

# 2. PRIMARY FISH CATEGORIES

1. Fresh / Ice Fish
2. Live Fish
3. Frozen Fish

Each product supports:
- Product name
- Arabic product name
- English product name
- Category
- Origin
- Grade
- Size
- Weight range
- Packaging
- Description
- Images
- Available quantity
- Quantity unit
- Minimum order quantity
- Current price
- Base currency
- Price effective date
- Public visibility
- Product status
- Stock status

---

# 3. WHOLESALE BUSINESS MODEL

This is a wholesale bulk trading platform, not a consumer store.

Use quantities such as KG and TON.

Example:
Fresh Hamour
Available: 8.5 TON
Minimum order: 500 KG
Price: SAR 28 / KG

---

# 4. USER TYPES

### PUBLIC VISITOR
Can:
- Home
- Public product catalog
- Public product details
- Login
- Merchant registration

Cannot:
- Full catalog
- Wholesale ordering
- Negotiation
- Private prices

### PENDING MERCHANT
Can:
- Login
- Dashboard
- Application status
- Company profile
- Logout

Cannot:
- Full catalog
- Order
- Negotiation

Show:
"Your merchant application is currently under review."

### APPROVED MERCHANT
Can:
- Full catalog
- Product details
- Current pricing
- Currency selection
- Cart
- Negotiation
- Orders
- Payments
- Shipments
- Delivery
- Documents
- Profile

### ADMIN
Full access.

Create a frontend role switcher for development:
- Visitor
- Pending Merchant
- Approved Merchant
- Admin

This is only for prototype/development and should be easy to remove when real authentication is implemented.

---

# 5. TECHNOLOGY

Preferred:
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide icons
- Reusable components
- Responsive design
- Local mock data
- localStorage

If an existing repository already has an established framework, respect it instead of unnecessarily replacing it.

Do not introduce unnecessary dependencies.

---

# 6. DESIGN DIRECTION

Create a premium B2B seafood trading interface.

Visual direction:
- Professional
- Modern
- Clean
- Commercial
- Trustworthy
- Premium
- International trading company
- Ocean/seafood inspired but not overly decorative

Avoid:
- Cartoon fish
- Excessive gradients
- Consumer grocery styling
- Cluttered dashboards
- Huge decorative illustrations
- Excessive animations

Use strong whitespace, clear typography, cards, tables and commercial dashboard patterns.

---

# 7. RESPONSIVE DESIGN

Support:
- Desktop
- Laptop
- Tablet
- Mobile

Admin dashboard prioritizes desktop/tablet but remains usable on mobile.

Merchant ordering must be mobile-friendly.

Navigation transforms into mobile menu.

Tables become responsive cards or horizontally scrollable tables where appropriate.

---

# 8. BILINGUAL SUPPORT

Support:
- English
- Arabic

Default: English.

Arabic must use RTL layout.

When Arabic is selected:
- Direction becomes RTL
- Navigation reverses correctly
- Tables/cards remain usable
- Forms align correctly
- Buttons and icons adapt
- Sidebar adapts
- Breadcrumbs adapt

Create centralized translations.

---

# 9. CURRENCY SYSTEM

Support:
- SAR
- USD
- EUR
- AED
- GBP

Each product has a base price.

Example:
Base: SAR 28/KG

Display converted values according to selected currency.

Important:
Do not change the underlying master/base price when currency changes.

Show:
"Indicative converted price. Final trading price is confirmed at order/negotiation."

---

# 10. PUBLIC WEBSITE

Create:
- Home
- Products
- Product details
- About
- Contact
- Login
- Merchant Registration

Home sections:
- Header
- Hero
- Categories
- Featured wholesale products
- How it works
- Trust section
- CTA
- Footer

Public featured products are Admin-selected, maximum 5.

---

# 11. PUBLIC PRODUCT CATALOG

Only products where:
`publicVisible === true`

Maximum 5.

Filters:
- All
- Fresh/Ice
- Live
- Frozen

Hidden products must not be accessible through public direct URLs.

Restricted access message:
"Wholesale access required"

CTA:
"Register as Merchant"

---

# 12. MERCHANT REGISTRATION

Fields:

Company:
- Company name
- Company name Arabic
- Business type
- Commercial registration number
- VAT/Tax number
- Country
- City
- Address

Contact:
- Full name
- Position
- Email
- Mobile
- WhatsApp

Business:
- Business activity
- Estimated monthly purchase volume
- Preferred fish categories
- Preferred product types
- Preferred delivery locations
- Preferred currency

Documents UI:
- Commercial registration
- Tax/VAT certificate
- Business license
- Other supporting document

Frontend only: show filenames and store mock metadata.

Account:
- Password
- Confirm password

Checkbox:
"I agree to the Terms and Privacy Policy."

Submit:
"Submit Merchant Application"

---

# 13. REGISTRATION RESULT

Show:
"Application Submitted"

Status:
"PENDING APPROVAL"

Message:
"Your merchant application has been submitted successfully. Our team will review your business information and contact you once your account is approved."

Button:
"Go to Login"

---

# 14. MERCHANT APPROVAL

Admin page:
`/admin/merchants`

Columns:
- Merchant
- Company
- Contact
- Country
- Registration date
- Application status
- Documents
- Estimated monthly volume
- Actions

Statuses:
- Pending
- Approved
- Rejected
- Suspended

Actions:
- View
- Approve
- Reject
- Suspend
- Reactivate

Use confirmation modals.

Admin can add internal notes.

---

# 15. APPROVED MERCHANT DASHBOARD

Route:
`/merchant`

Show:
- Active Orders
- Pending Negotiations
- Shipments in Transit
- Outstanding Payments

Recent Orders:
- Order number
- Date
- Items
- Quantity
- Total
- Status

Active Shipments:
- Shipment number
- Order
- Destination
- ETA
- Status

Current Market Highlights:
- Products
- Daily prices

Quick Actions:
- Browse Fish
- Request Quote
- View Orders
- Track Shipment

---

# 16. FULL MERCHANT CATALOG

Route:
`/merchant/products`

Features:
- Search
- Category filter
- Origin filter
- Size/grade filter
- Availability filter
- Price sorting
- Currency selector

Show:
- Fish image
- Name
- Category
- Origin
- Size
- Grade
- Available stock
- MOQ
- Current price
- Unit
- Price updated time
- Add to Cart
- Negotiate

Example:
"Price updated today at 09:30"

---

# 17. PRODUCT DETAIL

Route:
`/merchant/products/:id`

Show:
- Large product image
- Product name
- Arabic name
- Category
- Origin
- Size
- Grade
- Packaging
- Description
- Available inventory
- MOQ
- Current price
- Price history preview
- Currency conversion
- Price effective time

Quantity selector:
- KG
- TON

Allow:
500 KG
2 TON

Validate MOQ and available inventory.

Actions:
- Add to Cart
- Request Negotiation

---

# 18. CART

Route:
`/merchant/cart`

Columns:
- Product
- Price
- Unit
- Quantity
- Subtotal
- Remove

Support KG and TON.

Normalize internally to KG:
1 TON = 1,000 KG

Example:
500 KG × SAR 28/KG = SAR 14,000

---

# 19. NEGOTIATION SYSTEM

Support both product-level and order-level negotiation.

Product negotiation fields:
- Product
- Quantity
- Current price
- Proposed price
- Currency
- Message
- Desired delivery date

Statuses:
- Pending
- Counter Offer
- Accepted
- Rejected
- Expired

Admin:
- Accept
- Reject
- Counter Offer

Merchant:
- Accept counter
- Reject
- Submit another counter

Create conversation/timeline UI.

---

# 20. CHECKOUT

Sections:
- Order summary
- Buyer information
- Delivery information
- Payment terms

Payment terms:
1. Full Payment — 100%
2. 30% / 70% — 30% initial, remaining 70% before shipment documents are released
3. 100% Against Delivery

Make terms configurable in mock settings.

---

# 21. PAYMENT UI

Frontend only.

Do not integrate real payment gateways.

Payment methods:
- Bank Transfer
- Credit/Debit Card
- Online Payment
- Other

Simulate:
- Payment successful
- Payment pending
- Payment failed

---

# 22. PAYMENT WORKFLOW

100%:
Pending Payment → Payment Complete → Confirmed → Processing

30/70:
30% Pending → 30% Paid → Confirmed → Processing → Shipment → 70% Pending → 70% Paid → Shipment Documents Released

Against Delivery:
Confirmed → Processing → Shipped → Out for Delivery → Delivered → Payment Due → Paid

---

# 23. ORDER CONFIRMATION

After order:
"Order Successfully Submitted"

Generate mock order number:
`FL-20260910-00125`

Show:
- Order date
- Total
- Payment terms
- Delivery location
- Expected delivery
- Status

Buttons:
- View Order
- Track Shipment
- Download Order Summary

---

# 24. MERCHANT ORDERS

Route:
`/merchant/orders`

Filters:
- All
- Pending
- Confirmed
- Processing
- Shipped
- Delivered
- Cancelled

Show:
- Order #
- Date
- Items
- Quantity
- Amount
- Payment status
- Shipment status
- Order status

---

# 25. ORDER DETAIL

Show:
- Order information
- Products
- Financial summary
- Payment
- Timeline

Order timeline:
Order Placed → Confirmed → Processing → Packed → Shipped → Out for Delivery → Delivered

---

# 26. SHIPMENT TRACKING

Route:
`/merchant/shipments`

Show:
- Shipment number
- Order number
- Destination
- Carrier
- Vehicle
- Driver
- Dispatch date
- ETA
- Current status

Statuses:
- Preparing
- Packed
- Dispatched
- In Transit
- At Destination
- Out for Delivery
- Delivered

Create visual timeline.

---

# 27. DELIVERY

Show:
- Delivery address
- Scheduled date
- Actual date
- Delivered quantity
- Dispatched quantity
- Difference/variance
- Driver
- Vehicle
- Proof of delivery

Support variance.

Example:
Dispatched: 2,000 KG
Delivered: 1,980 KG
Variance: -20 KG

---

# 28. DOCUMENT CENTER

Route:
`/merchant/documents`

Documents:
- Order confirmation
- Invoice
- Shipment document
- Delivery note
- Proof of delivery
- Payment receipt

For 30/70:
Shipment documents are locked until 70% payment is complete.

Message:
"Complete the remaining 70% payment to access this document."

---

# 29. ADMIN DASHBOARD

Route:
`/admin`

Summary:
- Total Merchants
- Pending Approvals
- Active Products
- Today's Inventory
- Today's Orders
- Pending Negotiations
- Pending Payments
- Active Shipments

Charts:
- Orders over time
- Sales value
- Product category distribution
- Inventory levels

---

# 30. ADMIN PRODUCT MANAGEMENT

Route:
`/admin/products`

Features:
- Product list
- Search
- Filter
- Create
- Edit
- Duplicate
- Archive
- Active/inactive
- Public visibility

Product form:
- English name
- Arabic name
- Category
- Origin
- Grade
- Size
- Packaging
- Description
- Images
- MOQ
- Quantity
- Unit
- Base price
- Currency
- Public visibility

---

# 31. ADMIN PUBLIC VISIBILITY

Admin can toggle:
`Public Preview = ON/OFF`

Counter:
`Public products: 4 / 5`

Prevent selecting more than 5.

When sixth is selected:
"Public preview is limited to 5 products. Remove another product from public preview first."

---

# 32. ADMIN DAILY PRICING

Route:
`/admin/pricing`

Display:
- Product
- Current price
- Previous price
- Currency
- Unit
- Effective time
- Updated by
- Status

Admin can update today's price.

Show percentage change.

Allow bulk price updates.

Confirm before publishing.

---

# 33. PRICE HISTORY

Show:
Date | Price | Change

Example:
Sep 10 | SAR 28 | +1.82%
Sep 9 | SAR 27.50 | +3.77%
Sep 8 | SAR 26.50 | -1.85%

Add small chart.

---

# 34. ADMIN INVENTORY

Route:
`/admin/inventory`

Display:
- Product
- Available KG
- Available TON
- Reserved KG
- Available after reservations
- MOQ
- Stock status

Statuses:
- In Stock
- Low Stock
- Critical
- Out of Stock

Adjustment form:
- Quantity
- Unit
- Increase/decrease
- Reason

---

# 35. ADMIN NEGOTIATIONS

Route:
`/admin/negotiations`

Show:
- Negotiation #
- Merchant
- Product
- Quantity
- Current price
- Proposed price
- Difference
- Status
- Created date

Actions:
- Accept
- Reject
- Counter Offer

Conversation view.

---

# 36. ADMIN ORDERS

Route:
`/admin/orders`

Show:
- Order number
- Merchant
- Date
- Quantity
- Amount
- Payment term
- Payment status
- Order status
- Shipment status

Admin can update:
- Order status
- Payment status
- Shipment status

---

# 37. ADMIN SHIPMENTS

Route:
`/admin/shipments`

Create shipment:
- Order
- Shipment number
- Carrier
- Vehicle
- Driver
- Dispatch date
- ETA
- Destination
- Quantity
- Notes

Update status.

---

# 38. ADMIN DELIVERY

Admin can update:
- Dispatched quantity
- Delivered quantity
- Delivery date
- Driver
- Vehicle
- Delivery notes
- Proof of delivery

---

# 39. ADMIN PAYMENTS

Route:
`/admin/payments`

Show:
- Payment ID
- Order
- Merchant
- Amount
- Payment method
- Payment term
- Status
- Date

Statuses:
- Pending
- Processing
- Paid
- Failed
- Refunded

---

# 40. ADMIN CURRENCY SETTINGS

Route:
`/admin/settings/currencies`

Show:
- Currency
- Symbol
- Exchange rate
- Active
- Last updated

Actions:
- Add
- Edit exchange rate
- Activate/deactivate

---

# 41. ADMIN USERS & ROLES

Roles:

### Super Admin
Everything.

### Sales/Admin
- Products
- Pricing
- Merchants
- Negotiations
- Orders

### Operations
- Inventory
- Shipments
- Delivery

### Finance
- Payments
- Invoices
- Financial reports

Create frontend role-based UI visibility.

---

# 42. ADMIN MERCHANT DETAIL

Tabs:
- Overview
- Contacts
- Documents
- Orders
- Negotiations
- Payments
- Notes
- Status

---

# 43. NOTIFICATIONS

Create notification center.

Notifications:
- Merchant approved
- Merchant rejected
- Price changed
- Negotiation received
- Counter offer received
- Order confirmed
- Payment received
- Payment pending
- Shipment dispatched
- Shipment delivered
- Document unlocked

Header notification badge.

---

# 44. SEARCH

Global/product search:
- Fish name
- Product code
- Category
- Origin

Create useful empty states.

---

# 45. LOADING / ERROR / EMPTY STATES

Create reusable states for:
- Loading
- Empty
- Error
- No results
- Out of stock
- Price unavailable
- Pending approval
- Payment failed
- Negotiation expired
- Document locked

---

# 46. TOASTS

Actions should show toast messages:
- Product added
- Order submitted
- Negotiation sent
- Price updated
- Merchant approved
- Inventory updated
- Payment completed

---

# 47. MOCK DATA

Seed realistic data.

Products: 15–20 across all 3 categories.

Merchants: at least 8 with mixed statuses.

Orders: at least 12 with mixed statuses.

Negotiations: at least 8.

Shipments: at least 6.

Payments: mixed payment terms/statuses.

Notifications: at least 15.

Use demo fish such as Hamour, Kingfish, Sardine, Mackerel, Sea Bream, Grouper, Tilapia and Shrimp/Prawn where appropriate.

These are demo products only.

---

# 48. MOCK SERVICE ARCHITECTURE

Do not put all mock data inside components.

Use:

src/
  components/
  pages/
  layouts/
  routes/
  services/
    mock/
  data/
  types/
  hooks/
  utils/
  i18n/
  store/

Create:
- productService
- merchantService
- orderService
- negotiationService
- paymentService
- shipmentService
- inventoryService
- notificationService
- currencyService

Use mock/localStorage data now.

---

# 49. TYPESCRIPT DATA TYPES

Create types/interfaces for:
- Product
- Category
- Merchant
- MerchantApplication
- User
- Role
- Permission
- Order
- OrderItem
- Negotiation
- NegotiationMessage
- Payment
- PaymentTerm
- Shipment
- Delivery
- Invoice
- Document
- Notification
- Currency
- PriceHistory
- Inventory
- Address

---

# 50. ROUTING

Public:
`/`
`/products`
`/products/:id`
`/about`
`/contact`
`/register`
`/login`

Merchant:
`/merchant`
`/merchant/products`
`/merchant/products/:id`
`/merchant/cart`
`/merchant/checkout`
`/merchant/orders`
`/merchant/orders/:id`
`/merchant/negotiations`
`/merchant/shipments`
`/merchant/shipments/:id`
`/merchant/documents`
`/merchant/payments`
`/merchant/profile`
`/merchant/notifications`

Admin:
`/admin`
`/admin/products`
`/admin/products/new`
`/admin/products/:id`
`/admin/pricing`
`/admin/inventory`
`/admin/merchants`
`/admin/merchants/:id`
`/admin/negotiations`
`/admin/orders`
`/admin/orders/:id`
`/admin/payments`
`/admin/shipments`
`/admin/shipments/:id`
`/admin/delivery`
`/admin/users`
`/admin/settings`
`/admin/settings/currencies`

---

# 51. MOCK AUTHENTICATION

Demo users:

Admin:
`admin@fleasea.demo`

Approved merchant:
`merchant@fleasea.demo`

Pending merchant:
`pending@fleasea.demo`

No real passwords/external authentication.

After login:
Admin → `/admin`
Approved Merchant → `/merchant`
Pending Merchant → `/merchant/application-status`

---

# 52. DEVELOPMENT ROLE SWITCHER

Add:
"Preview As"
- Visitor
- Pending Merchant
- Approved Merchant
- Admin

Label:
"Prototype Mode"

Isolate implementation so it can later be removed.

---

# 53. LOCAL STORAGE

Persist:
- Language
- Currency
- Demo role
- Cart
- Merchant approval changes
- Product changes
- Price changes
- Inventory changes
- Negotiations
- Orders
- Payments
- Shipment status
- Notifications

Add:
"Reset Demo Data"

---

# 54. REUSABLE COMPONENTS

Create:
- Button
- Input
- Select
- SearchInput
- Modal
- ConfirmDialog
- Toast
- Badge
- StatusBadge
- DataTable
- Pagination
- Card
- StatCard
- Tabs
- Dropdown
- DatePicker
- CurrencySelector
- LanguageSelector
- Sidebar
- Header
- Breadcrumb
- ProductCard
- ProductTable
- PriceDisplay
- QuantityInput
- OrderStatusTimeline
- ShipmentTimeline
- PaymentStatus
- DocumentCard
- EmptyState
- LoadingState
- ErrorState
- FileUpload
- ImageUploader

---

# 55. PRICE DISPLAY

Reusable `PriceDisplay`:

Inputs:
- base price
- base currency
- selected currency
- exchange rate
- unit

Output:
`SAR 28.00 / KG`

or:
`USD 7.47 / KG`

Always display the unit.

---

# 56. WHOLESALE QUANTITY

Reusable `WholesaleQuantityInput`.

Allow:
- KG
- TON

Normalize internally to KG.

Examples:
1 TON = 1,000 KG
0.5 TON = 500 KG

Show:
"Minimum order: 500 KG"
"Available: 8.5 TON"

---

# 57. ORDER CALCULATIONS

Create reusable calculation functions.

Example:
quantityKG × pricePerKG

Represent taxes/delivery fees as configurable mock values.

Do not perform important calculations only inside JSX.

---

# 58. CENTRAL STATUS DEFINITIONS

Order:
DRAFT
PENDING_PAYMENT
CONFIRMED
PROCESSING
PACKED
SHIPPED
OUT_FOR_DELIVERY
DELIVERED
CANCELLED

Merchant:
PENDING
APPROVED
REJECTED
SUSPENDED

Negotiation:
PENDING
COUNTER_OFFER
ACCEPTED
REJECTED
EXPIRED

Payment:
PENDING
PROCESSING
PAID
FAILED
REFUNDED

Shipment:
PREPARING
PACKED
DISPATCHED
IN_TRANSIT
AT_DESTINATION
OUT_FOR_DELIVERY
DELIVERED

---

# 59. SECURITY-READY FRONTEND

Even frontend-only:
- No secret API keys
- Do not pretend frontend authorization is real security
- Separate role UI from real backend authorization
- Sanitize displayed user input where appropriate
- Do not store sensitive information
- Do not store real payment credentials
- Do not store real identity documents

Real security is V2 backend responsibility.

---

# 60. ACCESS CONTROL UI

Visitor accessing `/merchant/products`:
"Wholesale merchant approval required."
CTA: "Apply for Merchant Account"

Pending merchant accessing catalog:
"Your merchant account is awaiting approval."

Merchant accessing admin:
"Administrator access required."

---

# 61. IMAGE HANDLING

Use high-quality seafood/fish placeholder images suitable for a commercial prototype.

Centralize image data.

Later replace with backend image storage.

---

# 62. DASHBOARD VISUALIZATION

Admin:
- Sales trend
- Orders
- Inventory
- Categories

Merchant:
- Order history
- Spending
- Active shipments

Charts must be readable.

---

# 63. ACCESSIBILITY

Implement:
- Semantic HTML
- Keyboard navigation
- Visible focus
- Accessible labels
- Good contrast
- Alt text
- Form validation
- Appropriate ARIA

---

# 64. UX RULES

Always clearly communicate:
- Current price
- Price unit
- Quantity unit
- Available stock
- MOQ
- Currency
- Order status
- Payment status
- Shipment status

Never show a price without its unit.

Always display:
`SAR 28 / KG`

---

# 65. WHOLESALE QUANTITY UX

When user enters:
`2 TON`

show:
`2,000 KG`

When stock:
`5.5 TON`

also show:
`5,500 KG`

---

# 66. ADMIN DAILY OPERATIONS

Admin dashboard should feel like an operational control center.

"Today's Trading Overview"

Show:
- Today's price updates
- Low inventory
- Pending merchant approvals
- New negotiations
- Orders awaiting confirmation
- Pending payments
- Shipments requiring attention

---

# 67. PRICE CHANGE EXPERIENCE

Before:
SAR 27.50/KG

After:
SAR 28.00/KG

Confirmation:
"Publish new market price?"

Show old/new price and effective time.

After:
"Market price updated successfully."

---

# 68. INVENTORY RESERVATION UX

Example:
Available: 5,000 KG
Order: 1,000 KG
Reserved: 1,000 KG
Remaining available: 4,000 KG

Prototype behavior only.

Real inventory locking will be V2 backend.

---

# 69. ADMIN REPORTING

Create:
- Sales report
- Orders report
- Inventory report
- Merchant report
- Payment report

Filters:
- Date range
- Category
- Merchant
- Product
- Status

Export buttons can generate CSV from mock data.

---

# 70. NOTIFICATION EXAMPLES

- "New merchant application from Gulf Seafood Trading."
- "Price updated: Hamour — SAR 28/KG."
- "Merchant accepted your counter offer."
- "Order FL-20260910-00125 has been shipped."
- "70% payment is required before shipment documents can be released."

---

# 71. EMPTY STATES

No orders:
"You haven't placed any wholesale orders yet."
CTA: Browse Fish

No negotiations:
"No active negotiations."
CTA: Browse Products

No shipments:
"No active shipments."

No notifications:
"You're all caught up."

---

# 72. ERROR STATES

Product unavailable:
"This product is currently unavailable."

Inventory insufficient:
"Requested quantity exceeds available inventory."

Price expired:
"This price is no longer current. Please refresh before submitting your order."

Payment failed:
"Payment could not be completed. Please try again."

---

# 73. DEMO WORKFLOW

Complete frontend journey:

Visitor:
Home → Public Products → Product → Register

Merchant:
Registration → Pending → Admin Approves

Approved Merchant:
Login → Dashboard → Full Catalog → Product Detail → Select 2 TON → Cart → Negotiation → Admin Counter Offer → Merchant Accepts → Checkout → 30/70 Payment → Simulate 30% → Order Confirmed → Shipment → 70% Pending → Document Locked → Simulate 70% → Document Unlocked → Shipment → Delivery → Complete

This must work entirely in the frontend.

---

# 74. ADMIN DEMO WORKFLOW

Admin:
Login → Dashboard → Pending Merchant → Review → Approve

Then:
Products → Update Daily Price → Publish

Inventory → Update Quantity

Negotiations → Receive Proposal → Counter → Accept Response

Orders → Confirm

Payments → Review

Shipments → Create → Assign Driver/Vehicle → Update Status

Delivery → Mark Delivered → Add Quantity → Add Proof of Delivery

---

# 75. NO BACKEND IN V1

STRICT:
Do not build:
- Node backend
- Express server
- Laravel
- Django
- PostgreSQL
- MySQL
- MongoDB
- Supabase database
- Firebase backend
- Real authentication
- Real payment gateway
- Real shipping API

V1 is frontend-only.

Use mock services and localStorage.

---

# 76. FUTURE BACKEND COMPATIBILITY

Structure:
`productService.getProducts()`
etc.

Later replace implementations with API calls without changing UI components.

---

# 77. CODE QUALITY

Use:
- Small components
- Typed data
- Reusable hooks
- Service layer
- Utility functions
- Centralized constants
- Centralized translations
- Centralized status definitions

Avoid:
- `any` unless necessary
- duplicated logic
- duplicated styling
- hardcoded business calculations in JSX
- giant components

---

# 78. README

Create README with:
- Project overview
- Technology stack
- Installation
- Development command
- Production build
- Demo accounts
- Prototype role switching
- Mock data architecture
- Routes
- Folder structure
- Future backend integration notes

---

# 79. FINAL QUALITY REQUIREMENT

Do not stop at static screens.

Every major button must perform a meaningful frontend action.

Examples:
- Add to Cart → updates cart
- Submit Negotiation → creates negotiation
- Approve Merchant → changes merchant status
- Update Price → updates product price
- Update Inventory → updates inventory
- Submit Order → creates order
- Pay → changes mock payment status
- Create Shipment → creates shipment
- Mark Delivered → updates delivery/order status
- Switch Currency → recalculates displayed prices
- Switch Arabic → changes UI to Arabic RTL
- Switch Role → displays appropriate application

The result must feel like a real working B2B fish trading platform.

---

# 80. DEVELOPMENT APPROACH

Build sequentially:

### Phase 1
Project setup, theme, layout, routing, responsive navigation, language, currency.

### Phase 2
Public website, product preview, registration, login.

### Phase 3
Merchant dashboard, catalog, product details, cart, negotiation.

### Phase 4
Checkout, payment simulation, orders, shipment, documents, delivery.

### Phase 5
Admin dashboard, merchant management, product management, pricing, inventory.

### Phase 6
Admin negotiations, orders, payments, shipments, delivery.

### Phase 7
Notifications, reports, settings, role simulation.

### Phase 8
Polish, responsive testing, Arabic RTL, empty/error/loading states, accessibility, code cleanup.

---

# 81. IMPORTANT IMPLEMENTATION RULE

Before coding:
1. Inspect existing project.
2. Understand existing framework.
3. Do not unnecessarily replace setup.
4. Create implementation plan.
5. Implement incrementally.

After implementation:
1. Run application.
2. Check all routes.
3. Test Visitor workflow.
4. Test Pending Merchant workflow.
5. Test Approved Merchant workflow.
6. Test Admin workflow.
7. Test cart calculations.
8. Test KG/TON conversion.
9. Test currency conversion.
10. Test negotiation.
11. Test payment.
12. Test shipment.
13. Test Arabic RTL.
14. Test mobile responsiveness.
15. Fix console errors.
16. Fix broken routes.
17. Fix TypeScript errors.
18. Ensure production build succeeds.

Do not claim a feature is functional unless implemented and tested.

---

# 82. DEFINITION OF DONE

V1 is complete when:
- Public website works
- Merchant registration works
- Mock login works
- Role switching works
- Merchant approval works
- Full catalog works for approved merchants
- Public catalog limited to Admin-selected products
- Daily pricing works
- Currency switching works
- Arabic/English works
- RTL works
- KG/TON calculations work
- Cart works
- Product negotiation works
- Order negotiation works
- Checkout works
- Three payment terms work
- Mock payment works
- Orders work
- Inventory simulation works
- Shipments work
- Delivery workflow works
- Documents work
- 70% document locking works
- Admin dashboard works
- Admin product management works
- Admin pricing works
- Admin inventory works
- Admin merchant approval works
- Admin negotiations work
- Admin orders work
- Admin payments work
- Admin shipments work
- Admin delivery works
- Notifications work
- Responsive UI works
- No major console errors
- Production build succeeds

---

# FINAL INSTRUCTION TO CURSOR

Build this as a **real functional frontend prototype**, not a collection of mock screenshots.

Use realistic business data and realistic interactions.

Prioritize:
1. B2B wholesale usability
2. Clear pricing
3. Bulk KG/TON quantities
4. Merchant approval
5. Negotiation
6. Daily price management
7. Payment-term workflow
8. Shipment/delivery workflow
9. Admin operational control
10. Arabic + English
11. Responsive design
12. Future backend compatibility

Do not implement backend/database functionality yet.

The next phase will replace mock services with real backend, database, authentication, payment gateway, file storage, notifications and production integrations.
