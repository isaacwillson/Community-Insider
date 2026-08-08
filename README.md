# Realtor Insider — demo prototype

A look-and-feel prototype for a New Jersey realtor specializing in new
construction. **Everything in it is fake**: builders, communities, pricing,
incentives, and the agent's name are all invented sample data.

Static Next.js. No backend, no database, no form submissions, no analytics.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build
```

## Deploy

Import the repo on Vercel and deploy. There is no configuration, no environment
variable, and no build command to set — the defaults are correct. Every route is
prerendered at build time.

## What's here

| Route | What it does |
| --- | --- |
| `/` | Hero, quiz entry, filterable community grid, incentive strip, video placeholders, contact footer |
| `/communities/[slug]` | Per-community detail — specs, floor plan table, incentives, area prose, sticky CTA. Ten pages, statically generated |
| `/quiz` | Four-question Builder Match Quiz → live matches → lead capture |
| `/quiz#lead` | Skips the quiz and opens the contact form directly (used by the "request the full list" CTAs) |

## Structure

```
app/
  layout.tsx                  fonts, metadata, header/footer shell
  page.tsx                    homepage
  quiz/page.tsx               metadata wrapper around the client quiz
  communities/[slug]/page.tsx generateStaticParams over the data file
  not-found.tsx
components/
  CommunityExplorer.tsx       filter bar + grid (client, useState)
  QuizFlow.tsx                the whole quiz + results (client)
  LeadForm.tsx                fake-submit form — see the TODO inside
  CommunityCard.tsx, SiteHeader.tsx, SiteFooter.tsx, ImagePlaceholder.tsx
data/
  communities.ts              all content, typed
lib/
  filters.ts                  price buckets, formatters, filter + match logic
```

## The data file

`data/communities.ts` is shaped for a Sanity migration:

- Flat, primitive fields. Ranges are two numbers (`priceMin` / `priceMax`), not
  formatted strings, so they stay sortable and filterable.
- `incentives` is a **separate collection** referencing communities by slug, not
  nested inside them. Incentives change monthly and need to be editable on their
  own — that maps to a Sanity document type with a reference field.
- Every `Incentive` carries an `expiresOn` ISO date, which drives the "N days
  left" badges.
- `floorPlans` stays nested on the community because plans are owned by the
  community and never queried independently → Sanity array-of-objects.
- Dates are ISO `YYYY-MM-DD` strings so they serialize cleanly.

## Things that are deliberately fake

- **The lead form does not submit.** It logs the payload to the browser console
  and flips to a success state. The TODO marking where a real handler goes is in
  `components/LeadForm.tsx`.
- **Photography** is neutral gray placeholder blocks labeled with their intended
  dimensions, not stock images. Swap `ImagePlaceholder` for `next/image`.
- **"Today" is pinned** to a constant (`DEMO_TODAY` in `lib/filters.ts`) so the
  incentive countdowns stay stable in the demo instead of drifting with the
  build date.
- **Video cards** are thumbnails only — no player, no embed.

## Explicitly out of scope

No auth, CMS, admin, IDX/MLS, email sending, mortgage rate feeds, maps, or
analytics. Where one of those would naturally go, there's a `TODO` comment
instead.
