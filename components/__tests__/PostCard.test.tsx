import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostCard } from "../PostCard";
import type { Post } from "@/lib/types";

describe("PostCard", () => {
  const post: Post = {
    slug: "my-first-post",
    title: "My First Post",
    date: "2025-02-20T12:00:00Z",
    preview: "A short preview of the post content.",
    gistId: "abc123",
    filename: "my-first-post.md",
  };

  describe("US-001-AC02: Each list item shows title and preview or date", () => {
    it("renders post title", () => {
      render(<PostCard post={post} />);
      expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
        "My First Post"
      );
    });

    it("renders formatted date", () => {
      render(<PostCard post={post} />);
      expect(screen.getByText(/Feb.*20.*2025/)).toBeTruthy();
    });

    it("renders preview when present", () => {
      render(<PostCard post={post} />);
      expect(screen.getByText(/A short preview/)).toBeTruthy();
    });
  });

  describe("US-001-AC04: Clicking navigates to full post view", () => {
    it("links to /posts/[slug]", () => {
      render(<PostCard post={post} />);
      const link = screen.getByRole("link");
      expect(link.getAttribute("href")).toBe("/posts/my-first-post");
    });
  });
});
