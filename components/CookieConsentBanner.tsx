"use client";

import { useEffect, useState } from "react";
import { useAnalyticsEvent, useSubmitConsent, useVisitorPing } from "@/lib/api";
import { getAnalyticsConsent, saveAnalyticsConsent } from "@/lib/consent";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const ping = useVisitorPing(false);
  const consent = useSubmitConsent();
  const event = useAnalyticsEvent();

  useEffect(() => {
    if (getAnalyticsConsent() === null) {
      setVisible(true);
    }
  }, []);

  async function choose(accepted: boolean) {
    setError("");
    try {
      const pingResult = await ping.refetch();
      if (pingResult.isError) throw pingResult.error;
      if (!pingResult.data?.tracked) {
        throw new Error("The server did not confirm visitor tracking.");
      }
      await consent.mutateAsync({ accepted });
      saveAnalyticsConsent(accepted);
      if (accepted) {
        event.mutate({ surface: "marketplace", type: "page_view", path: window.location.pathname });
      }
      setVisible(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your choice. Please try again.");
    }
  }

  if (!visible) return null;
  return (
    <aside role="dialog" aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center justify-between gap-3 bg-ink px-5 py-4 text-white shadow-lg sm:flex-row">
      <div>
        <p className="text-sm text-white/80">We use anonymous page-view and click analytics only if you accept.</p>
        {error && <p role="alert" className="mt-1 text-sm text-red-300">{error}</p>}
      </div>
      <div className="flex gap-2">
        <button onClick={() => choose(false)} disabled={ping.isFetching || consent.isPending} className="rounded-lg border border-white/40 px-3 py-2 text-sm">Decline</button>
        <button onClick={() => choose(true)} disabled={ping.isFetching || consent.isPending} className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-ink">Accept</button>
      </div>
    </aside>
  );
}
