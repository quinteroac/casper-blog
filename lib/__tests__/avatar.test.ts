import { describe, it, expect } from "vitest";
import {
  getGitHubAvatarUrl,
  getAvatarFallbackLetter,
} from "../avatar";

describe("getGitHubAvatarUrl", () => {
  it("US-001-AC03: builds avatar URL from username (derived from GIST_ACCOUNT)", () => {
    expect(getGitHubAvatarUrl("octocat")).toBe(
      "https://github.com/octocat.png"
    );
    expect(getGitHubAvatarUrl("myuser")).toBe(
      "https://github.com/myuser.png"
    );
  });

  it("encodes special characters in username", () => {
    expect(getGitHubAvatarUrl("user-name")).toBe(
      "https://github.com/user-name.png"
    );
  });
});

describe("getAvatarFallbackLetter", () => {
  it("US-001-AC06: returns '?' when account is missing", () => {
    expect(getAvatarFallbackLetter(undefined)).toBe("?");
  });

  it("US-001-AC06: returns '?' when account is empty string", () => {
    expect(getAvatarFallbackLetter("")).toBe("?");
  });

  it("returns first letter uppercase when account exists", () => {
    expect(getAvatarFallbackLetter("octocat")).toBe("O");
    expect(getAvatarFallbackLetter("alice")).toBe("A");
  });

  it("trims whitespace before taking first letter", () => {
    expect(getAvatarFallbackLetter("  octocat  ")).toBe("O");
  });
});
