import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchGist,
  gistToPosts,
  fetchPosts,
} from "../gistClient";

describe("gistClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("US-001-AC01: Posts are fetched from configured Gist", () => {
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
});
