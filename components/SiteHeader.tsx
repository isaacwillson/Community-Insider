import Link from "next/link";
import HashLink from "./HashLink";
import MobileNav from "./MobileNav";

export default function SiteHeader() {
  return (
    <>
      {/* Prototype banner — makes it unmistakable that the data is invented. */}
      <div className="bg-ink px-4 py-2 text-center text-[11px] leading-tight text-paper/90">
        Demo prototype · Communities, builders, pricing and incentives below are
        fictional sample data
      </div>

      {/* `sticky` is a positioned ancestor, so the mobile panel anchors to it. */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:gap-4 sm:px-8 sm:py-3.5">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="display text-lg leading-none sm:text-[1.4rem]">
              Realtor Insider
            </span>
            <span className="hidden text-[11px] text-muted sm:inline">New Jersey</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Inline links, desktop only — below sm they live in MobileNav. */}
            <HashLink
              href="/#communities"
              className="hidden rounded-sm px-3 py-2 text-sm text-ink-soft transition-colors hover:text-accent sm:block"
            >
              Communities
            </HashLink>
            <HashLink
              href="/#incentives"
              className="hidden rounded-sm px-3 py-2 text-sm text-ink-soft transition-colors hover:text-accent sm:block"
            >
              Incentives
            </HashLink>

            {/* Primary action stays in the bar at every width. */}
            <Link
              href="/quiz"
              className="rounded-sm bg-accent px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep sm:px-4"
            >
              Match me
            </Link>

            <MobileNav />
          </div>
        </div>
      </header>
    </>
  );
}
