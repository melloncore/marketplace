import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { toast } from "react-toastify";
import { CartProvider, useCart } from "@/context/CartContext";
import { getProduct } from "./test-utils";

jest.mock("react-toastify", () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;
const setup = async () => {
  const hook = renderHook(() => useCart(), { wrapper });
  await waitFor(() => expect(hook.result.current.ready).toBe(true));
  return hook;
};

describe("CartContext", () => {
  beforeEach(() => jest.clearAllMocks());

  it("starts empty", async () => {
    const { result } = await setup();
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("adds a product and shows a toast", async () => {
    const { result } = await setup();
    act(() => result.current.add(getProduct(4)));
    expect(result.current.count).toBe(1);
    expect(result.current.subtotal).toBe(getProduct(4).price);
    expect(toast.success).toHaveBeenCalledWith("iPhone 15 Pro added to cart");
  });

  it("merges the same product into one line", async () => {
    const { result } = await setup();
    act(() => { result.current.add(getProduct(8)); result.current.add(getProduct(8), 2); });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].qty).toBe(3);
  });

  it("never exceeds stock (new and existing lines)", async () => {
    const dell = getProduct(3); // stock 3
    const { result } = await setup();
    act(() => result.current.add(dell, 10));
    expect(result.current.items[0].qty).toBe(3);
    act(() => result.current.add(dell, 1));
    expect(result.current.items[0].qty).toBe(3);
  });

  it("setQty clamps between 1 and stock", async () => {
    const { result } = await setup();
    act(() => result.current.add(getProduct(3)));
    act(() => result.current.setQty(3, 99));
    expect(result.current.items[0].qty).toBe(3);
    act(() => result.current.setQty(3, 0));
    expect(result.current.items[0].qty).toBe(1);
  });

  it("removes items and clears the cart", async () => {
    const { result } = await setup();
    act(() => { result.current.add(getProduct(8)); result.current.add(getProduct(9)); });
    act(() => result.current.remove(8));
    expect(result.current.items.map((i) => i.product.id)).toEqual([9]);
    expect(toast.info).toHaveBeenCalledWith("Item removed");
    act(() => result.current.clear());
    expect(result.current.items).toEqual([]);
  });

  it("persists to localStorage and restores on mount", async () => {
    const first = await setup();
    act(() => first.result.current.add(getProduct(5)));
    await waitFor(() => expect(JSON.parse(localStorage.getItem("cart")!)).toHaveLength(1));
    first.unmount();

    const second = await setup();
    expect(second.result.current.items[0].product.name).toBe("Galaxy S24 Ultra");
  });

  it("ignores corrupted localStorage", async () => {
    localStorage.setItem("cart", "{not json");
    const { result } = await setup();
    expect(result.current.items).toEqual([]);
  });

  it("throws when used outside the provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useCart())).toThrow(/CartProvider/);
    spy.mockRestore();
  });
});
