import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchGist,
  gistToPosts,
  fetchPosts,
  fetchPostContent,
  getPostBySlug,
} from "../gistClient";

describe("gistClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("US-001-AC01: Posts are fetched from configured Gist", () => {
    it("TC-001-01: Gist client fetches metadata from configured Gist ID", async () => {
      const mockGist = {
        id: "configured-gist-id",
        files: {
          "my-post.md": {
            filename: "my-post.md",
            type: "text/markdown",
            content: "# My Post\n\nHello world.",
          },
        },
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-02-01T00:00:00Z",
      };

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockGist,
      } as Response);

      const posts = await fetchPosts(["configured-gist-id"]);
      expect(posts).toHaveLength(1);
      expect(posts[0].slug).toBe("my-post");
      expect(posts[0].title).toBe("my post");
      expect(posts[0].date).toBe("2025-02-01T00:00:00Z");
      expect(posts[0].gistId).toBe("configured-gist-id");
    });

    it("fetchGist returns gist data when API succeeds", async () => {
      const mockGist = {
        id: "abc123",
        files: {
          "my-post.md": {
            filename: "my-post.md",
            type: "text/markdown",
            content: "# My Post\n\nHello world.",
          },
        },
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-02-01T00:00:00Z",
      };

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockGist,
      } as Response);

      const result = await fetchGist("abc123");
      expect(result).not.toBeNull();
      expect(result?.id).toBe("abc123");
      expect(result?.files["my-post.md"]).toBeDefined();
    });

    it("fetchGist returns null when API fails", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
      } as Response);

      const result = await fetchGist("bad-id");
      expect(result).toBeNull();
    });

    it("fetchPosts returns posts from multiple gists", async () => {
      const mockGist1 = {
        id: "g1",
        files: {
          "post-a.md": {
            filename: "post-a.md",
            type: "text/markdown",
            content: "# Post A",
          },
        },
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-15T00:00:00Z",
      };
      const mockGist2 = {
        id: "g2",
        files: {
          "post-b.md": {
            filename: "post-b.md",
            type: "text/markdown",
            content: "# Post B",
          },
        },
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-02-01T00:00:00Z",
      };

      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGist1,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGist2,
        } as Response);

      const posts = await fetchPosts(["g1", "g2"]);
      expect(posts).toHaveLength(2);
      expect(posts.map((p) => p.slug)).toContain("post-a");
      expect(posts.map((p) => p.slug)).toContain("post-b");
    });

    it("fetchPosts returns empty array when no gist IDs provided", async () => {
      const posts = await fetchPosts([]);
      expect(posts).toEqual([]);
    });
  });

  describe("US-001-AC02: Each list item shows title and preview or date", () => {
    it("gistToPosts extracts title, date, and preview from gist file", () => {
      const gist = {
        id: "g1",
        files: {
          "hello-world.md": {
            filename: "hello-world.md",
            type: "text/markdown",
            content:
              "# Hello World\n\nThis is a short preview of the post content here.",
          },
        },
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-02-20T12:00:00Z",
      };

      const posts = gistToPosts(gist as Parameters<typeof gistToPosts>[0]);
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe("hello world");
      expect(posts[0].date).toBe("2025-02-20T12:00:00Z");
      expect(posts[0].preview).toContain("short preview");
    });
  });

  describe("US-001-AC03: List is ordered by date, newest first", () => {
    it("fetchPosts sorts posts from multiple gists by date descending", async () => {
      const gist1 = {
        id: "g1",
        files: {
          "first.md": {
            filename: "first.md",
            type: "text/markdown",
            content: "First",
          },
        },
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-10T00:00:00Z",
      };
      const gist2 = {
        id: "g2",
        files: {
          "second.md": {
            filename: "second.md",
            type: "text/markdown",
            content: "Second",
          },
        },
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-02-15T00:00:00Z",
      };

      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          json: async () => gist1,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => gist2,
        } as Response);

      const posts = await fetchPosts(["g1", "g2"]);
      expect(posts[0].slug).toBe("second");
      expect(posts[1].slug).toBe("first");
    });
  });

  describe("US-001-AC04: Clicking navigates to full post view", () => {
    it("Post slug is used to build /posts/[slug] path", () => {
      const gist = {
        id: "g1",
        files: {
          "my-awesome-post.md": {
            filename: "my-awesome-post.md",
            type: "text/markdown",
            content: "Content",
          },
        },
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-02-20T00:00:00Z",
      };

      const posts = gistToPosts(gist as Parameters<typeof gistToPosts>[0]);
      expect(posts[0].slug).toBe("my-awesome-post");
    });
  });

  describe("US-002-AC01: Full post content is loaded from the corresponding Gist file", () => {
    it("fetchPostContent returns file content when gist and file exist", async () => {
      const mockGist = {
        id: "abc123",
        files: {
          "my-post.md": {
            filename: "my-post.md",
            type: "text/markdown",
            content: "# My Post\n\nFull content here.",
          },
        },
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-02-01T00:00:00Z",
      };

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockGist,
      } as Response);

      const content = await fetchPostContent("abc123", "my-post.md");
      expect(content).toBe("# My Post\n\nFull content here.");
    });

    it("fetchPostContent returns null when gist fetch fails", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
      } as Response);

      const content = await fetchPostContent("bad-id", "missing.md");
      expect(content).toBeNull();
    });

    it("fetchPostContent returns null when file does not exist in gist", async () => {
      const mockGist = {
        id: "abc123",
        files: {
          "other-post.md": {
            filename: "other-post.md",
            type: "text/markdown",
            content: "Other",
          },
        },
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-02-01T00:00:00Z",
      };

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockGist,
      } as Response);

      const content = await fetchPostContent("abc123", "my-post.md");
      expect(content).toBeNull();
    });

    it("getPostBySlug returns post with content when slug matches", async () => {
      const mockGist = {
        id: "g1",
        files: {
          "hello-world.md": {
            filename: "hello-world.md",
            type: "text/markdown",
            content: "# Hello World\n\nThis is the full post body.",
          },
        },
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-02-20T12:00:00Z",
      };

      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGist,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGist,
        } as Response);

      const result = await getPostBySlug("hello-world", ["g1"]);
      expect(result).not.toBeNull();
      expect(result?.title).toBe("hello world");
      expect(result?.content).toBe(
        "# Hello World\n\nThis is the full post body."
      );
    });

    it("getPostBySlug returns null when slug does not match any post", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({
          id: "g1",
          files: {},
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-02-20T00:00:00Z",
        }),
      } as Response);

      const result = await getPostBySlug("nonexistent", ["g1"]);
      expect(result).toBeNull();
    });
  });
});
