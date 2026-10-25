import { apiRequest } from "./http";

export async function pingVisitor(): Promise<{ tracked: boolean }> {
  return apiRequest("/landing/ping");
}

export async function submitConsent(accepted: boolean): Promise<{ success: boolean }> {
  return apiRequest("/landing/consent", {
    method: "POST",
    body: JSON.stringify({ accepted }),
  });
}
