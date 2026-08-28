import { validate } from "../../shared/middlewares/validate";
import { githubOAuthSchema, googleOAuthSchema, logoutSchema, refreshSchema } from "./auth.schema";

export const validateGoogleOAuth = validate(googleOAuthSchema);
export const validateGithubOAuth = validate(githubOAuthSchema);
export const validateRefresh = validate(refreshSchema);
export const validateLogout = validate(logoutSchema);
