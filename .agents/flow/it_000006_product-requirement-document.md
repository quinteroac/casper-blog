# Requirement: About Me Section on Home Page

## Context
The blog home page currently only lists posts. Adding an "About Me" section gives visitors immediate context about the author. Content is sourced from the author's GitHub account using the existing `GIST_ACCOUNT` username: first from the profile README.md (the special `{username}/{username}` repository), and falling back to the standard GitHub account profile fields if no README exists.

## Goals
- Display a visually distinct "About Me" section on the home page with the author's identity.
- Reuse the existing `GIST_ACCOUNT` config variable as the source of truth for the GitHub username.
- Prefer rich Markdown content (profile README) over structured profile fields when available.

## User Stories

### US-001: Author can see the About Me section rendered on the home page
**As a** blog author, **I want** an "About Me" section to appear on the home page **so that** visitors immediately know who I am.

**Acceptance Criteria:**
- [ ] The home page (`/`) renders an "About Me" section above or below the post list.
- [ ] The section renders content from the profile README if available, or falls back to the account profile fields (avatar, name, bio, location, website) if not.
- [ ] If neither source yields any content, the section is omitted entirely — the page does not break.
- [ ] Typecheck / lint passes.
- [ ] Visually verified in browser.

### US-002: About Me content is read from the GitHub profile README.md
**As a** blog author, **I want** my GitHub profile README to be the primary source of my About Me content **so that** I manage everything from my GitHub profile page.

**Acceptance Criteria:**
- [ ] The feature reads the username from `GIST_ACCOUNT` (exported from `config/gist.ts`); no username is hardcoded.
- [ ] The fetcher attempts to retrieve the raw `README.md` from the special profile repository: `https://raw.githubusercontent.com/{username}/{username}/HEAD/README.md`.
- [ ] If the README.md exists (HTTP 200), its Markdown content is rendered in the About Me section.
- [ ] The rendered Markdown is sanitized before display (no raw HTML injection).
- [ ] Fetching happens server-side so no credentials are exposed to the client.
- [ ] Typecheck / lint passes.
- [ ] Visually verified in browser with a username that has a profile README.

### US-003: About Me falls back to GitHub account profile when no README exists
**As a** blog author without a GitHub profile README, **I want** the About Me section to still show my account information **so that** the section is never empty for visitors.

**Acceptance Criteria:**
- [ ] If the README.md request returns a non-200 status (e.g. 404), the fetcher falls back to calling `https://api.github.com/users/{username}`.
- [ ] The fallback renders at minimum: avatar image and display name.
- [ ] Optional fields shown when present: bio, location, blog/website URL (as a clickable link).
- [ ] If the GitHub Users API also fails, the section is omitted gracefully — no error is shown to the visitor.
- [ ] Typecheck / lint passes.
- [ ] Visually verified in browser.

## Functional Requirements
- FR-1: The feature reads the username exclusively from `GIST_ACCOUNT` (exported by `config/gist.ts`).
- FR-2: A server-side function `fetchProfileReadme(username: string): Promise<string | null>` fetches `https://raw.githubusercontent.com/{username}/{username}/HEAD/README.md` and returns the raw Markdown string on HTTP 200, or `null` otherwise.
- FR-3: A server-side function `fetchGitHubProfile(username: string): Promise<GitHubProfile | null>` fetches `https://api.github.com/users/{username}` and returns the mapped profile object on success, or `null` on any failure.
- FR-4: A `GitHubProfile` type defines the shape: `{ avatarUrl: string; name: string | null; bio: string | null; location: string | null; website: string | null }`.
- FR-5: The orchestrating logic tries `fetchProfileReadme` first. If it returns a non-null string, that Markdown is passed to the `AboutMe` component as the primary content. Otherwise, `fetchGitHubProfile` is called and its result is passed as the fallback content.
- FR-6: An `AboutMe` React Server Component accepts either `{ mode: "readme"; markdown: string }` or `{ mode: "profile"; profile: GitHubProfile }` and renders accordingly.
- FR-7: In `"readme"` mode, the Markdown is rendered using the existing Markdown renderer (e.g. `react-markdown`) with sanitization.
- FR-8: In `"profile"` mode, the avatar image uses `next/image` with appropriate `alt` text (author's name or `"Author avatar"`).
- FR-9: If both sources return `null`, `AboutMe` is not rendered and the home page shows only the post list.
- FR-10: All network calls are server-side only (Next.js Server Component or equivalent).

## Non-Goals (Out of Scope)
- Editing the GitHub profile or README from within the blog UI.
- Caching or revalidation strategy beyond Next.js defaults.
- Authentication or use of a GitHub token (public API and public repositories only).
- Parsing or transforming the README content beyond standard Markdown rendering.
- Any profile fields beyond `avatar_url`, `name`, `bio`, `location`, `blog`.

## Layout & Visual Decisions
- **Position:** Above the post list (hero-style — first thing visitors see).
- **Style:** Full-width banner — avatar on the left, content (name + README Markdown or profile fields) on the right.
