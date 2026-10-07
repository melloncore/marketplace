"use client";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { MdDevices } from "react-icons/md";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white"><MdDevices /></span>
          GadgetHub
        </Link>
        <Link href="/cart" className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-paper" aria-label="Cart">
          <FiShoppingCart className="text-xl" /> Cart
          {count > 0 && <span data-testid="cart-count" className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-volt px-1 text-xs font-bold">{count}</span>}
        </Link>
      </div>
    </header>
  );
}
