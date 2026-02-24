import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PostPage from "../page";

vi.mock("@/lib/gistClient", () => ({
  getPostBySlug: vi.fn(),
}));

vi.mock("@/config/gist", () => ({
  GIST_IDS: ["g1"],
}));

const { getPostBySlug } = await import("@/lib/gistClient");

describe("PostPage", () => {
  beforeEach(() => {
    vi.mocked(getPostBySlug).mockReset();
  });

  describe("US-002-AC03: Post title is displayed", () => {
    it("displays the post title when post is found", async () => {
      vi.mocked(getPostBySlug).mockResolvedValueOnce({
        slug: "my-post",
        title: "My Awesome Post",
        date: "2025-02-20T12:00:00Z",
        preview: "Preview",
        gistId: "g1",
        filename: "my-post.md",
        content: "# My Awesome Post\n\nContent here.",
      });

      const Page = await PostPage({
        params: Promise.resolve({ slug: "my-post" }),
      });
      render(Page);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "My Awesome Post"
      );
    });
  });

  describe("US-002-AC04: User can return to the list (e.g. back link or navigation)", () => {
    it("renders a back link to the home page", async () => {
      vi.mocked(getPostBySlug).mockResolvedValueOnce({
        slug: "my-post",
        title: "My Post",
        date: "2025-02-20T12:00:00Z",
        preview: "Preview",
        gistId: "g1",
        filename: "my-post.md",
        content: "Content",
      });

      const Page = await PostPage({
        params: Promise.resolve({ slug: "my-post" }),
      });
      render(Page);

      const backLink = screen.getByRole("link", { name: /back to list/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "/");
    });

    it("renders back link even when post is not found", async () => {
      vi.mocked(getPostBySlug).mockResolvedValueOnce(null);

      const Page = await PostPage({
        params: Promise.resolve({ slug: "nonexistent" }),
      });
      render(Page);

      const backLink = screen.getByRole("link", { name: /back to list/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "/");
    });
  });

  describe("US-002-AC01: Full post content is loaded", () => {
    it("renders post content via PostContent when post is found", async () => {
      vi.mocked(getPostBySlug).mockResolvedValueOnce({
        slug: "my-post",
        title: "My Post",
        date: "2025-02-20T12:00:00Z",
        preview: "Preview",
        gistId: "g1",
        filename: "my-post.md",
        content: "**Bold** and _italic_ text.",
      });

      const Page = await PostPage({
        params: Promise.resolve({ slug: "my-post" }),
      });
      render(Page);

      expect(screen.getByText("Bold")).toBeInTheDocument();
      expect(screen.getByText("italic")).toBeInTheDocument();
    });
  });
});
