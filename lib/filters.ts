import {
  Community,
  HomeType,
  MOVE_IN_ORDER,
  MoveInWindow,
  communities,
} from "@/data/communities";

/* ------------------------------------------------------------------ */
/* Price buckets — shared by the homepage filter bar and the quiz so   */
/* both speak the same language. Migrating to a CMS shouldn't change   */
/* these; they're presentation, not content.                           */
/* ------------------------------------------------------------------ */

export interface PriceBucket {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_BUCKETS: PriceBucket[] = [
  { id: "under-500", label: "Under $500K", min: 0, max: 500_000 },
  { id: "500-700", label: "$500K – $700K", min: 500_000, max: 700_000 },
  { id: "700-900", label: "$700K – $900K", min: 700_000, max: 900_000 },
  { id: "900-1200", label: "$900K – $1.2M", min: 900_000, max: 1_200_000 },
  { id: "1200-plus", label: "$1.2M+", min: 1_200_000, max: Number.MAX_SAFE_INTEGER },
];

export function getPriceBucket(id: string): PriceBucket | undefined {
  return PRICE_BUCKETS.find((bucket) => bucket.id === id);
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

export function formatPrice(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    // 1.15M, 1.4M, 2M — trim trailing zeros
    return `$${millions.toFixed(2).replace(/0$/, "").replace(/\.$/, "")}M`;
  }
  return `$${Math.round(value / 1000)}K`;
}

export function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}

export function formatPriceExact(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export function formatSquareFeet(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatBaths(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function formatRange(min: number, max: number, format: (n: number) => string): string {
  return min === max ? format(min) : `${format(min)} – ${format(max)}`;
}

/** "Aug 31, 2026" */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Days until an incentive expires, relative to a fixed reference date.
 *
 * Deliberately NOT `new Date()` — a static build would bake in the build date
 * and drift, and using the client clock causes hydration mismatches. For the
 * prototype a fixed "today" keeps the demo stable.
 * TODO: when this moves to Sanity, compute freshness server-side on each
 * request (or revalidate on a schedule) instead of using this constant.
 */
export const DEMO_TODAY = "2026-08-08";

export function daysUntil(iso: string, from: string = DEMO_TODAY): number {
  const toTime = Date.parse(`${iso}T00:00:00Z`);
  const fromTime = Date.parse(`${from}T00:00:00Z`);
  return Math.round((toTime - fromTime) / 86_400_000);
}

/* ------------------------------------------------------------------ */
/* Filtering                                                           */
/* ------------------------------------------------------------------ */

export interface CommunityFilters {
  county: string; // "" = any
  priceBucketId: string; // "" = any
  homeType: string; // "" = any
}

export const EMPTY_FILTERS: CommunityFilters = {
  county: "",
  priceBucketId: "",
  homeType: "",
};

export function hasActiveFilters(filters: CommunityFilters): boolean {
  return Boolean(filters.county || filters.priceBucketId || filters.homeType);
}

/** A community matches a price bucket if its range overlaps the bucket at all. */
export function overlapsPriceBucket(community: Community, bucket: PriceBucket): boolean {
  return community.priceMin <= bucket.max && community.priceMax >= bucket.min;
}

export function filterCommunities(
  source: Community[],
  filters: CommunityFilters,
): Community[] {
  return source.filter((community) => {
    if (filters.county && community.county !== filters.county) return false;

    if (filters.homeType && !community.homeTypes.includes(filters.homeType as HomeType)) {
      return false;
    }

    if (filters.priceBucketId) {
      const bucket = getPriceBucket(filters.priceBucketId);
      if (bucket && !overlapsPriceBucket(community, bucket)) return false;
    }

    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Quiz matching                                                       */
/* ------------------------------------------------------------------ */

export interface QuizAnswers {
  counties: string[];
  priceBucketId: string;
  homeType: string;
  moveInWindow: string;
}

export interface CommunityMatch {
  community: Community;
  score: number;
  maxScore: number;
  /** Short human-readable reasons, rendered as chips under each match. */
  reasons: string[];
  misses: string[];
}

const WEIGHTS = {
  county: 3,
  price: 3,
  homeType: 2,
  timing: 2,
};

const MAX_SCORE = WEIGHTS.county + WEIGHTS.price + WEIGHTS.homeType + WEIGHTS.timing;

/**
 * Scores every community against the quiz answers and returns them ranked.
 *
 * Scored rather than hard-filtered on purpose: a buyer who picks one county and
 * a narrow budget can easily zero out a hard filter, and "no results" is a dead
 * end. Partial matches still surface, clearly labeled with what doesn't line up.
 */
export function matchCommunities(answers: QuizAnswers): CommunityMatch[] {
  const bucket = getPriceBucket(answers.priceBucketId);
  const wantedTimingIndex = MOVE_IN_ORDER.indexOf(answers.moveInWindow as MoveInWindow);

  const matches: CommunityMatch[] = communities.map((community) => {
    let score = 0;
    const reasons: string[] = [];
    const misses: string[] = [];

    if (answers.counties.includes(community.county)) {
      score += WEIGHTS.county;
      reasons.push(`In ${community.county} County`);
    } else {
      misses.push(`${community.county} County — outside your search area`);
    }

    if (bucket && overlapsPriceBucket(community, bucket)) {
      score += WEIGHTS.price;
      reasons.push("Homes in your budget");
    } else if (bucket && community.priceMin > bucket.max) {
      misses.push("Starts above your budget");
    } else if (bucket) {
      misses.push("Priced below your range");
    }

    if (answers.homeType && community.homeTypes.includes(answers.homeType as HomeType)) {
      score += WEIGHTS.homeType;
      reasons.push("Builds your home type");
    } else if (answers.homeType) {
      misses.push("Different home type");
    }

    const communityTimingIndex = MOVE_IN_ORDER.indexOf(community.moveInWindow);
    if (wantedTimingIndex >= 0 && communityTimingIndex <= wantedTimingIndex) {
      score += WEIGHTS.timing;
      reasons.push("Delivers on your timeline");
    } else if (wantedTimingIndex >= 0) {
      misses.push("Delivers later than you want");
    }

    return { community, score, maxScore: MAX_SCORE, reasons, misses };
  });

  return matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Stable-ish tiebreak: featured first, then fewer homes remaining (urgency).
    if (a.community.featured !== b.community.featured) return a.community.featured ? -1 : 1;
    return a.community.homesRemaining - b.community.homesRemaining;
  });
}

/** Strong matches lead; anything at or above half the weighting is worth showing. */
export function splitMatches(matches: CommunityMatch[]): {
  strong: CommunityMatch[];
  worthAlook: CommunityMatch[];
} {
  const strong = matches.filter((m) => m.score >= MAX_SCORE - 2).slice(0, 4);
  const strongIds = new Set(strong.map((m) => m.community.id));
  const worthAlook = matches
    .filter((m) => !strongIds.has(m.community.id) && m.score >= WEIGHTS.county)
    .slice(0, 3);
  return { strong, worthAlook };
}
