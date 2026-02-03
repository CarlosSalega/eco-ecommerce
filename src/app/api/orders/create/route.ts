import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface OrderItem {
  productId: string;
  quantity: number;
  title: string;
  price: number;
}

export async function POST(request: Request) {
  try {
    const {
      phone,
      fullName,
      email,
      deliveryType,
      address,
      city,
      province,
      postalCode,
      items,
    } = await request.json();

    if (!phone || !items || items.length === 0) {
      return Response.json({ error: "Invalid order data" }, { status: 400 });
    }

    // Find customer
    let customer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { phone },
      });
    }

    // Update customer info
    if (fullName || email) {
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: fullName,
          email: email,
        },
      });
    }

    // Calculate total
    const totalAmount = (items as OrderItem[]).reduce(
      (sum: number, item: OrderItem) => sum + item.price * item.quantity,
      0,
    );

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        totalAmount,
        status: "PENDING",
        deliveryType,
        fullName,
        address,
        city,
        province,
        postalCode,
        items: {
          create: (items as OrderItem[]).map((item: OrderItem) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Decrement stock for each product
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    console.log("[v0] Order created:", order.id);

    return Response.json({
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
