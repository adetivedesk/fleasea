import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { PendingLayout } from '@/layouts/PendingLayout';
import { MerchantLayout } from '@/layouts/MerchantLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HomePage } from '@/pages/public/HomePage';
import { ProductsPage } from '@/pages/public/ProductsPage';
import { ProductDetailPage } from '@/pages/public/ProductDetailPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { LoginPage } from '@/pages/public/LoginPage';
import { RegisterPage } from '@/pages/public/RegisterPage';
import { ApplicationStatusPage } from '@/pages/merchant/ApplicationStatusPage';
import { MerchantDashboardPage } from '@/pages/merchant/MerchantDashboardPage';
import { MerchantCatalogPage } from '@/pages/merchant/MerchantCatalogPage';
import { MerchantProductDetailPage } from '@/pages/merchant/MerchantProductDetailPage';
import { CartPage } from '@/pages/merchant/CartPage';
import { MerchantNegotiationsPage } from '@/pages/merchant/MerchantNegotiationsPage';
import { MerchantProfilePage } from '@/pages/merchant/MerchantProfilePage';
import { CheckoutPage } from '@/pages/merchant/CheckoutPage';
import { MerchantOrdersPage } from '@/pages/merchant/MerchantOrdersPage';
import { MerchantOrderDetailPage } from '@/pages/merchant/MerchantOrderDetailPage';
import { MerchantShipmentsPage } from '@/pages/merchant/MerchantShipmentsPage';
import { MerchantShipmentDetailPage } from '@/pages/merchant/MerchantShipmentDetailPage';
import { MerchantDocumentsPage } from '@/pages/merchant/MerchantDocumentsPage';
import { MerchantPaymentsPage } from '@/pages/merchant/MerchantPaymentsPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminMerchantsPage } from '@/pages/admin/AdminMerchantsPage';
import { AdminMerchantDetailPage } from '@/pages/admin/AdminMerchantDetailPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminProductFormPage } from '@/pages/admin/AdminProductFormPage';
import { AdminPricingPage } from '@/pages/admin/AdminPricingPage';
import { AdminInventoryPage } from '@/pages/admin/AdminInventoryPage';
import { AdminNegotiationsPage } from '@/pages/admin/AdminNegotiationsPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from '@/pages/admin/AdminOrderDetailPage';
import { AdminPaymentsPage } from '@/pages/admin/AdminPaymentsPage';
import { AdminShipmentsPage } from '@/pages/admin/AdminShipmentsPage';
import { AdminShipmentDetailPage } from '@/pages/admin/AdminShipmentDetailPage';
import { AdminDeliveryPage } from '@/pages/admin/AdminDeliveryPage';
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage';
import { AdminCurrenciesPage } from '@/pages/admin/AdminCurrenciesPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Pending merchant */}
      <Route element={<PendingLayout />}>
        <Route path="merchant/application-status" element={<ApplicationStatusPage />} />
      </Route>

      {/* Approved merchant */}
      <Route path="merchant" element={<MerchantLayout />}>
        <Route index element={<MerchantDashboardPage />} />
        <Route path="products" element={<MerchantCatalogPage />} />
        <Route path="products/:id" element={<MerchantProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<MerchantOrdersPage />} />
        <Route path="orders/:id" element={<MerchantOrderDetailPage />} />
        <Route path="negotiations" element={<MerchantNegotiationsPage />} />
        <Route path="shipments" element={<MerchantShipmentsPage />} />
        <Route path="shipments/:id" element={<MerchantShipmentDetailPage />} />
        <Route path="documents" element={<MerchantDocumentsPage />} />
        <Route path="payments" element={<MerchantPaymentsPage />} />
        <Route path="profile" element={<MerchantProfilePage />} />
        <Route path="notifications" element={<NotificationsPage role="merchant" />} />
      </Route>

      {/* Admin */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:id" element={<AdminProductFormPage />} />
        <Route path="pricing" element={<AdminPricingPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        <Route path="merchants" element={<AdminMerchantsPage />} />
        <Route path="merchants/:id" element={<AdminMerchantDetailPage />} />
        <Route path="negotiations" element={<AdminNegotiationsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="shipments" element={<AdminShipmentsPage />} />
        <Route path="shipments/:id" element={<AdminShipmentDetailPage />} />
        <Route path="delivery" element={<AdminDeliveryPage />} />
        <Route path="notifications" element={<NotificationsPage role="admin" />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="settings/currencies" element={<AdminCurrenciesPage />} />
      </Route>

      <Route path="404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
