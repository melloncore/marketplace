export interface PaymentResult { ok: boolean; reference: string }

/**
 * SIMULATED payment. Replace the body with Paystack / Flutterwave:
 * create the transaction on your server, open their popup, then verify on your server.
 */
export async function processPayment(amount: number): Promise<PaymentResult> {
  await new Promise((r) => setTimeout(r, 1500));
  return { ok: amount > 0, reference: "PAY-" + Date.now() };
}
