import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostContent } from "../PostContent";

describe("PostContent", () => {
  describe("US-002-AC02: Markdown is rendered as HTML (headings, lists, code blocks, links, etc.)", () => {
    it("renders headings as HTML heading elements", () => {
      const markdown = "# Main Title\n\n## Subtitle\n\n### Section";
      render(<PostContent content={markdown} />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Main Title"
      );
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "Subtitle"
      );
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "Section"
      );
    });

    it("renders unordered lists", () => {
      const markdown = "- Item one\n- Item two\n- Item three";
      render(<PostContent content={markdown} />);
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
      expect(screen.getByText("Item one")).toBeInTheDocument();
      expect(screen.getByText("Item two")).toBeInTheDocument();
      expect(screen.getByText("Item three")).toBeInTheDocument();
    });

    it("renders ordered lists", () => {
      const markdown = "1. First\n2. Second";
      render(<PostContent content={markdown} />);
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("renders code blocks", () => {
      const markdown = "```js\nconst x = 1;\n```";
      render(<PostContent content={markdown} />);
      const code = screen.getByText("const x = 1;");
      expect(code).toBeInTheDocument();
      expect(code.tagName.toLowerCase()).toBe("code");
    });

    it("renders inline code", () => {
      const markdown = "Use the `console.log()` function.";
      render(<PostContent content={markdown} />);
      const code = screen.getByText("console.log()");
      expect(code).toBeInTheDocument();
      expect(code.tagName.toLowerCase()).toBe("code");
    });

    it("renders links with href", () => {
      const markdown = "[Click here](https://example.com)";
      render(<PostContent content={markdown} />);
      const link = screen.getByRole("link", { name: "Click here" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://example.com");
    });

    it("renders paragraphs", () => {
      const markdown = "First paragraph.\n\nSecond paragraph.";
      render(<PostContent content={markdown} />);
      expect(screen.getByText("First paragraph.")).toBeInTheDocument();
      expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
    });
  });
});
