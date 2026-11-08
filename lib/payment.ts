import { initializeOrder, type OrderRequest } from "./api/marketplace";

export function processPayment(input: OrderRequest) {
  return initializeOrder(input);
}

export function redirectToPaystack(authorizationUrl: string): void {
  window.location.assign(authorizationUrl);
}
