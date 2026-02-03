"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-context";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="border-border sticky top-0 z-50 border-b bg-white">
      <nav className="container-gutter mx-auto flex max-w-7xl items-center justify-between py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-foreground font-serif text-2xl font-light tracking-wider"
        >
          Belleza
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/shop"
            className="text-foreground hover:text-accent text-sm font-medium transition"
          >
            Tienda
          </Link>
          <Link
            href="/favorites"
            className="text-foreground hover:text-accent text-sm font-medium transition"
          >
            Favoritos
          </Link>
          <Link
            href="/contact"
            className="text-foreground hover:text-accent text-sm font-medium transition"
          >
            Contacto
          </Link>
          <Link
            href="/admin/login"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition"
          >
            Admin
          </Link>
        </div>

        {/* Cart & Auth */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="hover:bg-primary/10 relative rounded-lg p-2 transition"
          >
            <ShoppingBag className="size-6" />
            {cartCount > 0 && (
              <span className="bg-accent absolute top-0 right-0 flex size-5 items-center justify-center rounded-full text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hover:bg-primary/10 relative rounded-lg p-2 transition md:hidden"
          >
            <span
              className={`absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-all duration-300 ${mobileMenuOpen ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}
              style={{ pointerEvents: mobileMenuOpen ? "none" : "auto" }}
              aria-hidden={mobileMenuOpen}
            >
              <Menu className="size-full" />
            </span>
            <span
              className={`absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-all duration-300 ${mobileMenuOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
              style={{ pointerEvents: !mobileMenuOpen ? "none" : "auto" }}
              aria-hidden={!mobileMenuOpen}
            >
              <X className="size-full" />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`border-border bg-card transform border-t transition-all duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
        style={{ position: "absolute", width: "100%" }}
      >
        <div className="container-gutter mx-auto flex max-w-7xl flex-col gap-3 py-4">
          <Link
            href="/shop"
            className="text-foreground hover:text-accent text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Tienda
          </Link>
          <Link
            href="/favorites"
            className="text-foreground hover:text-accent text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Favoritos
          </Link>
          <Link
            href="/contact"
            className="text-foreground hover:text-accent text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contacto
          </Link>
          <Link
            href="/admin/login"
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
