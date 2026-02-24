import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchGist,
  gistToPosts,
  fetchPosts,
  fetchPostContent,
  getPostBySlug,
  fetchPublicGistsForUser,
  fetchPostsFromAccount,
  getGistIdsForAccount,
  createGist,
} from "../gistClient";

describe("gistClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("US-001-AC01: Posts from account (GitHub Gists API)", () => {
    it("fetchPublicGistsForUser fetches from users API (US-001-AC03)", async () => {
      const mockGists = [
        {
          id: "g1",
          files: {
            "my-post.md": {
              filename: "my-post.md",
              type: "text/markdown",
            },
          },
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-02-20T12:00:00Z",
        },
      ];

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockGists,
      } as Response);

      const gists = await fetchPublicGistsForUser("octocat");
      expect(gists).toHaveLength(1);
      expect(gists[0].id).toBe("g1");
      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/users/octocat/gists",
        expect.any(Object)
      );
    });

    it("fetchPostsFromAccount returns posts with title and date (US-001-AC02)", async () => {
      const mockGists = [
        {
          id: "g1",
          files: {
            "hello-world.md": {
              filename: "hello-world.md",
              type: "text/markdown",
            },
          },
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-02-20T12:00:00Z",
        },
      ];

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockGists,
      } as Response);

      const posts = await fetchPostsFromAccount("octocat");
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe("hello world");
      expect(posts[0].date).toBe("2025-02-20T12:00:00Z");
      expect(posts[0].slug).toBe("hello-world");
      expect(posts[0].gistId).toBe("g1");
    });

    it("fetchPostsFromAccount returns empty array when account has no Gists (US-001-AC04)", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      const posts = await fetchPostsFromAccount("emptyuser");
      expect(posts).toEqual([]);
    });

    it("fetchPublicGistsForUser returns empty array when API fails", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
      } as Response);

      const gists = await fetchPublicGistsForUser("baduser");
      expect(gists).toEqual([]);
    });

    it("getGistIdsForAccount returns gist IDs for account", async () => {
      const mockGists = [
        { id: "g1", files: {}, created_at: "", updated_at: "" },
        { id: "g2", files: {}, created_at: "", updated_at: "" },
      ];

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockGists,
      } as Response);

      const ids = await getGistIdsForAccount("octocat");
      expect(ids).toEqual(["g1", "g2"]);
    });
  });

  describe("Posts from configured Gist IDs (fallback)", () => {
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

  describe("US-003: createGist", () => {
    it("US-003-AC01: creates a new Gist via GitHub API with token", async () => {
      const mockResponse = {
        id: "new-gist-123",
        files: { "My-Post.md": { filename: "My-Post.md", type: "text/markdown", content: "# Hello" } },
        created_at: "2026-02-24T10:00:00Z",
        updated_at: "2026-02-24T10:00:00Z",
      };

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await createGist("ghp_token123", "My Post", "# Hello");

      expect(result.id).toBe("new-gist-123");
      expect(result.filename).toBe("My-Post.md");
      expect(result.slug).toBe("my-post");
      expect(result.title).toBe("My Post");
      expect(result.date).toBe("2026-02-24T10:00:00Z");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/gists",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer ghp_token123",
          }),
        })
      );
    });

    it("US-003-AC01: sends correct body with public gist and .md file", async () => {
      const mockResponse = {
        id: "g1",
        files: {},
        created_at: "2026-02-24T10:00:00Z",
        updated_at: "2026-02-24T10:00:00Z",
      };

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await createGist("token", "Test Title", "Content body");

      const callBody = JSON.parse(
        (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].body
      );
      expect(callBody.public).toBe(true);
      expect(callBody.description).toBe("Test Title");
      expect(callBody.files["Test-Title.md"].content).toBe("Content body");
    });

    it("US-003-AC04: throws on API error", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => "Unauthorized",
      } as Response);

      await expect(createGist("bad-token", "Title", "Body")).rejects.toThrow(
        "GitHub API error (401)"
      );
    });

    it("US-003-AC04: throws on network error", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(
        new Error("Network failure")
      );

      await expect(createGist("token", "Title", "Body")).rejects.toThrow(
        "Network failure"
      );
    });
  });
});
