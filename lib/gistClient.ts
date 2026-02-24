/**
 * GitHub Gist API client.
 * Fetches post metadata from configured Gist(s).
 */

import type { Post } from "./types";

const GIST_API_BASE = "https://api.github.com/gists";

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
    const res = await fetch(`${GIST_API_BASE}/${gistId}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as GistResponse;
  } catch {
    return null;
  }
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
