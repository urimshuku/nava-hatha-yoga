"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header({ brandName = SITE_NAME }: { brandName?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = () => setOpen(false);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href) ?? false;
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/85 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-container items-center justify-between px-5 sm:h-20 sm:px-8"
        aria-label="Primary"
      >
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex min-w-0 max-w-[calc(100%-2.75rem)] items-center gap-2 sm:max-w-none sm:gap-3"
        >
          <BrandLogo
            variant="symbol"
            priority
            decorative
            className="h-10 w-10 sm:h-14 sm:w-14"
          />
          <span className="truncate font-heading text-lg tracking-wide text-charcoal transition-colors group-hover:text-saffron sm:text-xl">
            {brandName}
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-charcoal/80 transition-colors hover:text-saffron",
                isActiveLink(link.href) && "text-saffron",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button href="/events" size="sm">
            Upcoming Events
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={cn(
                "absolute left-0 top-0 h-0.5 w-6 bg-charcoal transition-transform duration-300",
                open && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[7px] h-0.5 w-6 bg-charcoal transition-opacity duration-300",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[14px] h-0.5 w-6 bg-charcoal transition-transform duration-300",
                open && "-translate-y-[7px] -rotate-45",
              )}
            />
          </span>
        </button>
      </nav>

      {open ? (
        <div className="border-t border-border bg-cream lg:hidden">
          <div className="flex flex-col gap-0.5 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-2 py-2 text-sm font-medium text-charcoal hover:bg-sand/50"
              >
                {link.label}
              </Link>
            ))}
            <Button href="/events" size="sm" onClick={closeMenu} className="mt-2 w-fit self-start">
              Upcoming Events
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
