/**
 * Environment variable validation for Vercel deployment.
 *
 * Vercel injects env vars configured in the dashboard at both build time
 * and runtime for server-side code. Since all Gist config is consumed in
 * server components / server functions, no NEXT_PUBLIC_ prefix is needed.
 */

import { GIST_ACCOUNT, GIST_IDS } from "./gist";

/** Names of the supported env vars for Gist content source. */
export const GIST_ENV_VARS = [
  "GIST_ACCOUNT",
  "GITHUB_USERNAME",
  "GIST_IDS",
] as const;

/**
 * Returns true when at least one Gist content source is configured
 * (either a GitHub account or explicit Gist IDs).
 */
export function isGistSourceConfigured(): boolean {
  return GIST_ACCOUNT.length > 0 || GIST_IDS.length > 0;
}

/**
 * Validates that the environment has a Gist content source configured.
 * Returns an object with `ok` and an optional `message` describing the issue.
 */
export function validateEnv(): { ok: boolean; message?: string } {
  if (isGistSourceConfigured()) {
    return { ok: true };
  }

  return {
    ok: false,
    message:
      "No Gist content source configured. " +
      "Set GIST_ACCOUNT (or GITHUB_USERNAME) or GIST_IDS in the Vercel dashboard.",
  };
}
