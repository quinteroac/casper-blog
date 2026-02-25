import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RichTextEditor from "../RichTextEditor";

describe("US-001: TipTap Rich Text Editor", () => {
  describe("US-001-AC01: Editor renders in place of textarea", () => {
    it("renders the editor wrapper element", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(document.querySelector(".rich-text-editor")).not.toBeNull();
    });

    it("does not render a <textarea> element", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(document.querySelector("textarea")).toBeNull();
    });

    it("renders a TipTap contenteditable editor area", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      const editableEl = document.querySelector("[contenteditable]");
      expect(editableEl).not.toBeNull();
    });

    it("applies error class when hasError is true", () => {
      render(<RichTextEditor onChange={vi.fn()} hasError />);
      expect(document.querySelector(".rich-text-editor--error")).not.toBeNull();
    });

    it("does not apply error class by default", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(document.querySelector(".rich-text-editor--error")).toBeNull();
    });
  });

  describe("US-001-AC02: Toolbar renders required formatting buttons", () => {
    it("renders a formatting toolbar", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByRole("toolbar")).toBeInTheDocument();
    });

    it("renders a Bold button", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Bold")).toBeInTheDocument();
    });

    it("renders an Italic button", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Italic")).toBeInTheDocument();
    });

    it("renders a Heading 1 button", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Heading 1")).toBeInTheDocument();
    });

    it("renders a Heading 2 button", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Heading 2")).toBeInTheDocument();
    });

    it("renders a Heading 3 button", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Heading 3")).toBeInTheDocument();
    });

    it("renders an Unordered list button", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Unordered list")).toBeInTheDocument();
    });

    it("renders an Ordered list button", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Ordered list")).toBeInTheDocument();
    });

    it("renders a Code block button", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Code block")).toBeInTheDocument();
    });

    it("renders a Blockquote button", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(screen.getByTitle("Blockquote")).toBeInTheDocument();
    });
  });

  describe("US-001-AC03: Visual consistency with admin UI", () => {
    it("wraps editor content in the styled content container", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(document.querySelector(".rich-text-editor__content")).not.toBeNull();
    });

    it("wraps toolbar in the styled toolbar container", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      expect(document.querySelector(".rich-text-editor__toolbar")).not.toBeNull();
    });

    it("toolbar buttons have the expected CSS class", () => {
      render(<RichTextEditor onChange={vi.fn()} />);
      const btns = document.querySelectorAll(".rich-text-editor__toolbar-btn");
      expect(btns.length).toBeGreaterThanOrEqual(9);
    });

    it("disables all toolbar buttons when disabled prop is true", () => {
      render(<RichTextEditor onChange={vi.fn()} disabled />);
      const btns = document.querySelectorAll<HTMLButtonElement>(
        ".rich-text-editor__toolbar-btn",
      );
      btns.forEach((btn) => {
        expect(btn.disabled).toBe(true);
      });
    });
  });
});
