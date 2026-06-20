# Storyfied — concept page

A single static `index.html` (no build step, no dependencies) describing the
Storyfied extension. Ready to deploy to Vercel as-is.

## Preview locally

Just open the file:

```bash
open concept/index.html      # macOS
```

…or serve it: `npx serve concept`.

## Deploy to Vercel

Because it's one static file, there's nothing to build — point Vercel at this
folder and it serves `index.html` directly.

**Option A — Dashboard (no CLI):**

1. Push this repo to GitHub.
2. On <https://vercel.com> → **Add New… → Project** → import the repo.
3. In project settings set **Root Directory** to `concept`.
4. **Framework Preset:** Other. Leave Build Command empty and Output Directory
   blank (it serves the static files).
5. **Deploy.** You'll get a `*.vercel.app` URL.

**Option B — Vercel CLI:**

```bash
npm i -g vercel
cd concept
vercel            # first run links/creates the project
vercel --prod     # promote to production
```

When prompted, accept the defaults — there is no build command and the output
directory is the current folder.

To use a custom domain, add it under the project's **Settings → Domains**.
