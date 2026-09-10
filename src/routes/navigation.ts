import {
  LayoutDashboard,
  Fish,
  Tags,
  Boxes,
  Users,
  Handshake,
  ShoppingCart,
  CreditCard,
  Truck,
  PackageCheck,
  FileText,
  Bell,
  Settings,
  Building2,
  BarChart3,
  Coins,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TranslationKey } from '@/i18n/translations';

export interface NavItem {
  to: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
  end?: boolean;
}

export const PUBLIC_NAV: NavItem[] = [
  { to: '/', labelKey: 'nav.home', icon: LayoutDashboard, end: true },
  { to: '/products', labelKey: 'nav.products', icon: Fish },
  { to: '/about', labelKey: 'nav.about', icon: Building2 },
  { to: '/contact', labelKey: 'nav.contact', icon: Bell },
];

export const MERCHANT_NAV: NavItem[] = [
  { to: '/merchant', labelKey: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/merchant/products', labelKey: 'nav.catalog', icon: Fish },
  { to: '/merchant/cart', labelKey: 'nav.cart', icon: ShoppingCart },
  { to: '/merchant/negotiations', labelKey: 'nav.negotiations', icon: Handshake },
  { to: '/merchant/orders', labelKey: 'nav.orders', icon: PackageCheck },
  { to: '/merchant/shipments', labelKey: 'nav.shipments', icon: Truck },
  { to: '/merchant/payments', labelKey: 'nav.payments', icon: CreditCard },
  { to: '/merchant/documents', labelKey: 'nav.documents', icon: FileText },
  { to: '/merchant/notifications', labelKey: 'nav.notifications', icon: Bell },
  { to: '/merchant/profile', labelKey: 'nav.profile', icon: Building2 },
];

export const ADMIN_NAV: NavItem[] = [
  { to: '/admin', labelKey: 'nav.admin.dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', labelKey: 'nav.admin.products', icon: Fish },
  { to: '/admin/pricing', labelKey: 'nav.admin.pricing', icon: Tags },
  { to: '/admin/inventory', labelKey: 'nav.admin.inventory', icon: Boxes },
  { to: '/admin/merchants', labelKey: 'nav.admin.merchants', icon: Users },
  { to: '/admin/negotiations', labelKey: 'nav.admin.negotiations', icon: Handshake },
  { to: '/admin/orders', labelKey: 'nav.admin.orders', icon: PackageCheck },
  { to: '/admin/payments', labelKey: 'nav.admin.payments', icon: CreditCard },
  { to: '/admin/shipments', labelKey: 'nav.admin.shipments', icon: Truck },
  { to: '/admin/delivery', labelKey: 'nav.admin.delivery', icon: Truck },
  { to: '/admin/reports', labelKey: 'nav.admin.reports', icon: BarChart3 },
  { to: '/admin/notifications', labelKey: 'nav.notifications', icon: Bell },
  { to: '/admin/users', labelKey: 'nav.admin.users', icon: Users },
  { to: '/admin/settings/currencies', labelKey: 'nav.admin.currencies', icon: Coins },
  { to: '/admin/settings', labelKey: 'nav.admin.settings', icon: Settings },
];

export const NAV_ICONS = { Fish, Tags, Boxes, Coins };
