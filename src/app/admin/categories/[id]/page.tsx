"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Prisma } from "@prisma/client";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Category = Prisma.CategoryGetPayload<{}>;

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (!response.ok) {
          throw new Error("Categoría no encontrada");
        }
        const data: Category = await response.json();
        setName(data.name);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar la categoría",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la categoría");
      }

      router.push("/admin/categories");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar la categoría",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Cargando categoría...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <AdminHeader />

      <main className="container-gutter mx-auto max-w-2xl flex-1 py-12">
        <Link
          href="/admin/categories"
          className="text-accent hover:text-accent/80 mb-6 flex items-center gap-2 transition"
        >
          <ArrowLeft className="size-4" />
          Volver a Categorías
        </Link>

        <h1 className="mb-8 font-serif text-4xl font-light tracking-tight">
          Editar Categoría
        </h1>

        {error && (
          <div className="bg-destructive/10 text-destructive mb-6 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-card border-border space-y-6 rounded-lg border p-8"
        >
          <div>
            <Label htmlFor="name" className="mb-2 block">
              Nombre de la Categoría *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej., Skincare"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              {submitting ? "Guardando..." : "Guardar Categoría"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/categories">Cancelar</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
