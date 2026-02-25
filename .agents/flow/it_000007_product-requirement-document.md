# Requirement: Profile Photo in About Me Section

## Context

The About Me section on the blog home page currently shows either (a) Markdown from the GitHub profile README, or (b) a profile block with name, bio, location, and an avatar when the README is absent. When the README is used, no profile photo is shown. This requirement adds the author's profile photo (from GitHub) into the About Me section so it is visible in both modes, using the existing gist username variable (`GIST_ACCOUNT`) to resolve the image.

## Goals

- Display the blog author's GitHub profile photo in the About Me section (banner/block).
- Use the existing `GIST_ACCOUNT` (or equivalent gist username) variable as the single source for the GitHub username when resolving the profile image.
- Ensure the displayed image corresponds to the configured GitHub user and is visible to visitors.

## User Stories

Each story is small enough to implement in one focused session.

### US-001: Profile photo is visible in the About Me section

**As a** blog author (admin), **I want** my profile photo to appear in the About Me section **so that** visitors see who I am at a glance.

**Acceptance Criteria:**

- [ ] When About Me is rendered (readme or profile mode), a profile image is visible in the About Me block/banner.
- [ ] The image URL is derived from the GitHub user associated with the gist username variable (e.g. `https://github.com/{username}.png` or the GitHub API `avatar_url` for that user).
- [ ] No hardcoded usernames or avatar URLs; the username comes from config (e.g. `GIST_ACCOUNT`).
- [ ] Typecheck / lint passes.
- [ ] **Visually verified in browser.**

### US-002: Profile photo is taken from the GitHub profile

**As a** blog author, **I want** the About Me profile photo to be the same as my GitHub profile picture **so that** the blog reflects my GitHub identity without extra configuration.

**Acceptance Criteria:**

- [ ] The photo shown in About Me is the avatar for the GitHub user identified by the gist username variable (same user used for Gists / profile README).
- [ ] If the app already fetches GitHub profile data for About Me, the avatar URL from that source (e.g. `avatar_url` or fallback `https://github.com/{username}.png`) may be used; otherwise the URL is built from the gist username variable.
- [ ] Typecheck / lint passes.
- [ ] **Visually verified in browser.**

## Functional Requirements

- **FR-1:** The About Me section receives or has access to the GitHub username from the gist username variable (e.g. `GIST_ACCOUNT`) so the profile image can be resolved.
- **FR-2:** In readme mode, the About Me UI shows the profile photo (e.g. in a banner or header area) in addition to the Markdown content.
- **FR-3:** In profile mode, the existing avatar in the About Me block continues to use the same GitHub user (gist username); no second source of truth.
- **FR-4:** Avatar URL is built from the username (e.g. `https://github.com/{username}.png`) or taken from existing profile fetch; no inline secrets or hardcoded user IDs.

## Non-Goals (Out of Scope)

- Changing where About Me appears (e.g. moving it to another page).
- Allowing upload or custom profile images; only GitHub-sourced avatar.
- Modifying the gist username variable name or config schema beyond using it for the avatar.

## Open Questions

- None at this time.
