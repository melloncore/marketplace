import { processPayment } from "@/lib/payment";

describe("processPayment (simulated)", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("succeeds for a positive amount and returns a reference", async () => {
    const p = processPayment(5000);
    jest.advanceTimersByTime(2000);
    const r = await p;
    expect(r.ok).toBe(true);
    expect(r.reference).toMatch(/^PAY-/);
  });

  it("fails for a zero amount", async () => {
    const p = processPayment(0);
    jest.advanceTimersByTime(2000);
    expect((await p).ok).toBe(false);
  });
});
