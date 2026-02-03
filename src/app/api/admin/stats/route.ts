import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [totalProducts, totalCategories, pendingOrders, orders] =
      await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.order.count({
          where: { status: "PENDING" },
        }),
        prisma.order.findMany({
          where: { status: "PAID" },
        }),
      ]);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    return Response.json({
      totalProducts,
      totalCategories,
      pendingOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
