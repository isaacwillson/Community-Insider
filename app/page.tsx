import Link from "next/link";
import {
  INCENTIVE_KIND_LABELS,
  communities,
  getActiveCounties,
  getCommunityBySlug,
  getFeaturedCommunities,
  incentives,
  videoPlaceholders,
} from "@/data/communities";
import { daysUntil, formatDate } from "@/lib/filters";
import CommunityExplorer from "@/components/CommunityExplorer";
import HashLink from "@/components/HashLink";
import ImagePlaceholder from "@/components/ImagePlaceholder";

// Three sample incentives for the homepage strip — one of each headline kind.
const FEATURED_INCENTIVE_IDS = ["inc-001", "inc-003", "inc-004"];

export default function HomePage() {
  const featured = getFeaturedCommunities();
  const counties = getActiveCounties().map((entry) => entry.county);

  const strip = FEATURED_INCENTIVE_IDS.map((id) =>
    incentives.find((incentive) => incentive.id === id),
  ).filter((incentive) => incentive !== undefined);

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-24">
          <p className="eyebrow text-accent">New Jersey · New construction</p>

          <h1 className="display mt-6 max-w-4xl text-[2.75rem] leading-[1.03] sm:text-6xl lg:text-7xl">
            The sales office works for the builder.
            <br className="hidden sm:block" />{" "}
            <span className="text-accent">I work for you.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
            An independent guide to every new-construction community worth
            knowing about in New Jersey — what each builder is actually offering
            this month, which lots are worth the premium, and what the model home
            isn&apos;t telling you.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/quiz"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-base font-medium text-white transition-colors hover:bg-accent-deep"
            >
              Find my match in 4 questions
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <HashLink
              href="/#communities"
              className="inline-flex items-center justify-center rounded-full border border-ink/20 px-7 py-4 text-base font-medium text-ink transition-colors hover:border-ink/50"
            >
              Browse communities
            </HashLink>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 sm:grid-cols-4">
            {[
              { value: String(communities.length), label: "Communities tracked" },
              { value: String(counties.length), label: "Counties covered" },
              { value: String(incentives.length), label: "Live incentives" },
              { value: "$0", label: "Cost to work with me" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="display text-4xl tabular-nums sm:text-5xl">{stat.value}</dd>
                <p className="mt-2 text-xs leading-snug text-muted sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Quiz entry point                                                 */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-line bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow text-accent">Builder Match Quiz</p>
              <h2 className="display mt-4 text-4xl leading-tight sm:text-5xl">
                Four questions. Your actual shortlist, not a brochure.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/70">
                County, budget, home type, timeline. You&apos;ll see matched
                communities the moment you finish — no email gate, no waiting for
                a callback.
              </p>
              <Link
                href="/quiz"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-base font-medium text-white transition-colors hover:bg-accent-deep"
              >
                Start the quiz
                <span aria-hidden>→</span>
              </Link>
              <p className="mt-4 text-xs text-paper/50">
                Takes about 40 seconds. Results appear before any form.
              </p>
            </div>

            <ol className="space-y-0 border-t border-paper/15">
              {[
                { n: "01", q: "Where in New Jersey?", a: "Pick as many counties as you like" },
                { n: "02", q: "What's your budget?", a: "Five ranges, no exact number needed" },
                { n: "03", q: "What kind of home?", a: "Single-family, townhome, condo, 55+" },
                { n: "04", q: "When do you want to move?", a: "Now through 12+ months out" },
              ].map((step) => (
                <li
                  key={step.n}
                  className="flex gap-5 border-b border-paper/15 py-5"
                >
                  <span className="font-mono text-xs text-accent">{step.n}</span>
                  <div>
                    <p className="text-base font-medium">{step.q}</p>
                    <p className="mt-1 text-sm text-paper/55">{step.a}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Communities + filters                                            */}
      {/* ---------------------------------------------------------------- */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <CommunityExplorer
          allCommunities={communities}
          featuredCommunities={featured}
          counties={counties}
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Incentives strip                                                 */}
      {/* ---------------------------------------------------------------- */}
      <section id="incentives" className="scroll-mt-24 border-y border-line bg-paper-deep">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-accent">On the table right now</p>
              <h2 className="display mt-3 text-4xl sm:text-5xl">Current builder incentives</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              Three of {incentives.length} I&apos;m tracking. These change monthly
              and are rarely advertised at full value — the rest of the list is
              available on request.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {strip.map((incentive) => {
              const community = getCommunityBySlug(incentive.communitySlug);
              const remaining = daysUntil(incentive.expiresOn);

              return (
                <article
                  key={incentive.id}
                  className="flex flex-col border border-line bg-white p-6"
                >
                  <p className="eyebrow text-accent">
                    {INCENTIVE_KIND_LABELS[incentive.kind]}
                  </p>
                  <p className="display mt-4 text-4xl tabular-nums">{incentive.value}</p>
                  <h3 className="mt-3 text-base font-medium leading-snug">
                    {incentive.headline}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-soft">
                    {incentive.detail}
                  </p>

                  <div className="mt-5 border-t border-line pt-4">
                    {community && (
                      <Link
                        href={`/communities/${community.slug}`}
                        className="text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:text-accent hover:decoration-accent"
                      >
                        {community.name}
                      </Link>
                    )}
                    <p className="mt-2 text-xs text-muted">
                      Expires {formatDate(incentive.expiresOn)}
                      {remaining > 0 && (
                        <span className="text-accent"> · {remaining} days left</span>
                      )}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-start gap-4 border border-ink/15 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-lg font-medium">
                Want the full incentive list for this month?
              </p>
              <p className="mt-1.5 text-sm text-ink-soft">
                Every builder, every county, updated the first week of the month.
              </p>
            </div>
            <Link
              href="/quiz#lead"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
            >
              Request the full list
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Video library placeholder                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-accent">Video library</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">
              Everything I&apos;d tell you at the kitchen table
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
            Short, specific, no music beds. Coming soon — the first three are in
            production.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videoPlaceholders.map((video) => (
            <article key={video.id} className="group flex flex-col border border-line bg-white">
              <div className="relative">
                {/* TODO: swap for real video embed (Mux / YouTube) once produced. */}
                <ImagePlaceholder width={640} height={360} label="Video thumbnail" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm">
                    <span aria-hidden className="ml-0.5 text-sm">
                      ▶
                    </span>
                  </span>
                </span>
                <span className="absolute bottom-3 right-3 bg-ink/85 px-2 py-1 font-mono text-[10px] text-paper">
                  {video.durationLabel}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] uppercase tracking-[0.12em] text-muted">
                  {video.category}
                </p>
                <h3 className="mt-2 text-lg font-medium leading-snug">{video.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {video.description}
                </p>
                <p className="mt-4 text-xs uppercase tracking-wider text-muted">
                  In production
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
