import { getAnalyticsConsent, saveAnalyticsConsent } from "@/lib/consent";

describe("analytics consent cookies", () => {
  beforeEach(() => {
    document.cookie = "msc_analytics_consent=; Max-Age=0; Path=/";
    document.cookie = "marketplace_consent=; Max-Age=0; Path=/";
    document.cookie = "cookie_consent_choice=; Max-Age=0; Path=/";
    delete process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  });

  it("stores consent on localhost without a Secure or cross-domain requirement", () => {
    saveAnalyticsConsent(true);

    expect(getAnalyticsConsent()).toBe("accepted");
    expect(document.cookie).toContain("msc_analytics_consent=accepted");
  });

  it("continues honoring existing consent cookies during migration", () => {
    document.cookie = "marketplace_consent=declined; Path=/";

    expect(getAnalyticsConsent()).toBe("declined");
  });

  it("overwrites consent with the user's updated choice", () => {
    saveAnalyticsConsent(true);
    saveAnalyticsConsent(false);

    expect(getAnalyticsConsent()).toBe("declined");
  });
});
