"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiLock } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { naira } from "@/lib/products";
import { STATES, deliveryFee, formatCard, validateCheckout } from "@/lib/checkout";
import { processPayment } from "@/lib/payment";
import type { CheckoutForm, Order } from "@/lib/types";

type FieldEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

export default function Checkout() {
  const { items, subtotal, clear, ready } = useCart();
  const router = useRouter();
  const [f, setF] = useState<CheckoutForm>({ name: "", email: "", phone: "", address: "", city: "", state: "Lagos", note: "", card: "", expiry: "", cvv: "" });
  const [paying, setPaying] = useState(false);
  const set = (k: keyof CheckoutForm) => (e: FieldEvent) => setF({ ...f, [k]: e.target.value });

  if (!ready) return null;
  if (items.length === 0) return <p className="py-20 text-center text-ink/60">Your cart is empty.</p>;

  const fee = deliveryFee(f.state);
  const total = subtotal + fee;

  const pay = async (e: FormEvent) => {
    e.preventDefault();
    const err = validateCheckout(f);
    if (err) return toast.error(err);

    setPaying(true);
    try {
      const result = await processPayment(total);
      if (!result.ok) { toast.error("Payment failed. Try again."); return; }

      const order: Order = {
        id: "ORD-" + Date.now().toString().slice(-8),
        date: new Date().toISOString(),
        items: items.map(({ product, qty }) => ({ id: product.id, name: product.name, price: product.price, qty })),
        delivery: { name: f.name, email: f.email, phone: f.phone, address: f.address, city: f.city, state: f.state, note: f.note },
        subtotal, fee, total, status: "Paid",
      };
      localStorage.setItem("lastOrder", JSON.stringify(order));
      const all: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem("orders", JSON.stringify([order, ...all]));
      clear();
      toast.success("Payment successful");
      router.push("/order-success");
    } catch {
      toast.error("Something went wrong while paying. You were not charged.");
    } finally {
      setPaying(false);
    }
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
        <section>
          <h2 className="mb-3 text-xl font-extrabold">Payment</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input sm:col-span-2" inputMode="numeric" placeholder="Card number" maxLength={19} value={f.card}
              onChange={(e) => setF({ ...f, card: formatCard(e.target.value) })} />
            <input className="input" placeholder="MM/YY" maxLength={5} value={f.expiry}
              onChange={(e) => setF({ ...f, expiry: e.target.value.replace(/[^\d/]/g, "") })} />
            <input className="input" placeholder="CVV" maxLength={4} inputMode="numeric" value={f.cvv}
              onChange={(e) => setF({ ...f, cvv: e.target.value.replace(/\D/g, "") })} />
          </div>
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
        <button className="btn mt-4 w-full" disabled={paying}><FiLock /> {paying ? "Processing…" : `Pay ${naira(total)}`}</button>
      </aside>
    </form>
  );
}
