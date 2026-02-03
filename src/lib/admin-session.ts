import { prisma } from "./db";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 60 * 60 * 1000; // 1h

export async function createAdminSession(adminUserId: string) {
  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.adminSession.create({
    data: { sessionToken, adminUserId, expires },
  });
  (await cookies()).set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });

  return sessionToken;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  const session = await prisma.adminSession.findUnique({
    where: { sessionToken },
    include: { adminUser: true },
  });

  if (!session || session.expires < new Date()) return null;
  return session;
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  if (sessionToken) {
    await prisma.adminSession
      .delete({ where: { sessionToken } })
      .catch(() => {});
  }
  cookieStore.delete(COOKIE_NAME);
}
