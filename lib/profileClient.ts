/**
 * GitHub profile API client.
 * Fetches profile README (username/username repo) or user profile fields
 * for the About Me section.
 */

const GITHUB_API_BASE = "https://api.github.com";

export interface ProfileFields {
  avatarUrl: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  username: string;
}

export type AboutMeContent =
  | { type: "readme"; markdown: string }
  | { type: "profile"; fields: ProfileFields }
  | null;

interface ReadmeResponse {
  content?: string;
  encoding?: string;
}

interface UserResponse {
  avatar_url?: string;
  name?: string | null;
  bio?: string | null;
  location?: string | null;
  blog?: string | null;
  login?: string;
}

/**
 * Fetches the profile README from the username/username repo.
 * Returns markdown string or null if not found or empty.
 */
export async function fetchProfileReadme(
  username: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${encodeURIComponent(username)}/${encodeURIComponent(username)}/readme`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as ReadmeResponse;
    if (!data.content || data.encoding !== "base64") return null;
    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    return decoded.trim().length > 0 ? decoded : null;
  } catch {
    return null;
  }
}

/**
 * Fetches user profile from GitHub Users API.
 * Returns profile fields or null on failure.
 */
export async function fetchUserProfile(
  username: string
): Promise<ProfileFields | null> {
  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as UserResponse;
    const blog = data.blog?.trim();
    return {
      avatarUrl: data.avatar_url ?? `https://github.com/${username}.png`,
      name: data.name?.trim() || null,
      bio: data.bio?.trim() || null,
      location: data.location?.trim() || null,
      website: blog && blog.length > 0 ? blog : null,
      username: data.login ?? username,
    };
  } catch {
    return null;
  }
}

/**
 * Returns content for the About Me section.
 * Tries profile README first; falls back to account profile fields.
 * Returns null if neither yields content (section should be omitted).
 */
export async function fetchAboutMeContent(
  username: string
): Promise<AboutMeContent> {
  const readme = await fetchProfileReadme(username);
  if (readme && readme.length > 0) {
    return { type: "readme", markdown: readme };
  }

  const profile = await fetchUserProfile(username);
  if (!profile) return null;

  return { type: "profile", fields: profile };
}
