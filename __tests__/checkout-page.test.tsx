import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Checkout from "@/app/checkout/page";
import { processPayment } from "@/lib/payment";
import type { Order } from "@/lib/types";
import { renderWithCart, seedCart } from "./test-utils";

jest.mock("next/navigation", () => ({ useRouter: jest.fn(), useParams: jest.fn() }));
jest.mock("react-toastify", () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));
jest.mock("@/lib/payment", () => ({ processPayment: jest.fn() }));

const push = jest.fn();
const pay = processPayment as jest.Mock;

async function fillForm(user: ReturnType<typeof userEvent.setup>, overrides: Record<string, string> = {}) {
  const v = { name: "Ada Obi", email: "ada@example.com", phone: "08012345678", city: "Ibadan", address: "12 Ring Road",
    card: "4242424242424242", expiry: "12/29", cvv: "123", ...overrides };
  await user.type(screen.getByPlaceholderText("Full name"), v.name);
  if (v.email) await user.type(screen.getByPlaceholderText("Email"), v.email);
  await user.type(screen.getByPlaceholderText(/Phone/), v.phone);
  await user.type(screen.getByPlaceholderText("City / Town"), v.city);
  await user.type(screen.getByPlaceholderText("Street address"), v.address);
  await user.type(screen.getByPlaceholderText("Card number"), v.card);
  await user.type(screen.getByPlaceholderText("MM/YY"), v.expiry);
  await user.type(screen.getByPlaceholderText("CVV"), v.cvv);
}

describe("Checkout page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
    pay.mockResolvedValue({ ok: true, reference: "PAY-1" });
  });

  it("tells the user when the cart is empty", async () => {
    renderWithCart(<Checkout />);
    expect(await screen.findByText("Your cart is empty.")).toBeInTheDocument();
  });

  it("calculates delivery by state and updates the total", async () => {
    seedCart([8, 1]); // 95,000
    const user = userEvent.setup();
    renderWithCart(<Checkout />);
    expect(await screen.findByText(/Delivery \(Lagos\)/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Pay .*98,000/ })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("State"), "Kano");
    expect(screen.getByText(/Delivery \(Kano\)/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Pay .*101,000/ })).toBeInTheDocument();
  });

  it("formats the card number as the user types", async () => {
    seedCart([8, 1]);
    const user = userEvent.setup();
    renderWithCart(<Checkout />);
    const card = await screen.findByPlaceholderText("Card number");
    await user.type(card, "4242424242424242");
    expect(card).toHaveValue("4242 4242 4242 4242");
  });

  it("shows a toast and does not charge when the form is invalid", async () => {
    seedCart([8, 1]);
    const user = userEvent.setup();
    renderWithCart(<Checkout />);
    await user.click(await screen.findByRole("button", { name: /Pay/ }));
    expect(toast.error).toHaveBeenCalledWith("Fill in your name, address and city.");
    expect(pay).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    seedCart([8, 1]);
    const user = userEvent.setup();
    renderWithCart(<Checkout />);
    await screen.findByPlaceholderText("Full name");
    await fillForm(user, { email: "bad-email" });
    await user.click(screen.getByRole("button", { name: /Pay/ }));
    expect(toast.error).toHaveBeenCalledWith("Enter a valid email address.");
    expect(pay).not.toHaveBeenCalled();
  });

  it("pays, saves the order, clears the cart and redirects", async () => {
    seedCart([8, 1], [9, 2]); // 95,000 + 76,000 = 171,000 (+3,000 Lagos)
    const user = userEvent.setup();
    renderWithCart(<Checkout />);
    await screen.findByPlaceholderText("Full name");
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /Pay/ }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/order-success"));
    expect(pay).toHaveBeenCalledWith(174000);
    expect(toast.success).toHaveBeenCalledWith("Payment successful");

    const order: Order = JSON.parse(localStorage.getItem("lastOrder")!);
    expect(order.status).toBe("Paid");
    expect(order.total).toBe(174000);
    expect(order.fee).toBe(3000);
    expect(order.items).toHaveLength(2);
    expect(order.delivery).toMatchObject({ name: "Ada Obi", city: "Ibadan", state: "Lagos" });
    expect(JSON.parse(localStorage.getItem("orders")!)).toHaveLength(1);
    await waitFor(() => expect(JSON.parse(localStorage.getItem("cart")!)).toEqual([]));
  });

  it("keeps the cart and shows an error when payment is declined", async () => {
    pay.mockResolvedValue({ ok: false, reference: "" });
    seedCart([8, 1]);
    const user = userEvent.setup();
    renderWithCart(<Checkout />);
    await screen.findByPlaceholderText("Full name");
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /Pay/ }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Payment failed. Try again."));
    expect(push).not.toHaveBeenCalled();
    expect(localStorage.getItem("lastOrder")).toBeNull();
    expect(JSON.parse(localStorage.getItem("cart")!)).toHaveLength(1);
  });

  it("handles a payment error without losing the cart", async () => {
    pay.mockRejectedValue(new Error("network"));
    seedCart([8, 1]);
    const user = userEvent.setup();
    renderWithCart(<Checkout />);
    await screen.findByPlaceholderText("Full name");
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /Pay/ }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/not charged/)));
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /Pay/ })).toBeEnabled();
  });
});
