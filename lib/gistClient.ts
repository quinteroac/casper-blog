/**
 * GitHub Gist API client.
 * Fetches post metadata from configured Gist(s).
 */

import type { Post } from "./types";

interface GistFile {
  filename: string;
  type: string;
  content?: string;
}

interface GistResponse {
  id: string;
  files: Record<string, GistFile>;
  created_at: string;
  updated_at: string;
}

interface GistListFile {
  filename: string;
  type: string;
}

interface GistListResponse {
  id: string;
  files: Record<string, GistListFile>;
  created_at: string;
  updated_at: string;
}

const GITHUB_API_BASE = "https://api.github.com";

const PREVIEW_LENGTH = 120;

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/i, "").replace(/\s+/g, "-").toLowerCase();
}

function titleFromFilename(filename: string): string {
  return filename.replace(/\.md$/i, "").replace(/-/g, " ");
}

function extractPreview(content: string): string {
  const plain = content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/[*_`[\]()]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (plain.length <= PREVIEW_LENGTH) return plain;
  return plain.slice(0, PREVIEW_LENGTH) + "…";
}

export async function fetchGist(gistId: string): Promise<GistResponse | null> {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as GistResponse;
  } catch {
    return null;
  }
}

export async function fetchPublicGistsForUser(
  username: string
): Promise<GistListResponse[]> {
  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/gists`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    return (await res.json()) as GistListResponse[];
  } catch {
    return [];
  }
}

function gistListToPosts(gists: GistListResponse[]): Post[] {
  const posts: Post[] = [];

  for (const gist of gists) {
    const updatedAt = gist.updated_at;

    for (const file of Object.values(gist.files)) {
      if (!file.filename.toLowerCase().endsWith(".md")) continue;
      const slug = slugFromFilename(file.filename);
      const title = titleFromFilename(file.filename);

      posts.push({
        slug,
        title,
        date: updatedAt,
        preview: "",
        gistId: gist.id,
        filename: file.filename,
      });
    }
  }

  return posts;
}

export async function fetchPostsFromAccount(
  username: string
): Promise<Post[]> {
  const gists = await fetchPublicGistsForUser(username);
  const posts = gistListToPosts(gists);
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getGistIdsForAccount(username: string): Promise<string[]> {
  const gists = await fetchPublicGistsForUser(username);
  return gists.map((g) => g.id);
}

export function gistToPosts(gist: GistResponse): Post[] {
  const posts: Post[] = [];
  const updatedAt = gist.updated_at;

  for (const file of Object.values(gist.files)) {
    if (!file.filename.toLowerCase().endsWith(".md")) continue;
    const slug = slugFromFilename(file.filename);
    const title = titleFromFilename(file.filename);
    const content = file.content ?? "";
    const preview = extractPreview(content);

    posts.push({
      slug,
      title,
      date: updatedAt,
      preview,
      gistId: gist.id,
      filename: file.filename,
    });
  }

  return posts;
}

export async function fetchPosts(gistIds: string[]): Promise<Post[]> {
  const allPosts: Post[] = [];

  for (const id of gistIds) {
    const gist = await fetchGist(id);
    if (gist) allPosts.push(...gistToPosts(gist));
  }

  return allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function fetchPostContent(
  gistId: string,
  filename: string
): Promise<string | null> {
  const gist = await fetchGist(gistId);
  if (!gist) return null;
  const file = gist.files[filename];
  if (!file?.content) return null;
  return file.content;
}

export interface PostWithContent extends Post {
  content: string;
}

export interface CreateGistResult {
  id: string;
  filename: string;
  slug: string;
  title: string;
  date: string;
}

export async function createGist(
  token: string,
  title: string,
  body: string
): Promise<CreateGistResult> {
  const filename = `${title.trim().replace(/\s+/g, "-")}.md`;

  const res = await fetch(`${GITHUB_API_BASE}/gists`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: title.trim(),
      public: true,
      files: {
        [filename]: { content: body },
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(
      `GitHub API error (${res.status}): ${errorBody}`
    );
  }

  const gist = (await res.json()) as GistResponse;
  return {
    id: gist.id,
    filename,
    slug: slugFromFilename(filename),
    title: title.trim(),
    date: gist.created_at,
  };
}

export async function getPostBySlug(
  slug: string,
  gistIds: string[]
): Promise<PostWithContent | null> {
  const posts = await fetchPosts(gistIds);
  const normalizedSlug = slug.toLowerCase();
  const post = posts.find((p) => p.slug === normalizedSlug);
  if (!post) return null;

  const content = await fetchPostContent(post.gistId, post.filename);
  if (content === null) return null;

  return { ...post, content };
}
