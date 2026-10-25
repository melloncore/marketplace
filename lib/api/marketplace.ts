import type { Order, Product } from "../types";
import { apiRequest } from "./http";

export async function listProducts(): Promise<Product[]> {
  const result = await apiRequest<{ products: Product[] }>("/marketplace/products");
  return result.products;
}

export interface OrderRequest {
  items: { productId: number; quantity: number }[];
  delivery: Omit<Order["delivery"], "note"> & { note?: string };
}

export async function initializeOrder(input: OrderRequest): Promise<{ authorizationUrl: string; reference: string }> {
  return apiRequest("/marketplace/orders/initialize", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function verifyOrderPayment(reference: string): Promise<{ paid: boolean; order: Order }> {
  return apiRequest("/marketplace/orders/verify", {
    method: "POST",
    body: JSON.stringify({ reference }),
  });
}
