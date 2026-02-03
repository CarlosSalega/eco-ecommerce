"use client";

import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/cart";

function CartContent() {
  const { cart, removeItem, updateItem } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="container-gutter mx-auto max-w-7xl py-20 text-center">
        <div className="mb-8">
          <div className="mb-4 text-6xl">🛍️</div>
          <h2 className="mb-4 font-serif text-3xl font-light tracking-tight">
            Tu carrito está vacío
          </h2>
          <p className="text-muted-foreground mb-8">
            Agregá algunos productos hermosos para empezar.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-white">
            <Link href="/shop">Seguir Comprando</Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  return (
    <div className="container-gutter mx-auto max-w-7xl py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}

        <Link
          href="/shop"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm"
        >
          <ChevronLeft className="size-4" />
          Volver a la Tienda
        </Link>
        <h1 className="mb-8 font-serif text-3xl font-light tracking-tight">
          Carrito de Compras
        </h1>

        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="bg-card border-border flex gap-4 rounded-lg border p-4"
              >
                <div className="bg-primary/10 size-24 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={96}
                    height={96}
                    className="size-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="mb-1 font-semibold">{item.title}</h3>
                  <p className="text-accent mb-3 font-semibold">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="border-border flex items-center rounded-lg border">
                      <button
                        onClick={() =>
                          updateItem(item.productId, item.quantity - 1)
                        }
                        className="hover:bg-primary/10 px-2 py-1"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateItem(item.productId, item.quantity + 1)
                        }
                        className="hover:bg-primary/10 px-2 py-1"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-destructive hover:bg-destructive/10 ml-auto rounded p-2 transition"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border-border sticky top-20 rounded-lg border p-6">
            <h2 className="mb-6 text-lg font-semibold">Resumen de la Orden</h2>

            <div className="mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (10%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-border flex justify-between border-t pt-3 font-semibold">
                <span>Total</span>
                <span className="text-accent">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              asChild
              className="bg-accent hover:bg-accent/90 mb-3 w-full text-white"
            >
              <Link href="/checkout">Ir al Pago</Link>
            </Button>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/shop">Seguir Comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return <CartContent />;
}
