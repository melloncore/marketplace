"use client";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FiShoppingCart } from "react-icons/fi";
import { FaLaptop, FaMobileAlt, FaHeadphonesAlt } from "react-icons/fa";
import { cardSpecs, naira } from "@/lib/products";
import type { Category, Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

const ICONS: Record<Category, IconType> = { laptop: FaLaptop, phone: FaMobileAlt, accessory: FaHeadphonesAlt };

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const Icon = ICONS[p.category];
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white">
      <Link href={`/product/${p.id}`} className="grid h-40 place-items-center bg-ink/5 text-5xl text-ink/40"><Icon /></Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-semibold text-brand">{p.brand}</p>
        <Link href={`/product/${p.id}`} className="font-bold leading-snug hover:underline">{p.name}</Link>
        <p className="text-xs text-ink/60">{cardSpecs(p).join(" · ")}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-extrabold">{naira(p.price)}</span>
          <button onClick={() => add(p)} className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-white hover:bg-brand" aria-label={`Add ${p.name} to cart`}>
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}
