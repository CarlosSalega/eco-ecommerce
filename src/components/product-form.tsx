"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySelect } from "@/components/category-select";
import { ImageUpload } from "@/components/image-upload";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  product?: any; // Replace with your Product type if available
  mode: "create" | "edit";
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Imágenes locales seleccionadas (File[])
  const [localImages, setLocalImages] = useState<File[]>([]);
  // URLs de miniaturas locales
  const [localThumbs, setLocalThumbs] = useState<string[]>([]);

  const defaultValues: Partial<ProductInput> = {
    title: product?.title ?? "",
    description: product?.description ?? "",
    price:
      product?.price !== undefined && product?.price !== null
        ? (product.price / 100).toFixed(2)
        : "",
    stock:
      product?.stock !== undefined && product?.stock !== null
        ? String(product.stock)
        : "",
    categoryId:
      product?.categoryId !== undefined && product?.categoryId !== null
        ? String(product.categoryId)
        : "",
    images: Array.isArray(product?.images) ? product.images : [],
    isActive: product?.isActive ?? true,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues,
    mode: "onChange",
  });

  const formData = watch();

  // Genera miniaturas locales al seleccionar archivos
  useEffect(() => {
    if (localImages.length) {
      setLocalThumbs(localImages.map((file) => URL.createObjectURL(file)));
    } else {
      setLocalThumbs([]);
    }
    // Cleanup object URLs
    return () => {
      localThumbs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [localImages]);

  const onSubmit = async (data: ProductInput) => {
    setLoading(true);
    try {
      // Subir imágenes locales a Vercel Blob
      let uploadedUrls: string[] = [];
      if (localImages.length) {
        for (let file of localImages) {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const json = await res.json();
          if (res.ok && json?.blob?.url) {
            uploadedUrls.push(json.blob.url);
          } else {
            toast({
              title: "Error",
              description: json?.error || "Error al subir imagen",
              variant: "destructive",
            });
            throw new Error(json?.error || "Error al subir imagen");
          }
        }
      }
      const url =
        mode === "create" ? "/api/products" : `/api/products/${product?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const payload = {
        ...data,
        price: Math.round(Number(data.price) * 100),
        stock: Number(data.stock),
        images: uploadedUrls,
        categoryId: data.categoryId || undefined,
        isActive: data.isActive,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast({
          title: mode === "create" ? "Producto creado" : "Producto actualizado",
          description:
            mode === "create"
              ? "El producto se creó correctamente."
              : "El producto se actualizó correctamente.",
        });
        router.push("/admin/products");
        router.refresh();
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast({
          title: "Error",
          description: errorData.error || "Error al guardar el producto",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al guardar el producto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mx-auto max-w-2xl py-6">
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Nuevo Producto" : "Editar Producto"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Nombre *</Label>
            <Input id="title" {...register("title")} required />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register("description")} rows={4} />
            {errors.description && (
              <p className="text-destructive text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="price">Precio (ARS) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
                required
              />
              {errors.price && (
                <p className="text-destructive text-sm">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                {...register("stock")}
                required
              />
              {errors.stock && (
                <p className="text-destructive text-sm">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="categoryId" className="mb-2 block">
              Categoría
            </Label>
            <CategorySelect
              value={formData.categoryId ?? ""}
              onChange={(value) => setValue("categoryId", value)}
            />
            {errors.categoryId && (
              <p className="text-destructive text-sm">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Imágenes</Label>
            <ImageUpload
              files={localImages}
              setFiles={setLocalImages}
              thumbs={localThumbs}
            />
            {errors.images && (
              <p className="text-destructive text-sm">
                {typeof errors.images === "object" && "message" in errors.images
                  ? String(errors.images.message)
                  : String(errors.images)}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              {loading
                ? "Guardando..."
                : mode === "create"
                  ? "Crear Producto"
                  : "Guardar Cambios"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                router.back();
              }}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
