import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return Response.json(
        { error: "Phone and code required" },
        { status: 400 },
      );
    }

    // Find and verify OTP
    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        phone,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return Response.json(
        { error: "Invalid or expired code" },
        { status: 401 },
      );
    }

    // Delete used OTP
    await prisma.oTPCode.delete({
      where: {
        id: otpRecord.id,
      },
    });

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          phone,
        },
      });
    }

    return Response.json({
      customer: {
        id: customer.id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
