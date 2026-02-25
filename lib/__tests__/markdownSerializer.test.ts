/**
 * US-003-AC01: TipTap's document is serialised to Markdown via tiptap-markdown.
 * US-003-AC04: Heading, bold, italic, list, code block, and blockquote
 *              formatting serialises to the correct Markdown syntax.
 */
import { describe, it, expect, afterEach } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

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

describe("US-003-AC01: TipTap serialises document to Markdown", () => {
  it("produces a non-empty Markdown string from HTML content", () => {
    const editor = createEditorWithHTML("<p>Hello world</p>");
    const md = getMarkdown(editor);
    editor.destroy();
    expect(typeof md).toBe("string");
    expect(md.trim().length).toBeGreaterThan(0);
  });

  it("uses tiptap-markdown storage to retrieve the Markdown string", () => {
    const editor = createEditorWithHTML("<p>Test</p>");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mdStorage = (editor.storage as any).markdown;
    editor.destroy();
    expect(mdStorage).toBeDefined();
    expect(typeof mdStorage.getMarkdown).toBe("function");
  });
});

describe("US-003-AC04: Formatting round-trip — TipTap → Markdown syntax", () => {
  describe("Headings", () => {
    it("serialises <h1> to # syntax", () => {
      const editor = createEditorWithHTML("<h1>Title</h1>");
      const md = getMarkdown(editor);
      editor.destroy();
      expect(md).toBe("# Title");
    });

    it("serialises <h2> to ## syntax", () => {
      const editor = createEditorWithHTML("<h2>Subtitle</h2>");
      const md = getMarkdown(editor);
      editor.destroy();
      expect(md).toBe("## Subtitle");
    });

    it("serialises <h3> to ### syntax", () => {
      const editor = createEditorWithHTML("<h3>Section</h3>");
      const md = getMarkdown(editor);
      editor.destroy();
      expect(md).toBe("### Section");
    });
  });

  describe("Inline marks", () => {
    it("serialises <strong> to **bold** syntax", () => {
      const editor = createEditorWithHTML("<p><strong>bold text</strong></p>");
      const md = getMarkdown(editor);
      editor.destroy();
      expect(md).toBe("**bold text**");
    });

    it("serialises <em> to *italic* syntax", () => {
      const editor = createEditorWithHTML("<p><em>italic text</em></p>");
      const md = getMarkdown(editor);
      editor.destroy();
      expect(md).toBe("*italic text*");
    });
  });

  describe("Lists", () => {
    it("serialises <ul><li> to - list items", () => {
      const editor = createEditorWithHTML(
        "<ul><li>Item one</li><li>Item two</li></ul>"
      );
      const md = getMarkdown(editor);
      editor.destroy();
      expect(md).toBe("- Item one\n- Item two");
    });

    it("serialises <ol><li> to numbered list items", () => {
      const editor = createEditorWithHTML(
        "<ol><li>First</li><li>Second</li></ol>"
      );
      const md = getMarkdown(editor);
      editor.destroy();
      expect(md).toBe("1. First\n2. Second");
    });
  });

  describe("Blocks", () => {
    it("serialises <pre><code> to fenced code block", () => {
      const editor = createEditorWithHTML(
        "<pre><code>const x = 1;</code></pre>"
      );
      const md = getMarkdown(editor);
      editor.destroy();
      expect(md).toBe("```\nconst x = 1;\n```");
    });

    it("serialises <blockquote> to > syntax", () => {
      const editor = createEditorWithHTML(
        "<blockquote><p>quoted text</p></blockquote>"
      );
      const md = getMarkdown(editor);
      editor.destroy();
      expect(md).toBe("> quoted text");
    });
  });
});
