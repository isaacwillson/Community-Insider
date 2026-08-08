import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-deep">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-accent">Next step</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">
            Tell me what you&apos;re looking for.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            I represent buyers in new construction across New Jersey — the same
            builders, without the sales office deciding what you get to know.
            There is no cost to you; the builder pays the commission either way.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
            >
              Take the Builder Match Quiz
            </Link>
            <a
              href="mailto:hello@example.com"
              className="inline-flex items-center justify-center rounded-full border border-ink/20 px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink/50"
            >
              Email a question
            </a>
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-line-strong/70 pt-10 sm:grid-cols-3">
          <div>
            <p className="eyebrow text-muted">Contact</p>
            <p className="mt-3 text-sm text-ink-soft">
              Dana Whitfield
              <br />
              Placeholder Realty Group
              <br />
              <span className="text-muted">(555) 010-4477</span>
              <br />
              <span className="text-muted">hello@example.com</span>
            </p>
          </div>
          <div>
            <p className="eyebrow text-muted">Site</p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
              <li>
                <Link href="/" className="hover:text-accent">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#communities" className="hover:text-accent">
                  Communities
                </Link>
              </li>
              <li>
                <Link href="/#incentives" className="hover:text-accent">
                  Current incentives
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-accent">
                  Builder Match Quiz
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-muted">Note</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This is a design prototype. Names, communities, builders, pricing
              and incentives are invented. Nothing here is an offer, and no form
              on this site sends anything anywhere.
            </p>
          </div>
        </div>

        <p className="mt-12 text-xs text-muted">
          © {new Date().getFullYear()} Realtor Insider (demo). Equal Housing
          Opportunity.
        </p>
      </div>
    </footer>
  );
}
