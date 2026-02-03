import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return Response.json({ error: "Phone number required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 10 minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.oTPCode.create({
      data: {
        phone,
        code,
        expiresAt,
      },
    });

    // In production, send via WhatsApp API
    // For now, log to console for development
    console.log(`[v0] OTP Code for ${phone}: ${code}`);

    return Response.json({
      code, // For development only - remove in production
      message: "Code sent successfully",
    });
  } catch (error) {
    console.error("OTP send error:", error);
    return Response.json({ error: "Failed to send code" }, { status: 500 });
  }
}
