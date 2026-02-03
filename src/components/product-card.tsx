"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
  stock: number;
  slug: string;
}

export function ProductCard({
  id,
  title,
  description,
  price,
  image,
  stock,
  slug,
}: ProductCardProps) {
  const formattedPrice = (price / 100).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
  const isOutOfStock = stock === 0;
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [fav, setFav] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]").some(
        (p: any) => p.id === id,
      );
    } catch {
      return false;
    }
  });
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window === "undefined") return;
    let favs = [];
    try {
      favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {}
    if (fav) {
      favs = favs.filter((p: any) => p.id !== id);
      setFav(false);
    } else {
      favs.push({ id, title, price, image, stock, slug });
      setFav(true);
    }
    localStorage.setItem("favorites", JSON.stringify(favs));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({ id, title, price, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link href={`/product/${slug}`}>
      <div className="bg-card border-border group relative cursor-pointer overflow-hidden rounded-lg border transition-shadow hover:shadow-lg">
        {/* Image */}
        <div className="bg-primary/5 relative aspect-square overflow-hidden">
          {image ? (
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              width={400}
              height={400}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
              <span>Sin imagen</span>
            </div>
          )}
          {/* Botón de favorito */}
          <button
            onClick={handleFavorite}
            className={`absolute top-2 right-2 rounded-full bg-white/80 p-2 shadow transition ${
              fav ? "text-red-500" : "text-muted-foreground"
            }`}
            aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart fill={fav ? "#ef4444" : "none"} className="size-5" />
          </button>
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="bg-destructive rounded-full px-3 py-1 text-sm font-semibold text-white">
                Sin Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-foreground mb-1 line-clamp-2 font-semibold">
            {title}
          </h3>
          {description && (
            <p className="text-muted-foreground mb-3 line-clamp-1 text-sm">
              {description}
            </p>
          )}

          <div className="mb-3">
            <p className="text-muted-foreground text-xs">
              {isOutOfStock ? (
                <span className="text-destructive font-semibold">Agotado</span>
              ) : stock <= 5 ? (
                <span className="font-semibold text-amber-600">
                  Solo {stock} disponibles
                </span>
              ) : (
                <span className="text-green-600">En stock</span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-accent text-lg font-semibold">
              {formattedPrice}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {added ? "✓ Agregado" : "Agregar"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
