# Requirement: Author GitHub Avatar in Post List

## Context

The post list page (`/`) currently shows posts without any author identity. The author's profile picture should appear alongside each post entry on this page only, giving the blog a more personal and polished look. The avatar is not displayed on post detail pages (`/posts/[slug]`). The username is read from `GIST_ACCOUNT` (the Gist/GitHub identity). The avatar URL is constructed from this username using GitHub's CDN (e.g. `https://avatars.githubusercontent.com/<username>`), since Gist accounts use GitHub identities.

## Goals

- Display the author's avatar on the post list page.
- Retrieve the avatar from GitHub using the `GIST_ACCOUNT` identity (no local storage or manual upload needed).

## User Stories

### US-001: Display author avatar on the post list page

**As an** author/admin, **I want** my profile picture to appear on the post list page **so that** readers can see who wrote the blog.

**Acceptance Criteria:**
- [ ] The post list page (`/`) renders the author's avatar image.
- [ ] The avatar is visible without requiring the reader to be logged in.
- [ ] The avatar URL is derived from `GIST_ACCOUNT` (no hardcoded URLs).
- [ ] The avatar is fetched server-side (server component or `getServerSideProps`-equivalent) — not in the browser.
- [ ] If the avatar fails to load, a fallback is shown. The exact fallback type (e.g. generic user icon or first letter of username) is an implementation choice, but a broken image must never be displayed.
- [ ] If `GIST_ACCOUNT` is missing or empty, the fallback (same as for failed avatar load) is shown and no error is thrown.
- [ ] Changing the GitHub profile picture is reflected on the blog without a code change (only a cache/redeploy may be needed).
- [ ] Typecheck / lint passes.
- [ ] Visually verified in browser: avatar appears on the post list page.

---

## Functional Requirements

- FR-1: The application must read the GitHub username from the `GIST_ACCOUNT` environment variable.
- FR-2: The avatar URL must be constructed using the GitHub CDN pattern (e.g. `https://github.com/<username>.png` or `https://avatars.githubusercontent.com/<username>`).
- FR-3: The avatar image must be rendered in the post list page component using a Next.js `<Image>` component (or `<img>` with appropriate sizing).
- FR-4: The avatar fetch must occur server-side to avoid exposing unnecessary client-side requests.
- FR-5: A fallback must be defined for cases where the avatar cannot be loaded or `GIST_ACCOUNT` is missing.

## Non-Goals (Out of Scope)

- Displaying per-post author avatars for multi-author scenarios.
- Uploading or storing custom avatars (GitHub is the sole source).
- Showing the avatar on the post detail page (`/posts/[slug]`).
- Adding author name or bio alongside the avatar.
- Full accessibility audit or WCAG compliance for the avatar (basic alt text is expected; screen-reader optimisation is out of scope for this iteration).

## Open Questions

- None.
