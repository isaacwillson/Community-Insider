"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HashLink from "./HashLink";

/**
 * Mobile nav disclosure. The desktop header lays its links out inline, which
 * runs out of room under ~640px — "Incentives" was being dropped entirely
 * rather than moved somewhere reachable. Everything lives in here instead, and
 * the primary CTA stays visible in the bar at all times.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change — otherwise the panel hangs around over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="-mr-1.5 flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-accent sm:hidden"
      >
        <span aria-hidden className="relative block h-4 w-5">
          <span
            className={`absolute left-0 block h-[1.5px] w-5 bg-current transition-transform duration-200 ${
              open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0.5"
            }`}
          />
          <span
            className={`absolute left-0 top-1/2 block h-[1.5px] w-5 -translate-y-1/2 bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 block h-[1.5px] w-5 bg-current transition-transform duration-200 ${
              open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0.5"
            }`}
          />
        </span>
      </button>

      {open && (
        <>
          {/* Tapping the page behind the panel closes it. Absolute rather than
              fixed so `top-full` anchors to the header's bottom edge — fixed
              would resolve it against the viewport and collapse to no height. */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={close}
            className="absolute left-0 right-0 top-full z-30 h-screen cursor-default bg-ink/25 sm:hidden"
          />

          <div
            id="mobile-nav-panel"
            className="panel-in absolute left-0 right-0 top-full z-40 border-b border-line-strong bg-surface sm:hidden"
          >
            <nav className="px-5 py-1">
              <MenuItem href="/#communities" label="Communities" hint="Browse and filter all 10" onNavigate={close} />
              <MenuItem
                href="/#incentives"
                label="Current incentives"
                hint="What builders are offering now"
                onNavigate={close}
              />
              <MenuItem
                href="/quiz"
                label="Builder Match Quiz"
                hint="Four questions, instant matches"
                onNavigate={close}
              />
              {/* Bare hash — the footer is on every page, no need to route home. */}
              <MenuItem href="#contact" label="Contact" hint="Ask me anything" onNavigate={close} last />
            </nav>

            <div className="flex gap-2 border-t border-line bg-paper-deep px-5 py-4">
              <a
                href="tel:+15550104477"
                className="flex-1 rounded-sm border border-line-strong px-4 py-3 text-center text-sm font-medium text-ink"
              >
                Call
              </a>
              <a
                href="mailto:hello@example.com"
                className="flex-1 rounded-sm border border-line-strong px-4 py-3 text-center text-sm font-medium text-ink"
              >
                Email
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function MenuItem({
  href,
  label,
  hint,
  onNavigate,
  last = false,
}: {
  href: string;
  label: string;
  hint: string;
  onNavigate: () => void;
  last?: boolean;
}) {
  const className = `flex items-center justify-between gap-4 py-4 ${
    last ? "" : "border-b border-line"
  }`;

  const content = (
    <>
      <span className="min-w-0">
        <span className="block text-base font-medium text-ink">{label}</span>
        <span className="mt-0.5 block text-sm text-muted">{hint}</span>
      </span>
      <span aria-hidden className="shrink-0 text-muted">
        →
      </span>
    </>
  );

  // Plain routes don't need the hash interception — and must NOT close the
  // panel on click, since unmounting the link cancels the navigation. The
  // pathname effect above closes the panel once the route actually changes.
  if (!href.includes("#")) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <HashLink href={href} className={className} onNavigate={onNavigate}>
      {content}
    </HashLink>
  );
}
