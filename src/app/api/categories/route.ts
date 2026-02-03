import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return Response.json(categories);
  } catch (error) {
    console.error("Categories fetch error:", error);
    return Response.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return Response.json(
        { error: "Category name required" },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return Response.json(category);
  } catch (error) {
    console.error("Category creation error:", error);
    return Response.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
