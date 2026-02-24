import { describe, it, expect, vi, beforeEach } from "vitest";
import "@/lib/auth-types";

describe("US-001: Admin access with Gist authentication", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe("US-001-AC01/AC03: Auth configuration", () => {
    it("authOptions uses GitHub provider", async () => {
      const { authOptions } = await import("../auth");
      expect(authOptions.providers).toHaveLength(1);
      expect(authOptions.providers[0].id).toBe("github");
    });

    it("GitHub provider requests gist scope", async () => {
      const { authOptions } = await import("../auth");
      const provider = authOptions.providers[0];
      // next-auth GitHub provider stores authorization config
      expect(provider).toBeDefined();
      // The provider is configured with gist scope via authorization params
      const authConfig = (provider as { options?: { authorization?: { params?: { scope?: string } } } }).options;
      expect(authConfig?.authorization?.params?.scope).toBe("gist");
    });

    it("custom signIn page is set to /admin/login", async () => {
      const { authOptions } = await import("../auth");
      expect(authOptions.pages?.signIn).toBe("/admin/login");
    });

    it("jwt callback stores access token from account", async () => {
      const { authOptions } = await import("../auth");
      const jwtCallback = authOptions.callbacks?.jwt;
      expect(jwtCallback).toBeDefined();

      const result = await jwtCallback!({
        token: { sub: "123" },
        account: { access_token: "gho_abc123", provider: "github", type: "oauth", providerAccountId: "1" },
        user: { id: "1" },
        trigger: "signIn",
      });
      expect(result.accessToken).toBe("gho_abc123");
    });

    it("jwt callback preserves token when no account (subsequent calls)", async () => {
      const { authOptions } = await import("../auth");
      const jwtCallback = authOptions.callbacks?.jwt;

      const result = await jwtCallback!({
        token: { sub: "123", accessToken: "existing_token" },
        account: null,
        user: { id: "1" },
        trigger: "update",
      });
      expect(result.accessToken).toBe("existing_token");
    });

    it("session callback attaches accessToken to session", async () => {
      const { authOptions } = await import("../auth");
      const sessionCallback = authOptions.callbacks?.session;
      expect(sessionCallback).toBeDefined();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (sessionCallback as any)({
        session: { user: { name: "test" }, expires: "" },
        token: { sub: "123", accessToken: "gho_abc123" },
      });
      expect(result.accessToken).toBe("gho_abc123");
    });

    it("reads GitHub client ID and secret from env vars", async () => {
      const { authOptions } = await import("../auth");
      const provider = authOptions.providers[0] as { options?: { clientId?: string; clientSecret?: string } };
      // When env vars are not set, they default to empty strings
      expect(provider.options?.clientId).toBeDefined();
      expect(provider.options?.clientSecret).toBeDefined();
    });
  });
});
