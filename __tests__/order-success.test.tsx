import { render, screen } from "@testing-library/react";
import Success from "@/app/order-success/page";
import type { Order } from "@/lib/types";

const order: Order = {
  id: "ORD-12345678", date: new Date().toISOString(), status: "Paid",
  items: [{ id: 8, name: "MX Master 3S Mouse", price: 95000, qty: 1 }],
  delivery: { name: "Ada Obi", email: "ada@example.com", phone: "08012345678", address: "12 Ring Road", city: "Ibadan", state: "Oyo", note: "" },
  subtotal: 95000, fee: 3000, total: 98000,
};

describe("Order success page", () => {
  it("shows the order and delivery details", () => {
    localStorage.setItem("lastOrder", JSON.stringify(order));
    render(<Success />);
    expect(screen.getByText(/ORD-12345678/)).toBeInTheDocument();
    expect(screen.getByText(/ada@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/12 Ring Road, Ibadan, Oyo/)).toBeInTheDocument();
    expect(screen.getByText(/98,000/)).toBeInTheDocument();
  });

  it("falls back to a shop link when there is no order", () => {
    render(<Success />);
    expect(screen.getByRole("link", { name: "Go to shop" })).toHaveAttribute("href", "/");
  });
});
