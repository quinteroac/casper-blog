# Requirement: TipTap Rich Text Editor in Admin Post Creation

## Context

The current admin panel allows authenticated authors to create blog posts via `NewPostForm`, which uses a plain `<textarea>` for content input. This offers no formatting assistance and forces the author to write raw Markdown by hand. Replacing it with TipTap (open source) provides a WYSIWYG editing experience while keeping the Gist-based Markdown storage unchanged.

## Goals

- Replace the plain textarea in `NewPostForm` with a TipTap rich text editor.
- Give the author visual formatting controls (bold, italic, headings, lists, code, etc.).
- Preserve the existing data flow: content is serialised to Markdown and saved to GitHub Gists.
- Keep the door open for AI extensions in future iterations (no AI scope now).

## User Stories

### US-001: Author sees a rich text editor when creating a post

**As a** blog author authenticated via GitHub OAuth, **I want** to see a TipTap rich text editor instead of a plain textarea on the new-post form **so that** I can write and format content visually.

**Acceptance Criteria:**
- [ ] The `NewPostForm` component renders a TipTap `<Editor>` in place of the `<textarea>`.
- [ ] The editor displays a toolbar with at minimum: Bold, Italic, Heading (H1–H3), Unordered list, Ordered list, Code block, Blockquote.
- [ ] The editor is visually consistent with the existing admin UI (no unstyled raw DOM).
- [ ] Typecheck / lint passes.
- [ ] Visually verified in browser.

### US-002: Author can format content using the toolbar

**As a** blog author, **I want** to apply formatting (bold, italic, headings, lists, code blocks) via toolbar buttons **so that** I do not have to type Markdown syntax manually.

**Acceptance Criteria:**
- [ ] Clicking Bold toggles `<strong>` formatting on selected text.
- [ ] Clicking Italic toggles `<em>` formatting on selected text.
- [ ] Clicking Heading H1/H2/H3 applies the corresponding heading to the current line.
- [ ] Clicking Unordered List / Ordered List wraps the current line in a list.
- [ ] Clicking Code Block wraps the current block in a code fence.
- [ ] Clicking Blockquote wraps the current block in a blockquote.
- [ ] Typecheck / lint passes.
- [ ] Visually verified in browser.

### US-003: Post content is saved to GitHub Gists as Markdown

**As a** blog author, **I want** the TipTap editor content to be converted to Markdown when I submit the form **so that** the post is stored in GitHub Gists exactly as before and remains readable in the existing blog.

**Acceptance Criteria:**
- [ ] On form submit, TipTap's document is serialised to Markdown (e.g. via `@tiptap/pm` + a Markdown serialiser or equivalent open-source utility).
- [ ] The resulting Markdown string is sent to `/api/gists` unchanged from the current payload shape.
- [ ] A post created via the TipTap editor is visible on the blog home page and renders correctly on its detail page.
- [ ] Heading, bold, italic, list, code block, and blockquote formatting round-trips correctly (TipTap → Markdown → react-markdown render).
- [ ] Typecheck / lint passes.
- [ ] Visually verified in browser (post appears and renders as expected).

## Functional Requirements

- **FR-1:** Install `@tiptap/react`, `@tiptap/starter-kit`, and any open-source Markdown serialisation package required (e.g. `tiptap-markdown` or `prosemirror-markdown`). No TipTap Pro or Cloud packages.
- **FR-2:** Create a `RichTextEditor` component (or extend `NewPostForm`) that wraps the TipTap `useEditor` hook and renders the editor with the toolbar described in US-001/US-002.
- **FR-3:** The `RichTextEditor` must expose a controlled interface: accept an `onChange` callback that fires with the current Markdown string on every editor change.
- **FR-4:** `NewPostForm` must use the Markdown string from `RichTextEditor` as the post body sent to `/api/gists`; no other changes to the API route or Gist client.
- **FR-5:** Only open-source TipTap extensions may be used (StarterKit covers most; any additional extensions must be from the `@tiptap/*` open-source packages or community equivalents).
- **FR-6:** Existing unit tests must continue to pass; add tests for the `RichTextEditor` component covering: editor renders, toolbar buttons trigger correct formatting, `onChange` emits valid Markdown.

## Non-Goals (Out of Scope)

- AI-assisted writing, autocomplete, or content suggestions (future iteration).
- Editing or deleting existing posts.
- Draft / auto-save / preview mode.
- Image upload or embedding.
- Switching the blog's storage format away from Markdown.
- Any TipTap Pro or Cloud features.

## Open Questions

- Which Markdown serialisation library integrates most cleanly with TipTap v2? (`tiptap-markdown` is the most common choice — confirm before implementation.)
- Should the toolbar be a fixed bar above the editor or a floating bubble toolbar? (Default: fixed bar, consistent with standard admin UIs.)
