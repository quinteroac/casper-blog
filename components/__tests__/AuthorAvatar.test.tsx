import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthorAvatar } from "../AuthorAvatar";

describe("AuthorAvatar", () => {
  describe("US-001-AC01: Renders author avatar", () => {
    it("renders img with GitHub avatar URL when account is provided", () => {
      render(<AuthorAvatar account="octocat" />);
      const img = screen.getByRole("img", { name: /avatar for octocat/i });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://github.com/octocat.png");
    });
  });

  describe("US-001-AC05: Fallback when avatar fails to load", () => {
    it("shows fallback (first letter) when img onError fires", () => {
      render(<AuthorAvatar account="octocat" />);
      const img = screen.getByRole("img", { name: /avatar for octocat/i });
      expect(img).toBeInTheDocument();

      // Simulate image load failure
      fireEvent.error(img);

      // Fallback should show first letter - broken image must never be displayed
      expect(screen.getByText("O")).toBeInTheDocument();
    });
  });

  describe("US-001-AC06: Fallback when GIST_ACCOUNT missing or empty", () => {
    it("shows fallback (?) when account is undefined", () => {
      render(<AuthorAvatar account={undefined} />);
      expect(screen.getByText("?")).toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("shows fallback (?) when account is empty string", () => {
      render(<AuthorAvatar account="" />);
      expect(screen.getByText("?")).toBeInTheDocument();
    });

    it("does not throw when account is missing", () => {
      expect(() => render(<AuthorAvatar account={undefined} />)).not.toThrow();
    });
  });

  describe("US-001-AC02: Avatar visible without login", () => {
    it("renders avatar/fallback without requiring authentication", () => {
      render(<AuthorAvatar account="testuser" />);
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });

  describe("US-002-AC02: Optional avatarUrl from profile", () => {
    it("uses avatarUrl when provided (e.g. from GitHub API avatar_url)", () => {
      const apiAvatarUrl = "https://avatars.githubusercontent.com/u/1?v=4";
      render(
        <AuthorAvatar account="octocat" avatarUrl={apiAvatarUrl} />
      );
      const img = screen.getByRole("img", { name: /avatar for octocat/i });
      expect(img).toHaveAttribute("src", apiAvatarUrl);
    });

    it("builds URL from account when avatarUrl is not provided", () => {
      render(<AuthorAvatar account="myuser" />);
      const img = screen.getByRole("img", { name: /avatar for myuser/i });
      expect(img).toHaveAttribute("src", "https://github.com/myuser.png");
    });
  });
});
