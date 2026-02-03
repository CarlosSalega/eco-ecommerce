import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AddToCart } from "@/components/add-to-cart";
import { FavoriteButton } from "@/components/favorite-button";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  const price = (product.price / 100).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const productUrl = `${SITE_URL}/product/${slug}`;
  const productImage =
    (Array.isArray(product.images) && product.images[0]) ||
    `${SITE_URL}/placeholder.svg`;

  const title = `${product.title} - ${price} | Eco Ecommerce`;
  const description =
    product.description ||
    `${product.title} disponible por ${price}. ${
      product.category?.name ? `Categoría: ${product.category.name}` : ""
    }`;

  return {
    title,
    description,
    openGraph: {
      title: product.title,
      description,
      url: productUrl,
      siteName: "Eco Ecommerce",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.title,
        },
        {
          url: productImage,
          width: 1080,
          height: 1080,
          alt: product.title,
        },
      ],
      locale: "es_AR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  const price = (product.price / 100).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const isOutOfStock = product.stock === 0;

  // Favoritos localStorage

  return (
    <div className="flex min-h-screen flex-col">
      {/* Breadcrumb */}
      <div className="container-gutter max-w-5xl py-4">
        <Link
          href="/shop"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm"
        >
          <ChevronLeft className="size-4" />
          Volver a la Tienda
        </Link>
      </div>

      {/* Product Section */}
      <div className="container-gutter mx-auto max-w-7xl flex-1 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Images Column */}
          <div>
            <div className="relative">
              <div className="bg-primary/5 mb-4 aspect-square overflow-hidden rounded-lg">
                <Image
                  src={
                    (Array.isArray(product.images) && product.images[0]) ||
                    "/placeholder.svg"
                  }
                  alt={product.title}
                  width={600}
                  height={600}
                  className="size-full object-cover"
                />
                {/* Botón de favorito */}
                <div className="absolute top-2 right-2">
                  <FavoriteButton product={product} />
                </div>
              </div>

              {isOutOfStock && (
                <div className="absolute top-3 left-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                  Sin stock
                </div>
              )}
            </div>

            {product.images &&
              Array.isArray(product.images) &&
              product.images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {product.images.map((imgUrl: string, idx: number) => (
                    <Image
                      key={idx}
                      src={imgUrl || "/placeholder.svg"}
                      alt={`Vista ${idx + 1}`}
                      width={150}
                      height={150}
                      className="size-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
          </div>

          {/* Info Column */}
          <div>
            <div className="mb-6">
              <h1 className="mb-2 font-serif text-3xl font-light tracking-tight">
                {product.title}
              </h1>
              <div className="text-accent mb-2 text-3xl font-semibold">
                {price}
              </div>

              {isOutOfStock && (
                <p className="mb-4 font-medium text-red-600">
                  Actualmente no hay stock disponible.
                </p>
              )}

              {product.description && (
                <p className="text-foreground leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Add to Cart */}
            {!isOutOfStock ? (
              <AddToCart product={product} />
            ) : (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-lg bg-gray-300 py-3 font-medium text-gray-600"
              >
                Sin Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
