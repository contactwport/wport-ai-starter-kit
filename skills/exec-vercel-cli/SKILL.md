---
name: exec-vercel-cli
description: >-
  Runs Vercel CLI for login, project linking, deploy, env vars, and multi-project
  monorepo patterns. Use when the user mentions Vercel, vercel deploy, preview URL,
  or hosting static sites / open-slide / resume HTML from one repo.
---

# Vercel CLI

Upstream: [Vercel CLI](https://vercel.com/docs/cli)

Prefer project-local execution (no global install required):

```bash
npx vercel <command>
```

## Auth

```bash
npx vercel login
npx vercel whoami
```

For CI, create a token in Vercel dashboard → Account Settings → Tokens. Store as `VERCEL_TOKEN` in the secret store — never commit values.

## Common commands

```bash
# Link current directory to a Vercel project (creates .vercel/)
npx vercel link

# Deploy preview (default)
npx vercel

# Deploy production
npx vercel --prod

# List deployments
npx vercel ls

# Pull env vars to .env.local
npx vercel env pull

# Set env var (production)
npx vercel env add <NAME> production
```

## Static output (resume HTML, open-slide export)

When the build output is a plain folder of static files:

```bash
# From the folder that contains index.html (or your output root)
npx vercel --prod
```

If Vercel asks for settings on first deploy:

| Prompt | Typical answer |
|--------|----------------|
| Framework | Other / None |
| Build Command | leave empty or your build script |
| Output Directory | `dist`, `out`, `doc/resume`, etc. |

## One repo → two Vercel sites (monorepo)

Use **two separate Vercel projects** pointing at the **same Git repo**, each with its own Root Directory and Output Directory.

Example layout:

```text
my-career-workspace/
├── slides/              # open-slide deck(s)
├── doc/resume/          # rendered resume + reports (static HTML)
├── vercel.resume.json   # optional per-site config
└── vercel.slides.json
```

**Project A — Resume site**

- Root Directory: `.` (or subfolder if you isolate resume assets)
- Build Command: `node templates/resume/render.mjs doc/resume/resume.json doc/resume/resume.html` (if needed)
- Output Directory: `doc/resume`
- Install Command: leave empty for pure static

**Project B — open-slide site**

- Root Directory: `.` (open-slide workspace root)
- Build Command: `pnpm build` or `npx @open-slide/cli build` per your open-slide setup
- Output Directory: per open-slide docs (often `dist`)

In each subfolder you can add a minimal `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist"
}
```

Link separately from each logical app root:

```bash
cd /path/to/workspace
npx vercel link    # choose project "my-resume"
# set Root Directory = doc/resume in Vercel dashboard

cd /path/to/workspace
npx vercel link    # choose project "my-slides"
# set Root Directory = . and Build = open-slide build
```

**Dashboard path:** Project → Settings → General → Root Directory.

Each project gets its own `*.vercel.app` URL and custom domain.

## CI checklist

- [ ] `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` set per project (from `.vercel/project.json` after `vercel link`)
- [ ] `VERCEL_TOKEN` in CI secrets
- [ ] Production deploy: `npx vercel deploy --prod --token=$VERCEL_TOKEN`

## Safety

- Never commit `.vercel/` if it contains org-specific IDs you do not want shared — or commit only after team agreement.
- Confirm `outputDirectory` before `--prod`; wrong directory publishes the wrong site.
