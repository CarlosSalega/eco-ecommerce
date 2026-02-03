"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="from-primary/5 to-background bg-linear-to-b">
          <div className="container-gutter mx-auto max-w-7xl py-20 md:py-32">
            <div className="max-w-3xl">
              <h1 className="mb-6 font-serif text-4xl font-light tracking-tight md:text-6xl">
                Belleza y elegancia en cada producto
              </h1>
              <p className="text-muted-foreground mb-8 max-w-2xl text-lg leading-relaxed">
                Descubrí nuestra colección seleccionada de cosméticos y
                productos de cuidado de piel premium. Lujo a precios accesibles
                para todas.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white"
              >
                <Link href="/shop">Comprar Ahora</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Preview */}
        <section className="container-gutter mx-auto max-w-7xl py-16 md:py-24">
          <h2 className="mb-12 font-serif text-3xl font-light tracking-tight">
            Comprar por Categoría
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { name: "Cuidado de Piel", slug: "skincare" },
              { name: "Maquillaje", slug: "makeup" },
              { name: "Cuidado Capilar", slug: "haircare" },
            ].map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="bg-primary/10 border-border hover:bg-primary/20 group flex aspect-square items-center justify-center rounded-lg border transition"
              >
                <div className="text-center">
                  <h3 className="group-hover:text-accent text-lg font-semibold transition">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-foreground text-white">
          <div className="container-gutter mx-auto max-w-7xl py-16 text-center md:py-24">
            <h2 className="mb-6 font-serif text-3xl font-light tracking-tight md:text-4xl">
              Descubrí lo que buscás
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
              Desde cuidado de piel hasta maquillaje, encontrá todo lo que
              necesitás para verte y sentirte hermosa.
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-foreground hover:bg-primary bg-white"
            >
              <Link href="/shop">Explorar Catálogo</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
