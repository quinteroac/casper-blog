# Test Plan - Iteration 000002

## Scope

- Gist account-based post listing: fetching public Gists from a configured GitHub account.
- Slug-based post URLs and routing: mapping filenames to slugs (e.g. `hello-world.md` → `hello-world`).
- Post list and post detail rendering: homepage list with links and post detail Markdown rendering.
- Environment configuration: single `GIST_ACCOUNT` variable; removal/deprecation of Gist ID configuration.
- Error and edge cases: empty account, unknown slug (404), typecheck/lint.

## Environment and data

- **Runtime:** Bun.
- **Test runner:** Vitest.
- **Environment:** `GIST_ACCOUNT` (or equivalent) must be configurable for tests; use a test account or mocked API.
- **API:** GitHub Gists API; tests should mock `GET /users/{username}/gists` and Gist file fetch to avoid network dependency.
- **Fixtures:** Mock Gist response payloads for list and file content; empty list for no-Gists scenario.

## User Story: US-001 - List posts from Gist account

| Test Case ID | Description | Type (unit/integration/e2e) | Mode (automated/manual) | Correlated Requirements (US-XXX, FR-X) | Expected Result |
|---|---|---|---|---|---|
| TC-001-01 | Env variable `GIST_ACCOUNT` (or equivalent) is read and used when fetching Gists | unit | automated | US-001, FR-1 | Config/client resolves username from env; test asserts correct variable is used |
| TC-001-02 | Gist fetcher calls `GET /users/{username}/gists` with the account from config | integration | automated | US-001, FR-2 | Mocked fetch receives correct URL; response is parsed |
| TC-001-03 | Slug derivation converts first filename to slug (e.g. `hello-world.md` → `hello-world`) | unit | automated | US-001, FR-3 | Utility returns correct slug for given filename(s) |
| TC-001-04 | Homepage renders a list of posts with links to `/posts/[slug]` | integration | automated | US-001, FR-4 | Rendered HTML contains post list and valid `/posts/{slug}` links |
| TC-001-05 | Account with no public Gists shows empty list, no error | integration | automated | US-001, US-001-AC04 | Page renders empty list; no 500 or thrown error |
| TC-001-06 | Each list item includes post metadata (title/filename, date if available) | integration | automated | US-001, US-001-AC02 | DOM assertions verify metadata presence |
| TC-001-07 | Gist list is fetched server-side (not client-side) | integration | automated | US-001, US-001-AC03 | Assert list data is present in initial server response |
| TC-001-08 | Typecheck and lint pass for Gist list feature | unit | automated | US-001, US-001-AC05 | `bun run typecheck` and `bun run lint` succeed |
| TC-001-09 | No Gist ID env variable required; account-based fetch used | unit | automated | US-001, FR-6 | Config/Gist client does not depend on `GIST_ID` or similar; only `GIST_ACCOUNT` is used |
| TC-001-10 | Visual layout and spacing of post list look correct | e2e | manual | US-001, US-001-AC06 | **Justification:** Subjective visual layout and spacing cannot be reliably asserted via DOM/state; human verification required. |

## User Story: US-002 - Open post by slug

| Test Case ID | Description | Type (unit/integration/e2e) | Mode (automated/manual) | Correlated Requirements (US-XXX, FR-X) | Expected Result |
|---|---|---|---|---|---|
| TC-002-01 | Post page fetches Gist content for slug and renders as Markdown | integration | automated | US-002, FR-5 | Request to `/posts/{slug}` returns HTML with rendered Markdown content |
| TC-002-02 | Slug correctly maps to Gist file (filename without extension → slug) | unit | automated | US-002, FR-3 | Given slug, correct Gist file is resolved and fetched |
| TC-002-03 | Unknown or invalid slug returns 404 | integration | automated | US-002, US-002-AC03 | `GET /posts/invalid-slug` returns 404 status |
| TC-002-04 | Homepage links to `/posts/[slug]` resolve to correct post content | e2e | automated | US-002, US-002-AC01, FR-4 | Click list link navigates to correct post; content matches slug |
| TC-002-05 | Typecheck and lint pass for post detail feature | unit | automated | US-002, US-002-AC04 | `bun run typecheck` and `bun run lint` succeed |
| TC-002-06 | Visual rendering of Markdown (headings, code blocks, links) looks correct | e2e | manual | US-002, US-002-AC05 | **Justification:** Subjective typography and Markdown styling cannot be fully validated via DOM structure; human verification required. |

## Functional Requirements Coverage

| FR-ID | Description | Covered by Test Case(s) |
|-------|-------------|-------------------------|
| FR-1 | Single env variable defines GitHub account | TC-001-01 |
| FR-2 | Fetch public Gists via `GET /users/{username}/gists` | TC-001-02 |
| FR-3 | Post slugs derived from Gist filenames | TC-001-03, TC-002-02 |
| FR-4 | Homepage renders list with links to `/posts/[slug]` | TC-001-04, TC-002-04 |
| FR-5 | Post detail fetches and renders Gist as Markdown | TC-002-01 |
| FR-6 | Gist ID configuration removed or deprecated | TC-001-09 |

## Appendix: Manual Test Justification

- **TC-001-10:** Visual layout and spacing are subjective and depend on CSS; automated assertions on dimensions/positioning are brittle and environment-dependent.
- **TC-002-06:** Markdown styling (typography, code highlighting, link appearance) is best verified visually; DOM structure can be tested, but final appearance requires human check.
