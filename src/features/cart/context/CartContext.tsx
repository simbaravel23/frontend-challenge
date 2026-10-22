import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';

export interface CartItem {
  id: string;
  name: string;
  priceETH: string;
  imageUrl: string;
  rarity: string;
  quantity: number;
  available: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemPrice: (id: string, priceETH: string, available: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalETH: string;
}

type AuthChangeEvent = CustomEvent<{ userId: string | null }>;

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_KEY_PREFIX = 'kurio_cart_';

function getUserIdFromToken(token: string | null): string | null {
  if (token === 'mock-jwt-token-kurio-123') return 'user-1';
  if (token === 'mock-jwt-token-kurio-456') return 'user-2';
  return token?.match(/^mock-jwt-(user-\d+)-/)?.[1] ?? null;
}

function readCart(key: string): CartItem[] {
  const stored = window.localStorage.getItem(key);
  if (!stored) return [];
  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error('O carrinho armazenado não é uma lista.');
    return parsed.filter((item): item is CartItem =>
      typeof item?.id === 'string'
      && typeof item?.name === 'string'
      && typeof item?.priceETH === 'string'
      && Number.isInteger(item?.quantity)
      && typeof item?.available === 'number',
    );
  } catch (error) {
    console.error('Não foi possível recuperar o carrinho salvo.', error);
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState(() => getUserIdFromToken(window.localStorage.getItem('kurio_token')));
  const activeKey = `${CART_KEY_PREFIX}${userId ?? 'guest'}`;
  const [cart, setCart] = useState<CartItem[]>(() => readCart(activeKey));

  useEffect(() => {
    window.localStorage.setItem(activeKey, JSON.stringify(cart));
  }, [activeKey, cart]);

  useEffect(() => {
    const onAuthChange = (event: Event) => {
      const { userId: nextUserId } = (event as AuthChangeEvent).detail;
      window.localStorage.setItem(`${CART_KEY_PREFIX}${userId ?? 'guest'}`, JSON.stringify(cart));

      if (nextUserId) {
        const guestItems = readCart(`${CART_KEY_PREFIX}guest`);
        const accountItems = readCart(`${CART_KEY_PREFIX}${nextUserId}`);
        const merged = [...accountItems];
        for (const guestItem of guestItems) {
          const existing = merged.find((item) => item.id === guestItem.id);
          if (existing) {
            existing.quantity = Math.min(existing.available, existing.quantity + guestItem.quantity);
          } else {
            merged.push(guestItem);
          }
        }
        window.localStorage.removeItem(`${CART_KEY_PREFIX}guest`);
        window.localStorage.setItem(`${CART_KEY_PREFIX}${nextUserId}`, JSON.stringify(merged));
        setCart(merged);
      } else {
        const guestItems = readCart(`${CART_KEY_PREFIX}guest`);
        setCart(guestItems);
      }
      setUserId(nextUserId);
    };

    window.addEventListener('kurio:auth-changed', onAuthChange);
    return () => window.removeEventListener('kurio:auth-changed', onAuthChange);
  }, [cart, userId]);

  useEffect(() => {
    const onNFTUpdate = (event: Event) => {
      const update = (event as CustomEvent<{ id: string; priceETH: string; editionAvailable: number }>).detail;
      setCart((previous) => previous.map((item) =>
        item.id === update.id
          ? { ...item, priceETH: update.priceETH, available: update.editionAvailable }
          : item,
      ));
    };
    window.addEventListener('kurio:nft-updated', onNFTUpdate);
    return () => window.removeEventListener('kurio:nft-updated', onNFTUpdate);
  }, []);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart((previous) => {
      const existing = previous.find((entry) => entry.id === item.id);
      if (existing) {
        return previous.map((entry) => entry.id === item.id
          ? { ...entry, quantity: Math.min(entry.available, entry.quantity + (item.quantity ?? 1)) }
          : entry);
      }
      return [...previous, { ...item, quantity: Math.min(item.available, item.quantity ?? 1) }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    setCart((previous) => previous.map((item) =>
      item.id === id ? { ...item, quantity: item.available > 0 ? Math.min(quantity, item.available) : item.quantity } : item,
    ));
  };

  const updateItemPrice = (id: string, priceETH: string, available: number) => {
    setCart((previous) => previous.map((item) => item.id === id ? { ...item, priceETH, available } : item));
  };

  const removeFromCart = (id: string) => setCart((previous) => previous.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  const totalETH = useMemo(
    () => cart.reduce(
      (total, item) => total.plus(new BigNumber(item.priceETH).multipliedBy(item.quantity)),
      new BigNumber(0),
    ).toFixed(),
    [cart],
  );

  const value = useMemo(
    () => ({ cart, addToCart, updateQuantity, updateItemPrice, removeFromCart, clearCart, totalETH }),
    [cart, totalETH],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Context hooks share this module with their provider intentionally.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
