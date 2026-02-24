import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("US-002: Configure environment variables", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("US-002-AC01: Env vars available at build and runtime", () => {
    it("GIST_ACCOUNT is read from process.env (server-side)", async () => {
      process.env.GIST_ACCOUNT = "testuser";
      delete process.env.GIST_IDS;
      const { isGistSourceConfigured } = await import("../env");
      expect(isGistSourceConfigured()).toBe(true);
    });

    it("GIST_IDS is read from process.env (server-side)", async () => {
      delete process.env.GIST_ACCOUNT;
      delete process.env.GITHUB_USERNAME;
      process.env.GIST_IDS = "abc123";
      const { isGistSourceConfigured } = await import("../env");
      expect(isGistSourceConfigured()).toBe(true);
    });

    it("no NEXT_PUBLIC_ prefix is required (server components only)", async () => {
      process.env.GIST_ACCOUNT = "serveruser";
      delete process.env.NEXT_PUBLIC_GIST_ACCOUNT;
      const { GIST_ACCOUNT } = await import("../gist");
      expect(GIST_ACCOUNT).toBe("serveruser");
    });

    it("GIST_ENV_VARS lists all supported env var names", async () => {
      const { GIST_ENV_VARS } = await import("../env");
      expect(GIST_ENV_VARS).toContain("GIST_ACCOUNT");
      expect(GIST_ENV_VARS).toContain("GITHUB_USERNAME");
      expect(GIST_ENV_VARS).toContain("GIST_IDS");
    });
  });

  describe("US-002-AC02: Site displays posts when Gist ID is set", () => {
    it("isGistSourceConfigured returns true when GIST_ACCOUNT is set", async () => {
      process.env.GIST_ACCOUNT = "quinteroac";
      delete process.env.GIST_IDS;
      const { isGistSourceConfigured } = await import("../env");
      expect(isGistSourceConfigured()).toBe(true);
    });

    it("isGistSourceConfigured returns true when GIST_IDS is set", async () => {
      delete process.env.GIST_ACCOUNT;
      delete process.env.GITHUB_USERNAME;
      process.env.GIST_IDS = "abc123,def456";
      const { isGistSourceConfigured } = await import("../env");
      expect(isGistSourceConfigured()).toBe(true);
    });

    it("isGistSourceConfigured returns false when no source is set", async () => {
      delete process.env.GIST_ACCOUNT;
      delete process.env.GITHUB_USERNAME;
      delete process.env.GIST_IDS;
      const { isGistSourceConfigured } = await import("../env");
      expect(isGistSourceConfigured()).toBe(false);
    });

    it("validateEnv returns ok when a source is configured", async () => {
      process.env.GIST_ACCOUNT = "quinteroac";
      const { validateEnv } = await import("../env");
      expect(validateEnv()).toEqual({ ok: true });
    });

    it("validateEnv returns error message when no source is configured", async () => {
      delete process.env.GIST_ACCOUNT;
      delete process.env.GITHUB_USERNAME;
      delete process.env.GIST_IDS;
      const { validateEnv } = await import("../env");
      const result = validateEnv();
      expect(result.ok).toBe(false);
      expect(result.message).toContain("Vercel");
      expect(result.message).toContain("GIST_ACCOUNT");
    });
  });

  describe("US-002-AC03: Typecheck / lint passes", () => {
    it("typecheck script is defined", async () => {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const root = path.resolve(__dirname, "../..");
      const pkg = JSON.parse(
        fs.readFileSync(path.join(root, "package.json"), "utf-8"),
      );
      expect(pkg.scripts.typecheck).toBe("tsc --noEmit");
    });

    it("lint script is defined", async () => {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const root = path.resolve(__dirname, "../..");
      const pkg = JSON.parse(
        fs.readFileSync(path.join(root, "package.json"), "utf-8"),
      );
      expect(pkg.scripts.lint).toBeDefined();
    });

    it(".env.example documents Vercel dashboard instructions", async () => {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const root = path.resolve(__dirname, "../..");
      const content = fs.readFileSync(
        path.join(root, ".env.example"),
        "utf-8",
      );
      expect(content).toContain("Vercel");
      expect(content).toContain("GIST_ACCOUNT");
      expect(content).toContain("GIST_IDS");
    });
  });
});
