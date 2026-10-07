import type { AccessorySpecs, Category, LaptopSpecs, PhoneBrand, PhoneSpecs, Product } from "./types";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "laptop", label: "Laptops" },
  { id: "phone", label: "Phones" },
  { id: "accessory", label: "Accessories" },
];

export const PHONE_BRANDS: PhoneBrand[] = ["iPhone", "Samsung", "Google", "Nokia"];

/** Each category has its OWN spec fields and labels. */
export const SPEC_LABELS: {
  laptop: Record<keyof LaptopSpecs, string>;
  phone: Record<keyof PhoneSpecs, string>;
  accessory: Record<keyof AccessorySpecs, string>;
} = {
  laptop: {
    processor: "Processor", ram: "RAM", storage: "Storage", display: "Display",
    gpu: "Graphics", battery: "Battery life", os: "Operating system", weight: "Weight",
  },
  phone: {
    display: "Display", chipset: "Chipset", ram: "RAM", storage: "Storage",
    camera: "Main camera", battery: "Battery", os: "Operating system", sim: "SIM",
  },
  accessory: {
    type: "Type", compatibility: "Works with", connectivity: "Connectivity",
    material: "Material", warranty: "Warranty",
  },
};

export const products: Product[] = [
  { id: 1, category: "laptop", brand: "Apple", name: "MacBook Air 13 M2", price: 1450000, stock: 6,
    specs: { processor: "Apple M2 (8-core)", ram: "16GB", storage: "512GB SSD", display: "13.6\" Liquid Retina", gpu: "10-core GPU", battery: "Up to 18 hrs", os: "macOS", weight: "1.24 kg" } },
  { id: 2, category: "laptop", brand: "HP", name: "HP EliteBook 840 G8", price: 890000, stock: 10,
    specs: { processor: "Intel Core i7-1165G7", ram: "16GB", storage: "512GB SSD", display: "14\" FHD IPS", gpu: "Intel Iris Xe", battery: "Up to 12 hrs", os: "Windows 11 Pro", weight: "1.36 kg" } },
  { id: 3, category: "laptop", brand: "Dell", name: "Dell XPS 15 9520", price: 2100000, stock: 3,
    specs: { processor: "Intel Core i7-12700H", ram: "32GB", storage: "1TB SSD", display: "15.6\" OLED 3.5K", gpu: "NVIDIA RTX 3050 Ti", battery: "Up to 10 hrs", os: "Windows 11 Home", weight: "1.86 kg" } },
  { id: 4, category: "phone", brand: "iPhone", name: "iPhone 15 Pro", price: 1650000, stock: 8,
    specs: { display: "6.1\" Super Retina XDR", chipset: "A17 Pro", ram: "8GB", storage: "256GB", camera: "48MP + 12MP + 12MP", battery: "3274 mAh", os: "iOS 17", sim: "Nano-SIM + eSIM" } },
  { id: 5, category: "phone", brand: "Samsung", name: "Galaxy S24 Ultra", price: 1550000, stock: 5,
    specs: { display: "6.8\" Dynamic AMOLED 2X", chipset: "Snapdragon 8 Gen 3", ram: "12GB", storage: "512GB", camera: "200MP + 50MP + 12MP + 10MP", battery: "5000 mAh", os: "Android 14", sim: "Dual Nano-SIM + eSIM" } },
  { id: 6, category: "phone", brand: "Google", name: "Pixel 8 Pro", price: 1050000, stock: 7,
    specs: { display: "6.7\" LTPO OLED", chipset: "Google Tensor G3", ram: "12GB", storage: "128GB", camera: "50MP + 48MP + 48MP", battery: "5050 mAh", os: "Android 14", sim: "Nano-SIM + eSIM" } },
  { id: 7, category: "phone", brand: "Nokia", name: "Nokia G42 5G", price: 215000, stock: 15,
    specs: { display: "6.56\" IPS LCD 90Hz", chipset: "Snapdragon 480+ 5G", ram: "6GB", storage: "128GB", camera: "50MP + 2MP + 2MP", battery: "5000 mAh", os: "Android 13", sim: "Dual Nano-SIM" } },
  { id: 8, category: "accessory", brand: "Logitech", name: "MX Master 3S Mouse", price: 95000, stock: 20,
    specs: { type: "Wireless mouse", compatibility: "Windows, macOS, Linux", connectivity: "Bluetooth / USB receiver", material: "Plastic, rubber grip", warranty: "1 year" } },
  { id: 9, category: "accessory", brand: "Anker", name: "Anker 65W GaN Charger", price: 38000, stock: 40,
    specs: { type: "USB-C laptop charger", compatibility: "Most USB-C laptops & phones", connectivity: "2x USB-C, 1x USB-A", material: "Fire-resistant PC", warranty: "18 months" } },
  { id: 10, category: "accessory", brand: "Targus", name: "15.6\" Laptop Backpack", price: 45000, stock: 25,
    specs: { type: "Laptop bag", compatibility: "Laptops up to 15.6\"", connectivity: "N/A", material: "Water-resistant polyester", warranty: "6 months" } },
  { id: 11, category: "accessory", brand: "Baseus", name: "7-in-1 USB-C Hub", price: 32000, stock: 30,
    specs: { type: "USB-C hub", compatibility: "USB-C laptops", connectivity: "HDMI 4K, 3x USB 3.0, SD, microSD", material: "Aluminium", warranty: "12 months" } },
];

export const findProduct = (id: number): Product | undefined => products.find((p) => p.id === id);

export const naira = (n: number): string =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

/** Labelled spec rows for the product page, using the right labels for the category. */
export function getSpecRows(p: Product): { key: string; label: string; value: string }[] {
  const labels = SPEC_LABELS[p.category] as Record<string, string>;
  const specs = p.specs as unknown as Record<string, string>;
  return Object.entries(labels).map(([key, label]) => ({ key, label, value: specs[key] ?? "—" }));
}

/** Short list of headline specs shown on a product card. */
export function cardSpecs(p: Product): string[] {
  const keys: Record<Category, string[]> = {
    laptop: ["processor", "ram", "storage"],
    phone: ["chipset", "ram", "storage"],
    accessory: ["type", "compatibility"],
  };
  const specs = p.specs as unknown as Record<string, string>;
  return keys[p.category].map((k) => specs[k]);
}
