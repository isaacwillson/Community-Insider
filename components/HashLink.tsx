"use client";

import { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * In-page anchor link that eases to its target instead of jumping.
 *
 * Why this exists rather than just `scroll-behavior: smooth` in CSS: the App
 * Router handles a hash-only <Link> navigation itself, and its scroll logic
 * doesn't cooperate with the CSS property — the URL hash updates and the page
 * never moves. So when the target is on the current page we take the click,
 * scroll it ourselves, and push the hash. Cross-page links (e.g. /#communities
 * from a community detail page) fall through to normal Next navigation, where
 * the CSS handles the landing.
 *
 * `scrollIntoView({ block: "start" })` honours `scroll-margin-top`, so targets
 * keep their `scroll-mt-*` clearance under the sticky header.
 */
export default function HashLink({
  href,
  className,
  children,
  onNavigate,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  /** Fires on any accepted click — used by the mobile menu to close itself. */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const [rawPath, hash] = href.split("#");
  // A bare "#foo" targets whatever page you're on (the footer lives on all of
  // them); "/#foo" specifically means that section of the homepage.
  const targetPath = rawPath === "" ? pathname : rawPath;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Let the browser own modified clicks (new tab, download, etc.).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!hash || pathname !== targetPath) return;

    const target = document.getElementById(hash);
    if (!target) return;

    event.preventDefault();

    // Only after we've committed to handling this ourselves. Firing it on a
    // click that falls through to Next would let the caller unmount this link
    // mid-navigation, which cancels the navigation.
    onNavigate?.();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.history.pushState(null, "", `#${hash}`);
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
