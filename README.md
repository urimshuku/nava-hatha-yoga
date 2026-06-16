# Nava Hatha Yoga

A premium, calm, light-only website for **Nava Hatha Yoga** — Classical Hatha Yoga taught in its original form in Saranda, Albania, by Erlinda Mustafaraj.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Sanity CMS**.

## Tech stack

- Next.js 16 (App Router, Server Components first)
- TypeScript
- Tailwind CSS v3 (design tokens in `tailwind.config.ts`)
- Sanity CMS v6 + `next-sanity` (embedded Studio at `/studio`)
- `next/font` (Cormorant Garamond + Inter)
- Framer Motion (subtle animations only)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.local.example .env.local
   ```

   Then add your Sanity `projectId` and `dataset`. Create a free project at
   [sanity.io/manage](https://www.sanity.io/manage) if you don't have one.

3. Run the dev server:

   ```bash
   npm run dev
   ```

   - Site: [http://localhost:3000](http://localhost:3000)
   - Studio (CMS): [http://localhost:3000/studio](http://localhost:3000/studio)

> The site renders with built-in placeholder content even before Sanity is
> configured, so you can preview the design immediately.

## Seeding the CMS

Once your Sanity project is connected, populate the Studio with the 11 programs
and sample content:

```bash
npx sanity login
npm run seed
```

## Editing content (for the client)

Everything editable lives in the Studio (`/studio`):

- **Site Settings** — brand name, contact details, WhatsApp number, default SEO
- **Home Page** — hero, sections, featured programs, calls to action
- **About Page** — teacher story and training background
- **Programs** — add/edit/reorder programs, each with its own detail page
- **Events** — upcoming events appear automatically; past events move to the archive
- **Retreats** — CMS-ready (currently shown as "Coming Soon")
- **Legal Pages** — Terms, Privacy, Cookie policy

## Project structure

```
app/            App Router routes (site pages, studio, api, sitemap, robots)
components/     Reusable UI, layout, card, content, and form components
sanity/         Sanity client, schemas, queries, desk structure
lib/            SEO helpers, constants, placeholders, utilities
seed/           Seed data (NDJSON) for first-time CMS population
```

## Troubleshooting

### `npm run dev` shows `EMFILE: too many open files` and pages 404

This is a macOS file-descriptor limit issue (the default soft limit is only
256), not a code problem. The `dev` script already raises the limit
automatically. If you still hit it, raise it in your shell before running dev:

```bash
ulimit -n 65536
npm run dev
```

To raise it permanently for your shell, add `ulimit -n 65536` to your
`~/.zshrc` (or `~/.bashrc`). Optionally, installing Watchman makes file
watching far more efficient:

```bash
brew install watchman
```

### `Another next dev server is already running`

A previous dev server didn't shut down cleanly. The `predev` script clears
stale locks automatically. If a real server is still running, stop it first
(the message prints the PID, e.g. `kill <pid>`), or just run `npm run dev`
again.

### `npm install` peer dependency errors

This project uses React 19 (required by Next 16 and next-sanity 13). If you see
`ERESOLVE` errors, make sure you're on Node 18.18+ (Node 20+ recommended) and
delete `node_modules` + `package-lock.json`, then `npm install` again.

## Notes

- All classes are currently **in-person only**. Retreats are "coming soon".
- No online payments — registration is handled manually / in person.
- Light-only visual system; restrained, accessible, responsive.
