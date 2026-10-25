import { deliveryFee, validateCheckout } from "@/lib/checkout";
import type { CheckoutForm } from "@/lib/types";

const valid: CheckoutForm = {
  name: "Ada Obi", email: "ada@example.com", phone: "08012345678", address: "12 Ring Road",
  city: "Ibadan", state: "Oyo", note: "",
};

describe("deliveryFee", () => {
  it.each(["Lagos", "Oyo", "Ogun"])("charges 3000 for %s", (s) => expect(deliveryFee(s)).toBe(3000));
  it.each(["Kano", "Rivers", "Other"])("charges 6000 for %s", (s) => expect(deliveryFee(s)).toBe(6000));
});

describe("validateCheckout", () => {
  it("accepts a valid form", () => expect(validateCheckout(valid)).toBeNull());

  it.each([
    [{ name: " " }, /name, address and city/],
    [{ address: "" }, /name, address and city/],
    [{ city: "" }, /name, address and city/],
    [{ email: "nope" }, /email/i],
    [{ phone: "123" }, /phone/i],
  ] as [Partial<CheckoutForm>, RegExp][])("rejects %j", (patch, message) => {
    expect(validateCheckout({ ...valid, ...patch })).toMatch(message);
  });

  it("accepts +234 phone numbers", () => {
    expect(validateCheckout({ ...valid, phone: "+2348012345678" })).toBeNull();
  });
});
