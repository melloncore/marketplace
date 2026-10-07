"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";
import { naira } from "@/lib/products";
import type { Order } from "@/lib/types";

export default function Success() {
  const [o, setO] = useState<Order | null>(null);
  useEffect(() => {
    try { setO(JSON.parse(localStorage.getItem("lastOrder") || "null")); } catch { /* ignore */ }
  }, []);
  if (!o) return <div className="py-20 text-center"><Link href="/" className="btn">Go to shop</Link></div>;

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-ink/10 bg-white p-8">
      <FiCheckCircle className="text-5xl text-green-600" />
      <h1 className="mt-3 text-2xl font-extrabold">Order placed</h1>
      <p className="text-sm text-ink/60">Order {o.id}. A confirmation will be sent to {o.delivery.email}.</p>
      <div className="mt-5 space-y-1 text-sm">
        {o.items.map((i) => <div key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{naira(i.price * i.qty)}</span></div>)}
        <div className="flex justify-between pt-2"><span>Delivery</span><span>{naira(o.fee)}</span></div>
        <div className="flex justify-between font-extrabold"><span>Total paid</span><span>{naira(o.total)}</span></div>
      </div>
      <h2 className="mb-1 mt-6 font-bold">Delivering to</h2>
      <p className="text-sm text-ink/70">{o.delivery.name}, {o.delivery.phone}<br />{o.delivery.address}, {o.delivery.city}, {o.delivery.state}</p>
      <Link href="/" className="btn mt-6">Continue shopping</Link>
    </div>
  );
}
