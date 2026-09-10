import type { Notification } from '@/types';

/* Demo notifications (spec §47, §70) — at least 15, mixed audiences. */
export const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: 'nt-01', audience: 'admin', type: 'merchant_application', title: 'New merchant application', body: 'New merchant application from Red Sea Foods Est.', createdAt: '2026-09-05T12:05:00Z', read: false },
  { id: 'nt-02', audience: 'admin', type: 'merchant_application', title: 'New merchant application', body: 'New merchant application from Blue Harbor Distribution.', createdAt: '2026-09-08T15:35:00Z', read: false },
  { id: 'nt-03', audience: 'merchant', type: 'price_change', title: 'Price updated', body: 'Price updated: Hamour — SAR 28/KG.', createdAt: '2026-09-10T09:31:00Z', read: false },
  { id: 'nt-04', audience: 'merchant', type: 'price_change', title: 'Price updated', body: 'Price updated: Kingfish — SAR 34/KG.', createdAt: '2026-09-10T09:32:00Z', read: false },
  { id: 'nt-05', audience: 'admin', type: 'negotiation', title: 'Negotiation received', body: 'Gulf Seafood Trading requested a negotiation on Frozen Shrimp 40/60.', createdAt: '2026-09-10T08:21:00Z', read: false },
  { id: 'nt-06', audience: 'merchant', type: 'counter_offer', title: 'Counter offer received', body: 'Fleasea sent a counter offer on NG-2026-0001 (Hamour) — SAR 27/KG.', createdAt: '2026-09-08T14:31:00Z', read: false },
  { id: 'nt-07', audience: 'merchant', type: 'order_confirmed', title: 'Order confirmed', body: 'Order FL-20260907-00122 has been confirmed and is now processing.', createdAt: '2026-09-08T10:00:00Z', read: true },
  { id: 'nt-08', audience: 'merchant', type: 'payment_received', title: 'Payment received', body: 'Payment received for FL-20260904-00120 — SAR 162,150.00.', createdAt: '2026-09-04T11:05:00Z', read: true },
  { id: 'nt-09', audience: 'merchant', type: 'payment_pending', title: 'Payment pending', body: '70% payment is required before shipment documents can be released for FL-20260902-00118.', createdAt: '2026-09-05T09:00:00Z', read: true },
  { id: 'nt-10', audience: 'merchant', type: 'shipment_dispatched', title: 'Shipment dispatched', body: 'Order FL-20260904-00120 has been shipped (SHP-20260904-0007).', createdAt: '2026-09-09T05:05:00Z', read: false },
  { id: 'nt-11', audience: 'merchant', type: 'shipment_delivered', title: 'Shipment delivered', body: 'Order FL-20260902-00118 has been delivered. Variance −20 KG recorded.', createdAt: '2026-09-06T09:25:00Z', read: true },
  { id: 'nt-12', audience: 'merchant', type: 'document_unlocked', title: 'Document unlocked', body: 'Shipment document for FL-20260902-00118 is now available.', createdAt: '2026-09-05T10:05:00Z', read: true },
  { id: 'nt-13', audience: 'admin', type: 'payment', title: 'Payment failed', body: 'Payment failed for FL-20260901-00115 (Oman Fresh Catch) — USD 29,325.00.', createdAt: '2026-09-09T14:05:00Z', read: false },
  { id: 'nt-14', audience: 'admin', type: 'shipment', title: 'Shipment requires attention', body: 'SHP-20260901-0005 has been at destination for over 24h.', createdAt: '2026-09-10T08:00:00Z', read: false },
  { id: 'nt-15', audience: 'all', type: 'system', title: 'Daily prices published', body: 'Today’s market prices have been published (10 Sep 2026).', createdAt: '2026-09-10T09:30:00Z', read: false },
  { id: 'nt-16', audience: 'merchant', type: 'negotiation', title: 'Negotiation accepted', body: 'Your counter offer on NG-2026-0003 (Kingfish) was accepted at SAR 33.50/KG.', createdAt: '2026-09-06T15:31:00Z', read: true },
];
