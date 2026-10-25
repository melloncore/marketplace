import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/components/QueryProvider";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import CookieConsentBanner from "@/components/CookieConsentBanner";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "Mellon Strata Core Marketplace – Laptops, Phones & Accessories",
  description: "Shop laptops, phones, and accessories at the Mellon Strata Core Marketplace.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans">
        <QueryProvider>
          <CartProvider>
            <AnalyticsTracker />
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
            <CookieConsentBanner />
            <ToastContainer position="top-right" autoClose={2500} />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
