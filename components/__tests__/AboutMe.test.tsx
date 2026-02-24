import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutMe } from "../AboutMe";

describe("AboutMe", () => {
  describe("US-001-AC01: About Me section", () => {
    it("renders 'About Me' heading", () => {
      render(
        <AboutMe content={{ type: "readme", markdown: "# Hello" }} />
      );
      expect(
        screen.getByRole("heading", { name: "About Me" })
      ).toBeInTheDocument();
    });

    it("renders README content as markdown", () => {
      render(
        <AboutMe
          content={{
            type: "readme",
            markdown: "# Hello\n\nI am the author.",
          }}
        />
      );
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("I am the author.")).toBeInTheDocument();
    });

    it("renders profile fields fallback (avatar, name, bio, location, website)", () => {
      render(
        <AboutMe
          content={{
            type: "profile",
            fields: {
              avatarUrl: "https://example.com/avatar.png",
              name: "Jane Doe",
              bio: "Software developer",
              location: "Berlin",
              website: "https://jane.dev",
              username: "jane",
            },
          }}
        />
      );
      expect(
        screen.getByRole("heading", { name: "About Me" })
      ).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("Software developer")).toBeInTheDocument();
      expect(screen.getByText(/Berlin/)).toBeInTheDocument();
      const link = screen.getByRole("link", { name: "https://jane.dev" });
      expect(link).toHaveAttribute("href", "https://jane.dev");
    });

    it("renders profile with only username when other fields are empty", () => {
      render(
        <AboutMe
          content={{
            type: "profile",
            fields: {
              avatarUrl: "https://example.com/avatar.png",
              name: null,
              bio: null,
              location: null,
              website: null,
              username: "minimal",
            },
          }}
        />
      );
      expect(screen.getByText("minimal")).toBeInTheDocument();
    });

    it("adds https to website when missing", () => {
      render(
        <AboutMe
          content={{
            type: "profile",
            fields: {
              avatarUrl: "https://example.com/avatar.png",
              name: "User",
              bio: null,
              location: null,
              website: "example.com",
              username: "user",
            },
          }}
        />
      );
      const link = screen.getByRole("link", { name: "example.com" });
      expect(link).toHaveAttribute("href", "https://example.com");
    });
  });
});
