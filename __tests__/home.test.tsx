import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import { renderWithCart } from "./test-utils";

jest.mock("react-toastify", () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));

describe("Home page", () => {
  it("lists every product by default", () => {
    renderWithCart(<Home />);
    expect(screen.getByText("MacBook Air 13 M2")).toBeInTheDocument();
    expect(screen.getByText("iPhone 15 Pro")).toBeInTheDocument();
    expect(screen.getByText("MX Master 3S Mouse")).toBeInTheDocument();
  });

  it("filters by category", async () => {
    renderWithCart(<Home />);
    await userEvent.click(screen.getByRole("button", { name: "Laptops" }));
    expect(screen.getByText("MacBook Air 13 M2")).toBeInTheDocument();
    expect(screen.queryByText("iPhone 15 Pro")).not.toBeInTheDocument();
    expect(screen.queryByText("MX Master 3S Mouse")).not.toBeInTheDocument();
  });

  it("shows brand filters only for phones and filters by brand", async () => {
    renderWithCart(<Home />);
    expect(screen.queryByRole("button", { name: "Nokia" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Phones" }));
    for (const b of ["iPhone", "Samsung", "Google", "Nokia"]) {
      expect(screen.getByRole("button", { name: b })).toBeInTheDocument();
    }
    await userEvent.click(screen.getByRole("button", { name: "Nokia" }));
    expect(screen.getByText("Nokia G42 5G")).toBeInTheDocument();
    expect(screen.queryByText("Pixel 8 Pro")).not.toBeInTheDocument();
  });

  it("searches by name (case-insensitive)", async () => {
    renderWithCart(<Home />);
    await userEvent.type(screen.getByPlaceholderText("Search gadgets"), "pixel");
    expect(screen.getByText("Pixel 8 Pro")).toBeInTheDocument();
    expect(screen.queryByText("MacBook Air 13 M2")).not.toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", async () => {
    renderWithCart(<Home />);
    await userEvent.type(screen.getByPlaceholderText("Search gadgets"), "zzzzz");
    expect(screen.getByText(/No gadgets match/)).toBeInTheDocument();
  });
});
