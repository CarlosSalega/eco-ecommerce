"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-context";

function useFavorites() {
  const getFavorites = () => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  };
  const addFavorite = (product: Product) => {
    const favs = getFavorites();
    if (!favs.some((p: any) => p.id === product.id)) {
      localStorage.setItem(
        "favorites",
        JSON.stringify([
          ...favs,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            image:
              typeof product.images?.[0] === "string"
                ? product.images[0]
                : (product.images?.[0] as any)?.url || "/placeholder.svg",
          },
        ]),
      );
    }
  };
  const removeFavorite = (id: string) => {
    const favs = getFavorites();
    localStorage.setItem(
      "favorites",
      JSON.stringify(favs.filter((p: any) => p.id !== id)),
    );
  };
  const isFavorite = (id: string) => {
    return getFavorites().some((p: any) => p.id === id);
  };
  return { getFavorites, addFavorite, removeFavorite, isFavorite };
}
import { Prisma } from "@prisma/client";

type Product = Prisma.ProductGetPayload<{
  include: { images: true; category: true };
}>;

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [favState, setFavState] = useState(isFavorite(product.id));

  const isOutOfStock = product.stock === 0;
  const maxQuantity = Math.min(product.stock, 10);

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert(`Solo hay ${product.stock} productos disponibles`);
      return;
    }

    addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image:
          typeof product.images?.[0] === "string"
            ? product.images[0]
            : (product.images?.[0] as any)?.url || "/placeholder.svg",
      },
      quantity,
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="bg-card border-border mb-6 rounded-lg border p-6">
      <div className="bg-primary/5 mb-4 rounded-lg p-3">
        {isOutOfStock ? (
          <p className="text-destructive font-semibold">Producto agotado</p>
        ) : product.stock <= 5 ? (
          <p className="font-semibold text-amber-600">
            ¡Solo {product.stock} disponibles en stock!
          </p>
        ) : (
          <p className="font-semibold text-green-600">
            En stock - Envío en 2-3 días hábiles
          </p>
        )}
      </div>

      {/* Quantity & Add to Cart */}
      {!isOutOfStock && (
        <>
          <div className="mb-4">
            <label className="mb-3 block text-sm font-medium">Cantidad</label>
            <div className="border-border flex w-fit items-center rounded-lg border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="hover:bg-primary/10 px-3 py-2 transition disabled:opacity-50"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="px-6 py-2 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                className="hover:bg-primary/10 px-3 py-2 transition disabled:opacity-50"
                disabled={quantity >= maxQuantity}
              >
                +
              </button>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              Máximo {maxQuantity} unidades por compra
            </p>
          </div>

          <Button
            onClick={handleAddToCart}
            className="bg-accent hover:bg-accent/90 mb-3 w-full text-white"
            disabled={quantity > product.stock}
          >
            {addedToCart ? "✓ Agregado al Carrito" : "Agregar al Carrito"}
          </Button>
        </>
      )}

      {isOutOfStock && (
        <Button disabled className="w-full opacity-50">
          Producto Agotado
        </Button>
      )}

      <Button
        variant={favState ? "default" : "outline"}
        className="w-full bg-transparent"
        onClick={() => {
          if (favState) {
            removeFavorite(product.id);
            setFavState(false);
          } else {
            addFavorite(product);
            setFavState(true);
          }
        }}
      >
        {favState ? "✓ Favorito" : "Agregar a Favoritos"}
      </Button>
    </div>
  );
}
