import { SHIPMENT_STATUS } from '@/constants';
import type { Shipment } from '@/types';

/* Demo shipments (spec §47) — linked to seeded orders. */
export const DEFAULT_SHIPMENTS: Shipment[] = [
  {
    id: 'shp-0007', number: 'SHP-20260904-0007', orderId: 'fl-20260904-00120',
    orderNumber: 'FL-20260904-00120', merchantId: 'm-gulf-seafood', destination: 'Dammam, Saudi Arabia',
    carrier: 'Gulf Cold Logistics', vehicle: 'Refrigerated truck · DMM-4821', driver: 'Nasser Al-Qahtani',
    dispatchedAt: '2026-09-09T05:00:00Z', etaAt: '2026-09-12T12:00:00Z',
    status: SHIPMENT_STATUS.IN_TRANSIT, dispatchedKg: 4000, notes: 'Maintain -18°C for frozen line.',
  },
  {
    id: 'shp-0006', number: 'SHP-20260902-0006', orderId: 'fl-20260902-00118',
    orderNumber: 'FL-20260902-00118', merchantId: 'm-gulf-seafood', destination: 'Dammam, Saudi Arabia',
    carrier: 'Gulf Cold Logistics', vehicle: 'Refrigerated truck · DMM-4102', driver: 'Ali Hakami',
    dispatchedAt: '2026-09-04T05:30:00Z', etaAt: '2026-09-06T10:00:00Z',
    status: SHIPMENT_STATUS.DELIVERED, dispatchedKg: 2000, deliveredKg: 1980,
    deliveredAt: '2026-09-06T09:20:00Z', proofOfDelivery: 'POD-signed-118.jpg',
    notes: 'Variance −20 KG accepted by receiver (drip loss).',
  },
  {
    id: 'shp-0005', number: 'SHP-20260901-0005', orderId: 'fl-20260901-00115',
    orderNumber: 'FL-20260901-00115', merchantId: 'm-oman-fresh', destination: 'Riyadh, Saudi Arabia',
    carrier: 'Peninsula Freight', vehicle: 'Reefer trailer · RUH-9930', driver: 'Turki Al-Mutairi',
    dispatchedAt: '2026-09-08T04:00:00Z', etaAt: '2026-09-11T14:00:00Z',
    status: SHIPMENT_STATUS.AT_DESTINATION, dispatchedKg: 2500,
  },
  {
    id: 'shp-0004', number: 'SHP-20260905-0004', orderId: 'fl-20260905-00121',
    orderNumber: 'FL-20260905-00121', merchantId: 'm-coastal-catering', destination: 'Yanbu, Saudi Arabia',
    carrier: 'Red Sea Haulage', vehicle: 'Refrigerated truck · YNB-2210', driver: 'Majed Otaibi',
    dispatchedAt: '2026-09-10T06:00:00Z', etaAt: '2026-09-13T09:00:00Z',
    status: SHIPMENT_STATUS.DISPATCHED, dispatchedKg: 6000,
  },
  {
    id: 'shp-0003', number: 'SHP-20260903-0003', orderId: 'fl-20260903-00119',
    orderNumber: 'FL-20260903-00119', merchantId: 'm-emirates-marine', destination: 'Jeddah, Saudi Arabia',
    carrier: 'Peninsula Freight', vehicle: 'Reefer van · JED-1180', driver: 'Sami Farsi',
    dispatchedAt: '2026-09-05T05:00:00Z', etaAt: '2026-09-08T11:00:00Z',
    status: SHIPMENT_STATUS.DELIVERED, dispatchedKg: 800, deliveredKg: 800,
    deliveredAt: '2026-09-08T10:15:00Z', proofOfDelivery: 'POD-signed-119.jpg',
  },
  {
    id: 'shp-0002', number: 'SHP-20260828-0002', orderId: 'fl-20260828-00110',
    orderNumber: 'FL-20260828-00110', merchantId: 'm-oman-fresh', destination: 'Riyadh, Saudi Arabia',
    carrier: 'Gulf Cold Logistics', vehicle: 'Reefer trailer · RUH-7788', driver: 'Fahad Dosari',
    dispatchedAt: '2026-08-30T04:30:00Z', etaAt: '2026-09-01T12:00:00Z',
    status: SHIPMENT_STATUS.DELIVERED, dispatchedKg: 4000, deliveredKg: 3960,
    deliveredAt: '2026-09-01T11:40:00Z', proofOfDelivery: 'POD-signed-110.jpg',
    notes: 'Variance −40 KG (ice melt).',
  },
];
