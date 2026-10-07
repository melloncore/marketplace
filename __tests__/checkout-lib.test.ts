import { deliveryFee, formatCard, validateCheckout } from "@/lib/checkout";
import type { CheckoutForm } from "@/lib/types";

const valid: CheckoutForm = {
  name: "Ada Obi", email: "ada@example.com", phone: "08012345678", address: "12 Ring Road",
  city: "Ibadan", state: "Oyo", note: "", card: "4242 4242 4242 4242", expiry: "12/29", cvv: "123",
};

describe("deliveryFee", () => {
  it.each(["Lagos", "Oyo", "Ogun"])("charges 3000 for %s", (s) => expect(deliveryFee(s)).toBe(3000));
  it.each(["Kano", "Rivers", "Other"])("charges 6000 for %s", (s) => expect(deliveryFee(s)).toBe(6000));
});

describe("formatCard", () => {
  it("groups digits in fours and strips non-digits", () => {
    expect(formatCard("4242424242424242")).toBe("4242 4242 4242 4242");
    expect(formatCard("42ab42")).toBe("4242");
  });
  it("limits to 16 digits", () => expect(formatCard("12345678901234567890")).toBe("1234 5678 9012 3456"));
});

describe("validateCheckout", () => {
  it("accepts a valid form", () => expect(validateCheckout(valid)).toBeNull());

  it.each([
    [{ name: " " }, /name, address and city/],
    [{ address: "" }, /name, address and city/],
    [{ city: "" }, /name, address and city/],
    [{ email: "nope" }, /email/i],
    [{ phone: "123" }, /phone/i],
    [{ card: "4242" }, /Card number/],
    [{ expiry: "13/29" }, /Expiry/],
    [{ expiry: "1229" }, /Expiry/],
    [{ cvv: "12" }, /CVV/],
  ] as [Partial<CheckoutForm>, RegExp][])("rejects %j", (patch, message) => {
    expect(validateCheckout({ ...valid, ...patch })).toMatch(message);
  });

  it("accepts +234 phone numbers", () => {
    expect(validateCheckout({ ...valid, phone: "+2348012345678" })).toBeNull();
  });
});
