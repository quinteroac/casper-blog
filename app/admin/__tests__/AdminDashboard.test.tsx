import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

import AdminDashboard from "../AdminDashboard";

describe("US-001: Admin dashboard", () => {
  describe("US-001-AC02: Authenticated user sees admin dashboard", () => {
    it("renders the dashboard title", () => {
      render(<AdminDashboard userName="testuser" />);
      expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    });

    it("displays the user name", () => {
      render(<AdminDashboard userName="testuser" />);
      expect(screen.getByText("testuser")).toBeInTheDocument();
    });

    it("renders a sign-out button", () => {
      render(<AdminDashboard userName="testuser" />);
      expect(screen.getByText("Sign out")).toBeInTheDocument();
    });

    it("calls signOut when sign-out button is clicked", async () => {
      const { signOut } = await import("next-auth/react");
      render(<AdminDashboard userName="testuser" />);
      screen.getByText("Sign out").click();
      expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/" });
    });
  });
});
