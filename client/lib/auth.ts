const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

const ACCESS_TOKEN_KEY = "memora_token";
const REFRESH_TOKEN_KEY = "memora_refresh_token";
const OAUTH_STATE_KEY = "memora_oauth_state";

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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface OAuthExchangeResult {
  user: AuthUser;
  tokens: AuthTokens;
  isNewUser: boolean;
}

export function saveTokens(tokens: AuthTokens) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/** Calls the Memora API, attaching the stored access token if present, and unwraps the {success,data,error} envelope. */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const accessToken = getAccessToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });

  const body = await response.json();

  if (!response.ok || !body.success) {
    throw new Error(body.error?.message ?? "Something went wrong. Please try again.");
  }

  return body.data as T;
}

function getRedirectUri(provider: OAuthProvider): string {
  return `${window.location.origin}/auth/callback/${provider}`;
}

function createOAuthState(): string {
  const state = crypto.randomUUID();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
  return state;
}

export function consumeOAuthState(receivedState: string | null): boolean {
  const expected = sessionStorage.getItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  return !!expected && !!receivedState && expected === receivedState;
}

export function getGoogleAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
    redirect_uri: getRedirectUri("google"),
    response_type: "code",
    scope: "openid email profile",
    state: createOAuthState(),
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function getGithubAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? "",
    redirect_uri: getRedirectUri("github"),
    scope: "read:user user:email",
    state: createOAuthState(),
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeOAuthCode(provider: OAuthProvider, code: string): Promise<OAuthExchangeResult> {
  return apiFetch<OAuthExchangeResult>(`/auth/oauth/${provider}`, {
    method: "POST",
    body: JSON.stringify({ code, redirectUri: getRedirectUri(provider) }),
  });
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { user } = await apiFetch<{ user: AuthUser }>("/auth/me");
  return user;
}

export async function logout() {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // best-effort — clear local tokens regardless of network failure
    }
  }

  clearTokens();
}
