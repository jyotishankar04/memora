const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export type OAuthProvider = "google" | "github";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  status: string;
  emailVerified: boolean;
  roles: string[];
  onboardingCompleted: boolean;
}

/**
 * Calls the Memora API with the httpOnly auth cookies attached, and unwraps
 * the {success,data,error} envelope. The backend owns the access/refresh
 * tokens entirely — this client never reads or stores them itself.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await response.json();

  if (!response.ok || !body.success) {
    throw new Error(body.error?.message ?? "Something went wrong. Please try again.");
  }

  return body.data as T;
}

/** Full-page redirect to the backend, which handles the entire OAuth round trip and redirects back with cookies set. */
export function getProviderLoginUrl(provider: OAuthProvider): string {
  return `${API_URL}/auth/${provider}`;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { user } = await apiFetch<{ user: AuthUser }>("/auth/me");
  return user;
}

export async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // best-effort — the cookies are httpOnly, so there's nothing local left to clear on failure
  }
}
