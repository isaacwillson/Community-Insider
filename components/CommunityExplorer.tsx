"use client";

import { useMemo, useState } from "react";
import {
  Community,
  HOME_TYPE_LABELS,
  HomeType,
} from "@/data/communities";
import {
  CommunityFilters,
  EMPTY_FILTERS,
  PRICE_BUCKETS,
  filterCommunities,
  hasActiveFilters,
} from "@/lib/filters";
import CommunityCard from "./CommunityCard";

const HOME_TYPE_OPTIONS: HomeType[] = ["single-family", "townhome", "condo", "55-plus"];

const selectClass =
  "w-full rounded-none border border-line-strong bg-white px-3.5 py-3 text-sm text-ink transition-colors hover:border-ink/40 focus:border-accent";

/**
 * Filter bar + grid. Featured communities show by default; touching any filter
 * searches the full list, so the homepage stays curated but the tool is real.
 */
export default function CommunityExplorer({
  allCommunities,
  featuredCommunities,
  counties,
}: {
  allCommunities: Community[];
  featuredCommunities: Community[];
  counties: string[];
}) {
  const [filters, setFilters] = useState<CommunityFilters>(EMPTY_FILTERS);

  const active = hasActiveFilters(filters);

  const results = useMemo(
    () => (active ? filterCommunities(allCommunities, filters) : featuredCommunities),
    [active, allCommunities, featuredCommunities, filters],
  );

  function update(key: keyof CommunityFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <section id="communities" className="scroll-mt-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-accent">Communities</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">
            {active ? "Search results" : "Worth your weekend"}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
          {active
            ? "Filtering all tracked communities. Clear the filters to return to this month's shortlist."
            : "Four communities I'd send a buyer to this month. Filter below to search everything I track."}
        </p>
      </div>

      {/* Filter bar */}
      <div className="mt-8 border border-line bg-white p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="eyebrow mb-2 block text-muted">County</span>
            <select
              className={selectClass}
              value={filters.county}
              onChange={(event) => update("county", event.target.value)}
            >
              <option value="">Any county</option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county} County
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="eyebrow mb-2 block text-muted">Price range</span>
            <select
              className={selectClass}
              value={filters.priceBucketId}
              onChange={(event) => update("priceBucketId", event.target.value)}
            >
              <option value="">Any price</option>
              {PRICE_BUCKETS.map((bucket) => (
                <option key={bucket.id} value={bucket.id}>
                  {bucket.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="eyebrow mb-2 block text-muted">Home type</span>
            <select
              className={selectClass}
              value={filters.homeType}
              onChange={(event) => update("homeType", event.target.value)}
            >
              <option value="">Any type</option>
              {HOME_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {HOME_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-sm text-ink-soft" aria-live="polite">
            <span className="font-medium tabular-nums text-ink">{results.length}</span>{" "}
            {results.length === 1 ? "community" : "communities"}
            {active ? ` of ${allCommunities.length} tracked` : " featured this month"}
          </p>
          {active && (
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="text-sm font-medium text-accent underline underline-offset-4 hover:text-accent-deep"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {results.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {results.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-line-strong bg-white px-6 py-16 text-center">
          <p className="display text-2xl">Nothing matches that combination.</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
            That doesn&apos;t mean it doesn&apos;t exist — it means it isn&apos;t
            on the public list. Several builders hold back inventory until
            they&apos;re asked directly.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/quiz"
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent-deep"
            >
              Have me look for you
            </a>
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="text-sm font-medium text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              Reset filters
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
