"use client";
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { CATEGORIES, PHONE_BRANDS, products } from "@/lib/products";
import type { Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [brand, setBrand] = useState<string>("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => products.filter((p) =>
    (cat === "all" || p.category === cat) &&
    (cat !== "phone" || brand === "all" || p.brand === brand) &&
    p.name.toLowerCase().includes(q.toLowerCase())
  ), [cat, brand, q]);

  const pill = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-semibold ${active ? "border-ink bg-ink text-white" : "border-ink/20 bg-white hover:border-ink"}`;

  return (
    <>
      <section className="mb-8 rounded-2xl bg-ink p-8 text-white">
        <h1 className="max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">Laptops, phones and accessories, delivered to your door.</h1>
        <p className="mt-3 max-w-lg text-white/70">Pick a gadget, enter your delivery address, pay securely.</p>
      </section>

      <div className="mb-6 flex flex-col gap-4">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-3.5 text-ink/50" />
          <input className="input pl-9" placeholder="Search gadgets" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={pill(cat === "all")} onClick={() => { setCat("all"); setBrand("all"); }}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} className={pill(cat === c.id)} onClick={() => { setCat(c.id); setBrand("all"); }}>{c.label}</button>
          ))}
        </div>
        {cat === "phone" && (
          <div className="flex flex-wrap gap-2">
            {["all", ...PHONE_BRANDS].map((b) => (
              <button key={b} className={pill(brand === b)} onClick={() => setBrand(b)}>{b === "all" ? "All brands" : b}</button>
            ))}
          </div>
        )}
      </div>

      {list.length === 0
        ? <p className="py-16 text-center text-ink/60">No gadgets match. Try another search or category.</p>
        : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
    </>
  );
}
