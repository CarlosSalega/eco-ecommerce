import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      totalProducts,
      totalCategories,
      totalCustomers,
      totalOrders,
      pendingOrders,
      paidOrders,
      orders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.customer.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.order.findMany({
        where: { status: "PAID" },
        select: { totalAmount: true },
      }),
    ]);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    return Response.json({
      totalProducts,
      totalCategories,
      totalCustomers,
      totalOrders,
      pendingOrders,
      paidOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Dashboard stats fetch error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
