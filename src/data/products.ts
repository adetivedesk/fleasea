import { PRODUCT_CATEGORY, STOCK_STATUS } from '@/constants';
import type { Product, PricePoint } from '@/types';

/* Demo products only (spec §47). Base currency is SAR; base price never mutates. */

function history(current: number, steps: number[]): PricePoint[] {
  // steps = day-over-day deltas going backwards from today
  const out: PricePoint[] = [];
  let price = current;
  const today = new Date('2026-09-10T09:30:00Z');
  out.push({
    date: today.toISOString(),
    price: round(price),
    currency: 'SAR',
    changePct: pct(price, price - (steps[0] ?? 0)),
    updatedBy: 'Admin — Sales',
  });
  for (let i = 0; i < steps.length; i++) {
    const prev = price - steps[i];
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - (i + 1));
    out.push({
      date: d.toISOString(),
      price: round(prev),
      currency: 'SAR',
      changePct: pct(prev, prev - (steps[i + 1] ?? 0)),
      updatedBy: 'Admin — Sales',
    });
    price = prev;
  }
  return out;
}

const round = (n: number) => Math.round(n * 100) / 100;
const pct = (now: number, before: number) =>
  before === 0 ? 0 : round(((now - before) / before) * 100);

function stockFor(availableKg: number, reservedKg: number, moqKg: number): Product['stockStatus'] {
  const free = availableKg - reservedKg;
  if (free <= 0) return STOCK_STATUS.OUT_OF_STOCK;
  if (free < moqKg * 2) return STOCK_STATUS.CRITICAL;
  if (free < moqKg * 6) return STOCK_STATUS.LOW_STOCK;
  return STOCK_STATUS.IN_STOCK;
}

type Seed = Omit<Product, 'stockStatus' | 'priceHistory'> & { steps: number[] };

