import type { CheckoutForm } from "./types";

const NEAR_STATES = ["Lagos", "Oyo", "Ogun"];

export const STATES = ["Lagos", "Abuja (FCT)", "Oyo", "Ogun", "Rivers", "Kano", "Enugu", "Other"];

export const deliveryFee = (state: string): number => (NEAR_STATES.includes(state) ? 3000 : 6000);

/** Returns an error message, or null when the form is valid. */
export function validateCheckout(f: CheckoutForm): string | null {
  if (!f.name.trim() || !f.address.trim() || !f.city.trim()) return "Fill in your name, address and city.";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) return "Enter a valid email address.";
  if (!/^(\+234|0)\d{10}$/.test(f.phone.replace(/\s/g, ""))) return "Enter a valid Nigerian phone number.";
  if (f.card.replace(/\s/g, "").length < 16) return "Card number must be 16 digits.";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.expiry)) return "Expiry must look like MM/YY.";
  if (f.cvv.length < 3) return "Enter the 3-digit CVV.";
  return null;
}

/** "4242424242424242" -> "4242 4242 4242 4242" */
export const formatCard = (raw: string): string =>
  raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
