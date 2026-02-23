# Project Context

<!-- Created or updated by `bun nvst create project-context`. Cap: 250 lines. -->

## Conventions

- **Naming:**
  - Files: kebab-case for config; PascalCase for React components; camelCase for utilities.
  - Variables/functions: camelCase.
  - Constants: UPPER_SNAKE_CASE.
- **Formatting:** Prettier + ESLint (project-specific config when added).
- **Git flow:** Feature branches per iteration (e.g. `feature/it_000001`).
- **Workflow:** Define → Prototype → Refactor; artifacts in `.agents/flow/`.

## Tech Stack

- **Language(s):** TypeScript
- **Runtime:** Bun
- **Frameworks:** Next.js (App Router)
- **Key libraries:** React, Markdown renderer (e.g. react-markdown), GitHub Gist API client
- **Package manager:** bun
- **Build / tooling:** Next.js build, TypeScript strict mode

## Code Standards

- **Style:** Functional components; prefer server components where possible.
- **Error handling:** Explicit error states for Gist fetch failures; graceful fallbacks.
- **Module organisation:** Feature-based structure under `src/` or `app/`.
- **Forbidden:** Inline secrets; hardcoded Gist IDs (use env/config).

## Testing Strategy

- **Approach:** Code first, tests after; critical paths (Gist fetch, Markdown render).
- **Runner:** Vitest
- **Coverage:** Not enforced initially.
- **Test location:** Colocated `*.test.ts` or `__tests__/` alongside source.

## Product Architecture

```
[User] → [Next.js App]
            ├── / (Post list) → fetch Gist metadata → render list
            └── /posts/[slug] → fetch Gist file → render Markdown
                  ↑
            [GitHub Gist API]
```

- **Main components:** Post list page, Post detail page, Gist fetcher, Markdown renderer.
- **Data flow:** Gist ID(s) from env → fetch on server → pass to components.

## Modular Structure

- **app/:** Next.js App Router pages and layouts.
- **lib/ or src/lib/:** Gist API client, Markdown parsing, post type definitions.
- **components/:** Reusable UI (PostCard, PostContent, Layout).
- **config/:** Gist ID(s), env schema.

## Implemented Capabilities

- (none yet — populated after first Refactor)
