/**
 * Gist configuration from environment.
 * GIST_ACCOUNT / GITHUB_USERNAME: GitHub username whose public Gists are used as posts.
 * GIST_IDS: (fallback) comma-separated list of GitHub Gist IDs.
 */

const GIST_ACCOUNT_ENV =
  process.env.GIST_ACCOUNT ?? process.env.GITHUB_USERNAME ?? "";
export const GIST_ACCOUNT = GIST_ACCOUNT_ENV.trim();

const GIST_IDS_ENV = process.env.GIST_IDS ?? "";
export const GIST_IDS = GIST_IDS_ENV
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);
