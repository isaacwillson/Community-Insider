import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FLOOR_PLAN_STATUS_LABELS,
  HOME_TYPE_LABELS,
  INCENTIVE_KIND_LABELS,
  MOVE_IN_LABELS,
  STATUS_LABELS,
  communities,
  getCommunityBySlug,
  getIncentivesForCommunity,
} from "@/data/communities";
import {
  daysUntil,
  formatBaths,
  formatDate,
  formatPriceExact,
  formatPriceRange,
  formatRange,
  formatSquareFeet,
} from "@/lib/filters";
import ImagePlaceholder from "@/components/ImagePlaceholder";

/** Fully static — every community is pre-rendered at build time. */
export function generateStaticParams() {
  return communities.map((community) => ({ slug: community.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const community = getCommunityBySlug(slug);
  if (!community) return { title: "Community not found" };

  return {
    title: `${community.name} — ${community.town}, NJ`,
    description: `${community.hook} Built by ${community.builder} in ${community.town}, ${community.county} County. ${formatPriceRange(community.priceMin, community.priceMax)}.`,
  };
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const community = getCommunityBySlug(slug);
  if (!community) notFound();

  const communityIncentives = getIncentivesForCommunity(community.slug);

  const specs = [
    {
      label: "Price range",
      value: formatPriceRange(community.priceMin, community.priceMax),
    },
    {
      label: "Square footage",
      value: `${formatRange(community.squareFeetMin, community.squareFeetMax, formatSquareFeet)} sq ft`,
    },
    {
      label: "Bedrooms",
      value: formatRange(community.bedsMin, community.bedsMax, String),
    },
    {
      label: "Bathrooms",
      value: formatRange(community.bathsMin, community.bathsMax, formatBaths),
    },
    {
      label: "Home types",
      value: community.homeTypes.map((type) => HOME_TYPE_LABELS[type]).join(", "),
    },
    {
      label: "Move-in",
      value: MOVE_IN_LABELS[community.moveInWindow],
    },
  ];

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-8 sm:pt-8">
          <Link
            href="/#communities"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            <span aria-hidden>←</span> All communities
          </Link>
        </div>

        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          <ImagePlaceholder
            width={community.heroImageWidth}
            height={community.heroImageHeight}
            label={community.heroImageAlt}
            className="w-full"
          />

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="border border-line-strong bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
              {STATUS_LABELS[community.status]}
            </span>
            {communityIncentives.length > 0 && (
              <span className="bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                {communityIncentives.length} active incentive
                {communityIncentives.length > 1 ? "s" : ""}
              </span>
            )}
            <span className="text-[11px] uppercase tracking-wider text-muted">
              {community.homesRemaining} of {community.totalHomes} homes remaining
            </span>
          </div>

          <p className="mt-6 text-sm uppercase tracking-[0.12em] text-muted">
            {community.builder}
          </p>
          <h1 className="display mt-3 max-w-3xl text-5xl leading-[1.03] sm:text-6xl lg:text-7xl">
            {community.name}
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            {community.town} · {community.county} County, New Jersey
          </p>
          <p className="mt-6 max-w-2xl border-l-2 border-accent pl-4 text-lg leading-relaxed text-ink-soft">
            {community.hook}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14 lg:py-16">
          {/* -------------------------------------------------------- */}
          {/* Main column                                              */}
          {/* -------------------------------------------------------- */}
          <div className="min-w-0">
            {/* Specs */}
            <section>
              <h2 className="eyebrow text-accent">The numbers</h2>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-7 sm:grid-cols-3">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-[11px] uppercase tracking-wider text-muted">
                      {spec.label}
                    </dt>
                    <dd className="mt-1.5 text-lg leading-snug tabular-nums">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Floor plans */}
            <section className="mt-16">
              <h2 className="eyebrow text-accent">Floor plans</h2>
              <p className="display mt-3 text-3xl">
                {community.floorPlans.length} plans available
              </p>

              <div className="mt-6 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[34rem] border-collapse text-sm">
                  <thead>
                    <tr className="border-y border-line-strong text-left">
                      <th className="py-3 pr-4 text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Plan
                      </th>
                      <th className="py-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Sq ft
                      </th>
                      <th className="py-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Bd
                      </th>
                      <th className="py-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Ba
                      </th>
                      <th className="py-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Gar
                      </th>
                      <th className="py-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-wider text-muted">
                        From
                      </th>
                      <th className="py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {community.floorPlans.map((plan) => (
                      <tr key={plan.id} className="border-b border-line">
                        <td className="py-4 pr-4">
                          <span className="font-medium">{plan.name}</span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {HOME_TYPE_LABELS[plan.homeType]}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-right tabular-nums">
                          {formatSquareFeet(plan.squareFeet)}
                        </td>
                        <td className="py-4 pr-4 text-right tabular-nums">{plan.beds}</td>
                        <td className="py-4 pr-4 text-right tabular-nums">
                          {formatBaths(plan.baths)}
                        </td>
                        <td className="py-4 pr-4 text-right tabular-nums">
                          {plan.garageSpaces || "—"}
                        </td>
                        <td className="py-4 pr-4 text-right font-medium tabular-nums">
                          {formatPriceExact(plan.basePrice)}
                        </td>
                        <td className="py-4 text-right">
                          <span
                            className={
                              plan.status === "quick-move-in" || plan.status === "final-release"
                                ? "text-accent"
                                : "text-ink-soft"
                            }
                          >
                            {FLOOR_PLAN_STATUS_LABELS[plan.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-muted">
                Base pricing excludes lot premiums, structural options and design
                center selections. Ask me for the fully-loaded number before you
                compare communities.
              </p>
            </section>

            {/* Incentives */}
            <section className="mt-16">
              <h2 className="eyebrow text-accent">Current incentives</h2>
              <p className="display mt-3 text-3xl">
                {communityIncentives.length > 0
                  ? "What this builder is offering"
                  : "Nothing published this month"}
              </p>

              {communityIncentives.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {communityIncentives.map((incentive) => {
                    const remaining = daysUntil(incentive.expiresOn);
                    return (
                      <article
                        key={incentive.id}
                        className="border border-line bg-white p-5 sm:p-6"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                          <p className="eyebrow text-accent">
                            {INCENTIVE_KIND_LABELS[incentive.kind]}
                          </p>
                          <p className="font-mono text-xs text-muted">
                            Expires {formatDate(incentive.expiresOn)}
                            {remaining > 0 && remaining <= 30 && (
                              <span className="text-accent"> · {remaining}d left</span>
                            )}
                          </p>
                        </div>
                        <h3 className="mt-3 text-xl font-medium leading-snug">
                          {incentive.headline}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                          {incentive.detail}
                        </p>
                        {incentive.insiderNote && (
                          <p className="mt-4 border-l-2 border-accent bg-accent-wash px-4 py-3 text-sm leading-relaxed text-ink-soft">
                            <span className="font-semibold text-ink">Insider note — </span>
                            {incentive.insiderNote}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
                  Which usually means there&apos;s something unpublished. Builders
                  hold incentives back when a phase is selling well. Ask me and
                  I&apos;ll find out what they&apos;ll actually do.
                </p>
              )}
            </section>

            {/* Prose */}
            <section className="mt-16">
              <h2 className="eyebrow text-accent">The area</h2>
              <div className="mt-6 max-w-2xl space-y-8 border-t border-line pt-7">
                <div>
                  <h3 className="display text-2xl">What it&apos;s like to live here</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-soft">
                    {community.areaOverview}
                  </p>
                </div>
                <div>
                  <h3 className="display text-2xl">Schools</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-soft">
                    {community.schoolsNote}
                  </p>
                </div>
                <div>
                  <h3 className="display text-2xl">Getting around</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-soft">
                    {community.commuteNote}
                  </p>
                  {/* TODO: no map integration in this prototype — a static map or
                      commute-time widget would live here. */}
                </div>
              </div>
            </section>
          </div>

          {/* -------------------------------------------------------- */}
          {/* Sticky CTA rail (desktop)                                 */}
          {/* -------------------------------------------------------- */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="border border-ink/15 bg-white p-6">
                <p className="eyebrow text-accent">Ask about this community</p>
                <p className="display mt-4 text-2xl leading-tight">
                  What would you want to know before you walked in?
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  I&apos;ll tell you which lots are actually worth the premium at{" "}
                  {community.name}, and what {community.builder} has negotiated on
                  recently.
                </p>
                <Link
                  href="/quiz#lead"
                  className="mt-6 flex items-center justify-center rounded-full bg-accent px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
                >
                  Ask about {community.name.split(" ")[0]}
                </Link>
                <Link
                  href="/quiz"
                  className="mt-3 flex items-center justify-center rounded-full border border-ink/20 px-5 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink/50"
                >
                  See my other matches
                </Link>
                <p className="mt-4 text-center text-xs text-muted">
                  Register me before your first visit — the builder pays my fee,
                  not you.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Sticky CTA bar (mobile)                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="sticky bottom-0 z-30 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{community.name}</p>
            <p className="truncate text-xs text-muted tabular-nums">
              {formatPriceRange(community.priceMin, community.priceMax)} ·{" "}
              {community.homesRemaining} left
            </p>
          </div>
          <Link
            href="/quiz#lead"
            className="shrink-0 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white"
          >
            Ask about this
          </Link>
        </div>
      </div>
    </>
  );
}
