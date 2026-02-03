import { prisma } from "@/lib/db";
import slugify from "slugify";

function generateSlugBase(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

async function generateUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let counter = 1;

  while (true) {
    const exists = await prisma.product.findFirst({ where: { slug } });
    if (!exists) return slug;

    slug = `${base}-${counter}`;
    counter++;
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(products);
  } catch (error) {
    console.error("Products fetch error:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, price, categoryId, stock, images } =
      await request.json();

    // Generar slug único basado en el título
    const baseSlug = generateSlugBase(title);
    const slug = await generateUniqueSlug(baseSlug);

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        stock,
        categoryId: categoryId || undefined,
        images: Array.isArray(images) ? images : [],
      },
      include: {
        category: true,
      },
    });

    return Response.json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
