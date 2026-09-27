# saadw50.github.io

Academic portfolio of Shad Ebny Wahid, EEE undergraduate at Jamalpur Science and Technology University.

Live at https://saadw50.github.io

Built with [Next.js](https://nextjs.org) (App Router, TypeScript) and exported as a static site: `next build` writes plain HTML, CSS and JS to `out/`, and GitHub Actions publishes that folder to GitHub Pages.

## Work on it locally

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000, reloads on save
npm run build      # static export to out/
npm run preview    # serve out/ like GitHub Pages (gzip) at http://localhost:8766
npm run lint
```

## Where things live

| Path | What it holds |
| --- | --- |
| `app/page.tsx` | The page: section order and JSON-LD |
| `app/layout.tsx` | Fonts (self-hosted Google Fonts), title, description, Open Graph |
| `app/globals.css` | All styles, light and dark themes |
| `components/` | One component per section, plus the interactive figures |
| `lib/scope-sim.ts` | The simulated sector scan in the hero |
| `lib/beam.ts` | Beam-pattern maths for the Fig. 3 explorer |
| `lib/site.ts` | Name, links, contact details and the "Updated" date |
| `public/` | Photos, CV, favicon files served as-is |
| `scripts/make-images.mjs` | Makes smaller copies of the photos (`npm run images`) |

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which lints, builds and publishes `out/`.
One-time setting: GitHub repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The same repo also deploys to Vercel with no extra configuration (import the repo at vercel.com/new).
