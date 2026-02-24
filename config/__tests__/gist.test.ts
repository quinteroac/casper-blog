import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("gist config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("US-001-AC01: Gist account from env", () => {
    it("GIST_ACCOUNT resolves from env", async () => {
      process.env.GIST_ACCOUNT = "octocat";
      const { GIST_ACCOUNT } = await import("../gist");
      expect(GIST_ACCOUNT).toBe("octocat");
    });

    it("GITHUB_USERNAME is used when GIST_ACCOUNT is unset", async () => {
      delete process.env.GIST_ACCOUNT;
      process.env.GITHUB_USERNAME = "myuser";
      const { GIST_ACCOUNT } = await import("../gist");
      expect(GIST_ACCOUNT).toBe("myuser");
    });

    it("GIST_ACCOUNT takes precedence over GITHUB_USERNAME", async () => {
      process.env.GIST_ACCOUNT = "primary";
      process.env.GITHUB_USERNAME = "fallback";
      const { GIST_ACCOUNT } = await import("../gist");
      expect(GIST_ACCOUNT).toBe("primary");
    });

    it("returns empty string when neither account env is set", async () => {
      delete process.env.GIST_ACCOUNT;
      delete process.env.GITHUB_USERNAME;
      const { GIST_ACCOUNT } = await import("../gist");
      expect(GIST_ACCOUNT).toBe("");
    });
  });

  describe("GIST_IDS (fallback)", () => {
    it("Config resolves Gist ID from env/config", async () => {
      process.env.GIST_IDS = "id1,id2,id3";
      const { GIST_IDS } = await import("../gist");
      expect(GIST_IDS).toEqual(["id1", "id2", "id3"]);
    });

    it("trims whitespace from each ID", async () => {
      process.env.GIST_IDS = "  id1  ,  id2  ";
      const { GIST_IDS } = await import("../gist");
      expect(GIST_IDS).toEqual(["id1", "id2"]);
    });

    it("returns empty array when GIST_IDS is unset", async () => {
      delete process.env.GIST_IDS;
      const { GIST_IDS } = await import("../gist");
      expect(GIST_IDS).toEqual([]);
    });

    it("returns empty array when GIST_IDS is empty string", async () => {
      process.env.GIST_IDS = "";
      const { GIST_IDS } = await import("../gist");
      expect(GIST_IDS).toEqual([]);
    });
  });
});
