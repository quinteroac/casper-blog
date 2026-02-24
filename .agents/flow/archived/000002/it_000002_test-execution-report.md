# Test Execution Report (Iteration 000002)

- Test Plan: `it_000002_TP.json`
- Total Tests: 16
- Passed: 14
- Failed: 2

| Test ID | Description | Status | Correlated Requirements | Artifacts |
| --- | --- | --- | --- | --- |
| TC-001-01 | Env variable `GIST_ACCOUNT` (or equivalent) is read and used when fetching Gists | passed | US-001, FR-1 | `.agents/flow/it_000002_test-execution-artifacts/TC-001-01_attempt_001.json` |
| TC-001-02 | Gist fetcher calls `GET /users/{username}/gists` with the account from config | passed | US-001, FR-2 | `.agents/flow/it_000002_test-execution-artifacts/TC-001-02_attempt_001.json` |
| TC-001-03 | Slug derivation converts first filename to slug (e.g. `hello-world.md` → `hello-world`) | passed | US-001, FR-3 | `.agents/flow/it_000002_test-execution-artifacts/TC-001-03_attempt_001.json` |
| TC-001-04 | Homepage renders a list of posts with links to `/posts/[slug]` | passed | US-001, FR-4 | `.agents/flow/it_000002_test-execution-artifacts/TC-001-04_attempt_001.json` |
| TC-001-05 | Account with no public Gists shows empty list, no error | passed | US-001 | `.agents/flow/it_000002_test-execution-artifacts/TC-001-05_attempt_001.json` |
| TC-001-06 | Each list item includes post metadata (title/filename, date if available) | failed | US-001 | `.agents/flow/it_000002_test-execution-artifacts/TC-001-06_attempt_001.json` |
| TC-001-07 | Gist list is fetched server-side (not client-side) | passed | US-001 | `.agents/flow/it_000002_test-execution-artifacts/TC-001-07_attempt_001.json` |
| TC-001-08 | Typecheck and lint pass for Gist list feature | passed | US-001 | `.agents/flow/it_000002_test-execution-artifacts/TC-001-08_attempt_001.json` |
| TC-001-09 | No Gist ID env variable required; account-based fetch used | passed | US-001, FR-6 | `.agents/flow/it_000002_test-execution-artifacts/TC-001-09_attempt_001.json` |
| TC-002-01 | Post page fetches Gist content for slug and renders as Markdown | failed | US-002, FR-5 | `.agents/flow/it_000002_test-execution-artifacts/TC-002-01_attempt_001.json` |
| TC-002-02 | Slug correctly maps to Gist file (filename without extension → slug) | passed | US-002, FR-3 | `.agents/flow/it_000002_test-execution-artifacts/TC-002-02_attempt_001.json` |
| TC-002-03 | Unknown or invalid slug returns 404 | passed | US-002 | `.agents/flow/it_000002_test-execution-artifacts/TC-002-03_attempt_001.json` |
| TC-002-04 | Homepage links to `/posts/[slug]` resolve to correct post content | passed | US-002, FR-4 | `.agents/flow/it_000002_test-execution-artifacts/TC-002-04_attempt_001.json` |
| TC-002-05 | Typecheck and lint pass for post detail feature | passed | US-002 | `.agents/flow/it_000002_test-execution-artifacts/TC-002-05_attempt_001.json` |
| TC-001-10 | Visual layout and spacing of post list look correct | passed | US-001 | `.agents/flow/it_000002_test-execution-artifacts/TC-001-10_attempt_001.json` |
| TC-002-06 | Visual rendering of Markdown (headings, code blocks, links) looks correct | passed | US-002 | `.agents/flow/it_000002_test-execution-artifacts/TC-002-06_attempt_001.json` |

