import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../page";

vi.mock("@/lib/gistClient", () => ({
  fetchPosts: vi.fn(),
  fetchPostsFromAccount: vi.fn(),
}));

const testConfig = { GIST_ACCOUNT: "", GIST_IDS: [] as string[] };
vi.mock("@/config/gist", () => ({
  get GIST_ACCOUNT() {
    return testConfig.GIST_ACCOUNT;
  },
  get GIST_IDS() {
    return testConfig.GIST_IDS;
  },
}));

vi.mock("@/config/env", () => ({
  isGistSourceConfigured: () =>
    testConfig.GIST_ACCOUNT.length > 0 || testConfig.GIST_IDS.length > 0,
}));

const { fetchPosts, fetchPostsFromAccount } = await import("@/lib/gistClient");

describe("HomePage", () => {
  beforeEach(() => {
    vi.mocked(fetchPostsFromAccount).mockResolvedValue([]);
    vi.mocked(fetchPosts).mockResolvedValue([]);
    testConfig.GIST_ACCOUNT = "";
    testConfig.GIST_IDS = [];
  });

  describe("US-001-AC01: List from account in env", () => {
    it("calls fetchPostsFromAccount and renders posts when GIST_ACCOUNT is set", async () => {
      testConfig.GIST_ACCOUNT = "octocat";
      testConfig.GIST_IDS = [];

      vi.mocked(fetchPostsFromAccount).mockResolvedValueOnce([
        {
          slug: "my-post",
          title: "My Post",
          date: "2025-02-20T12:00:00Z",
          preview: "Preview text",
          gistId: "g1",
          filename: "my-post.md",
        },
      ]);

      const Page = await HomePage();
      render(Page);

      expect(fetchPostsFromAccount).toHaveBeenCalledWith("octocat");
      expect(fetchPosts).not.toHaveBeenCalled();
      expect(screen.getByText("My Post")).toBeInTheDocument();
      expect(screen.getByText(/Feb 20, 2025/)).toBeInTheDocument();
    });
  });

  describe("US-001-AC02: Each list item displays metadata", () => {
    it("shows title and date for each post", async () => {
      testConfig.GIST_ACCOUNT = "octocat";
      vi.mocked(fetchPostsFromAccount).mockResolvedValueOnce([
        {
          slug: "hello-world",
          title: "hello world",
          date: "2025-01-15T00:00:00Z",
          preview: "",
          gistId: "abc",
          filename: "hello-world.md",
        },
      ]);

      const Page = await HomePage();
      render(Page);

      expect(screen.getByText("hello world")).toBeInTheDocument();
      expect(screen.getByText(/Jan 15, 2025/)).toBeInTheDocument();
    });
  });

  describe("US-001-AC04: Empty list when no Gists", () => {
    it("shows empty state when no account and no GIST_IDS", async () => {
      testConfig.GIST_ACCOUNT = "";
      testConfig.GIST_IDS = [];

      const Page = await HomePage();
      render(Page);

      expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Set GIST_ACCOUNT or GIST_IDS in your Vercel/i)
      ).toBeInTheDocument();
    });

    it("shows empty list when account has no public Gists (no error)", async () => {
      testConfig.GIST_ACCOUNT = "emptyuser";
      testConfig.GIST_IDS = [];
      vi.mocked(fetchPostsFromAccount).mockResolvedValueOnce([]);

      const Page = await HomePage();
      render(Page);

      expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
    });
  });
});
