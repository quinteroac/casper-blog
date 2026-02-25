"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown, type MarkdownStorage } from "tiptap-markdown";

interface RichTextEditorProps {
  onChange: (markdown: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export default function RichTextEditor({
  onChange,
  disabled = false,
  hasError = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    editable: !disabled,
    onUpdate({ editor }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mdStorage = editor.storage as unknown as { markdown: MarkdownStorage };
      onChange(mdStorage.markdown.getMarkdown());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  function toolbarBtn(
    label: string,
    title: string,
    onClick: () => void,
    active: boolean,
  ) {
    return (
      <button
        key={title}
        type="button"
        className={`rich-text-editor__toolbar-btn${active ? " is-active" : ""}`}
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={title}
        aria-pressed={active}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      className={`rich-text-editor${hasError ? " rich-text-editor--error" : ""}`}
    >
      <div
        className="rich-text-editor__toolbar"
        role="toolbar"
        aria-label="Formatting toolbar"
      >
        {toolbarBtn(
          "B",
          "Bold",
          () => editor?.chain().focus().toggleBold().run(),
          !!editor?.isActive("bold"),
        )}
        {toolbarBtn(
          "I",
          "Italic",
          () => editor?.chain().focus().toggleItalic().run(),
          !!editor?.isActive("italic"),
        )}
        <span className="rich-text-editor__toolbar-separator" />
        {toolbarBtn(
          "H1",
          "Heading 1",
          () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
          !!editor?.isActive("heading", { level: 1 }),
        )}
        {toolbarBtn(
          "H2",
          "Heading 2",
          () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
          !!editor?.isActive("heading", { level: 2 }),
        )}
        {toolbarBtn(
          "H3",
          "Heading 3",
          () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
          !!editor?.isActive("heading", { level: 3 }),
        )}
        <span className="rich-text-editor__toolbar-separator" />
        {toolbarBtn(
          "UL",
          "Unordered list",
          () => editor?.chain().focus().toggleBulletList().run(),
          !!editor?.isActive("bulletList"),
        )}
        {toolbarBtn(
          "OL",
          "Ordered list",
          () => editor?.chain().focus().toggleOrderedList().run(),
          !!editor?.isActive("orderedList"),
        )}
        <span className="rich-text-editor__toolbar-separator" />
        {toolbarBtn(
          "</>",
          "Code block",
          () => editor?.chain().focus().toggleCodeBlock().run(),
          !!editor?.isActive("codeBlock"),
        )}
        {toolbarBtn(
          "❝",
          "Blockquote",
          () => editor?.chain().focus().toggleBlockquote().run(),
          !!editor?.isActive("blockquote"),
        )}
      </div>
      <EditorContent
        editor={editor}
        className="rich-text-editor__content"
      />
    </div>
  );
}
