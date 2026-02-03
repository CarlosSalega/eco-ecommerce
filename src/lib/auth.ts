export interface AuthSession {
  customerId: string;
  phone: string;
  name?: string;
  email?: string;
  expiresAt: number;
}

const AUTH_STORAGE_KEY = "belleza-auth";

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored) as AuthSession;
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export function setSession(session: Omit<AuthSession, "expiresAt">) {
  if (typeof window === "undefined") return;

  try {
    const fullSession: AuthSession = {
      ...session,
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fullSession));
  } catch (error) {
    console.error("Failed to set session:", error);
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
