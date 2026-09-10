import { PAYMENT_STATUS, PAYMENT_TERM } from '@/constants';
import type { Payment } from '@/types';

/* Demo payments (spec §47) — mixed terms and statuses. */
export const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: 'pay-1001', orderId: 'fl-20260902-00118', orderNumber: 'FL-20260902-00118',
    merchantId: 'm-gulf-seafood', amount: 20286, currency: 'SAR', method: 'bank_transfer',
    term: PAYMENT_TERM.SPLIT_30_70, portion: '30% initial', status: PAYMENT_STATUS.PAID,
    createdAt: '2026-09-02T09:00:00Z',
  },
  {
    id: 'pay-1002', orderId: 'fl-20260902-00118', orderNumber: 'FL-20260902-00118',
    merchantId: 'm-gulf-seafood', amount: 47334, currency: 'SAR', method: 'bank_transfer',
    term: PAYMENT_TERM.SPLIT_30_70, portion: '70% balance', status: PAYMENT_STATUS.PAID,
    createdAt: '2026-09-05T10:00:00Z',
  },
  {
    id: 'pay-1003', orderId: 'fl-20260904-00120', orderNumber: 'FL-20260904-00120',
    merchantId: 'm-gulf-seafood', amount: 162150, currency: 'SAR', method: 'bank_transfer',
    term: PAYMENT_TERM.FULL, portion: 'Full', status: PAYMENT_STATUS.PAID,
    createdAt: '2026-09-04T11:00:00Z',
  },
  {
    id: 'pay-1004', orderId: 'fl-20260907-00122', orderNumber: 'FL-20260907-00122',
    merchantId: 'm-gulf-seafood', amount: 17342, currency: 'SAR', method: 'online',
    term: PAYMENT_TERM.SPLIT_30_70, portion: '30% initial', status: PAYMENT_STATUS.PROCESSING,
    createdAt: '2026-09-07T10:00:00Z',
  },
  {
    id: 'pay-1005', orderId: 'fl-20260909-00124', orderNumber: 'FL-20260909-00124',
    merchantId: 'm-gulf-seafood', amount: 31165, currency: 'SAR', method: 'other',
    term: PAYMENT_TERM.AGAINST_DELIVERY, portion: 'Full', status: PAYMENT_STATUS.PENDING,
    createdAt: '2026-09-09T13:30:00Z',
  },
  {
    id: 'pay-1006', orderId: 'fl-20260910-00125', orderNumber: 'FL-20260910-00125',
    merchantId: 'm-gulf-seafood', amount: 38430, currency: 'SAR', method: 'card',
    term: PAYMENT_TERM.SPLIT_30_70, portion: '30% initial', status: PAYMENT_STATUS.PENDING,
    createdAt: '2026-09-10T07:50:00Z',
  },
  {
    id: 'pay-1007', orderId: 'fl-20260903-00119', orderNumber: 'FL-20260903-00119',
    merchantId: 'm-emirates-marine', amount: 15984, currency: 'AED', method: 'bank_transfer',
    term: PAYMENT_TERM.SPLIT_30_70, portion: '30% initial', status: PAYMENT_STATUS.PAID,
    createdAt: '2026-09-03T12:00:00Z',
  },
  {
    id: 'pay-1008', orderId: 'fl-20260903-00119', orderNumber: 'FL-20260903-00119',
    merchantId: 'm-emirates-marine', amount: 37296, currency: 'AED', method: 'bank_transfer',
    term: PAYMENT_TERM.SPLIT_30_70, portion: '70% balance', status: PAYMENT_STATUS.PAID,
    createdAt: '2026-09-07T09:00:00Z',
  },
  {
    id: 'pay-1009', orderId: 'fl-20260905-00121', orderNumber: 'FL-20260905-00121',
    merchantId: 'm-coastal-catering', amount: 104350, currency: 'SAR', method: 'bank_transfer',
    term: PAYMENT_TERM.FULL, portion: 'Full', status: PAYMENT_STATUS.PAID,
    createdAt: '2026-09-05T10:00:00Z',
  },
  {
    id: 'pay-1010', orderId: 'fl-20260906-00117', orderNumber: 'FL-20260906-00117',
    merchantId: 'm-coastal-catering', amount: 43125, currency: 'SAR', method: 'bank_transfer',
    term: PAYMENT_TERM.FULL, portion: 'Full', status: PAYMENT_STATUS.REFUNDED,
    createdAt: '2026-08-30T10:00:00Z',
  },
  {
    id: 'pay-1011', orderId: 'fl-20260901-00115', orderNumber: 'FL-20260901-00115',
    merchantId: 'm-oman-fresh', amount: 29325, currency: 'USD', method: 'card',
    term: PAYMENT_TERM.SPLIT_30_70, portion: '70% balance', status: PAYMENT_STATUS.FAILED,
    createdAt: '2026-09-09T14:00:00Z',
  },
];
