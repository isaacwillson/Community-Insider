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
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  const [rawPath, hash] = href.split("#");
  const targetPath = rawPath === "" ? "/" : rawPath;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Let the browser own modified clicks (new tab, download, etc.).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!hash || pathname !== targetPath) return;

    const target = document.getElementById(hash);
    if (!target) return;

    event.preventDefault();

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
