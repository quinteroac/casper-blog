import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock RichTextEditor so form tests run without a real TipTap instance.
// The mock exposes a textarea with id="post-body" so the existing <label>
// association (htmlFor-less label + aria-labelledby via the mock) keeps working.
vi.mock("../RichTextEditor", () => ({
  default: ({
    onChange,
    disabled,
    hasError,
  }: {
    onChange: (v: string) => void;
    disabled?: boolean;
    hasError?: boolean;
  }) => (
    <textarea
      id="post-body"
      aria-label="Body"
      className={`new-post-form__textarea${hasError ? " new-post-form__textarea--error" : ""}`}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      data-testid="rich-text-editor"
    />
  ),
}));

import NewPostForm from "../NewPostForm";

describe("US-002: Create posts with Markdown editor", () => {
  const onCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("US-002-AC01: Admin can open a 'New post' form with a rich editor (title + body)", () => {
    it("renders a heading 'New Post'", () => {
      render(<NewPostForm onCancel={onCancel} />);
      expect(screen.getByText("New Post")).toBeInTheDocument();
    });

    it("renders a title input field", () => {
      render(<NewPostForm onCancel={onCancel} />);
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    it("renders a body editor", () => {
      render(<NewPostForm onCancel={onCancel} />);
      expect(screen.getByTestId("rich-text-editor")).toBeInTheDocument();
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

    it("clears body error when user types in body editor", () => {
      render(<NewPostForm onCancel={onCancel} />);
      fireEvent.click(screen.getByText("Save"));
      expect(screen.getByText("Body is required.")).toBeInTheDocument();
      fireEvent.change(screen.getByTestId("rich-text-editor"), { target: { value: "A" } });
      expect(screen.queryByText("Body is required.")).not.toBeInTheDocument();
    });

    it("treats whitespace-only input as empty", () => {
      render(<NewPostForm onCancel={onCancel} />);
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "   " } });
      fireEvent.change(screen.getByTestId("rich-text-editor"), { target: { value: "  \n  " } });
      fireEvent.click(screen.getByText("Save"));
      expect(screen.getByText("Title is required.")).toBeInTheDocument();
      expect(screen.getByText("Body is required.")).toBeInTheDocument();
    });
  });

  describe("US-001-AC01: NewPostForm renders RichTextEditor instead of textarea", () => {
    it("renders the RichTextEditor component (not a plain textarea)", () => {
      render(<NewPostForm onCancel={onCancel} />);
      expect(screen.getByTestId("rich-text-editor")).toBeInTheDocument();
    });

    it("does not render a preview toggle button", () => {
      render(<NewPostForm onCancel={onCancel} />);
      expect(screen.queryByText("Preview")).not.toBeInTheDocument();
    });
  });
});

describe("US-003: Save Gist and view created posts", () => {
  const onCancel = vi.fn();
  const onSaved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(global, "fetch").mockReset();
  });

  describe("US-003-AC01: Save button creates a new Gist via the GitHub API", () => {
    it("calls /api/gists on save with title and body", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "gist-1",
          title: "My Post",
          slug: "my-post",
          filename: "My-Post.md",
          date: "2026-02-24T10:00:00Z",
        }),
      } as Response);

      render(<NewPostForm onCancel={onCancel} onSaved={onSaved} />);
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "My Post" } });
      fireEvent.change(screen.getByTestId("rich-text-editor"), { target: { value: "# Hello" } });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith("/api/gists", expect.objectContaining({
          method: "POST",
        }));
      });
    });

  });

  describe("US-003-AC02: Markdown string sent to /api/gists unchanged", () => {
    it("sends the Markdown string from the editor as the request body unchanged", async () => {
      const markdownBody =
        "# Hello World\n\n**bold** and *italic*\n\n- Item 1\n- Item 2";

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "gist-1",
          title: "My Post",
          slug: "my-post",
          filename: "My-Post.md",
          date: "2026-02-24T10:00:00Z",
        }),
      } as Response);

      render(<NewPostForm onCancel={onCancel} onSaved={onSaved} />);
      fireEvent.change(screen.getByLabelText("Title"), {
        target: { value: "My Post" },
      });
      fireEvent.change(screen.getByTestId("rich-text-editor"), {
        target: { value: markdownBody },
      });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          "/api/gists",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ title: "My Post", body: markdownBody }),
          })
        );
      });
    });

    it("payload shape matches { title, body } with body as the Markdown string", async () => {
      const markdownBody = "```\nconst x = 1;\n```";

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "g1",
          title: "Code Post",
          slug: "code-post",
          filename: "Code-Post.md",
          date: "2026-02-24T00:00:00Z",
        }),
      } as Response);

      render(<NewPostForm onCancel={onCancel} onSaved={onSaved} />);
      fireEvent.change(screen.getByLabelText("Title"), {
        target: { value: "Code Post" },
      });
      fireEvent.change(screen.getByTestId("rich-text-editor"), {
        target: { value: markdownBody },
      });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [, options] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [string, { body: string }];
        const parsed = JSON.parse(options.body);
        expect(parsed).toEqual({ title: "Code Post", body: markdownBody });
      });
    });
  });

  describe("US-003-AC01 (continued): Save button creates a new Gist via the GitHub API", () => {
    it("shows 'Saving…' while the request is in flight", async () => {
      let resolvePromise: (value: Response) => void;
      const responsePromise = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });
      vi.spyOn(global, "fetch").mockReturnValueOnce(responsePromise);

      render(<NewPostForm onCancel={onCancel} onSaved={onSaved} />);
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Title" } });
      fireEvent.change(screen.getByTestId("rich-text-editor"), { target: { value: "Body" } });
      fireEvent.click(screen.getByText("Save"));

      expect(screen.getByText("Saving…")).toBeInTheDocument();

      resolvePromise!({
        ok: true,
        json: async () => ({ id: "g1", title: "Title", slug: "title", filename: "Title.md", date: "2026-01-01T00:00:00Z" }),
      } as Response);

      await waitFor(() => {
        expect(screen.getByText("Save")).toBeInTheDocument();
      });
    });

    it("disables inputs while saving", async () => {
      let resolvePromise: (value: Response) => void;
      const responsePromise = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });
      vi.spyOn(global, "fetch").mockReturnValueOnce(responsePromise);

      render(<NewPostForm onCancel={onCancel} onSaved={onSaved} />);
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Title" } });
      fireEvent.change(screen.getByTestId("rich-text-editor"), { target: { value: "Body" } });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() => {
        expect(screen.getByText("Saving…")).toBeInTheDocument();
      });

      expect(screen.getByLabelText("Title")).toBeDisabled();
      expect(screen.getByTestId("rich-text-editor")).toBeDisabled();

      resolvePromise!({
        ok: true,
        json: async () => ({ id: "g1", title: "Title", slug: "title", filename: "Title.md", date: "2026-01-01T00:00:00Z" }),
      } as Response);

      await waitFor(() => {
        expect(screen.getByText("Save")).toBeInTheDocument();
      });
    });
  });

  describe("US-003-AC02: After save, admin sees success feedback", () => {
    it("calls onSaved with the created post after successful save", async () => {
      const savedData = {
        id: "gist-1",
        title: "My Post",
        slug: "my-post",
        filename: "My-Post.md",
        date: "2026-02-24T10:00:00Z",
      };

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => savedData,
      } as Response);

      render(<NewPostForm onCancel={onCancel} onSaved={onSaved} />);
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "My Post" } });
      fireEvent.change(screen.getByTestId("rich-text-editor"), { target: { value: "# Hello" } });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() => {
        expect(onSaved).toHaveBeenCalledWith(savedData);
      });
    });
  });

  describe("US-003-AC04: Save failure shows a clear error message", () => {
    it("shows error message when API returns an error", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 502,
        json: async () => ({ error: "GitHub API error (401): Unauthorized" }),
      } as Response);

      render(<NewPostForm onCancel={onCancel} onSaved={onSaved} />);
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Title" } });
      fireEvent.change(screen.getByTestId("rich-text-editor"), { target: { value: "Body" } });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent("GitHub API error (401): Unauthorized");
      });
      expect(onSaved).not.toHaveBeenCalled();
    });

    it("shows generic error message when fetch throws", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network failure"));

      render(<NewPostForm onCancel={onCancel} onSaved={onSaved} />);
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Title" } });
      fireEvent.change(screen.getByTestId("rich-text-editor"), { target: { value: "Body" } });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent("Network failure");
      });
    });

    it("clears error when retrying save", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ error: "Server error" }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: "g1", title: "Title", slug: "title", filename: "Title.md", date: "2026-01-01T00:00:00Z" }),
        } as Response);

      render(<NewPostForm onCancel={onCancel} onSaved={onSaved} />);
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Title" } });
      fireEvent.change(screen.getByTestId("rich-text-editor"), { target: { value: "Body" } });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      // Retry
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      });
    });
  });
});
