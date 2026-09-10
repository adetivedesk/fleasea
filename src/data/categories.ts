import { PRODUCT_CATEGORY } from '@/constants';
import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { id: PRODUCT_CATEGORY.FRESH_ICE, nameEn: 'Fresh / Ice Fish', nameAr: 'أسماك طازجة / مثلجة' },
  { id: PRODUCT_CATEGORY.LIVE, nameEn: 'Live Fish', nameAr: 'أسماك حية' },
  { id: PRODUCT_CATEGORY.FROZEN, nameEn: 'Frozen Fish', nameAr: 'أسماك مجمدة' },
];

export const categoryName = (id: string, locale: 'en' | 'ar'): string => {
  const c = CATEGORIES.find((x) => x.id === id);
  if (!c) return id;
  return locale === 'ar' ? c.nameAr : c.nameEn;
};

/** Options for filter controls, incl. an "all" entry. */
export const categoryFilterOptions = (locale: 'en' | 'ar') => [
  { value: 'all', label: locale === 'ar' ? 'الكل' : 'All' },
  ...CATEGORIES.map((c) => ({ value: c.id, label: locale === 'ar' ? c.nameAr : c.nameEn })),
];
