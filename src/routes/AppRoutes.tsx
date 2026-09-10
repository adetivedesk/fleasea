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
import { NotFoundPage } from '@/pages/NotFoundPage';
import * as P from '@/pages/placeholders';

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
        <Route path="notifications" element={<P.MerchantNotificationsPage />} />
      </Route>

      {/* Admin */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<P.AdminDashboardPage />} />
        <Route path="products" element={<P.AdminProductsPage />} />
        <Route path="products/new" element={<P.AdminProductFormPage />} />
        <Route path="products/:id" element={<P.AdminProductFormPage />} />
        <Route path="pricing" element={<P.AdminPricingPage />} />
        <Route path="inventory" element={<P.AdminInventoryPage />} />
        <Route path="merchants" element={<P.AdminMerchantsPage />} />
        <Route path="merchants/:id" element={<P.AdminMerchantDetailPage />} />
        <Route path="negotiations" element={<P.AdminNegotiationsPage />} />
        <Route path="orders" element={<P.AdminOrdersPage />} />
        <Route path="orders/:id" element={<P.AdminOrderDetailPage />} />
        <Route path="payments" element={<P.AdminPaymentsPage />} />
        <Route path="shipments" element={<P.AdminShipmentsPage />} />
        <Route path="shipments/:id" element={<P.AdminShipmentDetailPage />} />
        <Route path="delivery" element={<P.AdminDeliveryPage />} />
        <Route path="users" element={<P.AdminUsersPage />} />
        <Route path="reports" element={<P.AdminReportsPage />} />
        <Route path="settings" element={<P.AdminSettingsPage />} />
        <Route path="settings/currencies" element={<P.AdminCurrenciesPage />} />
      </Route>

      <Route path="404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
