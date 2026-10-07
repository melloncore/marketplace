"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import type { CartItem, Product } from "@/lib/types";

interface CartCtxValue {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  ready: boolean;
}

const CartCtx = createContext<CartCtxValue | null>(null);

export function useCart(): CartCtxValue {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("cart") || "[]")); } catch { /* ignore bad data */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("cart", JSON.stringify(items)); }, [items, ready]);

  const add: CartCtxValue["add"] = (product, qty = 1) => {
    setItems((cur) => {
      const found = cur.find((i) => i.product.id === product.id);
      if (found) return cur.map((i) => i.product.id === product.id ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i);
      return [...cur, { product, qty: Math.min(qty, product.stock) }];
    });
    toast.success(`${product.name} added to cart`);
  };
  const setQty: CartCtxValue["setQty"] = (id, qty) =>
    setItems((cur) => cur.map((i) => i.product.id === id ? { ...i, qty: Math.max(1, Math.min(qty || 1, i.product.stock)) } : i));
  const remove: CartCtxValue["remove"] = (id) => { setItems((cur) => cur.filter((i) => i.product.id !== id)); toast.info("Item removed"); };
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.product.price, 0);

  return <CartCtx.Provider value={{ items, add, setQty, remove, clear, count, subtotal, ready }}>{children}</CartCtx.Provider>;
}
