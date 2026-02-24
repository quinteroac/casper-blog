# Requirement: Blog with Gist as Post Repository

## Context

Create a blog where posts are stored and served from GitHub Gist. Content is written in Markdown. The goal is to validate that readers can discover and read posts without a traditional CMS or file-based storage.

## Goals

- Enable end users to browse a list of posts sourced from Gist
- Enable end users to open and read a single post with Markdown rendered correctly
- Use Gist as the sole source of truth for post content

## User Stories

### US-001: View List of Posts

**As a** visitor, **I want** to see a list of posts **so that** I can choose what to read.

**Acceptance Criteria:**

- [ ] Posts are fetched from a configured Gist (or Gist collection)
- [ ] Each list item shows at least: title and a short preview or date
- [ ] List is ordered (e.g. by date, newest first)
- [ ] Clicking an item navigates to the full post view
- [ ] Typecheck / lint passes
- [ ] Visually verified in browser

### US-002: Read a Full Post

**As a** visitor, **I want** to open and read a full post **so that** I can consume the content.

**Acceptance Criteria:**

- [ ] Full post content is loaded from the corresponding Gist file
- [ ] Markdown is rendered as HTML (headings, lists, code blocks, links, etc.)
- [ ] Post title is displayed
- [ ] User can return to the list (e.g. back link or navigation)
- [ ] Typecheck / lint passes
- [ ] Visually verified in browser

## Functional Requirements

- **FR-1:** The app fetches post metadata and content from GitHub Gist API.
- **FR-2:** Post content is stored as Markdown in Gist files.
- **FR-3:** The app renders Markdown to HTML for display.
- **FR-4:** A configurable Gist ID (or list of IDs) defines the post source.
- **FR-5:** Posts have a title (from Gist filename or frontmatter) and body content.

## Non-Goals (Out of Scope)

- Post creation or editing in the app (authoring stays in Gist/editor)
- Authentication or user accounts
- Comments, likes, or other social features
- Search or filtering of posts
- RSS or other feed formats
- Offline support or PWA

## Open Questions

- How is the Gist ID(s) configured? (env var, config file, etc.)
- Single Gist with multiple files vs multiple Gists?
- How to derive post title/slug from Gist (filename, frontmatter, first heading)?
