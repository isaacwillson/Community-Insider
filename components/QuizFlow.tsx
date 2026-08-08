"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  HOME_TYPE_LABELS,
  HomeType,
  MOVE_IN_LABELS,
  MOVE_IN_ORDER,
  MoveInWindow,
  getActiveCounties,
} from "@/data/communities";
import {
  CommunityMatch,
  PRICE_BUCKETS,
  QuizAnswers,
  formatPriceRange,
  getPriceBucket,
  matchCommunities,
  splitMatches,
} from "@/lib/filters";
import LeadForm from "./LeadForm";

const COUNTY_OPTIONS = getActiveCounties();
const HOME_TYPE_OPTIONS: HomeType[] = ["single-family", "townhome", "condo", "55-plus"];

const HOME_TYPE_BLURBS: Record<HomeType, string> = {
  "single-family": "Detached, your own lot, your own roof",
  townhome: "Attached, lower maintenance, usually lower price",
  condo: "No exterior upkeep at all, often walkable locations",
  "55-plus": "Age-restricted, amenity-forward, single-level living",
};

const MOVE_IN_BLURBS: Record<MoveInWindow, string> = {
  "0-3-months": "Quick move-in homes only — what's standing today",
  "3-6-months": "Late-stage inventory, limited selections",
  "6-12-months": "To-be-built with most options still open",
  "12-plus-months": "Pre-release pricing and first pick of homesites",
};

const EMPTY_ANSWERS: QuizAnswers = {
  counties: [],
  priceBucketId: "",
  homeType: "",
  moveInWindow: "",
};

const TOTAL_STEPS = 4;

