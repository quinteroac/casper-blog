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

  it("resolves GIST_IDS from env as comma-separated list", async () => {
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
