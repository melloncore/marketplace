"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { pingVisitor, recordAnalyticsEvent, submitConsent } from "@/lib/api";
import { getAnalyticsConsent, saveAnalyticsConsent } from "@/lib/consent";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const ping = useMutation({ mutationFn: pingVisitor });
  const consent = useMutation({ mutationFn: submitConsent });
  const event = useMutation({ mutationFn: recordAnalyticsEvent });

  useEffect(() => {
    if (getAnalyticsConsent() === null) {
      setVisible(true);
    }
  }, []);

  async function choose(accepted: boolean) {
    setError("");
    try {
      await ping.mutateAsync();
      await consent.mutateAsync(accepted);
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
        <button onClick={() => choose(false)} disabled={ping.isPending || consent.isPending} className="rounded-lg border border-white/40 px-3 py-2 text-sm">Decline</button>
        <button onClick={() => choose(true)} disabled={ping.isPending || consent.isPending} className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-ink">Accept</button>
      </div>
    </aside>
  );
}
