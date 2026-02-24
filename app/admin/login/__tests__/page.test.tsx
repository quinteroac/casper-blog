import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

import AdminLoginPage from "../page";

describe("US-001: Admin login page", () => {
  describe("US-001-AC01: Login page renders for unauthenticated users", () => {
    it("renders the login page with sign-in button", () => {
      render(<AdminLoginPage />);
      expect(screen.getByText("Admin Login")).toBeInTheDocument();
      expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
    });

    it("displays description text about GitHub authentication", () => {
      render(<AdminLoginPage />);
      expect(
        screen.getByText(/Sign in with your GitHub account/),
      ).toBeInTheDocument();
    });
  });

  describe("US-001-AC01: Sign in button triggers GitHub OAuth", () => {
    it("calls signIn with github provider when button is clicked", async () => {
      const { signIn } = await import("next-auth/react");
      render(<AdminLoginPage />);
      const button = screen.getByText("Sign in with GitHub");
      button.click();
      expect(signIn).toHaveBeenCalledWith("github", {
        callbackUrl: "/admin",
      });
    });
  });
});
