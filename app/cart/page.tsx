"use client";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { naira } from "@/lib/products";

export default function CartPage() {
  const { items, setQty, remove, subtotal, ready } = useCart();
  if (!ready) return null;
  if (items.length === 0)
    return <div className="py-20 text-center"><p className="mb-4 text-ink/60">Your cart is empty.</p><Link href="/" className="btn">Browse gadgets</Link></div>;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <h1 className="text-2xl font-extrabold">Your cart</h1>
        {items.map(({ product: p, qty }) => (
          <div key={p.id} className="flex items-center justify-between gap-4 rounded-xl border border-ink/10 bg-white p-4">
            <div>
              <Link href={`/product/${p.id}`} className="font-bold hover:underline">{p.name}</Link>
              <p className="text-sm text-ink/60">{naira(p.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              <input type="number" min={1} max={p.stock} value={qty} aria-label={`Quantity for ${p.name}`}
                onChange={(e) => setQty(p.id, Number(e.target.value))} className="input w-16 text-center" />
              <span className="w-28 text-right font-bold">{naira(p.price * qty)}</span>
              <button onClick={() => remove(p.id)} className="text-red-600" aria-label={`Remove ${p.name}`}><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
      <aside className="h-fit rounded-xl border border-ink/10 bg-white p-5">
        <h2 className="font-bold">Order summary</h2>
        <div className="mt-3 flex justify-between text-sm"><span>Subtotal</span><span className="font-bold">{naira(subtotal)}</span></div>
        <p className="mt-1 text-xs text-ink/60">Delivery fee is calculated at checkout.</p>
        <Link href="/checkout" className="btn mt-4 w-full">Checkout</Link>
      </aside>
    </div>
  );
}
