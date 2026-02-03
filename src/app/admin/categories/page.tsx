"use client";

import { AdminHeader } from "@/components/admin-header";
import { Button } from "@components/ui/button";
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
import { useToast } from "@/hooks/use-toast";

type Category = Prisma.CategoryGetPayload<{}>;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que querés eliminar esta categoría?"))
      return;
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCategories(categories.filter((c) => c.id !== id));
        toast({
          title: "Categoría eliminada",
          description: "La categoría se eliminó correctamente.",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar la categoría.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la categoría.",
        variant: "destructive",
      });
      console.error("Failed to delete category:", error);
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <AdminHeader />

      <main className="container-gutter mx-auto max-w-7xl min-w-xl flex-1 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-serif text-4xl font-light tracking-tight">
              Categorías
            </h1>
            <p className="text-muted-foreground">
              Administrar categorías de productos
            </p>
          </div>
          <Button
            asChild
            className="bg-accent hover:bg-accent/80 min-w-40 text-white"
          >
            <Link href="/admin/categories/new">
              <Plus className="mr-2 size-4" />
              Nueva Categoría
            </Link>
          </Button>
        </div>

        <div className="bg-card border-border overflow-hidden rounded-lg border">
          {loading ? (
            <div className="text-muted-foreground p-8 text-center">
              Cargando categorías...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-muted-foreground p-8 text-center">
              No hay categorías todavía. Creá una para comenzar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="hover:bg-accent/50"
                        >
                          <Link href={`/admin/categories/${category.id}`}>
                            <Edit className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(category.id)}
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
  );
}
