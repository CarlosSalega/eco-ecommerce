import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
