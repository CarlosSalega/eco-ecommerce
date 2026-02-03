import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart-context";
import { AppFrame } from "@/components/app-frame";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

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
    <html lang="es-AR">
      <body className={`font-sans antialiased`}>
        <CartProvider>
          <AppFrame>{children}</AppFrame>
        </CartProvider>
      </body>
    </html>
  );
}