const SEED: Seed[] = [
  {
    id: 'p-hamour', code: 'FL-HAM-01', nameEn: 'Fresh Hamour (Grouper)', nameAr: 'هامور طازج',
    category: PRODUCT_CATEGORY.FRESH_ICE, origin: 'Jazan, Saudi Arabia', grade: 'Premium A',
    size: '1–2 kg', weightRange: '1000–2000 g', packaging: 'Iced foam box 20 kg',
    descriptionEn: 'Line-caught reef grouper, iced within hours of landing. Firm white flesh, ideal for restaurant and catering wholesale.',
    descriptionAr: 'هامور صخري طازج يُبرَّد خلال ساعات من الصيد. لحم أبيض متماسك مثالي لتجارة الجملة للمطاعم.',
    images: ['hamour'], availableKg: 8500, reservedKg: 900, moqKg: 500,
    basePrice: 28, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T09:30:00Z',
    publicVisible: true, active: true, steps: [0.5, -1, 0.5, 0.5],
  },
  {
    id: 'p-kingfish', code: 'FL-KNG-01', nameEn: 'Kingfish (Kanad)', nameAr: 'كنعد',
    category: PRODUCT_CATEGORY.FRESH_ICE, origin: 'Oman', grade: 'Export',
    size: '4–7 kg', weightRange: '4000–7000 g', packaging: 'Iced foam box 25 kg',
    descriptionEn: 'Whole gilled-and-gutted kingfish, prized for steaks. High turnover wholesale line.',
    descriptionAr: 'كنعد كامل منظّف، مطلوب لشرائح الستيك. صنف عالي الحركة في الجملة.',
    images: ['kingfish'], availableKg: 4200, reservedKg: 400, moqKg: 500,
    basePrice: 34, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T09:30:00Z',
    publicVisible: true, active: true, steps: [1, 0.5, -0.5, 1],
  },
  {
    id: 'p-shrimp', code: 'FL-SHR-40', nameEn: 'Frozen Shrimp 40/60', nameAr: 'روبيان مجمّد ٤٠/٦٠',
    category: PRODUCT_CATEGORY.FROZEN, origin: 'Arabian Gulf', grade: 'IQF Grade A',
    size: '40/60 per kg', weightRange: 'HLSO', packaging: 'IQF 10 kg master carton',
    descriptionEn: 'Individually quick-frozen headless shell-on shrimp, 40–60 count. Export-ready cartons.',
    descriptionAr: 'روبيان مجمّد بشكل فردي بدون رأس، عدّ ٤٠–٦٠. كراتين جاهزة للتصدير.',
    images: ['shrimp'], availableKg: 12000, reservedKg: 2000, moqKg: 1000,
    basePrice: 41, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T09:30:00Z',
    publicVisible: true, active: true, steps: [0, 1.5, -1, 0.5],
  },
  {
    id: 'p-seabream', code: 'FL-SBM-01', nameEn: 'Sea Bream (Sultan Ibrahim)', nameAr: 'سلطان إبراهيم',
    category: PRODUCT_CATEGORY.FRESH_ICE, origin: 'Jeddah, Saudi Arabia', grade: 'Standard',
    size: '300–500 g', weightRange: '300–500 g', packaging: 'Iced foam box 15 kg',
    descriptionEn: 'Small whole sea bream, sold by the box. Consistent daily supply.',
    descriptionAr: 'سلطان إبراهيم صغير كامل، يُباع بالصندوق. توريد يومي منتظم.',
    images: ['seabream'], availableKg: 3100, reservedKg: 250, moqKg: 300,
    basePrice: 22, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T09:30:00Z',
    publicVisible: true, active: true, steps: [-0.5, 0.5, 0.5, -0.5],
  },
  {
    id: 'p-tilapia-live', code: 'FL-TIL-LV', nameEn: 'Live Tilapia', nameAr: 'بلطي حي',
    category: PRODUCT_CATEGORY.LIVE, origin: 'Al Kharj Farms, Saudi Arabia', grade: 'Farm A',
    size: '500–800 g', weightRange: '500–800 g', packaging: 'Oxygenated live tank transport',
    descriptionEn: 'Farm-raised live tilapia delivered in oxygenated tanks. Popular with live-fish retailers.',
    descriptionAr: 'بلطي مزارع حي يُسلَّم في خزانات مؤكسجة. مطلوب لدى تجار الأسماك الحية.',
    images: ['tilapia'], availableKg: 6000, reservedKg: 500, moqKg: 500,
    basePrice: 16.5, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T09:30:00Z',
    publicVisible: true, active: true, steps: [0.5, 0, -0.5, 0.5],
  },
  {
    id: 'p-sardine', code: 'FL-SAR-01', nameEn: 'Sardine (Oil Fish)', nameAr: 'سردين',
    category: PRODUCT_CATEGORY.FRESH_ICE, origin: 'Jazan, Saudi Arabia', grade: 'Bait/Food',
    size: '10–14 cm', weightRange: '40–80 g', packaging: 'Iced crate 20 kg',
    descriptionEn: 'Fresh sardine landed daily. High-volume, low-cost pelagic line.',
    descriptionAr: 'سردين طازج يومي. صنف سطحي عالي الكمية ومنخفض التكلفة.',
    images: ['sardine'], availableKg: 15000, reservedKg: 1000, moqKg: 1000,
    basePrice: 7.5, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T08:00:00Z',
    publicVisible: false, active: true, steps: [0.25, -0.5, 0.25, 0.25],
  },
  {
    id: 'p-mackerel', code: 'FL-MAC-01', nameEn: 'Indian Mackerel (Bagha)', nameAr: 'ماكريل هندي',
    category: PRODUCT_CATEGORY.FRESH_ICE, origin: 'Oman', grade: 'Standard',
    size: '150–250 g', weightRange: '150–250 g', packaging: 'Iced foam box 18 kg',
    descriptionEn: 'Whole Indian mackerel, iced. Steady wholesale demand across the year.',
    descriptionAr: 'ماكريل هندي كامل مبرّد. طلب جملة ثابت على مدار العام.',
    images: ['mackerel'], availableKg: 9200, reservedKg: 700, moqKg: 500,
    basePrice: 12, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T08:00:00Z',
    publicVisible: false, active: true, steps: [0.5, 0.5, -0.5, 0],
  },
  {
    id: 'p-grouper-frozen', code: 'FL-GRP-FZ', nameEn: 'Frozen Grouper Fillet', nameAr: 'فيليه هامور مجمّد',
    category: PRODUCT_CATEGORY.FROZEN, origin: 'Indonesia', grade: 'Skinless PBO',
    size: '170–220 g fillet', weightRange: 'fillet', packaging: 'IQF 5 kg carton',
    descriptionEn: 'Skinless, pin-bone-out grouper fillets, individually frozen. Catering and hotel supply.',
    descriptionAr: 'فيليه هامور بدون جلد وبدون شوك، مجمّد فرديًا. توريد للفنادق والتموين.',
    images: ['grouper'], availableKg: 5400, reservedKg: 600, moqKg: 500,
    basePrice: 46, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-09T14:00:00Z',
    publicVisible: false, active: true, steps: [0, -1, 1, 0.5],
  },
  {
    id: 'p-seabass', code: 'FL-SBS-01', nameEn: 'Sea Bass (Barramundi)', nameAr: 'قاروص',
    category: PRODUCT_CATEGORY.FRESH_ICE, origin: 'UAE Aquaculture', grade: 'Farm Premium',
    size: '600–900 g', weightRange: '600–900 g', packaging: 'Iced foam box 20 kg',
    descriptionEn: 'Farmed sea bass, uniform sizing, iced. Reliable specification for contract buyers.',
    descriptionAr: 'قاروص مزارع بحجم موحّد ومبرّد. مواصفة موثوقة لمشتري العقود.',
    images: ['seabream'], availableKg: 4800, reservedKg: 300, moqKg: 500,
    basePrice: 26, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T09:30:00Z',
    publicVisible: false, active: true, steps: [0.5, 0, 0.5, -0.5],
  },
  {
    id: 'p-sheri', code: 'FL-SHE-01', nameEn: 'Sheri (Emperor)', nameAr: 'شعري',
    category: PRODUCT_CATEGORY.FRESH_ICE, origin: 'Dammam, Saudi Arabia', grade: 'Premium',
    size: '800 g – 1.5 kg', weightRange: '800–1500 g', packaging: 'Iced foam box 20 kg',
    descriptionEn: 'Local emperor / sheri, high-value reef fish. Limited daily landings.',
    descriptionAr: 'شعري محلي، سمك شعاب عالي القيمة. كميات يومية محدودة.',
    images: ['grouper'], availableKg: 1900, reservedKg: 200, moqKg: 300,
    basePrice: 38, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T09:30:00Z',
    publicVisible: false, active: true, steps: [1, -0.5, 0.5, 1],
  },
  {
    id: 'p-safi', code: 'FL-SAF-01', nameEn: 'Safi (Rabbitfish)', nameAr: 'صافي',
    category: PRODUCT_CATEGORY.FRESH_ICE, origin: 'Jubail, Saudi Arabia', grade: 'Standard',
    size: '250–400 g', weightRange: '250–400 g', packaging: 'Iced crate 18 kg',
    descriptionEn: 'Gulf rabbitfish, strong regional demand. Seasonal price swings.',
    descriptionAr: 'صافي خليجي، طلب إقليمي قوي. تقلّبات سعرية موسمية.',
    images: ['seabream'], availableKg: 2600, reservedKg: 150, moqKg: 300,
    basePrice: 19, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T08:00:00Z',
    publicVisible: false, active: true, steps: [-0.5, 1, -0.5, 0.5],
  },
  {
    id: 'p-tuna-loin', code: 'FL-TUN-LN', nameEn: 'Yellowfin Tuna Loin', nameAr: 'لوين تونة صفراء',
    category: PRODUCT_CATEGORY.FROZEN, origin: 'Maldives', grade: 'CO-treated, Sashimi',
    size: '1–2 kg loin', weightRange: 'loin', packaging: 'Vacuum pack, 20 kg carton',
    descriptionEn: 'Frozen yellowfin tuna loins, sashimi grade. Premium export line.',
    descriptionAr: 'لوين تونة صفراء مجمّد بدرجة ساشيمي. صنف تصدير ممتاز.',
    images: ['kingfish'], availableKg: 3800, reservedKg: 500, moqKg: 500,
    basePrice: 58, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-09T14:00:00Z',
    publicVisible: false, active: true, steps: [0, 2, -1, 1],
  },
  {
    id: 'p-pomfret', code: 'FL-POM-01', nameEn: 'Silver Pomfret (Zubaidi)', nameAr: 'زبيدي',
    category: PRODUCT_CATEGORY.FRESH_ICE, origin: 'India', grade: 'Export A',
    size: '300–500 g', weightRange: '300–500 g', packaging: 'Iced foam box 12 kg',
    descriptionEn: 'Silver pomfret / zubaidi, the premium table fish of the Gulf. Tight supply.',
    descriptionAr: 'زبيدي فضي، سمك المائدة الفاخر في الخليج. عرض محدود.',
    images: ['seabream'], availableKg: 1400, reservedKg: 300, moqKg: 200,
    basePrice: 62, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T09:30:00Z',
    publicVisible: false, active: true, steps: [2, 1, -1, 2],
  },
  {
    id: 'p-snapper', code: 'FL-SNP-01', nameEn: 'Red Snapper (Hamra)', nameAr: 'حمراء',
    category: PRODUCT_CATEGORY.FRESH_ICE, origin: 'Yemen', grade: 'Premium',
    size: '1–3 kg', weightRange: '1000–3000 g', packaging: 'Iced foam box 22 kg',
    descriptionEn: 'Whole red snapper, vivid colour, firm flesh. Restaurant favourite.',
    descriptionAr: 'حمراء كاملة بلون زاهٍ ولحم متماسك. المفضّلة لدى المطاعم.',
    images: ['grouper'], availableKg: 3300, reservedKg: 400, moqKg: 500,
    basePrice: 33, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T09:30:00Z',
    publicVisible: false, active: true, steps: [0.5, -0.5, 1, 0.5],
  },
  {
    id: 'p-sole', code: 'FL-SOL-01', nameEn: 'Sole Fish (Samak Moosa)', nameAr: 'سمك موسى',
    category: PRODUCT_CATEGORY.FRESH_ICE, origin: 'Arabian Gulf', grade: 'Standard',
    size: '150–300 g', weightRange: '150–300 g', packaging: 'Iced crate 15 kg',
    descriptionEn: 'Whole sole, delicate flesh. Consistent hotel and catering demand.',
    descriptionAr: 'سمك موسى كامل بلحم طري. طلب ثابت للفنادق والتموين.',
    images: ['sardine'], availableKg: 2200, reservedKg: 100, moqKg: 300,
    basePrice: 24, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T08:00:00Z',
    publicVisible: false, active: true, steps: [0, 0.5, -0.5, 0.5],
  },
  {
    id: 'p-squid', code: 'FL-SQD-01', nameEn: 'Frozen Squid Tubes', nameAr: 'أنابيب حبار مجمّدة',
    category: PRODUCT_CATEGORY.FROZEN, origin: 'India', grade: 'Cleaned U-5',
    size: 'U-5 tubes', weightRange: 'tube', packaging: 'Block frozen 6 x 1 kg',
    descriptionEn: 'Cleaned squid tubes, block frozen. High-volume food-service line.',
    descriptionAr: 'أنابيب حبار منظّفة، مجمّدة بلوك. صنف خدمات غذائية عالي الكمية.',
    images: ['shrimp'], availableKg: 7600, reservedKg: 800, moqKg: 1000,
    basePrice: 21, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-09T14:00:00Z',
    publicVisible: false, active: true, steps: [0, -0.5, 0.5, 0],
  },
  {
    id: 'p-crab', code: 'FL-CRB-LV', nameEn: 'Live Blue Swimmer Crab', nameAr: 'سلطعون أزرق حي',
    category: PRODUCT_CATEGORY.LIVE, origin: 'Tarut Bay, Saudi Arabia', grade: 'Grade A live',
    size: '150–250 g', weightRange: '150–250 g', packaging: 'Chilled live crate 10 kg',
    descriptionEn: 'Live blue swimmer crab from Gulf waters. Premium live seafood line.',
    descriptionAr: 'سلطعون أزرق حي من مياه الخليج. صنف مأكولات بحرية حية فاخر.',
    images: ['shrimp'], availableKg: 1200, reservedKg: 200, moqKg: 200,
    basePrice: 44, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T09:30:00Z',
    publicVisible: false, active: true, steps: [1, 1, -1, 1],
  },
  {
    id: 'p-salmon', code: 'FL-SLM-FZ', nameEn: 'Frozen Atlantic Salmon Fillet', nameAr: 'فيليه سلمون أطلسي مجمّد',
    category: PRODUCT_CATEGORY.FROZEN, origin: 'Norway', grade: 'Trim D, skin-on',
    size: '1.4–1.8 kg fillet', weightRange: 'fillet', packaging: 'Vacuum pack, 20 kg carton',
    descriptionEn: 'Norwegian farmed salmon fillets, skin-on, frozen. Imported premium protein.',
    descriptionAr: 'فيليه سلمون نرويجي مزارع مع الجلد، مجمّد. بروتين مستورد فاخر.',
    images: ['kingfish'], availableKg: 6800, reservedKg: 900, moqKg: 500,
    basePrice: 54, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-09T14:00:00Z',
    publicVisible: false, active: true, steps: [0, 2, 1, -1],
  },
  {
    id: 'p-pangasius', code: 'FL-PAN-FZ', nameEn: 'Frozen Pangasius Fillet', nameAr: 'فيليه بنغاسيوس مجمّد',
    category: PRODUCT_CATEGORY.FROZEN, origin: 'Vietnam', grade: 'Well-trimmed, untreated',
    size: '170–220 g fillet', weightRange: 'fillet', packaging: 'IQF 10 kg carton',
    descriptionEn: 'Value white-fish fillets, individually frozen. High-volume catering staple.',
    descriptionAr: 'فيليه سمك أبيض اقتصادي، مجمّد فرديًا. أساسي للتموين عالي الكمية.',
    images: ['tilapia'], availableKg: 18000, reservedKg: 1500, moqKg: 1000,
    basePrice: 15, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-09T14:00:00Z',
    publicVisible: false, active: true, steps: [0, 0.5, -0.5, 0.5],
  },
  {
    id: 'p-hamour-live', code: 'FL-HAM-LV', nameEn: 'Live Hamour (Grouper)', nameAr: 'هامور حي',
    category: PRODUCT_CATEGORY.LIVE, origin: 'Farasan Islands, Saudi Arabia', grade: 'Live Premium',
    size: '800 g – 1.2 kg', weightRange: '800–1200 g', packaging: 'Oxygenated live tank transport',
    descriptionEn: 'Live reef grouper for premium live-fish markets and restaurants. Very limited supply.',
    descriptionAr: 'هامور شعاب حي لأسواق ومطاعم الأسماك الحية الفاخرة. عرض محدود جدًا.',
    images: ['hamour'], availableKg: 700, reservedKg: 150, moqKg: 200,
    basePrice: 52, baseCurrency: 'SAR', priceEffectiveAt: '2026-09-10T09:30:00Z',
    publicVisible: false, active: true, steps: [2, 0, -1, 2],
  },
];

export const DEFAULT_PRODUCTS: Product[] = SEED.map(({ steps, ...p }) => ({
  ...p,
  stockStatus: stockFor(p.availableKg, p.reservedKg, p.moqKg),
  priceHistory: history(p.basePrice, steps),
}));
