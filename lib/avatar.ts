/**
 * Avatar utilities for GitHub profile pictures.
 * URL is derived from GIST_ACCOUNT (GitHub username) - no hardcoded URLs.
 * @see https://docs.github.com/en/rest/users/users
 */

/**
 * Builds the GitHub avatar URL for a given username.
 * Uses GitHub's standard avatar endpoint; profile picture changes are reflected automatically.
 */
export function getGitHubAvatarUrl(username: string): string {
  return `https://github.com/${encodeURIComponent(username)}.png`;
}

/**
 * Returns the fallback character for the avatar: first letter of username, or "?" when missing.
 */
export function getAvatarFallbackLetter(account: string | undefined): string {
  if (!account || account.trim().length === 0) {
    return "?";
  }
  const first = account.trim()[0];
  return first ? first.toUpperCase() : "?";
}
