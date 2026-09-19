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
