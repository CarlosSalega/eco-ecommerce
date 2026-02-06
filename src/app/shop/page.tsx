"use client";

import { useState, useEffect } from "react";
import { Prisma } from "@prisma/client";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { WithPagination } from "@/components/with-pagination";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Select } from "@/components/ui/select";

type Product = Prisma.ProductGetPayload<{
  include: {
    category: true;
  };
}>;

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todo");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<string>("Más Recientes");
  const pageSize = 9;
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedPriceRange]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          const formattedProducts = Array.isArray(data) ? data : [];
          setProducts(formattedProducts);
          setError(null);
        } else {
          const errorData = await response.text();
          console.error("API error:", errorData);
          setError("Error al cargar productos");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Error al conectar con el servidor");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    // Filtrar por categoría
    if (selectedCategory !== "Todo") {
      filtered = filtered.filter(
        (product) => product.category?.name === selectedCategory,
      );
    }
    // Filtrar por rango de precios
    if (selectedPriceRange) {
      filtered = filtered.filter((product) => {
        if (selectedPriceRange === "Menos de $5000") {
          return product.price < 5000;
        }
        if (selectedPriceRange === "$5000 - $10000") {
          return product.price >= 5000 && product.price <= 10000;
        }
        if (selectedPriceRange === "Más de $10000") {
          return product.price > 10000;
        }
        return true;
      });
    }
    // Ordenar productos
    let sorted = [...filtered];
    if (sortOrder === "Precio: Menor a Mayor") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "Precio: Mayor a Menor") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "Más Recientes") {
      sorted.sort((a, b) => {
        // Si tienes un campo de fecha, reemplaza 'createdAt'
        if (a.createdAt && b.createdAt) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      });
    }

    setFilteredProducts(sorted);
  }, [products, selectedCategory, selectedPriceRange, sortOrder]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Section */}
      <div className="border-border bg-primary/5 border-b">
        <div className="container-gutter mx-auto max-w-7xl py-12">
          <h1 className="mb-2 font-serif text-3xl font-light tracking-tight md:text-4xl">
            Nuestra Colección
          </h1>
          <p className="text-muted-foreground">
            Descubrí nuestra selección de productos de belleza y cosméticos
            premium
          </p>
        </div>
      </div>

      {/* Filters & Products */}
      <div className="max-w-7xl py-12">
        <main className="grid gap-8 px-4 py-8 md:px-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Filters */}
          <div className="hidden lg:block">
            <aside className="w-full shrink-0 md:w-64">
              <div className="bg-card border-border rounded-lg border px-6 py-8">
                <h3 className="mb-4 font-semibold">Categorías</h3>
                <div className="space-y-2">
                  {[
                    "Todo",
                    "Cuidado de Piel",
                    "Maquillaje",
                    "Cuidado Capilar",
                  ].map((cat) => (
                    <button
                      key={cat}
                      className={`hover:bg-primary/10 block w-full rounded px-3 py-2 text-left text-sm transition ${selectedCategory === cat ? "bg-primary/10 font-bold" : ""}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="border-border mt-6 border-t pt-6">
                  <h3 className="mb-4 font-semibold">Rango de Precios</h3>
                  <div className="space-y-2">
                    {["Menos de $5000", "$5000 - $10000", "Más de $10000"].map(
                      (range) => (
                        <label
                          key={range}
                          className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                          <input
                            type="radio"
                            name="priceRange"
                            className="rounded"
                            checked={selectedPriceRange === range}
                            onChange={() => setSelectedPriceRange(range)}
                          />
                          {range}
                        </label>
                      ),
                    )}
                    <button
                      className="text-muted-foreground mt-2 text-xs underline"
                      onClick={() => setSelectedPriceRange("")}
                      type="button"
                    >
                      Limpiar filtro de precio
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Products Grid con paginación */}
          <WithPagination
            pagination={
              totalPages > 1
                ? {
                    currentPage,
                    totalPages,
                    onPageChange: setCurrentPage,
                  }
                : undefined
            }
          >
            <section className="min-w-0 flex-1">
              {isLoading ? (
                <>
                  {/* Skeleton Header */}
                  <div className="mb-8 flex items-center justify-between">
                    <Skeleton className="bg-secondary h-9 w-24" />
                    <Skeleton className="bg-secondary h-9 w-36" />
                  </div>
                  {/* Skeleton Grid */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-card border-border group relative cursor-pointer overflow-hidden rounded-lg border transition-shadow"
                      >
                        {/* Skeleton Image */}
                        <Skeleton className="bg-secondary aspect-square w-full" />
                        {/* Skeleton Content */}
                        <div className="p-4">
                          <Skeleton className="bg-secondary mb-1 h-5 w-full" />
                          <Skeleton className="bg-secondary mb-3 h-4 w-2/3" />
                          <Skeleton className="bg-secondary mb-3 h-3 w-1/2" />
                          <div className="flex items-center justify-between pt-2">
                            <Skeleton className="bg-secondary h-6 w-16" />
                            <Skeleton className="bg-secondary h-8 w-24" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : error ? (
                <div className="flex min-h-[400px] items-center justify-center py-12">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex min-h-[400px] items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">
                      No hay productos disponibles
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8 flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                      Mostrando {filteredProducts.length} productos
                    </p>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="border-border bg-card w-48 rounded border px-4 py-2 text-sm">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground">
                        <SelectItem value="Más Recientes">
                          Más Recientes
                        </SelectItem>
                        <SelectItem value="Precio: Menor a Mayor">
                          Precio: Menor a Mayor
                        </SelectItem>
                        <SelectItem value="Precio: Mayor a Menor">
                          Precio: Mayor a Menor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="xs:grid-cols-2 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        description={product.description ?? undefined}
                        price={product.price}
                        stock={product.stock}
                        image={
                          (Array.isArray(product.images) &&
                            product.images[0]) ||
                          "/placeholder.svg"
                        }
                        slug={product.slug}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          </WithPagination>
        </main>
      </div>
    </div>
  );
}
