import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(__dirname, "../..");

function readJson(filePath: string) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, filePath), "utf-8"));
}

function fileExists(filePath: string) {
  return fs.existsSync(path.join(ROOT, filePath));
}

describe("US-003: Automatic deployment on push", () => {
  describe("US-003-AC01: Push to main triggers a new Vercel deployment", () => {
    it("project is a git repository", () => {
      expect(fileExists(".git")).toBe(true);
    });

    it("main branch exists", () => {
      const branches = execSync("git branch --list main", {
        cwd: ROOT,
        encoding: "utf-8",
      });
      expect(branches).toContain("main");
    });

    it("vercel.json configures git auto-deploy for the main branch", () => {
      const vercelConfig = readJson("vercel.json");
      expect(vercelConfig.git).toBeDefined();
      expect(vercelConfig.git.deploymentEnabled).toBe(true);
    });
  });

  describe("US-003-AC02: Build completes successfully and deployment is live", () => {
    it("build script is defined in package.json", () => {
      const pkg = readJson("package.json");
      expect(pkg.scripts.build).toBe("next build");
    });

    it("next.config.ts exists for build configuration", () => {
      expect(fileExists("next.config.ts")).toBe(true);
    });

    it("app root page exists for a live landing route", () => {
      expect(fileExists("app/page.tsx")).toBe(true);
    });

    it("app layout exists for consistent rendering", () => {
      expect(fileExists("app/layout.tsx")).toBe(true);
    });
  });

  describe("US-003-AC03: Typecheck / lint passes", () => {
    it("typecheck script is defined", () => {
      const pkg = readJson("package.json");
      expect(pkg.scripts.typecheck).toBe("tsc --noEmit");
    });

    it("lint script is defined", () => {
      const pkg = readJson("package.json");
      expect(pkg.scripts.lint).toBe("next lint");
    });

    it("tsconfig.json has strict mode enabled", () => {
      const tsconfig = readJson("tsconfig.json");
      expect(tsconfig.compilerOptions.strict).toBe(true);
    });

    it("eslint configuration exists", () => {
      expect(fileExists("eslint.config.mjs")).toBe(true);
    });

    it("typecheck passes", () => {
      expect(() => {
        execSync("npx tsc --noEmit", { cwd: ROOT, encoding: "utf-8" });
      }).not.toThrow();
    });

    it("lint passes", () => {
      expect(() => {
        execSync("npx next lint", { cwd: ROOT, encoding: "utf-8" });
      }).not.toThrow();
    });
  });
});
