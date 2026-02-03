import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return Response.json(
        { error: "Order ID and status required" },
        { status: 400 },
      );
    }

    const validStatuses = ["PENDING", "PAID", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return Response.json(order);
  } catch (error) {
    console.error("Order status update error:", error);
    return Response.json(
      { error: "Failed to update order status" },
      { status: 500 },
    );
  }
}
