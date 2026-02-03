"use client";

import Link from "next/link";
import { AdminHeader } from "@/components/admin-header";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
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
        <ProductForm mode="create" />
      </main>
    </div>
  );
}
