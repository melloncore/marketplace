import { apiRequest } from "./http";

export interface AnalyticsEvent {
  surface: "client" | "marketplace";
  type: "page_view" | "click";
  path: string;
  label?: string;
}

export async function recordAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  await apiRequest("/analytics/events", {
    method: "POST",
    body: JSON.stringify(event),
    keepalive: true,
  });
}
