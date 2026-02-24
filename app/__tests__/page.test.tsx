import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../page";

vi.mock("@/lib/gistClient", () => ({
  fetchPosts: vi.fn(),
  fetchPostsFromAccount: vi.fn(),
}));

vi.mock("@/lib/profileClient", () => ({
  fetchAboutMeContent: vi.fn(),
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
const { fetchAboutMeContent } = await import("@/lib/profileClient");

describe("HomePage", () => {
  beforeEach(() => {
    vi.mocked(fetchPostsFromAccount).mockResolvedValue([]);
    vi.mocked(fetchPosts).mockResolvedValue([]);
    vi.mocked(fetchAboutMeContent).mockResolvedValue(null);
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

    it("US-001-AC01: renders author avatar on post list page", async () => {
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

      // Avatar should be rendered (img with GitHub URL derived from GIST_ACCOUNT)
      const avatars = screen.getAllByRole("img", { name: /avatar for octocat/i });
      expect(avatars.length).toBeGreaterThanOrEqual(1);
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

  describe("US-001-AC01: About Me section on home page", () => {
    it("renders About Me section above post list when GIST_ACCOUNT and content available", async () => {
      testConfig.GIST_ACCOUNT = "octocat";
      testConfig.GIST_IDS = [];
      vi.mocked(fetchAboutMeContent).mockResolvedValueOnce({
        type: "readme",
        markdown: "# Hi there\n\nWelcome to my blog.",
      });
      vi.mocked(fetchPostsFromAccount).mockResolvedValueOnce([
        {
          slug: "my-post",
          title: "My Post",
          date: "2025-02-20T12:00:00Z",
          preview: "Preview",
          gistId: "g1",
          filename: "my-post.md",
        },
      ]);

      const Page = await HomePage();
      render(Page);

      expect(
        screen.getByRole("heading", { name: "About Me" })
      ).toBeInTheDocument();
      expect(screen.getByText("Hi there")).toBeInTheDocument();
      expect(screen.getByText("My Post")).toBeInTheDocument();
    });

    it("US-002-AC01: uses username from GIST_ACCOUNT config for About Me fetch (no hardcoded username)", async () => {
      testConfig.GIST_ACCOUNT = "my-github-user";
      testConfig.GIST_IDS = [];
      vi.mocked(fetchAboutMeContent).mockResolvedValueOnce(null);
      vi.mocked(fetchPostsFromAccount).mockResolvedValueOnce([]);

      const Page = await HomePage();
      render(Page);

      expect(fetchAboutMeContent).toHaveBeenCalledWith("my-github-user");
    });

    it("US-001-AC03: omits About Me section when no content — page does not break", async () => {
      testConfig.GIST_ACCOUNT = "octocat";
      vi.mocked(fetchAboutMeContent).mockResolvedValueOnce(null);
      vi.mocked(fetchPostsFromAccount).mockResolvedValueOnce([]);

      const Page = await HomePage();
      render(Page);

      expect(screen.queryByRole("heading", { name: "About Me" })).toBeNull();
      expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
    });

    it("renders profile fallback when README not available", async () => {
      testConfig.GIST_ACCOUNT = "octocat";
      vi.mocked(fetchAboutMeContent).mockResolvedValueOnce({
        type: "profile",
        fields: {
          avatarUrl: "https://avatars.github.com/octocat",
          name: "The Octocat",
          bio: "There once was...",
          location: "San Francisco",
          website: "https://octocat.github.io",
          username: "octocat",
        },
      });
      vi.mocked(fetchPostsFromAccount).mockResolvedValueOnce([]);

      const Page = await HomePage();
      render(Page);

      expect(
        screen.getByRole("heading", { name: "About Me" })
      ).toBeInTheDocument();
      expect(screen.getByText("The Octocat")).toBeInTheDocument();
      expect(screen.getByText("There once was...")).toBeInTheDocument();
    });

    it("omits About Me when GIST_ACCOUNT not set (GIST_IDS only)", async () => {
      testConfig.GIST_ACCOUNT = "";
      testConfig.GIST_IDS = ["gist1"];
      vi.mocked(fetchPosts).mockResolvedValueOnce([]);

      const Page = await HomePage();
      render(Page);

      expect(screen.queryByRole("heading", { name: "About Me" })).toBeNull();
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
      // US-001-AC06: fallback shown when GIST_ACCOUNT missing (no error thrown)
      expect(screen.getByText("?")).toBeInTheDocument();
    });

    it("shows empty list when account has no public Gists (no error)", async () => {
      testConfig.GIST_ACCOUNT = "emptyuser";
      testConfig.GIST_IDS = [];
      vi.mocked(fetchPostsFromAccount).mockResolvedValueOnce([]);

      const Page = await HomePage();
      render(Page);

      expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
      // Avatar is shown even in empty state (derived from GIST_ACCOUNT)
      expect(
        screen.getByRole("img", { name: /avatar for emptyuser/i })
      ).toBeInTheDocument();
    });
  });
});
