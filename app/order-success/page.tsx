"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { FiCheckCircle } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { naira } from "@/lib/products";
import { verifyOrderPayment } from "@/lib/api";
import type { Order } from "@/lib/types";

export default function Success() {
  const [order, setOrder] = useState<Order | null>(null);
  const [started, setStarted] = useState(false);
  const { clear } = useCart();
  const verification = useMutation({
    mutationFn: verifyOrderPayment,
    onSuccess: ({ paid, order: confirmed }) => {
      if (!paid || confirmed.status !== "PAID") return;
      setOrder(confirmed);
      localStorage.setItem("lastOrder", JSON.stringify(confirmed));
      localStorage.removeItem("pendingOrderReference");
      clear();
    },
  });

  useEffect(() => {
    if (started) return;
    setStarted(true);
    const query = new URLSearchParams(window.location.search);
    const reference = query.get("reference")
      || query.get("trxref")
      || localStorage.getItem("pendingOrderReference");
    if (reference) verification.mutate(reference);
  }, [started, verification.mutate]);

  if (verification.isPending || (!started && !verification.isError)) {
    return <p role="status" className="py-20 text-center">Confirming your payment with Paystack…</p>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <p role="alert" className="mb-4 text-red-700">
          {verification.error instanceof Error
            ? verification.error.message
            : "We could not confirm payment. If your account was charged, please contact support with your Paystack reference."}
        </p>
        <Link href="/" className="btn">Return to shop</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-ink/10 bg-white p-8">
      <FiCheckCircle className="text-5xl text-green-600" />
      <h1 className="mt-3 text-2xl font-extrabold">Order placed</h1>
      <p className="text-sm text-ink/60">Order {order.id}. A confirmation will be sent to {order.delivery.email}.</p>
      <div className="mt-5 space-y-1 text-sm">
        {order.items.map((item) => <div key={item.id} className="flex justify-between"><span>{item.name} × {item.qty}</span><span>{naira(item.price * item.qty)}</span></div>)}
        <div className="flex justify-between pt-2"><span>Delivery</span><span>{naira(order.fee)}</span></div>
        <div className="flex justify-between font-extrabold"><span>Total paid</span><span>{naira(order.total)}</span></div>
      </div>
      <h2 className="mb-1 mt-6 font-bold">Delivering to</h2>
      <p className="text-sm text-ink/70">{order.delivery.name}, {order.delivery.phone}<br />{order.delivery.address}, {order.delivery.city}, {order.delivery.state}</p>
      <Link href="/" className="btn mt-6">Continue shopping</Link>
    </div>
  );
}
