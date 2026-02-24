import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next-auth/jwt
vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

import { middleware, config } from "./middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

function createRequest(path: string): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"));
}

describe("US-001: Admin route protection middleware", () => {
  beforeEach(() => {
    vi.mocked(getToken).mockReset();
  });

  describe("US-001-AC01: Unauthenticated users are redirected to login", () => {
    it("redirects unauthenticated users from /admin to /admin/login", async () => {
      vi.mocked(getToken).mockResolvedValue(null);
      const response = await middleware(createRequest("/admin"));
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain("/admin/login");
    });

    it("includes callbackUrl in redirect", async () => {
      vi.mocked(getToken).mockResolvedValue(null);
      const response = await middleware(createRequest("/admin"));
      const location = response.headers.get("location")!;
      expect(location).toContain("callbackUrl=%2Fadmin");
    });

    it("redirects unauthenticated users from /admin/subpage", async () => {
      vi.mocked(getToken).mockResolvedValue(null);
      const response = await middleware(createRequest("/admin/posts"));
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain("/admin/login");
    });
  });

  describe("US-001-AC02: Authenticated users reach admin dashboard", () => {
    it("allows authenticated users to access /admin", async () => {
      vi.mocked(getToken).mockResolvedValue({ sub: "123", name: "testuser" });
      const response = await middleware(createRequest("/admin"));
      // NextResponse.next() returns 200
      expect(response.status).toBe(200);
    });

    it("allows authenticated users to access /admin sub-routes", async () => {
      vi.mocked(getToken).mockResolvedValue({ sub: "123", name: "testuser" });
      const response = await middleware(createRequest("/admin/posts"));
      expect(response.status).toBe(200);
    });
  });

  describe("US-001-AC03: Login page and auth routes are accessible", () => {
    it("allows unauthenticated access to /admin/login", async () => {
      vi.mocked(getToken).mockResolvedValue(null);
      const response = await middleware(createRequest("/admin/login"));
      expect(response.status).toBe(200);
    });

    it("allows access to /api/auth routes", async () => {
      vi.mocked(getToken).mockResolvedValue(null);
      const response = await middleware(createRequest("/api/auth/callback/github"));
      expect(response.status).toBe(200);
    });
  });

  describe("Middleware config", () => {
    it("matcher targets /admin routes", () => {
      expect(config.matcher).toContain("/admin/:path*");
    });
  });
});
