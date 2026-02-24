import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

// Mock NewPostForm to avoid pulling in react-markdown
vi.mock("@/components/NewPostForm", () => ({
  default: ({ onCancel, onSaved }: { onCancel: () => void; onSaved?: (post: unknown) => void }) => (
    <div data-testid="new-post-form">
      <button onClick={onCancel}>Cancel</button>
      <button
        onClick={() =>
          onSaved?.({
            id: "gist-1",
            title: "Test Post",
            slug: "test-post",
            filename: "Test-Post.md",
            date: "2026-02-24T10:00:00Z",
          })
        }
      >
        Mock Save
      </button>
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

describe("US-003: Save Gist and view created posts", () => {
  describe("US-003-AC02: After save, admin sees success feedback and the new post in a list", () => {
    it("shows success message after saving a post", () => {
      render(<AdminDashboard userName="testuser" />);
      fireEvent.click(screen.getByText("New post"));
      fireEvent.click(screen.getByText("Mock Save"));

      expect(screen.getByRole("status")).toHaveTextContent(
        'Post "Test Post" saved successfully!'
      );
    });

    it("hides the form after successful save", () => {
      render(<AdminDashboard userName="testuser" />);
      fireEvent.click(screen.getByText("New post"));
      fireEvent.click(screen.getByText("Mock Save"));

      expect(screen.queryByTestId("new-post-form")).not.toBeInTheDocument();
      expect(screen.getByText("New post")).toBeInTheDocument();
    });

    it("shows the saved post in a 'Your Posts' list", () => {
      render(<AdminDashboard userName="testuser" />);
      fireEvent.click(screen.getByText("New post"));
      fireEvent.click(screen.getByText("Mock Save"));

      expect(screen.getByText("Your Posts")).toBeInTheDocument();
      expect(screen.getByText("Test Post")).toBeInTheDocument();
    });

    it("links the saved post to its detail page", () => {
      render(<AdminDashboard userName="testuser" />);
      fireEvent.click(screen.getByText("New post"));
      fireEvent.click(screen.getByText("Mock Save"));

      const link = screen.getByText("Test Post");
      expect(link.closest("a")).toHaveAttribute("href", "/posts/test-post");
    });

    it("allows dismissing the success message", () => {
      render(<AdminDashboard userName="testuser" />);
      fireEvent.click(screen.getByText("New post"));
      fireEvent.click(screen.getByText("Mock Save"));

      expect(screen.getByRole("status")).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText("Dismiss"));
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("accumulates multiple saved posts in the list", () => {
      render(<AdminDashboard userName="testuser" />);

      // Save first post
      fireEvent.click(screen.getByText("New post"));
      fireEvent.click(screen.getByText("Mock Save"));

      // Save second post
      fireEvent.click(screen.getByText("New post"));
      fireEvent.click(screen.getByText("Mock Save"));

      const postItems = screen.getAllByText("Test Post");
      expect(postItems).toHaveLength(2);
    });
  });

  describe("US-003-AC03: does not show 'Your Posts' heading when no posts saved", () => {
    it("does not render the posts section initially", () => {
      render(<AdminDashboard userName="testuser" />);
      expect(screen.queryByText("Your Posts")).not.toBeInTheDocument();
    });
  });
});
