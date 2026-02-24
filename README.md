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
   git clone https://github.com/quinteroac/casper-blog.git
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

## Deployment (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com), the platform built by the creators of Next.js.

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/quinteroac/casper-blog)

### Manual deploy via CLI

1. **Install the Vercel CLI**

   ```bash
   bun add -g vercel
   ```

2. **Log in to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel          # preview deployment
   vercel --prod   # production deployment
   ```

### Environment variables on Vercel

Set your environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**, or via the CLI:

```bash
vercel env add GIST_ACCOUNT
```

| Variable          | Required  | Description                                           |
| ----------------- | --------- | ----------------------------------------------------- |
| `GIST_ACCOUNT`    | Recommended | GitHub username whose public Gists are used as posts |
| `GITHUB_USERNAME` | Optional  | Fallback for `GIST_ACCOUNT`                           |
| `GIST_IDS`        | Optional  | Fallback: comma-separated Gist IDs                    |

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
