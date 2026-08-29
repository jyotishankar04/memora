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
 * Thrown by apiFetch/apiFetchRaw. `status` is 0 for a request that never got
 * a response at all (server unreachable — e.g. mid dev-server-restart), so
 * callers can tell "genuinely unauthorized" (status 401) apart from a
 * transient network hiccup instead of treating both the same way.
 */
export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Calls the Memora API with the httpOnly auth cookies attached, and unwraps
 * the {success,data,meta,error} envelope. The backend owns the access/refresh
 * tokens entirely — this client never reads or stores them itself.
 */
export async function apiFetchRaw<T>(
  path: string,
  options: RequestInit = {},
): Promise<{ data: T; meta: Record<string, unknown> }> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("Couldn't reach the server. Please check your connection.", 0);
  }

  if (response.status === 204) {
    return { data: undefined as T, meta: {} };
  }

  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    throw new ApiError(
      body?.error?.message ?? "Something went wrong. Please try again.",
      response.status,
      body?.error?.code,
    );
  }

  return { data: body.data as T, meta: body.meta ?? {} };
}

/** Same as {@link apiFetchRaw}, but discards `meta` for callers that only need the payload. */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { data } = await apiFetchRaw<T>(path, options);
  return data;
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
