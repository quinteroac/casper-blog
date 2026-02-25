/**
 * US-003-AC03: A post created via the TipTap editor renders correctly on the
 *              blog detail page.
 * US-003-AC04: Heading, bold, italic, list, code block, and blockquote
 *              formatting round-trips correctly through TipTap → Markdown →
 *              react-markdown render.
 *
 * This test exercises the complete pipeline:
 *   TipTap (with tiptap-markdown) → Markdown string → PostContent (react-markdown)
 */
import { describe, it, expect, afterEach } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { render, screen } from "@testing-library/react";
import { PostContent } from "../PostContent";

function createEditorWithHTML(html: string): Editor {
  const element = document.createElement("div");
  document.body.appendChild(element);
  return new Editor({
    element,
    extensions: [StarterKit, Markdown],
    content: html,
  });
}

function getMarkdown(editor: Editor): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (editor.storage as any).markdown.getMarkdown();
}

function renderMarkdown(markdown: string) {
  return render(<PostContent content={markdown} />);
}

describe("US-003-AC03 & AC04: Formatting round-trip (TipTap → Markdown → PostContent)", () => {
  describe("Headings", () => {
    it("H1 renders as a heading element after round-trip", () => {
      const editor = createEditorWithHTML("<h1>My Post Title</h1>");
      const md = getMarkdown(editor);
      editor.destroy();

      renderMarkdown(md);
      // PostContent maps h1→h2, so we expect a level-2 heading
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "My Post Title"
      );
    });

    it("H2 renders as a heading element after round-trip", () => {
      const editor = createEditorWithHTML("<h2>Subtitle</h2>");
      const md = getMarkdown(editor);
      editor.destroy();

      renderMarkdown(md);
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "Subtitle"
      );
    });

    it("H3 renders as a heading element after round-trip", () => {
      const editor = createEditorWithHTML("<h3>Section</h3>");
      const md = getMarkdown(editor);
      editor.destroy();

      renderMarkdown(md);
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "Section"
      );
    });
  });

  describe("Inline marks", () => {
    it("bold text renders as <strong> after round-trip", () => {
      const editor = createEditorWithHTML("<p><strong>bold text</strong></p>");
      const md = getMarkdown(editor);
      editor.destroy();

      const { container } = renderMarkdown(md);
      const strong = container.querySelector("strong");
      expect(strong).not.toBeNull();
      expect(strong?.textContent).toBe("bold text");
    });

    it("italic text renders as <em> after round-trip", () => {
      const editor = createEditorWithHTML("<p><em>italic text</em></p>");
      const md = getMarkdown(editor);
      editor.destroy();

      const { container } = renderMarkdown(md);
      const em = container.querySelector("em");
      expect(em).not.toBeNull();
      expect(em?.textContent).toBe("italic text");
    });
  });

  describe("Lists", () => {
    it("unordered list renders as <ul> after round-trip", () => {
      const editor = createEditorWithHTML(
        "<ul><li>Alpha</li><li>Beta</li></ul>"
      );
      const md = getMarkdown(editor);
      editor.destroy();

      renderMarkdown(md);
      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getByText("Alpha")).toBeInTheDocument();
      expect(screen.getByText("Beta")).toBeInTheDocument();
    });

    it("ordered list renders as <ol> after round-trip", () => {
      const editor = createEditorWithHTML(
        "<ol><li>First</li><li>Second</li></ol>"
      );
      const md = getMarkdown(editor);
      editor.destroy();

      renderMarkdown(md);
      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });
  });

  describe("Blocks", () => {
    it("code block renders as <pre><code> after round-trip", () => {
      const editor = createEditorWithHTML(
        "<pre><code>const x = 1;</code></pre>"
      );
      const md = getMarkdown(editor);
      editor.destroy();

      const { container } = renderMarkdown(md);
      const code = container.querySelector("code");
      expect(code).not.toBeNull();
      expect(code?.textContent?.trim()).toBe("const x = 1;");
    });

    it("blockquote renders as <blockquote> after round-trip", () => {
      const editor = createEditorWithHTML(
        "<blockquote><p>quoted text</p></blockquote>"
      );
      const md = getMarkdown(editor);
      editor.destroy();

      const { container } = renderMarkdown(md);
      const blockquote = container.querySelector("blockquote");
      expect(blockquote).not.toBeNull();
      expect(blockquote?.textContent?.trim()).toBe("quoted text");
    });
  });
});
