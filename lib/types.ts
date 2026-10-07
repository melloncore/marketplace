export type Category = "laptop" | "phone" | "accessory";
export type PhoneBrand = "iPhone" | "Samsung" | "Google" | "Nokia";

export interface LaptopSpecs {
  processor: string; ram: string; storage: string; display: string;
  gpu: string; battery: string; os: string; weight: string;
}
export interface PhoneSpecs {
  display: string; chipset: string; ram: string; storage: string;
  camera: string; battery: string; os: string; sim: string;
}
export interface AccessorySpecs {
  type: string; compatibility: string; connectivity: string; material: string; warranty: string;
}

interface BaseProduct { id: number; brand: string; name: string; price: number; stock: number }
export interface LaptopProduct extends BaseProduct { category: "laptop"; specs: LaptopSpecs }
export interface PhoneProduct extends BaseProduct { category: "phone"; specs: PhoneSpecs }
export interface AccessoryProduct extends BaseProduct { category: "accessory"; specs: AccessorySpecs }

/** Discriminated union: the `category` decides which spec fields exist. */
export type Product = LaptopProduct | PhoneProduct | AccessoryProduct;

export interface CartItem { product: Product; qty: number }

export interface DeliveryDetails {
  name: string; email: string; phone: string; address: string; city: string; state: string; note: string;
}
export interface CheckoutForm extends DeliveryDetails { card: string; expiry: string; cvv: string }

export interface OrderLine { id: number; name: string; price: number; qty: number }
export interface Order {
  id: string; date: string; items: OrderLine[]; delivery: DeliveryDetails;
  subtotal: number; fee: number; total: number; status: "Paid";
}
