"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { CATEGORIES, getSpecRows, naira } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { listProducts } from "@/lib/api";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["marketplace", "products"],
    queryFn: listProducts,
  });
  const p = products.find((product) => product.id === Number(id));

  if (isLoading) return <p role="status" className="py-16 text-center">Loading product…</p>;
  if (error) return <p role="alert" className="py-16 text-center text-red-700">Product details could not be loaded.</p>;
  if (!p) return <p>Product not found. <Link href="/" className="text-brand underline">Back to shop</Link></p>;

  return (
    <div>
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand"><FiArrowLeft /> Back to shop</Link>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="grid h-72 place-items-center rounded-2xl bg-white text-7xl font-extrabold text-ink/15">{p.brand}</div>
        <div>
          <p className="text-sm font-semibold text-brand">{CATEGORIES.find((c) => c.id === p.category)?.label} · {p.brand}</p>
          <h1 className="mt-1 break-words text-2xl font-extrabold sm:text-3xl">{p.name}</h1>
          <p className="mt-3 text-2xl font-extrabold">{naira(p.price)}</p>
          <p className="mt-1 text-sm text-ink/60">{p.stock} in stock</p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-ink/20 bg-white">
              <button className="px-3 py-2" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span data-testid="qty" className="w-8 text-center font-semibold">{qty}</span>
              <button className="px-3 py-2" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(p.stock, q + 1))}>+</button>
            </div>
            <button className="btn" onClick={() => add(p, qty)}><FiShoppingCart /> Add to cart</button>
          </div>

          <h2 className="mb-2 mt-8 font-bold">Specifications</h2>
          <dl className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white text-sm">
            {getSpecRows(p).map(({ key, label, value }) => (
              <div key={key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-2 px-4 py-2.5">
                <dt className="break-words text-ink/60">{label}</dt>
                <dd className="min-w-0 break-words font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
