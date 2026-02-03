"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl py-12">
      <main className="grid max-w-5xl gap-8 px-4 py-8 md:px-6">
        <h1 className="mb-8 text-3xl font-bold">Mis Favoritos</h1>
        {favorites.length === 0 ? (
          <p className="text-muted-foreground">
            No tienes productos favoritos.
          </p>
        ) : (
          <div className="xs:grid-cols-2 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                stock={1}
                slug={product.slug || product.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
