"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!name) {
        setError("El nombre de la categoría es obligatorio");
        setLoading(false);
        toast({
          title: "Error",
          description: "El nombre de la categoría es obligatorio",
          variant: "destructive",
        });
        return;
      }
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        toast({
          title: "Error",
          description: "Error al crear la categoría",
          variant: "destructive",
        });
        throw new Error("Error al crear la categoría");
      }
      toast({
        title: "Categoría creada",
        description: "La categoría se creó correctamente.",
      });
      router.push("/admin/categories");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la categoría",
      );
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Error al crear la categoría",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          Crear Nueva Categoría
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
              placeholder="e.g., Skincare"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              {loading ? "Creando..." : "Crear Categoría"}
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
