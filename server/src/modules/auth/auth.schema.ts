import { z } from "zod";

export const googleOAuthSchema = z.object({
  code: z.string().min(1),
  redirectUri: z.string().url(),
});

export const githubOAuthSchema = z.object({
  code: z.string().min(1),
  redirectUri: z.string().url(),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

export type GoogleOAuthInput = z.infer<typeof googleOAuthSchema>;
export type GithubOAuthInput = z.infer<typeof githubOAuthSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
