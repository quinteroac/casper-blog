import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../..");

function readJson(filePath: string) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, filePath), "utf-8"));
}

function fileExists(filePath: string) {
  return fs.existsSync(path.join(ROOT, filePath));
}

describe("US-001: Vercel deployment readiness", () => {
  describe("US-001-AC01: Repo is importable by Vercel", () => {
    it("package.json exists with a build script", () => {
      const pkg = readJson("package.json");
      expect(pkg.scripts).toBeDefined();
      expect(pkg.scripts.build).toBe("next build");
    });

    it("next.config.ts exists", () => {
      expect(fileExists("next.config.ts")).toBe(true);
    });

    it("no dependencies reference local file paths", () => {
      const pkg = readJson("package.json");
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };
      for (const [name, version] of Object.entries(allDeps)) {
        expect(
          (version as string).startsWith("/"),
          `Dependency "${name}" points to local path: ${version}`,
        ).toBe(false);
      }
    });
  });

  describe("US-001-AC02: Build completes without errors", () => {
    it("tsconfig.json is valid and has strict mode enabled", () => {
      const tsconfig = readJson("tsconfig.json");
      expect(tsconfig.compilerOptions.strict).toBe(true);
      expect(tsconfig.compilerOptions.noEmit).toBe(true);
    });

    it("app directory contains at least a root page and layout", () => {
      expect(fileExists("app/page.tsx")).toBe(true);
      expect(fileExists("app/layout.tsx")).toBe(true);
    });
  });

  describe("US-001-AC03: Deployment produces a live URL", () => {
    it("app has a root route (app/page.tsx)", () => {
      expect(fileExists("app/page.tsx")).toBe(true);
    });

    it("app has a dynamic post route (app/posts/[slug]/page.tsx)", () => {
      expect(fileExists("app/posts/[slug]/page.tsx")).toBe(true);
    });

    it("app has a not-found page", () => {
      expect(fileExists("app/not-found.tsx")).toBe(true);
    });
  });

  describe("US-001-AC04: Typecheck / lint passes", () => {
    it("typecheck script is defined in package.json", () => {
      const pkg = readJson("package.json");
      expect(pkg.scripts.typecheck).toBe("tsc --noEmit");
    });

    it("lint script is defined in package.json", () => {
      const pkg = readJson("package.json");
      expect(pkg.scripts.lint).toBeDefined();
    });

    it("schemas directory is excluded from tsconfig to avoid build errors", () => {
      const tsconfig = readJson("tsconfig.json");
      expect(tsconfig.exclude).toContain("schemas");
    });
  });
});
