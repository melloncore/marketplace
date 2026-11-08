import { initializeOrder } from "@/lib/api/marketplace";
import { processPayment } from "@/lib/payment";

jest.mock("@/lib/api/marketplace", () => ({ initializeOrder: jest.fn() }));

describe("processPayment", () => {
  it("delegates order initialization to the backend Paystack API", async () => {
    const input = {
      items: [{ productId: 8, quantity: 2 }],
      delivery: {
        name: "Ada Obi",
        email: "ada@example.com",
        phone: "08012345678",
        address: "12 Ring Road",
        city: "Ibadan",
        state: "Oyo",
      },
    };
    const payment = {
      authorizationUrl: "https://checkout.paystack.com/test",
      reference: "MSC-reference",
    };
    (initializeOrder as jest.Mock).mockResolvedValue(payment);

    await expect(processPayment(input)).resolves.toEqual(payment);
    expect(initializeOrder).toHaveBeenCalledWith(input);
  });
});
