import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../page";

vi.mock("@/lib/gistClient", () => ({
  fetchPosts: vi.fn(),
}));

vi.mock("@/config/gist", () => ({
  GIST_IDS: [],
}));

const { fetchPosts } = await import("@/lib/gistClient");

describe("HomePage", () => {
  it("shows graceful fallback when GIST_IDS is empty", async () => {
    const Page = await HomePage();
    render(Page);

    expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Configure GIST_IDS/i)).toBeInTheDocument();
  });
});
