"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiExternalLink } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { naira } from "@/lib/products";
import { STATES, deliveryFee, validateCheckout } from "@/lib/checkout";
import { processPayment, redirectToPaystack } from "@/lib/payment";
import type { CheckoutForm } from "@/lib/types";

type FieldEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

export default function Checkout() {
  const { items, subtotal, ready } = useCart();
  const [f, setF] = useState<CheckoutForm>({ name: "", email: "", phone: "", address: "", city: "", state: "Lagos", note: "" });
  const paymentMutation = useMutation({
    mutationFn: processPayment,
    onSuccess: ({ authorizationUrl, reference }) => {
      localStorage.setItem("pendingOrderReference", reference);
      redirectToPaystack(authorizationUrl);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not start payment. Please try again.");
    },
  });
  const set = (k: keyof CheckoutForm) => (e: FieldEvent) =>
    setF((current) => ({ ...current, [k]: e.target.value }));

  if (!ready) return null;
  if (items.length === 0) return <p className="py-20 text-center text-ink/60">Your cart is empty.</p>;

  const fee = deliveryFee(f.state);
  const total = subtotal + fee;

  const pay = async (e: FormEvent) => {
    e.preventDefault();
    const err = validateCheckout(f);
    if (err) return toast.error(err);

    paymentMutation.mutate({
      items: items.map(({ product, qty }) => ({ productId: product.id, quantity: qty })),
      delivery: f,
    });
  };

  return (
    <form onSubmit={pay} noValidate className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <section>
          <h2 className="mb-3 text-xl font-extrabold">Delivery details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input" placeholder="Full name" value={f.name} onChange={set("name")} />
            <input className="input" placeholder="Email" type="email" value={f.email} onChange={set("email")} />
            <input className="input" placeholder="Phone (e.g. 08012345678)" value={f.phone} onChange={set("phone")} />
            <select className="input" aria-label="State" value={f.state} onChange={set("state")}>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
            <input className="input" placeholder="City / Town" value={f.city} onChange={set("city")} />
            <input className="input sm:col-span-2" placeholder="Street address" value={f.address} onChange={set("address")} />
            <textarea className="input sm:col-span-2" rows={2} placeholder="Delivery note (optional)" value={f.note} onChange={set("note")} />
          </div>
        </section>
        <section className="rounded-xl border border-ink/10 bg-white p-5">
          <h2 className="font-extrabold">Secure payment with Paystack</h2>
          <p className="mt-2 text-sm text-ink/60">You will be redirected to Paystack to enter your payment details. Card data is never collected or stored on this site.</p>
        </section>
      </div>

      <aside className="h-fit rounded-xl border border-ink/10 bg-white p-5 text-sm">
        <h2 className="mb-3 font-bold">Order summary</h2>
        {items.map(({ product: p, qty }) => (
          <div key={p.id} className="flex justify-between py-1"><span>{p.name} × {qty}</span><span>{naira(p.price * qty)}</span></div>
        ))}
        <hr className="my-3 border-ink/10" />
        <div className="flex justify-between"><span>Subtotal</span><span>{naira(subtotal)}</span></div>
        <div className="flex justify-between"><span>Delivery ({f.state})</span><span>{naira(fee)}</span></div>
        <div className="mt-2 flex justify-between text-base font-extrabold"><span>Total</span><span>{naira(total)}</span></div>
        {paymentMutation.isError && <p role="alert" className="mt-3 text-sm text-red-700">{paymentMutation.error.message}</p>}
        <button className="btn mt-4 w-full" disabled={paymentMutation.isPending}>
          <FiExternalLink /> {paymentMutation.isPending ? "Redirecting to Paystack…" : `Continue to Paystack · ${naira(total)}`}
        </button>
      </aside>
    </form>
  );
}
