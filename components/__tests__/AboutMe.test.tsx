import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutMe } from "../AboutMe";

describe("AboutMe", () => {
  describe("US-001-AC01: About Me section", () => {
    it("renders 'About Me' heading", () => {
      render(
        <AboutMe
          username="octocat"
          content={{ type: "readme", markdown: "# Hello" }}
        />
      );
      expect(
        screen.getByRole("heading", { name: "About Me" })
      ).toBeInTheDocument();
    });

    it("US-001-AC01: when readme mode, a profile image is visible in the About Me block", () => {
      render(
        <AboutMe
          username="myuser"
          content={{ type: "readme", markdown: "# Hello" }}
        />
      );
      const img = screen.getByRole("img", { name: "Avatar for myuser" });
      expect(img).toBeInTheDocument();
    });

    it("US-001-AC02: in readme mode image URL is derived from GitHub username (github.com/username.png)", () => {
      render(
        <AboutMe
          username="ghuser"
          content={{ type: "readme", markdown: "# Hi" }}
        />
      );
      const img = screen.getByRole("img", { name: "Avatar for ghuser" });
      expect(img).toHaveAttribute("src", "https://github.com/ghuser.png");
    });

    it("US-001-AC03: avatar uses username from prop (no hardcoded URL)", () => {
      render(
        <AboutMe
          username="config-username"
          content={{ type: "readme", markdown: "# Hi" }}
        />
      );
      const img = screen.getByRole("img", {
        name: "Avatar for config-username",
      });
      expect(img).toHaveAttribute(
        "src",
        "https://github.com/config-username.png"
      );
    });

    it("renders README content as markdown", () => {
      render(
        <AboutMe
          username="octocat"
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
          username="jane"
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
          username="minimal"
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

    it("US-003-AC02: fallback renders at minimum avatar and display name", () => {
      render(
        <AboutMe
          username="alice"
          content={{
            type: "profile",
            fields: {
              avatarUrl: "https://example.com/av.png",
              name: "Alice",
              bio: null,
              location: null,
              website: null,
              username: "alice",
            },
          }}
        />
      );
      const avatar = screen.getByRole("img", { name: "Avatar for alice" });
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute("src", "https://example.com/av.png");
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("US-003-AC03: optional fields (bio, location, website) shown when present", () => {
      render(
        <AboutMe
          username="bob"
          content={{
            type: "profile",
            fields: {
              avatarUrl: "https://example.com/av.png",
              name: "Bob",
              bio: "Dev at Acme",
              location: "NYC",
              website: "https://bob.dev",
              username: "bob",
            },
          }}
        />
      );
      expect(screen.getByText("Dev at Acme")).toBeInTheDocument();
      expect(screen.getByText(/NYC/)).toBeInTheDocument();
      const link = screen.getByRole("link", { name: "https://bob.dev" });
      expect(link).toHaveAttribute("href", "https://bob.dev");
    });

    it("adds https to website when missing", () => {
      render(
        <AboutMe
          username="user"
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

    describe("US-002: Profile photo from GitHub profile", () => {
      it("US-002-AC01: in readme mode photo is avatar for GitHub user from gist username", () => {
        render(
          <AboutMe
            username="gist-username"
            content={{ type: "readme", markdown: "# Hi" }}
          />
        );
        const img = screen.getByRole("img", {
          name: "Avatar for gist-username",
        });
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute(
          "src",
          "https://github.com/gist-username.png"
        );
      });

      it("US-002-AC01: in profile mode photo is avatar for same GitHub user (fields from that user)", () => {
        render(
          <AboutMe
            username="gist-account"
            content={{
              type: "profile",
              fields: {
                avatarUrl: "https://avatars.githubusercontent.com/u/99",
                name: "Author",
                bio: null,
                location: null,
                website: null,
                username: "gist-account",
              },
            }}
          />
        );
        const img = screen.getByRole("img", {
          name: "Avatar for gist-account",
        });
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", "https://avatars.githubusercontent.com/u/99");
      });

      it("US-002-AC02: in profile mode avatar URL from profile data (avatar_url or fallback) is used", () => {
        render(
          <AboutMe
            username="johndoe"
            content={{
              type: "profile",
              fields: {
                avatarUrl: "https://avatars.github.com/johndoe",
                name: "John",
                bio: null,
                location: null,
                website: null,
                username: "johndoe",
              },
            }}
          />
        );
        const img = screen.getByRole("img", { name: "Avatar for johndoe" });
        expect(img).toHaveAttribute("src", "https://avatars.github.com/johndoe");
      });

      it("US-002-AC02: in readme mode URL is built from gist username when no profile fetch", () => {
        render(
          <AboutMe
            username="readme-user"
            content={{ type: "readme", markdown: "# Hello" }}
          />
        );
        const img = screen.getByRole("img", {
          name: "Avatar for readme-user",
        });
        expect(img).toHaveAttribute(
          "src",
          "https://github.com/readme-user.png"
        );
      });
    });
  });
});
