import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchProfileReadme,
  fetchUserProfile,
  fetchAboutMeContent,
} from "../profileClient";

describe("profileClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchProfileReadme", () => {
    it("US-002-AC02: fetches raw README from raw.githubusercontent.com", async () => {
      const markdown = "# Hi, I'm octocat\n\nWelcome to my blog.";
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        text: async () => markdown,
      } as Response);

      const result = await fetchProfileReadme("octocat");
      expect(result).toBe(markdown);
      expect(fetch).toHaveBeenCalledWith(
        "https://raw.githubusercontent.com/octocat/octocat/HEAD/README.md",
        expect.objectContaining({
          headers: { Accept: "text/plain" },
        })
      );
    });

    it("US-002-AC03: returns markdown when README exists (HTTP 200)", async () => {
      const markdown = "# About Me\n\nHello world.";
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        text: async () => markdown,
      } as Response);

      const result = await fetchProfileReadme("octocat");
      expect(result).toBe("# About Me\n\nHello world.");
    });

    it("returns null when repo does not exist (404)", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
      } as Response);

      const result = await fetchProfileReadme("nonexistent");
      expect(result).toBeNull();
    });

    it("returns null when content is empty", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        text: async () => "   ",
      } as Response);

      const result = await fetchProfileReadme("octocat");
      expect(result).toBeNull();
    });

    it("returns null on fetch error", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchProfileReadme("octocat");
      expect(result).toBeNull();
    });
  });

  describe("fetchUserProfile", () => {
    it("returns profile fields when user exists", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          avatar_url: "https://avatars.github.com/octocat",
          name: "The Octocat",
          bio: "There once was...",
          location: "San Francisco",
          blog: "https://octocat.github.io",
          login: "octocat",
        }),
      } as Response);

      const result = await fetchUserProfile("octocat");
      expect(result).toEqual({
        avatarUrl: "https://avatars.github.com/octocat",
        name: "The Octocat",
        bio: "There once was...",
        location: "San Francisco",
        website: "https://octocat.github.io",
        username: "octocat",
      });
    });

    it("handles null/empty profile fields", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          avatar_url: "https://avatars.github.com/user",
          name: null,
          bio: "",
          location: null,
          blog: null,
          login: "user",
        }),
      } as Response);

      const result = await fetchUserProfile("user");
      expect(result).toEqual({
        avatarUrl: "https://avatars.github.com/user",
        name: null,
        bio: null,
        location: null,
        website: null,
        username: "user",
      });
    });

    it("returns null on fetch error", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchUserProfile("octocat");
      expect(result).toBeNull();
    });
  });

  describe("fetchAboutMeContent", () => {
    it("US-001-AC02: returns readme content when profile README exists", async () => {
      const markdown = "# About Me\n\nHello world.";
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        text: async () => markdown,
      } as Response);

      const result = await fetchAboutMeContent("octocat");
      expect(result).toEqual({ type: "readme", markdown: "# About Me\n\nHello world." });
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("US-001-AC02: falls back to profile fields when README not available", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: false } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            avatar_url: "https://avatars.github.com/octocat",
            name: "Octocat",
            bio: "A curious cat",
            location: "GitHub",
            blog: null,
            login: "octocat",
          }),
        } as Response);

      const result = await fetchAboutMeContent("octocat");
      expect(result).toEqual({
        type: "profile",
        fields: {
          avatarUrl: "https://avatars.github.com/octocat",
          name: "Octocat",
          bio: "A curious cat",
          location: "GitHub",
          website: null,
          username: "octocat",
        },
      });
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("US-001-AC03: returns null when neither source yields content", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: false } as Response)
        .mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchAboutMeContent("octocat");
      expect(result).toBeNull();
    });

    it("US-003-AC01: falls back to api.github.com/users/{username} when README returns non-200", async () => {
      const fetchSpy = vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: false } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            avatar_url: "https://avatars.github.com/johndoe",
            name: "John Doe",
            bio: null,
            location: null,
            blog: null,
            login: "johndoe",
          }),
        } as Response);

      const result = await fetchAboutMeContent("johndoe");

      expect(result).toEqual({
        type: "profile",
        fields: expect.objectContaining({
          name: "John Doe",
          username: "johndoe",
        }),
      });
      expect(fetchSpy).toHaveBeenNthCalledWith(
        2,
        "https://api.github.com/users/johndoe",
        expect.any(Object)
      );
    });

    it("US-003-AC04: returns null when both README and Users API fail — section omitted gracefully", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: false } as Response)
        .mockResolvedValueOnce({ ok: false } as Response);

      const result = await fetchAboutMeContent("nonexistent");
      expect(result).toBeNull();
    });
  });
});
