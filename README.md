# ==== LIVE DEMO ====

[https://berkant.vercel.app](https://berkant.vercel.app)

![image](https://github.com/berkantkarakayis/Portfolio-Website/assets/102322084/3f4bb289-2f9f-4cc3-aae2-e8c4e37dcee2)

![image](https://github.com/berkantkarakayis/Portfolio-Website/assets/102322084/cb3bdd0d-6387-4ef6-855e-46805770dc14)


# Next.js

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Languages

The site is bilingual. English lives at `/`, Turkish at `/tr` (next-intl, `[locale]` segment,
`localePrefix: "as-needed"`). Both routes are statically generated.

- UI strings: `messages/en.json` and `messages/tr.json` (same keys).
- Content (projects, experience, skills, services): `src/Data.jsx` is the English source of truth.
  `messages/tr.json` → `data` holds Turkish overrides keyed by item `id`; any field left out falls
  back to English automatically.

### Adding a project

1. Add the project to `allProjects` in `src/Data.jsx` (title, description, tags, links, image).
2. Add a `data.projects.<id>` block to `messages/tr.json` with the Turkish `description`
   (and `title` / `role` / `cover.sub` / `status` when they are descriptive text).
3. Run `node scripts/i18n-check.mjs` to list anything still missing a translation.

## Analytics & Hacker Mode

The site ships a privacy-friendly, first-party analytics collector (no third parties, no
tracking cookies, anonymous ids, IPs hashed with a daily salt, 90-day retention) and a hidden
dashboard called **Hacker Mode**.

- **Storage:** Upstash Redis. On Vercel: *Storage → Marketplace → Upstash Redis* (injects
  `KV_REST_API_URL` / `KV_REST_API_TOKEN`), or create a database at console.upstash.com and set
  `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. Without credentials the dev server uses an
  in-memory store; production returns 503 from `/api/collect` and records nothing.
- **Enter Hacker Mode:** type `hacker` anywhere on the page (desktop) or tap the header logo five
  times quickly (mobile), then enter an access code. `Esc` hides the dashboard, `h` brings it back,
  `exit` leaves the mode, `logout` also clears the cookie. Type `help` in the command bar for commands.
- **Access codes:** `HACKER_MODE_SECRETS="owner:<secret>,friend1:<secret>"`. Each person gets their
  own label; remove a pair and redeploy to revoke access immediately (existing cookies stop working).
- **Env vars:** see `.env.example`. Generate secrets with `openssl rand -hex 32` (signing key),
  `openssl rand -hex 16` (IP salt) and `openssl rand -base64 18` (access codes). For local
  development copy the file to `.env.local` (gitignored) and run `vercel env pull .env.local` to
  sync from Vercel.
- **Owner exclusion:** logged-in Hacker Mode viewers are never tracked; the `exclude` command
  opts out the current device permanently.
