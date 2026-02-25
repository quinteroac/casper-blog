import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RichTextEditor from "../RichTextEditor";

// Hoisted mocks so they are available inside vi.mock() factory
const { mockChain, mockIsActive, mockEditor } = vi.hoisted(() => {
  const run = vi.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: any = { run };

  for (const m of [
    "focus",
    "toggleBold",
    "toggleItalic",
    "toggleHeading",
    "toggleBulletList",
    "toggleOrderedList",
    "toggleCodeBlock",
    "toggleBlockquote",
  ]) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }

  const mockIsActive = vi.fn().mockReturnValue(false);
  const mockEditor = {
    chain: vi.fn().mockReturnValue(chain),
    isActive: mockIsActive,
    setEditable: vi.fn(),
    storage: { markdown: { getMarkdown: vi.fn().mockReturnValue("") } },
  };

  return { mockChain: chain, mockIsActive, mockEditor };
});

vi.mock("@tiptap/react", () => ({
  useEditor: vi.fn().mockReturnValue(mockEditor),
  EditorContent: ({ className }: { className?: string }) => (
    <div className={className} contentEditable="true" />
  ),
}));

describe("US-002: Author can format content using the toolbar", () => {
  beforeEach(() => {
    // Clear call counts without resetting implementations
    vi.clearAllMocks();
    // Re-establish implementations that clearAllMocks may have affected
    mockIsActive.mockReturnValue(false);
    mockEditor.chain.mockReturnValue(mockChain);
    for (const m of [
      "focus",
      "toggleBold",
      "toggleItalic",
      "toggleHeading",
      "toggleBulletList",
      "toggleOrderedList",
      "toggleCodeBlock",
      "toggleBlockquote",
    ]) {
      mockChain[m].mockReturnValue(mockChain);
    }
  });

  // ─── AC01: Bold ─────────────────────────────────────────────────────────────

  describe("US-002-AC01: Bold toggles <strong> formatting on selected text", () => {
    it("clicking the Bold button calls toggleBold on the editor chain", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      fireEvent.click(screen.getByTitle("Bold"));
      expect(mockChain.toggleBold).toHaveBeenCalled();
      expect(mockChain.run).toHaveBeenCalled();
    });

    it("Bold button has aria-pressed=true when bold mark is active", () => {
      mockIsActive.mockImplementation((name: string) => name === "bold");
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Bold")).toHaveAttribute("aria-pressed", "true");
    });

    it("Bold button has aria-pressed=false when bold mark is inactive", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Bold")).toHaveAttribute("aria-pressed", "false");
    });
  });

  // ─── AC02: Italic ────────────────────────────────────────────────────────────

  describe("US-002-AC02: Italic toggles <em> formatting on selected text", () => {
    it("clicking the Italic button calls toggleItalic on the editor chain", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      fireEvent.click(screen.getByTitle("Italic"));
      expect(mockChain.toggleItalic).toHaveBeenCalled();
      expect(mockChain.run).toHaveBeenCalled();
    });

    it("Italic button has aria-pressed=true when italic mark is active", () => {
      mockIsActive.mockImplementation((name: string) => name === "italic");
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Italic")).toHaveAttribute("aria-pressed", "true");
    });

    it("Italic button has aria-pressed=false when italic mark is inactive", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Italic")).toHaveAttribute("aria-pressed", "false");
    });
  });

  // ─── AC03: Headings ─────────────────────────────────────────────────────────

  describe("US-002-AC03: Heading H1/H2/H3 applies the corresponding heading", () => {
    it("clicking H1 calls toggleHeading with level 1", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      fireEvent.click(screen.getByTitle("Heading 1"));
      expect(mockChain.toggleHeading).toHaveBeenCalledWith({ level: 1 });
      expect(mockChain.run).toHaveBeenCalled();
    });

    it("clicking H2 calls toggleHeading with level 2", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      fireEvent.click(screen.getByTitle("Heading 2"));
      expect(mockChain.toggleHeading).toHaveBeenCalledWith({ level: 2 });
      expect(mockChain.run).toHaveBeenCalled();
    });

    it("clicking H3 calls toggleHeading with level 3", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      fireEvent.click(screen.getByTitle("Heading 3"));
      expect(mockChain.toggleHeading).toHaveBeenCalledWith({ level: 3 });
      expect(mockChain.run).toHaveBeenCalled();
    });

    it("H1 button has aria-pressed=true when heading level 1 is active", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockIsActive.mockImplementation((name: string, attrs?: any) =>
        name === "heading" && attrs?.level === 1,
      );
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Heading 1")).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(screen.getByTitle("Heading 2")).toHaveAttribute(
        "aria-pressed",
        "false",
      );
      expect(screen.getByTitle("Heading 3")).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });

    it("H2 button has aria-pressed=true when heading level 2 is active", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockIsActive.mockImplementation((name: string, attrs?: any) =>
        name === "heading" && attrs?.level === 2,
      );
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Heading 2")).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    it("H3 button has aria-pressed=true when heading level 3 is active", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockIsActive.mockImplementation((name: string, attrs?: any) =>
        name === "heading" && attrs?.level === 3,
      );
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Heading 3")).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });
  });

  // ─── AC04: Lists ────────────────────────────────────────────────────────────

  describe("US-002-AC04: Unordered/Ordered List wraps the current line", () => {
    it("clicking Unordered list calls toggleBulletList on the editor chain", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      fireEvent.click(screen.getByTitle("Unordered list"));
      expect(mockChain.toggleBulletList).toHaveBeenCalled();
      expect(mockChain.run).toHaveBeenCalled();
    });

    it("clicking Ordered list calls toggleOrderedList on the editor chain", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      fireEvent.click(screen.getByTitle("Ordered list"));
      expect(mockChain.toggleOrderedList).toHaveBeenCalled();
      expect(mockChain.run).toHaveBeenCalled();
    });

    it("UL button has aria-pressed=true when bulletList is active", () => {
      mockIsActive.mockImplementation((name: string) => name === "bulletList");
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Unordered list")).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    it("OL button has aria-pressed=true when orderedList is active", () => {
      mockIsActive.mockImplementation((name: string) => name === "orderedList");
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Ordered list")).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    it("UL button has aria-pressed=false by default", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Unordered list")).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });

    it("OL button has aria-pressed=false by default", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Ordered list")).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });
  });

  // ─── AC05: Code Block ───────────────────────────────────────────────────────

  describe("US-002-AC05: Code Block wraps the current block in a code fence", () => {
    it("clicking Code block calls toggleCodeBlock on the editor chain", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      fireEvent.click(screen.getByTitle("Code block"));
      expect(mockChain.toggleCodeBlock).toHaveBeenCalled();
      expect(mockChain.run).toHaveBeenCalled();
    });

    it("Code block button has aria-pressed=true when codeBlock is active", () => {
      mockIsActive.mockImplementation((name: string) => name === "codeBlock");
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Code block")).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    it("Code block button has aria-pressed=false by default", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Code block")).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });
  });

  // ─── AC06: Blockquote ───────────────────────────────────────────────────────

  describe("US-002-AC06: Blockquote wraps the current block in a blockquote", () => {
    it("clicking Blockquote calls toggleBlockquote on the editor chain", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      fireEvent.click(screen.getByTitle("Blockquote"));
      expect(mockChain.toggleBlockquote).toHaveBeenCalled();
      expect(mockChain.run).toHaveBeenCalled();
    });

    it("Blockquote button has aria-pressed=true when blockquote is active", () => {
      mockIsActive.mockImplementation((name: string) => name === "blockquote");
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Blockquote")).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    it("Blockquote button has aria-pressed=false by default", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Blockquote")).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });
  });
});
