import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const categoryId = searchParams.get("categoryId");

    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          categoryId ? { categoryId } : {},
        ],
      },
      include: {
        images: true,
        category: true,
      },
      take: 20,
    });

    return Response.json(products);
  } catch (error) {
    console.error("Product search error:", error);
    return Response.json(
      { error: "Failed to search products" },
      { status: 500 },
    );
  }
}
