import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartPage from "@/app/cart/page";
import Navbar from "@/components/Navbar";
import { renderWithCart, seedCart } from "./test-utils";

jest.mock("react-toastify", () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));

describe("Cart page", () => {
  it("shows an empty state with a link to the shop", async () => {
    renderWithCart(<CartPage />);
    expect(await screen.findByText("Your cart is empty.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse gadgets" })).toHaveAttribute("href", "/");
  });

  it("shows items, line totals and subtotal", async () => {
    seedCart([8, 2], [9, 1]); // 95,000 x2 + 38,000
    renderWithCart(<CartPage />);
    expect(await screen.findByText("MX Master 3S Mouse")).toBeInTheDocument();
    expect(screen.getByText("Anker 65W GaN Charger")).toBeInTheDocument();
    expect(screen.getAllByText(/228,000/).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Checkout" })).toHaveAttribute("href", "/checkout");
  });

  it("removes an item", async () => {
    seedCart([8, 1], [9, 1]);
    renderWithCart(<CartPage />);
    await userEvent.click(await screen.findByLabelText("Remove MX Master 3S Mouse"));
    expect(screen.queryByText("MX Master 3S Mouse")).not.toBeInTheDocument();
    expect(screen.getByText("Anker 65W GaN Charger")).toBeInTheDocument();
  });

  it("navbar badge reflects total quantity", async () => {
    seedCart([8, 2], [9, 1]);
    renderWithCart(<Navbar />);
    expect(await screen.findByTestId("cart-count")).toHaveTextContent("3");
  });
});
