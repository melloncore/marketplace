import { screen } from "@testing-library/react";
import Success from "@/app/order-success/page";
import { verifyOrderPayment } from "@/lib/api/marketplace";
import type { Order } from "@/lib/types";
import { renderWithCart } from "./test-utils";

jest.mock("@/lib/api/marketplace", () => ({ verifyOrderPayment: jest.fn() }));

const order: Order = {
  id: "MSC-reference123",
  date: new Date().toISOString(),
  status: "PAID",
  items: [{ id: 8, name: "MX Master 3S Mouse", price: 95000, qty: 1 }],
  delivery: { name: "Ada Obi", email: "ada@example.com", phone: "08012345678", address: "12 Ring Road", city: "Ibadan", state: "Oyo", note: "" },
  subtotal: 95000,
  fee: 3000,
  total: 98000,
};

describe("Order success page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, "", "/order-success?reference=MSC-reference123");
    (verifyOrderPayment as jest.Mock).mockResolvedValue({ paid: true, order });
  });

  it("verifies the Paystack reference with the backend and shows delivery details", async () => {
    renderWithCart(<Success />);
    expect(await screen.findByText(/MSC-reference123/)).toBeInTheDocument();
    expect(await screen.findByText(/ada@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/12 Ring Road, Ibadan, Oyo/)).toBeInTheDocument();
    expect(screen.getByText(/98,000/)).toBeInTheDocument();
    expect((verifyOrderPayment as jest.Mock).mock.calls[0][0]).toBe("MSC-reference123");
  });

  it("asks the user to return to the shop when there is no payment reference", async () => {
    window.history.replaceState({}, "", "/order-success");
    renderWithCart(<Success />);
    expect(await screen.findByRole("link", { name: "Return to shop" })).toHaveAttribute("href", "/");
    expect(verifyOrderPayment).not.toHaveBeenCalled();
  });
});
