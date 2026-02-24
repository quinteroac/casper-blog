# Requirement: Admin Panel for Content Authoring via Gist

## Context

The blog currently displays posts fetched from GitHub Gists, but content creation happens outside the application (directly on GitHub). An admin panel will allow internal operators to create and manage posts through the app itself, using Gist authentication for access. This improves the authoring workflow by keeping everything in one place.

## Goals

- Enable admins to create new blog posts (as Gists) from within the application.
- Restrict admin access to authenticated users (via GitHub/Gist).
- Ensure newly created Gists appear on the main page after saving.

## User Stories

Each story must be small enough to implement in one focused session.

### US-001: Admin access with Gist authentication

**As an** admin, **I want** to access an administration page that requires Gist authentication **so that** only authorised users can manage content.

**Acceptance Criteria:**

- [ ] Unauthenticated users visiting `/admin` (or equivalent) are redirected to GitHub OAuth/Gist login.
- [ ] After successful authentication, the admin reaches an admin dashboard.
- [ ] Unauthenticated requests to admin routes return 401 or redirect to login.
- [ ] Typecheck / lint passes.
- [ ] **Visually verified in browser.**

### US-002: Create posts with Markdown editor

**As an** admin, **I want** to create new Gists through the admin page using a Markdown editor **so that** I can author posts without leaving the application.

**Acceptance Criteria:**

- [ ] Admin can open a "New post" form with a Markdown editor (title + body).
- [ ] Editor supports Markdown syntax (headings, lists, links, code blocks).
- [ ] Form validates required fields (title, body) before allowing save.
- [ ] Typecheck / lint passes.
- [ ] **Visually verified in browser.**

### US-003: Save Gist and view created posts

**As an** admin, **I want** to save the post to Gist and see my created posts **so that** I can confirm the content is stored and visible.

**Acceptance Criteria:**

- [ ] "Save" button creates a new Gist via the GitHub API using the authenticated user's token.
- [ ] After save, the admin sees success feedback and the new post in a list of their posts.
- [ ] The newly created Gist is visible on the main page (post list) after save.
- [ ] Save failure (network, API error) shows a clear error message.
- [ ] Typecheck / lint passes.
- [ ] **Visually verified in browser.**

## Functional Requirements

- FR-1: Admin routes (`/admin`, `/admin/*`) are protected; unauthenticated users cannot access them.
- FR-2: Authentication uses GitHub OAuth (or equivalent) scoped for Gist read/write.
- FR-3: Admin dashboard displays a "New post" action and a list of posts created by the authenticated user.
- FR-4: Markdown editor allows editing title and body; body supports standard Markdown.
- FR-5: Gist creation uses the GitHub API with the authenticated user's token; new Gists are associated with the user's account.
- FR-6: The main page shows all Gists (no filtering); newly created Gists by the admin appear automatically in the list.

## Non-Goals (Out of Scope)

- Editing or deleting existing Gists from the admin panel.
- User registration or custom user management (authentication is GitHub-only).
- Draft/publish workflow; saving creates a public Gist immediately.
- Rich media upload (images, assets) beyond Markdown-compatible references.

## Open Questions

- None. Main page shows all Gists; admin posts appear automatically after save.
