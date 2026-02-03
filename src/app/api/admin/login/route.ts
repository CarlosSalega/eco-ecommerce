import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createAdminSession } from "@/lib/admin-session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create DB-backed session and set HttpOnly cookie
    await createAdminSession(admin.id);

    // For backward compatibility, return a token property (unused)
    return Response.json({
      token: null,
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
