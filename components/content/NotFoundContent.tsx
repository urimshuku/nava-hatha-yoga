import Link from "next/link";

import { Container } from "@/components/layout/Container";

const RECOVERY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
] as const;

/** Shared 404 body used by root and site-segment not-found pages. */
export function NotFoundContent() {
  return (
    <Container className="flex flex-col items-center py-20 text-center sm:py-28">
      <p className="eyebrow mb-5">Page not found</p>
      <h1 className="text-display">This page rests elsewhere</h1>
      <p className="section-lead mx-auto mt-5 max-w-md">
        The page you are looking for could not be found. It may have moved, or the link may be
        incomplete.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {RECOVERY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.href === "/"
                ? "inline-flex items-center justify-center rounded-full bg-saffron px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-saffron-hover"
                : "inline-flex items-center justify-center rounded-full border border-border bg-ivory px-6 py-3 text-sm font-medium text-charcoal transition-colors hover:border-saffron hover:text-saffron"
            }
          >
            {link.href === "/" ? "Return home" : link.label}
          </Link>
        ))}
      </div>
    </Container>
  );
}
