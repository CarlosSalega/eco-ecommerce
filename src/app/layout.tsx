import type React from "react";
import type { Metadata } from "next";
import { Red_Hat_Display, Red_Hat_Text } from "next/font/google";
import { CartProvider } from "@/components/cart-context";
import { AppFrame } from "@/components/app-frame";
import "./globals.css";

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

const redHatText = Red_Hat_Text({
  subsets: ["latin"],
  variable: "--font-text",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ecommerce - Tienda de productos",
  description: "Tienda moderna de productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${redHatDisplay.variable} ${redHatText.variable}`}
    >
      <body className="antialiased">
        <CartProvider>
          <AppFrame>{children}</AppFrame>
        </CartProvider>
      </body>
    </html>
  );
}
