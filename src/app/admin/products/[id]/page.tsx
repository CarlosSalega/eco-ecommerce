"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin-header";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/product-form";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Fallo al cargar producto",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Cargando producto...</p>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-destructive">Producto no encontrado</p>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <AdminHeader />
      <main className="container-gutter mx-auto max-w-4xl flex-1 py-12">
        <Link
          href="/admin/products"
          className="text-accent hover:text-accent/80 mb-6 flex items-center gap-2 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Productos
        </Link>
        <ProductForm product={product} mode="edit" />
      </main>
    </div>
  );
}
