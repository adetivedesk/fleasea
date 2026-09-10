import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, Tag } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { useCart } from '@/store/CartContext';
import { useApp } from '@/store/AppContext';
import { useI18n } from '@/i18n';
import { buildCartTotals } from '@/utils/orderCalc';
import { formatMoney } from '@/utils/currency';
import { formatDualQuantity, formatKg } from '@/utils/quantity';
import { fishImage } from '@/data/images';
import {
  Button, Card, CardBody, EmptyState, LoadingState, PageHeader, useToast,
} from '@/components/ui';
import { WholesaleQuantityInput } from '@/components/product/WholesaleQuantityInput';

export function CartPage() {
  const cart = useCart();
  const toast = useToast();
  const { currency, currencies } = useApp();
  const { t } = useI18n();
  const { data: products, loading } = useAsync(() => productService.list(), []);

  if (loading || !products) return <LoadingState />;

  if (cart.items.length === 0) {
    return (
      <div>
        <PageHeader title="Wholesale Cart" />
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          body="Add wholesale products from the catalogue to start an order."
          action={<Button to="/merchant/products">Browse Fish</Button>}
        />
      </div>
    );
  }

  const totals = buildCartTotals(cart.items, products, currency, currencies);

  return (
    <div>
      <PageHeader
        title="Wholesale Cart"
        subtitle="Quantities are entered in KG or TON and normalised to KG (1 TON = 1,000 KG)."
        actions={<Button variant="ghost" onClick={() => { cart.clear(); toast.info('Cart cleared'); }}>Clear cart</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            const line = totals.lines.find((l) => l.product.id === product.id);
            const freeKg = product.availableKg - product.reservedKg;
            return (
              <Card key={item.productId}>
                <CardBody className="flex flex-col gap-4 sm:flex-row">
                  <img
                    src={fishImage(product.images[0])}
                    alt={product.nameEn}
                    className="h-20 w-20 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/merchant/products/${product.id}`} className="font-semibold text-ink-900 hover:text-brand-700">
                          {product.nameEn}
                        </Link>
                        <p className="text-sm text-ink-500">
                          {formatMoney(line?.pricePerKg ?? 0, currency, { unit: 'KG' })}
                          {item.negotiatedPrice != null && (
                            <span className="ms-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                              <Tag className="h-3 w-3" /> negotiated
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => cart.remove(item.productId)}
                        className="text-ink-400 hover:text-red-600"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                      <WholesaleQuantityInput
                        valueKg={item.quantityKg}
                        onChange={(kg, u) => cart.updateQuantity(item.productId, kg, u)}
                        moqKg={product.moqKg}
                        availableKg={freeKg}
                      />
                      <div className="text-right">
                        <p className="text-xs text-ink-400">Subtotal</p>
                        <p className="text-lg font-bold text-ink-900">
                          {formatMoney(line?.subtotal ?? 0, currency)}
                        </p>
                        <p className="text-xs text-ink-400">{formatDualQuantity(item.quantityKg)}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <Card className="h-fit">
          <CardBody>
            <h3 className="font-semibold text-ink-900">Order summary</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label={`Goods subtotal (${formatKg(totals.totalKg)})`} value={formatMoney(totals.subtotal, currency)} />
              <Row label="Delivery (indicative)" value={formatMoney(totals.deliveryFee, currency)} />
              <Row label="VAT 15%" value={formatMoney(totals.tax, currency)} />
              <div className="border-t border-ink-200 pt-2">
                <Row label="Total" value={formatMoney(totals.total, currency)} strong />
              </div>
            </dl>
            <p className="mt-3 text-xs text-ink-400">{t('currency.disclaimer')}</p>
            <Button to="/merchant/checkout" fullWidth iconRight={ArrowRight} className="mt-4">
              Proceed to Checkout
            </Button>
            <Button to="/merchant/products" variant="ghost" fullWidth className="mt-2">
              Continue browsing
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className={strong ? 'font-semibold text-ink-900' : 'text-ink-500'}>{label}</dt>
      <dd className={strong ? 'text-base font-bold text-ink-900' : 'font-medium text-ink-800'}>{value}</dd>
    </div>
  );
}
