"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, AlertCircle } from "lucide-react";
import { consumeOAuthState, exchangeOAuthCode, saveTokens, type OAuthProvider } from "@/lib/auth";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const params = useParams<{ provider: string }>();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function completeOAuthLogin() {
      const provider = params.provider;
      if (provider !== "google" && provider !== "github") {
        setError("Unknown sign in provider.");
        return;
      }

      if (searchParams.get("error")) {
        setError("Sign in was cancelled or denied.");
        return;
      }

      const code = searchParams.get("code");
      if (!code) {
        setError("Missing authorization code.");
        return;
      }

      if (!consumeOAuthState(searchParams.get("state"))) {
        setError("Sign in session expired. Please try again.");
        return;
      }

      try {
        const { tokens, user } = await exchangeOAuthCode(provider as OAuthProvider, code);
        if (cancelled) return;
        saveTokens(tokens);
        router.replace(user.onboardingCompleted ? "/app" : "/onboard");
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
      }
    }

    completeOAuthLogin();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground px-4 text-center">
        <AlertCircle className="h-6 w-6 text-destructive" />
        <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
        <Link href="/auth/login" className="text-sm text-primary hover:underline font-semibold">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Sparkles className="h-5 w-5 text-primary animate-pulse" />
    </div>
  );
}
