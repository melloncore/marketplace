import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import Checkout from "@/app/checkout/page";
import { processPayment, redirectToPaystack } from "@/lib/payment";
import { renderWithCart, seedCart } from "./test-utils";

jest.mock("react-toastify", () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));
jest.mock("@/lib/payment", () => ({ processPayment: jest.fn(), redirectToPaystack: jest.fn() }));

const pay = processPayment as jest.Mock;

async function fillForm(user: ReturnType<typeof userEvent.setup>, overrides: Record<string, string> = {}) {
  const values = {
    name: "Ada Obi",
    email: "ada@example.com",
    phone: "08012345678",
    city: "Ibadan",
    address: "12 Ring Road",
    ...overrides,
  };
  await user.type(screen.getByPlaceholderText("Full name"), values.name);
  if (values.email) await user.type(screen.getByPlaceholderText("Email"), values.email);
  await user.type(screen.getByPlaceholderText(/Phone/), values.phone);
  await user.type(screen.getByPlaceholderText("City / Town"), values.city);
  await user.type(screen.getByPlaceholderText("Street address"), values.address);
}

describe("Checkout page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pay.mockResolvedValue({ authorizationUrl: "https://checkout.paystack.com/test", reference: "MSC-1" });
  });

  it("tells the user when the cart is empty", async () => {
    renderWithCart(<Checkout />);
    expect(await screen.findByText("Your cart is empty.")).toBeInTheDocument();
  });

  it("calculates delivery by state and updates the total", async () => {
    seedCart([8, 1]);
    const user = userEvent.setup();
    renderWithCart(<Checkout />);
    expect(await screen.findByText(/Delivery \(Lagos\)/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue to Paystack .*98,000/ })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("State"), "Kano");
    expect(screen.getByText(/Delivery \(Kano\)/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue to Paystack .*101,000/ })).toBeInTheDocument();
  });

  it("never collects card details in the marketplace checkout", async () => {
    seedCart([8, 1]);
    renderWithCart(<Checkout />);
    await screen.findByText("Secure payment with Paystack");
    expect(screen.queryByPlaceholderText("Card number")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("CVV")).not.toBeInTheDocument();
  });

  it("does not initialize payment when the delivery form is invalid", async () => {
    seedCart([8, 1]);
    const user = userEvent.setup();
    renderWithCart(<Checkout />);
    await user.click(await screen.findByRole("button", { name: /Continue to Paystack/ }));
    expect(toast.error).toHaveBeenCalledWith("Fill in your name, address and city.");
    expect(pay).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    seedCart([8, 1]);
    const user = userEvent.setup();
    renderWithCart(<Checkout />);
    await screen.findByPlaceholderText("Full name");
    await fillForm(user, { email: "bad-email" });
    await user.click(screen.getByRole("button", { name: /Continue to Paystack/ }));
    expect(toast.error).toHaveBeenCalledWith("Enter a valid email address.");
    expect(pay).not.toHaveBeenCalled();
  });

  it("initializes the order through the API and redirects to Paystack", async () => {
    seedCart([8, 1], [9, 2]);
    const user = userEvent.setup();
    renderWithCart(<Checkout />);
    await screen.findByPlaceholderText("Full name");
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /Continue to Paystack/ }));

    await waitFor(() => expect(redirectToPaystack).toHaveBeenCalledWith("https://checkout.paystack.com/test"));
    expect(pay.mock.calls[0][0]).toEqual({
      items: [{ productId: 8, quantity: 1 }, { productId: 9, quantity: 2 }],
      delivery: expect.objectContaining({ name: "Ada Obi", city: "Ibadan", state: "Lagos" }),
    });
    expect(localStorage.getItem("pendingOrderReference")).toBe("MSC-1");
    expect(JSON.parse(localStorage.getItem("cart")!)).toHaveLength(2);
  });

  it("keeps the cart and shows an error when order initialization fails", async () => {
    pay.mockRejectedValue(new Error("Online payments are not configured yet"));
    seedCart([8, 1]);
    const user = userEvent.setup();
    renderWithCart(<Checkout />);
    await screen.findByPlaceholderText("Full name");
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /Continue to Paystack/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Online payments are not configured yet");
    expect(JSON.parse(localStorage.getItem("cart")!)).toHaveLength(1);
  });
});
