"use client";

import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { Edit, Trash2, Plus } from "lucide-react";

type Product = Prisma.ProductGetPayload<{}>;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que querés eliminar este producto?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="bg-background flex min-h-screen flex-col">
        <main className="container-gutter mx-auto max-w-7xl min-w-xl flex-1 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 font-serif text-4xl font-light tracking-tight">
                Productos
              </h1>
              <p className="text-muted-foreground">
                Administrá tu catálogo de productos
              </p>
            </div>
            <Button
              asChild
              className="bg-accent hover:bg-accent/90 min-w-40 text-white"
            >
              <Link href="/admin/products/new">
                <Plus className="mr-2 size-4" />
                Nuevo Producto
              </Link>
            </Button>
          </div>

          <div className="bg-card border-border overflow-hidden rounded-lg border">
            {loading ? (
              <div className="text-muted-foreground p-8 text-center">
                Cargando productos...
              </div>
            ) : products.length === 0 ? (
              <div className="text-muted-foreground p-8 text-center">
                Sin productos aún. Creá uno para comenzar.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.title}
                      </TableCell>
                      <TableCell>
                        {(product.price / 100).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-2 rounded-full ${
                              product.stock === 0
                                ? "bg-destructive"
                                : product.stock <= 5
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                            }`}
                          />
                          <span className="font-medium">{product.stock}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded px-2 py-1 text-xs font-semibold ${
                            product.isActive
                              ? "bg-green-300 text-green-800"
                              : "bg-orange-300 text-orange-800"
                          }`}
                        >
                          {product.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="hover:bg-accent/50"
                          >
                            <Link href={`/admin/products/${product.id}`}>
                              <Edit className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(product.id)}
                            className="text-destructive hover:bg-destructive/50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
