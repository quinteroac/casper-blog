# Requirement: Load Posts from Gist Account

## Context

The blog currently requires manual configuration of Gist IDs in `.env`. This iteration changes the data source so posts are loaded automatically from a GitHub account’s public Gists, with the account username configured in `.env` instead of individual IDs.

## Goals

- Fetch posts from all public Gists of a configured GitHub account
- Use slug-based URLs for posts (e.g. `/posts/my-post`) instead of Gist IDs
- Remove the need to maintain a list of Gist IDs in the environment

## User Stories

### US-001: List posts from Gist account

**As a** visitor, **I want** to see a list of all public Gist-based posts from the configured account **so that** I can browse the blog without manual Gist ID configuration.

**Acceptance Criteria:**

- [ ] The homepage shows a list of public Gists from the account defined in env (e.g. `GIST_ACCOUNT` or `GITHUB_USERNAME`)
- [ ] Each list item displays post metadata (title or filename, date if available)
- [ ] The list is fetched server-side from the GitHub Gists API
- [ ] If the account has no public Gists, the list is empty (no error)
- [ ] Typecheck / lint passes
- [ ] **Visually verified in browser**

### US-002: Open post by slug

**As a** visitor, **I want** to open a post by its slug (e.g. `/posts/hello-world`) **so that** I can read the content with a readable, stable URL.

**Acceptance Criteria:**

- [ ] A post is reachable at `/posts/[slug]` where slug maps to a Gist (e.g. derived from the first filename without extension)
- [ ] The correct Gist content is rendered as Markdown for the given slug
- [ ] Invalid or unknown slugs return a 404
- [ ] Typecheck / lint passes
- [ ] **Visually verified in browser**

## Functional Requirements

- **FR-1:** A single env variable (e.g. `GIST_ACCOUNT`) defines the GitHub username whose public Gists are used as posts.
- **FR-2:** The app fetches the list of public Gists via `GET /users/{username}/gists` (or equivalent).
- **FR-3:** Post slugs are derived from Gist filenames (e.g. `hello-world.md` → slug `hello-world`); the convention is documented or configurable.
- **FR-4:** The homepage renders the list of posts with links to `/posts/[slug]`.
- **FR-5:** The post detail page fetches and renders the Gist file content as Markdown for the requested slug.
- **FR-6:** Gist ID configuration in env is removed or deprecated in favour of account-based fetching.

## Non-Goals (Out of Scope)

- Supporting multiple accounts or per-post account override
- Private Gist access (requires auth)
- Slug customisation or override (e.g. manual slug mapping)
- Pagination of the Gist list (MVP assumes a manageable number of public Gists)
- Caching strategy (can be added later)

## Open Questions

- Exact slug derivation: first file only, or support for multi-file Gists? (Assumption: first file’s base filename.)
- How to handle Gists with multiple files (e.g. `post.md` + `meta.json`)? (Assumption: treat the primary Markdown file as the post.)
- Rate limits: GitHub API allows 60 req/h unauthenticated; consider `GITHUB_TOKEN` for higher limits.
