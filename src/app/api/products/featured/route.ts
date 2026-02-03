import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: true,
        category: true,
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(products);
  } catch (error) {
    console.error("Featured products fetch error:", error);
    return Response.json(
      { error: "Failed to fetch featured products" },
      { status: 500 },
    );
  }
}
