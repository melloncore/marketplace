"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { recordAnalyticsEvent } from "@/lib/api";
import { getAnalyticsConsent } from "@/lib/consent";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const eventMutation = useMutation({ mutationFn: recordAnalyticsEvent });

  useEffect(() => {
    if (getAnalyticsConsent() === "accepted") {
      eventMutation.mutate({ surface: "marketplace", type: "page_view", path: pathname || "/" });
    }
  }, [eventMutation.mutate, pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (getAnalyticsConsent() !== "accepted" || !(event.target instanceof Element)) return;
      if (event.target.closest("input, textarea, select, [data-private]")) return;
      const element = event.target.closest<HTMLElement>("a, button, [role='button']");
      if (!element) return;
      const label = (element.getAttribute("aria-label") || element.innerText || element.title)
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 120);
      eventMutation.mutate({
        surface: "marketplace",
        type: "click",
        path: window.location.pathname,
        ...(label ? { label } : {}),
      });
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [eventMutation.mutate]);

  return null;
}
