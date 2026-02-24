import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PostPage from "../page";

const mockNotFound = vi.fn();

vi.mock("next/navigation", () => ({
  notFound: () => {
    mockNotFound();
    throw new Error("NEXT_NOT_FOUND");
  },
}));

vi.mock("@/lib/gistClient", () => ({
  getPostBySlug: vi.fn(),
  getGistIdsForAccount: vi.fn(),
}));

vi.mock("@/config/gist", () => ({
  GIST_ACCOUNT: "",
  GIST_IDS: ["g1"],
}));

const { getPostBySlug } = await import("@/lib/gistClient");

describe("PostPage", () => {
  beforeEach(() => {
    vi.mocked(getPostBySlug).mockReset();
    mockNotFound.mockClear();
  });

  describe("US-002-AC01: Post is reachable at /posts/[slug]", () => {
    it("renders post when slug maps to a Gist", async () => {
      vi.mocked(getPostBySlug).mockResolvedValueOnce({
        slug: "hello-world",
        title: "Hello World",
        date: "2025-02-20T12:00:00Z",
        preview: "Preview",
        gistId: "g1",
        filename: "hello-world.md",
        content: "# Hello World\n\nContent here.",
      });

      const Page = await PostPage({
        params: Promise.resolve({ slug: "hello-world" }),
      });
      render(Page);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Hello World"
      );
      expect(screen.getByText("Content here.")).toBeInTheDocument();
    });

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
  });

  describe("US-002-AC02: Correct Gist content rendered as Markdown", () => {
    it("renders post content as Markdown when post is found", async () => {
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

  describe("US-002-AC03: Invalid or unknown slugs return 404", () => {
    it("calls notFound() when slug does not match any post", async () => {
      vi.mocked(getPostBySlug).mockResolvedValueOnce(null);

      await expect(
        PostPage({
          params: Promise.resolve({ slug: "nonexistent" }),
        })
      ).rejects.toThrow("NEXT_NOT_FOUND");

      expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
  });
});