export default function QuizFlow() {
  const [step, setStep] = useState(0); // 0–3 = questions, 4 = results
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [directAsk, setDirectAsk] = useState(false);

  // Deep link from "Request the full list" / "Ask about this community" CTAs
  // elsewhere on the site. Read in an effect so server and client markup match.
  useEffect(() => {
    if (window.location.hash === "#lead") setDirectAsk(true);
  }, []);

  const matches = useMemo(() => (step === TOTAL_STEPS ? matchCommunities(answers) : []), [
    step,
    answers,
  ]);
  const { strong, worthAlook } = useMemo(() => splitMatches(matches), [matches]);

  function toggleCounty(county: string) {
    setAnswers((current) => ({
      ...current,
      counties: current.counties.includes(county)
        ? current.counties.filter((c) => c !== county)
        : [...current.counties, county],
    }));
  }

  /** Single-select answers advance immediately — fewer taps on a phone. */
  function chooseAndAdvance(key: keyof QuizAnswers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setStep((current) => current + 1);
    scrollToTop();
  }

  function scrollToTop() {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
    leaveDirectAsk();
    scrollToTop();
  }

  /** Drop the #lead hash so a reload doesn't drop the user back into the form. */
  function leaveDirectAsk() {
    setDirectAsk(false);
    if (typeof window !== "undefined" && window.location.hash === "#lead") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Direct-ask mode — someone clicked a "contact me" CTA, not a quiz   */
  /* ---------------------------------------------------------------- */
  if (directAsk) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
        <p className="eyebrow text-accent">Ask directly</p>
        <h1 className="display mt-4 text-4xl leading-tight sm:text-5xl">
          Tell me what you need and I&apos;ll send it over.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
          The full incentive list, details on a specific community, or a straight
          answer about a builder you&apos;re already talking to.
        </p>

        <div className="mt-10" id="lead">
          <LeadForm
            heading="Send me this month's full incentive list"
            blurb="Every builder I track, every county, with the fine print that doesn't make the flyer. I'll include anything specific you're asking about."
          />
        </div>

        <button
          type="button"
          onClick={leaveDirectAsk}
          className="mt-8 text-sm font-medium text-accent underline underline-offset-4 hover:text-accent-deep"
        >
          Actually, take me through the 4-question quiz →
        </button>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Results                                                           */
  /* ---------------------------------------------------------------- */
  if (step === TOTAL_STEPS) {
    const bucket = getPriceBucket(answers.priceBucketId);

    return (
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        <p className="eyebrow text-accent">Your matches</p>
        <h1 className="display mt-4 text-4xl leading-[1.05] sm:text-6xl">
          {strong.length > 0
            ? `${strong.length} ${strong.length === 1 ? "community fits" : "communities fit"} what you described.`
            : "Nothing lines up perfectly — but these are close."}
        </h1>

        {/* Answer summary */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {[
            answers.counties.join(", "),
            bucket?.label,
            HOME_TYPE_LABELS[answers.homeType as HomeType],
            MOVE_IN_LABELS[answers.moveInWindow as MoveInWindow],
          ]
            .filter(Boolean)
            .map((chip) => (
              <span
                key={chip as string}
                className="border border-line-strong bg-white px-3 py-1.5 text-xs text-ink-soft"
              >
                {chip}
              </span>
            ))}
          <button
            type="button"
            onClick={restart}
            className="px-1 text-xs font-medium text-accent underline underline-offset-4 hover:text-accent-deep"
          >
            Change answers
          </button>
        </div>

        {/* Strong matches */}
        <div className="mt-10 space-y-4">
          {(strong.length > 0 ? strong : matches.slice(0, 3)).map((match, index) => (
            <MatchRow key={match.community.id} match={match} rank={index + 1} />
          ))}
        </div>

        {/* Near misses */}
        {strong.length > 0 && worthAlook.length > 0 && (
          <section className="mt-14">
            <h2 className="eyebrow text-muted">Also worth a look</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
              These miss on at least one of your answers. Buyers change their mind about a
              county or a timeline more often than they change their mind about a
              house.
            </p>
            <div className="mt-6 space-y-4">
              {worthAlook.map((match) => (
                <MatchRow key={match.community.id} match={match} muted />
              ))}
            </div>
          </section>
        )}

        {/* Lead capture */}
        <div id="lead" className="mt-16 scroll-mt-24">
          <LeadForm
            answers={answers}
            matchedSlugs={[...strong, ...worthAlook].map((m) => m.community.slug)}
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={restart}
            className="text-sm font-medium text-accent underline underline-offset-4 hover:text-accent-deep"
          >
            Start the quiz over
          </button>
          <Link
            href="/#communities"
            className="text-sm font-medium text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Browse every community instead
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Questions                                                         */
  /* ---------------------------------------------------------------- */
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-14">
      {/* Progress */}
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          Question {step + 1} of {TOTAL_STEPS}
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={() => {
              setStep((current) => current - 1);
              scrollToTop();
            }}
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            ← Back
          </button>
        )}
      </div>

      <div className="mt-3 flex gap-1.5" role="presentation">
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <span
            key={index}
            className={`h-1 flex-1 transition-colors ${
              index <= step ? "bg-accent" : "bg-line"
            }`}
          />
        ))}
      </div>

      {/* Q1 — counties (multi-select) */}
      {step === 0 && (
        <QuestionShell
          title="Where in New Jersey?"
          subtitle="Pick every county you'd consider. Most buyers pick two or three — the tradeoffs between them are usually where the real decision lives."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {COUNTY_OPTIONS.map(({ county, count }) => {
              const selected = answers.counties.includes(county);
              return (
                <button
                  key={county}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleCounty(county)}
                  className={`flex items-center justify-between gap-3 border px-5 py-4 text-left transition-colors ${
                    selected
                      ? "border-accent bg-accent-wash"
                      : "border-line-strong bg-white hover:border-ink/40"
                  }`}
                >
                  <span className="text-base font-medium">{county} County</span>
                  <span
                    className={`text-xs tabular-nums ${selected ? "text-accent" : "text-muted"}`}
                  >
                    {count} {count === 1 ? "community" : "communities"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              disabled={answers.counties.length === 0}
              onClick={() => {
                setStep(1);
                scrollToTop();
              }}
              className="rounded-full bg-accent px-8 py-4 text-base font-medium text-white transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-muted"
            >
              Continue
            </button>
            <p className="text-sm text-muted">
              {answers.counties.length === 0
                ? "Select at least one county"
                : `${answers.counties.length} selected`}
            </p>
          </div>
        </QuestionShell>
      )}

      {/* Q2 — budget */}
      {step === 1 && (
        <QuestionShell
          title="What's your budget?"
          subtitle="Base price, before lot premiums and options. Pick the range you'd be comfortable in — I'll show you what's just above it too, since that's usually where the incentives are."
        >
          <div className="space-y-2.5">
            {PRICE_BUCKETS.map((bucket) => (
              <OptionRow
                key={bucket.id}
                selected={answers.priceBucketId === bucket.id}
                label={bucket.label}
                onClick={() => chooseAndAdvance("priceBucketId", bucket.id)}
              />
            ))}
          </div>
        </QuestionShell>
      )}

      {/* Q3 — home type */}
      {step === 2 && (
        <QuestionShell
          title="What kind of home?"
          subtitle="If you're torn between two, pick the one you'd choose today. Nothing here is binding — it just sharpens the list."
        >
          <div className="space-y-2.5">
            {HOME_TYPE_OPTIONS.map((type) => (
              <OptionRow
                key={type}
                selected={answers.homeType === type}
                label={HOME_TYPE_LABELS[type]}
                blurb={HOME_TYPE_BLURBS[type]}
                onClick={() => chooseAndAdvance("homeType", type)}
              />
            ))}
          </div>
        </QuestionShell>
      )}

      {/* Q4 — timeframe */}
      {step === 3 && (
        <QuestionShell
          title="When do you want to be in?"
          subtitle="This matters more than people expect. Timeline decides whether you're choosing from what's built or choosing your own finishes."
        >
          <div className="space-y-2.5">
            {MOVE_IN_ORDER.map((window) => (
              <OptionRow
                key={window}
                selected={answers.moveInWindow === window}
                label={MOVE_IN_LABELS[window]}
                blurb={MOVE_IN_BLURBS[window]}
                onClick={() => chooseAndAdvance("moveInWindow", window)}
              />
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Your matches appear immediately — no email required.
          </p>
        </QuestionShell>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function QuestionShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10 sm:mt-14">
      <h1 className="display text-4xl leading-[1.05] sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">{subtitle}</p>
      <div className="mt-8 sm:mt-10">{children}</div>
    </div>
  );
}

function OptionRow({
  label,
  blurb,
  selected,
  onClick,
}: {
  label: string;
  blurb?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`group flex w-full items-center justify-between gap-4 border px-5 py-4 text-left transition-colors ${
        selected ? "border-accent bg-accent-wash" : "border-line-strong bg-white hover:border-ink/40"
      }`}
    >
      <span className="min-w-0">
        <span className="block text-base font-medium sm:text-lg">{label}</span>
        {blurb && <span className="mt-0.5 block text-sm text-muted">{blurb}</span>}
      </span>
      <span
        aria-hidden
        className="shrink-0 text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent"
      >
        →
      </span>
    </button>
  );
}

function MatchRow({
  match,
  rank,
  muted = false,
}: {
  match: CommunityMatch;
  rank?: number;
  muted?: boolean;
}) {
  const { community, score, maxScore, reasons, misses } = match;
  const percent = Math.round((score / maxScore) * 100);

  return (
    <article
      className={`border bg-white p-5 sm:p-6 ${muted ? "border-line" : "border-ink/15"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted">
            {rank ? `Match ${rank} · ` : ""}
            {community.builder}
          </p>
          <h3 className="display mt-1.5 text-2xl leading-tight sm:text-3xl">
            {community.name}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            {community.town} · {community.county} County
          </p>
        </div>
        <div className="text-right">
          <p className={`display text-3xl tabular-nums ${muted ? "text-muted" : "text-accent"}`}>
            {percent}%
          </p>
          <p className="text-[11px] uppercase tracking-wider text-muted">match</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-soft">{community.hook}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {reasons.map((reason) => (
          <span
            key={reason}
            className="border border-accent/30 bg-accent-wash px-2.5 py-1 text-[11px] text-accent-deep"
          >
            {reason}
          </span>
        ))}
        {misses.map((miss) => (
          <span
            key={miss}
            className="border border-line-strong px-2.5 py-1 text-[11px] text-muted"
          >
            {miss}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-sm tabular-nums text-ink-soft">
          {formatPriceRange(community.priceMin, community.priceMax)}
        </p>
        <Link
          href={`/communities/${community.slug}`}
          className="text-sm font-medium text-accent underline underline-offset-4 hover:text-accent-deep"
        >
          See the full breakdown →
        </Link>
      </div>
    </article>
  );
}
