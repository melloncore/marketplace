import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import ProductPage from "@/app/product/[id]/page";
import { renderWithCart } from "./test-utils";

jest.mock("next/navigation", () => ({ useParams: jest.fn(), useRouter: jest.fn() }));
jest.mock("react-toastify", () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));

const open = (id: string) => { (useParams as jest.Mock).mockReturnValue({ id }); return renderWithCart(<ProductPage />); };

describe("Product page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows laptop specs", () => {
    open("1");
    expect(screen.getByText("Processor")).toBeInTheDocument();
    expect(screen.getByText("Graphics")).toBeInTheDocument();
    expect(screen.queryByText("Chipset")).not.toBeInTheDocument();
    expect(screen.queryByText("Works with")).not.toBeInTheDocument();
  });

  it("shows phone specs", () => {
    open("4");
    expect(screen.getByText("Chipset")).toBeInTheDocument();
    expect(screen.getByText("Main camera")).toBeInTheDocument();
    expect(screen.getByText("SIM")).toBeInTheDocument();
    expect(screen.queryByText("Processor")).not.toBeInTheDocument();
  });

  it("shows accessory specs", () => {
    open("9");
    expect(screen.getByText("Works with")).toBeInTheDocument();
    expect(screen.getByText("Connectivity")).toBeInTheDocument();
    expect(screen.queryByText("Processor")).not.toBeInTheDocument();
    expect(screen.queryByText("Main camera")).not.toBeInTheDocument();
  });

  it("handles an unknown product", () => {
    open("999");
    expect(screen.getByText(/Product not found/)).toBeInTheDocument();
  });

  it("adds the chosen quantity to the cart", async () => {
    open("8");
    await userEvent.click(screen.getByLabelText("Increase quantity"));
    await userEvent.click(screen.getByLabelText("Increase quantity"));
    expect(screen.getByTestId("qty")).toHaveTextContent("3");
    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(toast.success).toHaveBeenCalledWith("MX Master 3S Mouse added to cart");
  });

  it("does not let quantity go below 1 or above stock", async () => {
    open("3"); // stock 3
    await userEvent.click(screen.getByLabelText("Decrease quantity"));
    expect(screen.getByTestId("qty")).toHaveTextContent("1");
    for (let i = 0; i < 6; i++) await userEvent.click(screen.getByLabelText("Increase quantity"));
    expect(screen.getByTestId("qty")).toHaveTextContent("3");
  });
});
