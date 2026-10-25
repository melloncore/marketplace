import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/context/CartContext";
import { findProduct } from "@/lib/products";
import type { CartItem, Product } from "@/lib/types";

export const renderWithCart = (ui: ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>{ui}</CartProvider>
    </QueryClientProvider>,
  );
};

export const getProduct = (id: number): Product => {
  const p = findProduct(id);
  if (!p) throw new Error(`Missing product ${id}`);
  return p;
};

/** Pre-fill the cart in localStorage before rendering. */
export const seedCart = (...entries: [number, number][]) => {
  const items: CartItem[] = entries.map(([id, qty]) => ({ product: getProduct(id), qty }));
  localStorage.setItem("cart", JSON.stringify(items));
};
