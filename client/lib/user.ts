import { apiFetch, type AuthUser } from "@/lib/auth";

export interface CompleteOnboardingInput {
  name: string;
  interests: string[];
  contentTypes: string[];
  organizeMode: "auto" | "manual";
}

export async function completeOnboarding(input: CompleteOnboardingInput): Promise<AuthUser> {
  const { user } = await apiFetch<{ user: AuthUser }>("/users/me/onboarding", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return user;
}
