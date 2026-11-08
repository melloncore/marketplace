import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import { processPayment } from "../payment";
import { listMarketplaceAdverts } from "./adverts";
import { recordAnalyticsEvent, type AnalyticsEvent } from "./analytics";
import { pingVisitor, submitConsent } from "./landing";
import {
  listProducts,
  verifyOrderPayment,
  type OrderRequest,
} from "./marketplace";

type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
>;

interface ConsentChoice {
  accepted: boolean;
  email?: string;
}

export const apiQueryKeys = {
  adverts: ["marketplace", "adverts"] as const,
  products: ["marketplace", "products"] as const,
  visitorPing: ["landing", "ping"] as const,
};

export function useMarketplaceAdverts() {
  return useQuery({
    queryKey: apiQueryKeys.adverts,
    queryFn: listMarketplaceAdverts,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: apiQueryKeys.products,
    queryFn: listProducts,
  });
}

export function useVisitorPing(enabled = true) {
  return useQuery({
    queryKey: apiQueryKeys.visitorPing,
    queryFn: pingVisitor,
    enabled,
    retry: false,
    staleTime: 0,
  });
}

export function useSubmitConsent(
  options?: MutationOptions<Awaited<ReturnType<typeof submitConsent>>, ConsentChoice>,
) {
  return useMutation({
    mutationFn: ({ accepted, email }: ConsentChoice) => submitConsent(accepted, email),
    ...options,
  });
}

export function useAnalyticsEvent(
  options?: MutationOptions<void, AnalyticsEvent>,
) {
  return useMutation({ mutationFn: recordAnalyticsEvent, ...options });
}

export function useInitializeOrder(
  options?: MutationOptions<
    Awaited<ReturnType<typeof processPayment>>,
    OrderRequest
  >,
) {
  return useMutation({ mutationFn: processPayment, ...options });
}

export function useVerifyOrderPayment(
  options?: MutationOptions<
    Awaited<ReturnType<typeof verifyOrderPayment>>,
    string
  >,
) {
  return useMutation({ mutationFn: verifyOrderPayment, ...options });
}
