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

   | Variable              | Required    | Description                                                        |
   | --------------------- | ----------- | ------------------------------------------------------------------ |
   | `GIST_ACCOUNT`        | Recommended | GitHub username whose public Gists are used as posts               |
   | `GITHUB_USERNAME`     | Optional    | Fallback for `GIST_ACCOUNT`                                        |
   | `GIST_IDS`            | Optional    | Fallback: comma-separated Gist IDs when no account is configured   |
   | `GITHUB_CLIENT_ID`    | Required\*  | GitHub OAuth App client ID (for admin panel)                       |
   | `GITHUB_CLIENT_SECRET`| Required\*  | GitHub OAuth App client secret (for admin panel)                   |
   | `NEXTAUTH_SECRET`     | Required    | Random secret for NextAuth — generate with `openssl rand -base64 32` |
   | `NEXTAUTH_URL`        | Required    | Base URL of the app (e.g. `http://localhost:3000` in dev)          |

   \* Only required if you use the admin panel.

   Example `.env.local`:
   ```env
   GIST_ACCOUNT=your-github-username
   GITHUB_CLIENT_ID=your-oauth-app-client-id
   GITHUB_CLIENT_SECRET=your-oauth-app-client-secret
   NEXTAUTH_SECRET=your-generated-secret
   NEXTAUTH_URL=http://localhost:3000
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

This project is optimized for deployment on [Vercel](https://vercel.com).

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

Set each variable in the Vercel dashboard under **Project → Settings → Environment Variables**, or via CLI:

```bash
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add GITHUB_CLIENT_ID production
vercel env add GITHUB_CLIENT_SECRET production
vercel env add GIST_ACCOUNT production
```

> **Important:** `NEXTAUTH_URL` must be set to your production domain (e.g. `https://your-blog.vercel.app`).

---

## Admin Panel

The blog includes a protected admin panel at `/admin` for creating new posts.

### How it works

Authentication is handled by [NextAuth.js](https://next-auth.js.org/) using **GitHub OAuth**. The app requests the `gist` scope so the admin can publish new posts as GitHub Gists.

```
/admin         → redirects to /admin/login if not authenticated
/admin/login   → GitHub OAuth login page
```

Once logged in, the dashboard allows you to:
- Create new blog posts (published as GitHub Gists)
- Sign out

### Setting up GitHub OAuth

1. Go to [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the fields:

   | Field                      | Value                                         |
   | -------------------------- | --------------------------------------------- |
   | Application name           | casper-blog (or any name)                     |
   | Homepage URL               | `https://your-blog.vercel.app`                |
   | Authorization callback URL | `https://your-blog.vercel.app/api/auth/callback/github` |

4. Copy the **Client ID** and **Client Secret** into your environment variables:

   ```env
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
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
