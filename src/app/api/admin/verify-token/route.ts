import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // In production, verify JWT token
    // For now, just return success
    return Response.json({ valid: true });
  } catch (error) {
    console.error("Token verification error:", error);
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}
