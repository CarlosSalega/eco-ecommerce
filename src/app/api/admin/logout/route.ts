import { deleteAdminSession } from "@/lib/admin-session";

export async function POST() {
  try {
    await deleteAdminSession();
    return Response.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json({ error: "Failed to logout" }, { status: 500 });
  }
}
