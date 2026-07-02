import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  priceLabel: string;
  imageUrl: string;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  signupDiscountApplied: boolean;
  firstBuyerDiscountApplied: boolean;
  isSignedIn: boolean;
  userId: string | null;
  itemCount: number;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "mh_ritual_cart_v1";

const SIGNUP_DISCOUNT_PCT = 20;
const FIRST_BUYER_DISCOUNT_PCT = 30;

export function parsePriceCents(price: string): number {
  const n = parseFloat(String(price).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}
export function formatCents(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasPaidOrder, setHasPaidOrder] = useState(false);

  // Load persisted cart
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Track auth
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUserId(data.user?.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  // Check first-buyer status
  useEffect(() => {
    if (!userId) { setHasPaidOrder(false); return; }
    let active = true;
    supabase.rpc("has_paid_order", { _user_id: userId }).then(({ data }) => {
      if (active) setHasPaidOrder(!!data);
    });
    return () => { active = false; };
  }, [userId]);

  const value = useMemo<CartCtx>(() => {
    const subtotalCents = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);
    const isSignedIn = !!userId;
    const signupDiscountApplied = isSignedIn;
    const firstBuyerDiscountApplied = isSignedIn && !hasPaidOrder;
    const pct =
      (signupDiscountApplied ? SIGNUP_DISCOUNT_PCT : 0) +
      (firstBuyerDiscountApplied ? FIRST_BUYER_DISCOUNT_PCT : 0);
    const discountCents = Math.round((subtotalCents * pct) / 100);
    const totalCents = Math.max(0, subtotalCents - discountCents);
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);

    return {
      items,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      add: (item, qty = 1) => {
        setItems((prev) => {
          const idx = prev.findIndex((i) => i.productId === item.productId);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
            return copy;
          }
          return [...prev, { ...item, quantity: qty }];
        });
        setIsOpen(true);
      },
      remove: (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId)),
      setQty: (productId, qty) => setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.productId !== productId)
          : prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
      ),
      clear: () => setItems([]),
      subtotalCents, discountCents, totalCents,
      signupDiscountApplied, firstBuyerDiscountApplied,
      isSignedIn, userId, itemCount,
    };
  }, [items, isOpen, userId, hasPaidOrder]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const CART_DISCOUNT_PCT = {
  signup: SIGNUP_DISCOUNT_PCT,
  firstBuyer: FIRST_BUYER_DISCOUNT_PCT,
};
