import type { DeliveryDetails } from "./types";

const NEAR_STATES = ["Lagos", "Oyo", "Ogun"];

export const STATES = ["Lagos", "Abuja (FCT)", "Oyo", "Ogun", "Rivers", "Kano", "Enugu", "Other"];

export const deliveryFee = (state: string): number => (NEAR_STATES.includes(state) ? 3000 : 6000);

/** Returns an error message, or null when the form is valid. */
export function validateCheckout(f: DeliveryDetails): string | null {
  if (!f.name.trim() || !f.address.trim() || !f.city.trim()) return "Fill in your name, address and city.";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) return "Enter a valid email address.";
  if (!/^(\+234|0)\d{10}$/.test(f.phone.replace(/\s/g, ""))) return "Enter a valid Nigerian phone number.";
  return null;
}
