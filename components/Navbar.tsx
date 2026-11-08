"use client";
import Link from "next/link";
import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-base font-extrabold tracking-tight sm:text-lg">
          <Image src="/melloncore-logo.png" alt="" width={36} height={36} className="shrink-0 object-contain" />
          <span className="truncate">Mellon Strata Core</span>
        </Link>
        <Link href="/cart" className="relative flex shrink-0 items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold hover:bg-paper sm:px-3" aria-label="Cart">
          <FiShoppingCart className="text-xl" /> <span>Cart</span>
          {count > 0 && <span data-testid="cart-count" className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-volt px-1 text-xs font-bold">{count}</span>}
        </Link>
      </div>
    </header>
  );
}
