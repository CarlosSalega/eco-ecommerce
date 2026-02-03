import { prisma } from "@/lib/db";
import slugify from "slugify";

function generateSlugBase(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

async function generateUniqueSlug(
  base: string,
  excludeId?: string,
): Promise<string> {
  let slug = base;
  let counter = 1;

  while (true) {
    const exists = await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    if (!exists) return slug;

    slug = `${base}-${counter}`;
    counter++;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return Response.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    console.error("Product fetch error:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, description, price, stock, categoryId, isActive, images } =
      body;

    // Obtener el producto actual para verificar si el título cambió
    const currentProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!currentProduct) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Generar nuevo slug si el título cambió
    let slug = currentProduct.slug;
    if (title && title !== currentProduct.title) {
      const baseSlug = generateSlugBase(title);
      slug = await generateUniqueSlug(baseSlug, id);
    }

    // Actualizar datos del producto
    const updateData: any = {
      title,
      slug,
      description,
      price,
      stock,
      categoryId: categoryId || undefined,
      isActive,
    };

    // Si hay imágenes, actualizar el array
    if (images && Array.isArray(images)) {
      updateData.images = images;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return Response.json(product);
  } catch (error) {
    console.error("Product update error:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    return Response.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Product delete error:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
