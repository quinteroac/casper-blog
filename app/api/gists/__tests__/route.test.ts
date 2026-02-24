import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/lib/gistClient", () => ({
  createGist: vi.fn(),
}));

import { POST } from "../route";
import { getServerSession } from "next-auth";
import { createGist } from "@/lib/gistClient";

const mockGetServerSession = getServerSession as ReturnType<typeof vi.fn>;
const mockCreateGist = createGist as ReturnType<typeof vi.fn>;

function makeRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/gists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("US-003: POST /api/gists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("US-003-AC01: creates a new Gist via the GitHub API using the authenticated user's token", () => {
    it("returns 201 with gist data on success", async () => {
      mockGetServerSession.mockResolvedValueOnce({
        accessToken: "ghp_test_token",
        user: { name: "testuser" },
      });

      const gistResult = {
        id: "new-gist-123",
        filename: "My-Post.md",
        slug: "my-post",
        title: "My Post",
        date: "2026-02-24T10:00:00Z",
      };
      mockCreateGist.mockResolvedValueOnce(gistResult);

      const res = await POST(makeRequest({ title: "My Post", body: "# Content" }));
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.id).toBe("new-gist-123");
      expect(mockCreateGist).toHaveBeenCalledWith("ghp_test_token", "My Post", "# Content");
    });
  });

  describe("Authentication", () => {
    it("returns 401 when not authenticated", async () => {
      mockGetServerSession.mockResolvedValueOnce(null);

      const res = await POST(makeRequest({ title: "Test", body: "Body" }));
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.error).toBe("Not authenticated");
    });

    it("returns 401 when session has no accessToken", async () => {
      mockGetServerSession.mockResolvedValueOnce({
        user: { name: "testuser" },
      });

      const res = await POST(makeRequest({ title: "Test", body: "Body" }));
      expect(res.status).toBe(401);
    });
  });

  describe("Validation", () => {
    it("returns 400 when title is missing", async () => {
      mockGetServerSession.mockResolvedValueOnce({
        accessToken: "token",
      });

      const res = await POST(makeRequest({ body: "Content" }));
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe("Title and body are required");
    });

    it("returns 400 when body is missing", async () => {
      mockGetServerSession.mockResolvedValueOnce({
        accessToken: "token",
      });

      const res = await POST(makeRequest({ title: "Title" }));
      expect(res.status).toBe(400);
    });

    it("returns 400 for invalid JSON", async () => {
      mockGetServerSession.mockResolvedValueOnce({
        accessToken: "token",
      });

      const req = new Request("http://localhost:3000/api/gists", {
        method: "POST",
        body: "not json",
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });

  describe("US-003-AC04: Save failure shows a clear error message", () => {
    it("returns 502 when createGist throws", async () => {
      mockGetServerSession.mockResolvedValueOnce({
        accessToken: "token",
      });
      mockCreateGist.mockRejectedValueOnce(
        new Error("GitHub API error (500): Internal Server Error")
      );

      const res = await POST(makeRequest({ title: "Title", body: "Body" }));
      const data = await res.json();

      expect(res.status).toBe(502);
      expect(data.error).toContain("GitHub API error (500)");
    });
  });
});
