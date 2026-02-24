# Test Plan - Iteration 000001

## Scope

- Post list page (`/`) and post detail page (`/posts/[slug]`) behaviour.
- Gist API client: fetch metadata and file content.
- Markdown rendering: conversion of post content to HTML.
- Configuration: Gist ID(s) from env/config and post source resolution.
- Navigation: list item click → post view; back link → list.

## Environment and data

- **Runtime:** Bun.
- **Test runner:** Vitest (unit and integration).
- **Build:** `bun run build` must succeed before running tests.
- **Environment variables:** `GIST_ID` or equivalent config for Gist source (mocked in tests).
- **Fixtures:** Sample Gist metadata and Markdown content for deterministic unit/integration tests.

---

## User Story: US-001 - View List of Posts

| Test Case ID | Description | Type | Mode | Correlated Requirements | Expected Result |
|---|---|---|---|---|---|
| TC-001-01 | Gist client fetches metadata from configured Gist ID | unit | automated | US-001, FR-1, FR-4 | Returns post metadata array when Gist ID is valid |
| TC-001-02 | Config resolves Gist ID from env/config | unit | automated | US-001, FR-4 | Correct Gist ID(s) used when env is set |
| TC-001-03 | Post list component displays title and preview/date for each post | unit | automated | US-001, US-001-AC02, FR-5 | Each PostCard shows title and at least preview or date |
| TC-001-04 | Post list is ordered by date (newest first) | unit | automated | US-001, US-001-AC03 | List order matches sorted-by-date expectation |
| TC-001-05 | Post list link navigates to `/posts/[slug]` | integration | automated | US-001, US-001-AC04 | Clicking a post item navigates to correct post URL |
| TC-001-06 | Typecheck and lint pass | unit | automated | US-001-AC05 | `bun run typecheck` and `bun run lint` exit 0 |
| TC-001-07 | Post list page renders correctly in browser | e2e | manual | US-001-AC06 | Layout, spacing, and visual hierarchy match design intent. *Justification: subjective visual feel cannot be reliably asserted via DOM/state.* |

---

## User Story: US-002 - Read a Full Post

| Test Case ID | Description | Type | Mode | Correlated Requirements | Expected Result |
|---|---|---|---|---|---|
| TC-002-01 | Gist client fetches file content by slug | unit | automated | US-002, US-002-AC01, FR-1 | Returns raw Markdown content for given slug |
| TC-002-02 | Markdown renderer converts content to HTML | unit | automated | US-002, US-002-AC02, FR-2, FR-3 | Headings, lists, code blocks, links render as valid HTML |
| TC-002-03 | Post detail page displays post title | unit | automated | US-002, US-002-AC03, FR-5 | Title from frontmatter or filename is shown |
| TC-002-04 | Post has title and body derived from Gist | unit | automated | US-002, FR-2, FR-5 | Parsed post includes non-empty title and body |
| TC-002-05 | Back link or navigation returns to list | integration | automated | US-002, US-002-AC04 | Navigating back reaches `/` (post list) |
| TC-002-06 | Typecheck and lint pass | unit | automated | US-002-AC05 | `bun run typecheck` and `bun run lint` exit 0 |
| TC-002-07 | Full post page renders correctly in browser | e2e | manual | US-002-AC06 | Typography, spacing, code highlighting, and readability match design. *Justification: subjective visual quality cannot be asserted via DOM/state.* |

---

## Cross-cutting Test Cases

| Test Case ID | Description | Type | Mode | Correlated Requirements | Expected Result |
|---|---|---|---|---|---|
| TC-X-01 | Gist fetch failure shows explicit error state | unit | automated | FR-1 | Error component or fallback is rendered; no uncaught exception |
| TC-X-02 | Invalid or missing Gist ID yields graceful fallback | unit | automated | FR-4 | App handles missing config without crash |
| TC-X-03 | Markdown with code blocks renders code element | unit | automated | FR-3 | Code blocks produce `<pre><code>...</code></pre>` or equivalent |
| TC-X-04 | Markdown with links renders anchor elements | unit | automated | FR-3 | Links produce `<a href="...">` with correct attributes |

---

## Checklist

- [x] Read `it_000001_PRD.json`
- [x] Read `.agents/PROJECT_CONTEXT.md`
- [x] Plan includes **Scope** section with at least one bullet
- [x] Plan includes **Environment and data** section with at least one bullet
- [x] Test cases are grouped by user story
- [x] Every `FR-N` is covered by automated test cases
- [x] Every test case includes correlated requirement IDs (`US-XXX`, `FR-X`)
- [x] Manual tests are only UI/UX nuance checks that cannot be validated via DOM/state assertions
- [x] File written to `.agents/flow/it_000001_test-plan.md`
