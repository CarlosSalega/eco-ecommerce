import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Producto no encontrado</h1>
        <p className="text-muted-foreground mb-6">
          El producto que buscas no existe o ha sido eliminado.
        </p>
        <Link
          href="/shop"
          className="text-accent hover:text-accent/80 inline-flex items-center gap-2 transition"
        >
          <ChevronLeft className="size-4" />
          Volver a la Tienda
        </Link>
      </div>
    </div>
  );
}
