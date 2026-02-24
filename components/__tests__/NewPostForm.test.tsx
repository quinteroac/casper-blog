import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock react-markdown to avoid ESM issues in test environment
vi.mock("react-markdown", () => ({
  default: ({ children }: { children: string }) => <div data-testid="markdown-preview">{children}</div>,
}));

import NewPostForm from "../NewPostForm";

describe("US-002: Create posts with Markdown editor", () => {
  const onCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("US-002-AC01: Admin can open a 'New post' form with a Markdown editor (title + body)", () => {
    it("renders a heading 'New Post'", () => {
      render(<NewPostForm onCancel={onCancel} />);
      expect(screen.getByText("New Post")).toBeInTheDocument();
    });

    it("renders a title input field", () => {
      render(<NewPostForm onCancel={onCancel} />);
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    it("renders a body textarea", () => {
      render(<NewPostForm onCancel={onCancel} />);
      expect(screen.getByLabelText("Body")).toBeInTheDocument();
    });

    it("renders a Save button", () => {
      render(<NewPostForm onCancel={onCancel} />);
      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("renders a Cancel button that calls onCancel", () => {
      render(<NewPostForm onCancel={onCancel} />);
      fireEvent.click(screen.getByText("Cancel"));
      expect(onCancel).toHaveBeenCalledOnce();
    });
  });

  describe("US-002-AC02: Editor supports Markdown syntax", () => {
    it("shows a Preview toggle button", () => {
      render(<NewPostForm onCancel={onCancel} />);
      expect(screen.getByText("Preview")).toBeInTheDocument();
    });

    it("renders Markdown preview when Preview is clicked", () => {
      render(<NewPostForm onCancel={onCancel} />);
      const textarea = screen.getByLabelText("Body");
      fireEvent.change(textarea, {
        target: { value: "# Hello\n\n- list item\n- [link](http://example.com)\n\n```js\ncode\n```" },
      });
      fireEvent.click(screen.getByText("Preview"));
      expect(screen.getByTestId("markdown-preview")).toBeInTheDocument();
    });

    it("shows 'Edit' button when in preview mode", () => {
      render(<NewPostForm onCancel={onCancel} />);
      fireEvent.click(screen.getByText("Preview"));
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    it("switches back to editor when Edit is clicked", () => {
      render(<NewPostForm onCancel={onCancel} />);
      fireEvent.click(screen.getByText("Preview"));
      fireEvent.click(screen.getByText("Edit"));
      expect(screen.getByLabelText("Body")).toBeInTheDocument();
    });

    it("shows 'Nothing to preview.' when body is empty", () => {
      render(<NewPostForm onCancel={onCancel} />);
      fireEvent.click(screen.getByText("Preview"));
      expect(screen.getByText("Nothing to preview.")).toBeInTheDocument();
    });

    it("uses monospace font on textarea for code authoring", () => {
      render(<NewPostForm onCancel={onCancel} />);
      const textarea = screen.getByLabelText("Body");
      expect(textarea).toHaveClass("new-post-form__textarea");
    });
  });

  describe("US-002-AC03: Form validates required fields before allowing save", () => {
    it("shows title error when saving with empty title", () => {
      render(<NewPostForm onCancel={onCancel} />);
      fireEvent.click(screen.getByText("Save"));
      expect(screen.getByText("Title is required.")).toBeInTheDocument();
    });

    it("shows body error when saving with empty body", () => {
      render(<NewPostForm onCancel={onCancel} />);
      fireEvent.click(screen.getByText("Save"));
      expect(screen.getByText("Body is required.")).toBeInTheDocument();
    });

    it("shows both errors when both fields are empty", () => {
      render(<NewPostForm onCancel={onCancel} />);
      fireEvent.click(screen.getByText("Save"));
      expect(screen.getByText("Title is required.")).toBeInTheDocument();
      expect(screen.getByText("Body is required.")).toBeInTheDocument();
    });

    it("clears title error when user starts typing in title", () => {
      render(<NewPostForm onCancel={onCancel} />);
      fireEvent.click(screen.getByText("Save"));
      expect(screen.getByText("Title is required.")).toBeInTheDocument();
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "A" } });
      expect(screen.queryByText("Title is required.")).not.toBeInTheDocument();
    });

    it("clears body error when user starts typing in body", () => {
      render(<NewPostForm onCancel={onCancel} />);
      fireEvent.click(screen.getByText("Save"));
      expect(screen.getByText("Body is required.")).toBeInTheDocument();
      fireEvent.change(screen.getByLabelText("Body"), { target: { value: "A" } });
      expect(screen.queryByText("Body is required.")).not.toBeInTheDocument();
    });

    it("treats whitespace-only input as empty", () => {
      render(<NewPostForm onCancel={onCancel} />);
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "   " } });
      fireEvent.change(screen.getByLabelText("Body"), { target: { value: "  \n  " } });
      fireEvent.click(screen.getByText("Save"));
      expect(screen.getByText("Title is required.")).toBeInTheDocument();
      expect(screen.getByText("Body is required.")).toBeInTheDocument();
    });
  });
});
