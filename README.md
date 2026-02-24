# casper-blog

A blog powered by Next.js and GitHub Gists.

> ⚠️ **Work in Progress** — This project is currently under active development.

---

## Prerequisites

- [Bun](https://bun.sh/) ≥ 1.0
- Node.js ≥ 18 (required by Next.js)

---

## Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd casper-blog
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure environment variables**

   Copy the example env file and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   | Variable           | Description                                                       |
   | ------------------ | ----------------------------------------------------------------- |
   | `GIST_ACCOUNT`     | GitHub username whose public Gists are used as posts (recommended) |
   | `GITHUB_USERNAME`  | Fallback for `GIST_ACCOUNT`                                       |
   | `GIST_IDS`         | Fallback: comma-separated Gist IDs when no account is configured  |

   Example (recommended):
   ```env
   GIST_ACCOUNT=your-github-username
   ```

   Example (legacy):
   ```env
   GIST_IDS=abc123def456,ghi789jkl012
   ```

---

## Development

Start the local development server:

```bash
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Build

Compile the production bundle:

```bash
bun run build
```

---

## Running in Production

After building, start the production server:

```bash
bun run start
```

---

## Testing

Run the test suite once:

```bash
bun run test
```

Run tests in watch mode:

```bash
bun run test:watch
```

---

## Linting & Type Checking

```bash
bun run lint        # ESLint
bun run typecheck   # TypeScript type check (no emit)
```
