const CONSENT_COOKIE = "msc_analytics_consent";
const LEGACY_CONSENT_COOKIES = ["marketplace_consent", "cookie_consent_choice"];

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getAnalyticsConsent(): string | null {
  return readCookie(CONSENT_COOKIE) ?? LEGACY_CONSENT_COOKIES
    .map(readCookie)
    .find((value) => value !== null) ?? null;
}

export function saveAnalyticsConsent(accepted: boolean): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const configuredDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN?.trim();
  if (configuredDomain && !/^\.[a-z\d](?:[a-z\d.-]*[a-z\d])?$/i.test(configuredDomain)) {
    throw new Error("NEXT_PUBLIC_COOKIE_DOMAIN must be a bare cookie domain, such as .melloncore.com");
  }
  const domain = configuredDomain ? `; Domain=${configuredDomain}` : "";
  document.cookie = `${CONSENT_COOKIE}=${accepted ? "accepted" : "declined"}; Path=/; Max-Age=31536000; SameSite=Lax${domain}${secure}`;
}
