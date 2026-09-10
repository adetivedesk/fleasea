import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils/storage';
import type { CartItem, QuantityUnit } from '@/types';

interface CartContextValue {
  items: CartItem[];
  count: number;
  /** total normalised weight across the cart, in KG */
  totalKg: number;
  add: (item: CartItem) => void;
  updateQuantity: (productId: string, quantityKg: number, displayUnit?: QuantityUnit) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    storage.get<CartItem[]>(STORAGE_KEYS.CART, []),
  );

  useEffect(() => {
    storage.set(STORAGE_KEYS.CART, items);
  }, [items]);

  const add = useCallback((item: CartItem) => {
    setItems((list) => {
      const i = list.findIndex((x) => x.productId === item.productId);
      if (i === -1) return [...list, item];
      const next = [...list];
      next[i] = {
        ...next[i],
        quantityKg: next[i].quantityKg + item.quantityKg,
        displayUnit: item.displayUnit,
        negotiatedPrice: item.negotiatedPrice ?? next[i].negotiatedPrice,
      };
      return next;
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantityKg: number, displayUnit?: QuantityUnit) => {
      setItems((list) =>
        list.map((x) =>
          x.productId === productId
            ? { ...x, quantityKg, displayUnit: displayUnit ?? x.displayUnit }
            : x,
        ),
      );
    },
    [],
  );

  const remove = useCallback((productId: string) => {
    setItems((list) => list.filter((x) => x.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      totalKg: items.reduce((s, x) => s + x.quantityKg, 0),
      add,
      updateQuantity,
      remove,
      clear,
      has: (productId: string) => items.some((x) => x.productId === productId),
    }),
    [items, add, updateQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
