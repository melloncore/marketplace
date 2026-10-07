import { CATEGORIES, PHONE_BRANDS, SPEC_LABELS, cardSpecs, findProduct, getSpecRows, naira, products } from "@/lib/products";

describe("product catalogue", () => {
  it("has unique ids", () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has at least one product in every category", () => {
    CATEGORIES.forEach((c) => expect(products.some((p) => p.category === c.id)).toBe(true));
  });

  it("has phones for iPhone, Samsung, Google and Nokia", () => {
    const brands = products.filter((p) => p.category === "phone").map((p) => p.brand);
    PHONE_BRANDS.forEach((b) => expect(brands).toContain(b));
  });

  it("gives every product exactly the spec fields of its category", () => {
    products.forEach((p) => {
      const expected = Object.keys(SPEC_LABELS[p.category]).sort();
      expect(Object.keys(p.specs).sort()).toEqual(expected);
    });
  });

  it("uses different spec fields for laptops, phones and accessories", () => {
    const l = Object.keys(SPEC_LABELS.laptop);
    const ph = Object.keys(SPEC_LABELS.phone);
    const a = Object.keys(SPEC_LABELS.accessory);
    expect(l).toContain("processor"); expect(ph).not.toContain("processor");
    expect(ph).toContain("camera"); expect(l).not.toContain("camera");
    expect(a).toContain("compatibility"); expect(l).not.toContain("compatibility");
  });

  it("has positive prices and stock", () => {
    products.forEach((p) => { expect(p.price).toBeGreaterThan(0); expect(p.stock).toBeGreaterThan(0); });
  });
});

describe("helpers", () => {
  it("findProduct returns a product or undefined", () => {
    expect(findProduct(1)?.name).toBe("MacBook Air 13 M2");
    expect(findProduct(9999)).toBeUndefined();
  });

  it("naira formats currency without decimals", () => {
    expect(naira(1450000)).toMatch(/1,450,000/);
    expect(naira(1450000)).not.toMatch(/\.00/);
  });

  it("getSpecRows returns category-specific labels", () => {
    const laptopLabels = getSpecRows(findProduct(1)!).map((r) => r.label);
    const phoneLabels = getSpecRows(findProduct(4)!).map((r) => r.label);
    const accLabels = getSpecRows(findProduct(8)!).map((r) => r.label);
    expect(laptopLabels).toContain("Processor");
    expect(phoneLabels).toContain("Chipset");
    expect(phoneLabels).not.toContain("Processor");
    expect(accLabels).toEqual(["Type", "Works with", "Connectivity", "Material", "Warranty"]);
  });

  it("cardSpecs shows headline specs per category", () => {
    expect(cardSpecs(findProduct(1)!)).toEqual(["Apple M2 (8-core)", "16GB", "512GB SSD"]);
    expect(cardSpecs(findProduct(8)!)).toHaveLength(2);
  });
});
