import Link from "next/link";
import HashLink from "./HashLink";

export default function SiteHeader() {
  return (
    <>
      {/* Prototype banner — makes it unmistakable that the data is invented. */}
      <div className="bg-ink px-4 py-2 text-center text-[11px] leading-tight text-paper/80">
        Demo prototype · Communities, builders, pricing and incentives below are
        fictional sample data
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="display text-xl leading-none sm:text-[1.4rem]">
              Realtor Insider
            </span>
            <span className="hidden text-[11px] text-muted sm:inline">New Jersey</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <HashLink
              href="/#communities"
              className="rounded-full px-2.5 py-2 text-sm text-ink-soft transition-colors hover:text-ink sm:px-3"
            >
              Communities
            </HashLink>
            <HashLink
              href="/#incentives"
              className="hidden rounded-full px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink sm:block"
            >
              Incentives
            </HashLink>
            <Link
              href="/quiz"
              className="rounded-full bg-accent px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep sm:px-4"
            >
              Match me
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
