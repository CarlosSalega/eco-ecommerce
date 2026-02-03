"use client";
import { useState } from "react";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    image?: string;
    stock: number;
    slug: string;
  };
  className?: string;
}

export function FavoriteButton({ product, className }: FavoriteButtonProps) {
  const [fav, setFav] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]").some(
        (p: any) => p.id === product.id,
      );
    } catch {
      return false;
    }
  });

  const handleFavorite = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (typeof window === "undefined") return;
    let favs = [];
    try {
      favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {}
    if (fav) {
      favs = favs.filter((p: any) => p.id !== product.id);
      setFav(false);
    } else {
      favs.push(product);
      setFav(true);
    }
    localStorage.setItem("favorites", JSON.stringify(favs));
  };

  return (
    <button
      onClick={handleFavorite}
      className={`absolute top-2 right-2 rounded-full bg-white/80 p-2 shadow transition ${
        fav ? "text-red-500" : "text-muted-foreground"
      } ${className || ""}`}
      aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
      type="button"
    >
      <Heart fill={fav ? "#ef4444" : "none"} className="size-5" />
    </button>
  );
}
