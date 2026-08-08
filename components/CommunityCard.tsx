import Link from "next/link";
import {
  Community,
  HOME_TYPE_LABELS,
  STATUS_LABELS,
  getIncentivesForCommunity,
} from "@/data/communities";
import { formatPriceRange } from "@/lib/filters";
import ImagePlaceholder from "./ImagePlaceholder";

export default function CommunityCard({ community }: { community: Community }) {
  const incentiveCount = getIncentivesForCommunity(community.slug).length;

  return (
    <Link
      href={`/communities/${community.slug}`}
      className="group flex flex-col border border-line bg-surface transition-colors hover:border-line-strong focus-visible:border-accent"
    >
      <div className="relative">
        <ImagePlaceholder
          width={800}
          height={520}
          label={community.heroImageAlt}
          className="w-full"
        />
        <span className="absolute left-3 top-3 bg-surface/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
          {STATUS_LABELS[community.status]}
        </span>
        {incentiveCount > 0 && (
          <span className="absolute right-3 top-3 bg-accent px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            {incentiveCount} incentive{incentiveCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted">
          {community.builder}
        </p>
        <h3 className="display mt-2 text-[1.375rem] transition-colors group-hover:text-accent">
          {community.name}
        </h3>
        <p className="mt-1.5 text-sm text-ink-soft">
          {community.town} · {community.county} County
        </p>

        <p className="mt-4 border-l-2 border-accent pl-3 text-sm leading-relaxed text-ink-soft">
          {community.hook}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-muted">Price</dt>
            <dd className="mt-0.5 font-medium tabular-nums">
              {formatPriceRange(community.priceMin, community.priceMax)}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-muted">Home type</dt>
            <dd className="mt-0.5 font-medium">
              {community.homeTypes.map((type) => HOME_TYPE_LABELS[type]).join(" · ")}
            </dd>
          </div>
        </dl>

        <p className="mt-5 flex items-center gap-1.5 text-sm font-medium text-accent">
          View community
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
