/**
 * Centralised translations (spec §8). Flat dot-keyed dictionary.
 * Phase 1 covers chrome (nav, layout, common actions); later phases extend it.
 */
export type TranslationKey = keyof typeof en;

export const en = {
  'app.name': 'Fleasea',
  'app.tagline': 'B2B Wholesale Fish Trading',

  'nav.home': 'Home',
  'nav.products': 'Products',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.login': 'Login',
  'nav.register': 'Register as Merchant',
  'nav.dashboard': 'Dashboard',
  'nav.catalog': 'Catalog',
  'nav.cart': 'Cart',
  'nav.orders': 'Orders',
  'nav.negotiations': 'Negotiations',
  'nav.shipments': 'Shipments',
  'nav.documents': 'Documents',
  'nav.payments': 'Payments',
  'nav.profile': 'Company Profile',
  'nav.notifications': 'Notifications',
  'nav.logout': 'Logout',
  'area.merchant': 'Merchant Portal',
  'area.admin': 'Admin Console',

  'nav.admin.dashboard': 'Dashboard',
  'nav.admin.products': 'Fish Products',
  'nav.admin.pricing': 'Daily Pricing',
  'nav.admin.inventory': 'Inventory',
  'nav.admin.merchants': 'Merchants',
  'nav.admin.negotiations': 'Negotiations',
  'nav.admin.orders': 'Orders',
  'nav.admin.payments': 'Payments',
  'nav.admin.shipments': 'Shipments',
  'nav.admin.delivery': 'Delivery',
  'nav.admin.users': 'Users & Roles',
  'nav.admin.reports': 'Reports',
  'nav.admin.settings': 'Settings',
  'nav.admin.currencies': 'Currencies',

  'common.language': 'Language',
  'common.currency': 'Currency',
  'common.search': 'Search',
  'common.viewAll': 'View all',
  'common.loading': 'Loading…',
  'common.comingSoon': 'Coming soon',
  'common.comingSoon.body': 'This screen is part of a later build phase.',
  'common.backHome': 'Back to home',

  'preview.label': 'Prototype Mode — Preview As',
  'preview.visitor': 'Visitor',
  'preview.pending': 'Pending Merchant',
  'preview.merchant': 'Approved Merchant',
  'preview.admin': 'Admin',
  'preview.reset': 'Reset Demo Data',
  'preview.reset.confirm':
    'Reset all demo data to its original seeded state? Your local changes will be lost.',

  'currency.disclaimer':
    'Indicative converted price. Final trading price is confirmed at order / negotiation.',

  'footer.rights': 'All rights reserved.',
  'footer.prototype':
    'Frontend prototype — mock data only. No real orders or payments are processed.',

  'access.merchantRequired.title': 'Wholesale merchant approval required',
  'access.merchantRequired.body': 'This area is available to approved wholesale merchants only.',
  'access.merchantRequired.cta': 'Apply for Merchant Account',
  'access.pending.title': 'Your merchant account is awaiting approval',
  'access.pending.body': 'Your merchant application is currently under review.',
  'access.adminRequired.title': 'Administrator access required',
  'access.adminRequired.body': 'You need administrator privileges to view this area.',

  'notfound.title': 'Page not found',
  'notfound.body': 'The page you are looking for does not exist or has moved.',
} as const;

export const ar: Record<TranslationKey, string> = {
  'app.name': 'فليسيا',
  'app.tagline': 'تجارة الأسماك بالجملة بين الشركات',

  'nav.home': 'الرئيسية',
  'nav.products': 'المنتجات',
  'nav.about': 'من نحن',
  'nav.contact': 'اتصل بنا',
  'nav.login': 'تسجيل الدخول',
  'nav.register': 'سجّل كتاجر',
  'nav.dashboard': 'لوحة التحكم',
  'nav.catalog': 'الكتالوج',
  'nav.cart': 'السلة',
  'nav.orders': 'الطلبات',
  'nav.negotiations': 'المفاوضات',
  'nav.shipments': 'الشحنات',
  'nav.documents': 'المستندات',
  'nav.payments': 'المدفوعات',
  'nav.profile': 'ملف الشركة',
  'nav.notifications': 'الإشعارات',
  'nav.logout': 'تسجيل الخروج',
  'area.merchant': 'بوابة التاجر',
  'area.admin': 'وحدة تحكم المدير',

  'nav.admin.dashboard': 'لوحة التحكم',
  'nav.admin.products': 'منتجات الأسماك',
  'nav.admin.pricing': 'التسعير اليومي',
  'nav.admin.inventory': 'المخزون',
  'nav.admin.merchants': 'التجار',
  'nav.admin.negotiations': 'المفاوضات',
  'nav.admin.orders': 'الطلبات',
  'nav.admin.payments': 'المدفوعات',
  'nav.admin.shipments': 'الشحنات',
  'nav.admin.delivery': 'التوصيل',
  'nav.admin.users': 'المستخدمون والأدوار',
  'nav.admin.reports': 'التقارير',
  'nav.admin.settings': 'الإعدادات',
  'nav.admin.currencies': 'العملات',

  'common.language': 'اللغة',
  'common.currency': 'العملة',
  'common.search': 'بحث',
  'common.viewAll': 'عرض الكل',
  'common.loading': 'جارٍ التحميل…',
  'common.comingSoon': 'قريباً',
  'common.comingSoon.body': 'هذه الشاشة جزء من مرحلة تطوير لاحقة.',
  'common.backHome': 'العودة إلى الرئيسية',

  'preview.label': 'وضع النموذج — المعاينة بصفة',
  'preview.visitor': 'زائر',
  'preview.pending': 'تاجر قيد المراجعة',
  'preview.merchant': 'تاجر معتمد',
  'preview.admin': 'مدير',
  'preview.reset': 'إعادة تعيين البيانات التجريبية',
  'preview.reset.confirm':
    'إعادة تعيين جميع البيانات التجريبية إلى حالتها الأصلية؟ ستفقد تغييراتك المحلية.',

  'currency.disclaimer': 'سعر تحويلي استرشادي. يتم تأكيد السعر النهائي عند الطلب / التفاوض.',

  'footer.rights': 'جميع الحقوق محفوظة.',
  'footer.prototype':
    'نموذج واجهة أمامية — بيانات وهمية فقط. لا تتم معالجة طلبات أو مدفوعات حقيقية.',

  'access.merchantRequired.title': 'مطلوب اعتماد تاجر جملة',
  'access.merchantRequired.body': 'هذه المنطقة متاحة لتجار الجملة المعتمدين فقط.',
  'access.merchantRequired.cta': 'تقدّم بطلب حساب تاجر',
  'access.pending.title': 'حساب التاجر الخاص بك قيد الموافقة',
  'access.pending.body': 'طلب التاجر الخاص بك قيد المراجعة حالياً.',
  'access.adminRequired.title': 'مطلوب صلاحية مدير',
  'access.adminRequired.body': 'تحتاج إلى صلاحيات المدير لعرض هذه المنطقة.',

  'notfound.title': 'الصفحة غير موجودة',
  'notfound.body': 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
};

export const dictionaries = { en, ar } as const;
