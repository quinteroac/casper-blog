/**
 * Gist configuration from environment.
 * GIST_IDS: comma-separated list of GitHub Gist IDs.
 */

const GIST_IDS_ENV = process.env.GIST_IDS ?? "";
export const GIST_IDS = GIST_IDS_ENV
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);
