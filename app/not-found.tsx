import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
      <p className="eyebrow text-accent">404</p>
      <h1 className="display mt-4 text-5xl leading-tight sm:text-6xl">
        That page isn&apos;t here.
      </h1>
      <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft">
        Communities come off the list when they sell out. Try the quiz — it&apos;ll
        point you at what&apos;s still available.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/quiz"
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
        >
          Take the Builder Match Quiz
        </Link>
        <Link
          href="/#communities"
          className="inline-flex items-center justify-center rounded-full border border-ink/20 px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink/50"
        >
          Browse communities
        </Link>
      </div>
    </div>
  );
}
