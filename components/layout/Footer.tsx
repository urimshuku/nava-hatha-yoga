import Link from "next/link";

import { Container } from "@/components/layout/Container";
import {
  LEGAL_LINKS,
  NAV_LINKS,
  SITE_NAME,
  SITE_TAGLINE,
  whatsappLink,
} from "@/lib/constants";
import type { SiteSettings } from "@/sanity/lib/types";

export function Footer({ settings }: { settings?: SiteSettings }) {
  const brand = settings?.brandName || SITE_NAME;
  const tagline = settings?.tagline || SITE_TAGLINE;
  const email = settings?.email;
  const phone = settings?.phone;
  const location = settings?.location;
  const whatsapp = settings?.whatsapp;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-ivory">
      <Container className="py-section-sm">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="font-heading text-2xl text-charcoal">{brand}</p>
            <p className="mt-3 text-sm leading-relaxed text-brown">{tagline}</p>
          </div>

          <div>
            <h2 className="eyebrow mb-4">Explore</h2>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-charcoal/80 transition-colors hover:text-saffron"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow mb-4">Contact</h2>
            <ul className="space-y-2.5 text-sm text-charcoal/80">
              {location ? <li>{location}</li> : null}
              {email ? (
                <li>
                  <a href={`mailto:${email}`} className="hover:text-saffron">
                    {email}
                  </a>
                </li>
              ) : null}
              {phone ? (
                <li>
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-saffron">
                    {phone}
                  </a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-saffron"
                  >
                    WhatsApp
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-xs text-brown sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {brand}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-saffron">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
