import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

// Mock NewPostForm to avoid pulling in react-markdown
vi.mock("@/components/NewPostForm", () => ({
  default: ({ onCancel }: { onCancel: () => void }) => (
    <div data-testid="new-post-form">
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
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

describe("US-002: New post form integration in dashboard", () => {
  describe("US-002-AC01: Admin can open a 'New post' form", () => {
    it("renders a 'New post' button", () => {
      render(<AdminDashboard userName="testuser" />);
      expect(screen.getByText("New post")).toBeInTheDocument();
    });

    it("shows the new post form when 'New post' is clicked", () => {
      render(<AdminDashboard userName="testuser" />);
      fireEvent.click(screen.getByText("New post"));
      expect(screen.getByTestId("new-post-form")).toBeInTheDocument();
    });

    it("hides the form and shows 'New post' button when Cancel is clicked", () => {
      render(<AdminDashboard userName="testuser" />);
      fireEvent.click(screen.getByText("New post"));
      expect(screen.getByTestId("new-post-form")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Cancel"));
      expect(screen.queryByTestId("new-post-form")).not.toBeInTheDocument();
      expect(screen.getByText("New post")).toBeInTheDocument();
    });
  });
});
