import { NEGOTIATION_STATUS } from '@/constants';
import type { Negotiation } from '@/types';

/* Demo negotiations (spec §47) — product-level, mixed statuses. */
export const DEFAULT_NEGOTIATIONS: Negotiation[] = [
  {
    id: 'ng-0001', number: 'NG-2026-0001', merchantId: 'm-gulf-seafood', productId: 'p-hamour',
    quantityKg: 2000, currentPrice: 28, proposedPrice: 26, currency: 'SAR',
    desiredDeliveryDate: '2026-09-18', status: NEGOTIATION_STATUS.COUNTER_OFFER,
    createdAt: '2026-09-08T10:00:00Z',
    messages: [
      { id: 'm1', author: 'merchant', proposedPrice: 26, message: 'Requesting 2 TON at SAR 26/KG for a repeat order.', createdAt: '2026-09-08T10:00:00Z' },
      { id: 'm2', author: 'admin', proposedPrice: 27, message: 'We can meet at SAR 27/KG on 2 TON, delivered within 6 days.', createdAt: '2026-09-08T14:30:00Z' },
    ],
  },
  {
    id: 'ng-0002', number: 'NG-2026-0002', merchantId: 'm-gulf-seafood', productId: 'p-shrimp',
    quantityKg: 3000, currentPrice: 41, proposedPrice: 38, currency: 'SAR',
    desiredDeliveryDate: '2026-09-22', status: NEGOTIATION_STATUS.PENDING,
    createdAt: '2026-09-10T08:20:00Z',
    messages: [
      { id: 'm1', author: 'merchant', proposedPrice: 38, message: 'Can you do SAR 38/KG on 3 TON IQF 40/60?', createdAt: '2026-09-10T08:20:00Z' },
    ],
  },
  {
    id: 'ng-0003', number: 'NG-2026-0003', merchantId: 'm-gulf-seafood', productId: 'p-kingfish',
    quantityKg: 1500, currentPrice: 34, proposedPrice: 32, currency: 'SAR',
    desiredDeliveryDate: '2026-09-14', status: NEGOTIATION_STATUS.ACCEPTED,
    createdAt: '2026-09-06T09:00:00Z',
    messages: [
      { id: 'm1', author: 'merchant', proposedPrice: 32, message: 'SAR 32/KG for 1.5 TON kingfish?', createdAt: '2026-09-06T09:00:00Z' },
      { id: 'm2', author: 'admin', proposedPrice: 33.5, message: 'Best we can do is SAR 33.5/KG.', createdAt: '2026-09-06T12:00:00Z' },
      { id: 'm3', author: 'merchant', proposedPrice: 33.5, message: 'Agreed at SAR 33.5/KG.', createdAt: '2026-09-06T15:00:00Z' },
      { id: 'm4', author: 'admin', message: 'Accepted. Price locked for this order.', createdAt: '2026-09-06T15:30:00Z' },
    ],
  },
  {
    id: 'ng-0004', number: 'NG-2026-0004', merchantId: 'm-gulf-seafood', productId: 'p-seabream',
    quantityKg: 1500, currentPrice: 22, proposedPrice: 19, currency: 'SAR',
    desiredDeliveryDate: '2026-09-13', status: NEGOTIATION_STATUS.REJECTED,
    createdAt: '2026-09-05T11:00:00Z',
    messages: [
      { id: 'm1', author: 'merchant', proposedPrice: 19, message: 'SAR 19/KG for 1.5 TON?', createdAt: '2026-09-05T11:00:00Z' },
      { id: 'm2', author: 'admin', message: 'Cannot go below SAR 21.50/KG at this volume — declining for now.', createdAt: '2026-09-05T16:00:00Z' },
    ],
  },
  {
    id: 'ng-0005', number: 'NG-2026-0005', merchantId: 'm-oman-fresh', productId: 'p-hamour-live',
    quantityKg: 500, currentPrice: 52, proposedPrice: 48, currency: 'USD',
    desiredDeliveryDate: '2026-09-19', status: NEGOTIATION_STATUS.PENDING,
    createdAt: '2026-09-09T07:00:00Z',
    messages: [
      { id: 'm1', author: 'merchant', proposedPrice: 48, message: 'Live hamour 500 KG — USD 48/KG possible?', createdAt: '2026-09-09T07:00:00Z' },
    ],
  },
  {
    id: 'ng-0006', number: 'NG-2026-0006', merchantId: 'm-emirates-marine', productId: 'p-salmon',
    quantityKg: 2000, currentPrice: 54, proposedPrice: 50, currency: 'AED',
    desiredDeliveryDate: '2026-09-24', status: NEGOTIATION_STATUS.COUNTER_OFFER,
    createdAt: '2026-09-07T13:00:00Z',
    messages: [
      { id: 'm1', author: 'merchant', proposedPrice: 50, message: 'AED 50/KG on 2 TON salmon fillet.', createdAt: '2026-09-07T13:00:00Z' },
      { id: 'm2', author: 'admin', proposedPrice: 52, message: 'Counter at AED 52/KG, FOB Jeddah.', createdAt: '2026-09-08T09:00:00Z' },
    ],
  },
  {
    id: 'ng-0007', number: 'NG-2026-0007', merchantId: 'm-coastal-catering', productId: 'p-pangasius',
    quantityKg: 5000, currentPrice: 15, proposedPrice: 13.5, currency: 'SAR',
    desiredDeliveryDate: '2026-09-09', status: NEGOTIATION_STATUS.EXPIRED,
    createdAt: '2026-09-01T10:00:00Z',
    messages: [
      { id: 'm1', author: 'merchant', proposedPrice: 13.5, message: 'SAR 13.5/KG for 5 TON pangasius.', createdAt: '2026-09-01T10:00:00Z' },
      { id: 'm2', author: 'admin', proposedPrice: 14.25, message: 'Counter at SAR 14.25/KG, valid 3 days.', createdAt: '2026-09-02T10:00:00Z' },
    ],
  },
  {
    id: 'ng-0008', number: 'NG-2026-0008', merchantId: 'm-coastal-catering', productId: 'p-tuna-loin',
    quantityKg: 800, currentPrice: 58, proposedPrice: 54, currency: 'SAR',
    desiredDeliveryDate: '2026-09-12', status: NEGOTIATION_STATUS.ACCEPTED,
    createdAt: '2026-09-03T09:00:00Z',
    messages: [
      { id: 'm1', author: 'merchant', proposedPrice: 54, message: 'SAR 54/KG for 800 KG tuna loin.', createdAt: '2026-09-03T09:00:00Z' },
      { id: 'm2', author: 'admin', message: 'Accepted at SAR 54/KG.', createdAt: '2026-09-03T12:00:00Z' },
    ],
  },
];
