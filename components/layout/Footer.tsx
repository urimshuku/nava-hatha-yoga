import Link from "next/link";

import { FooterCertificationLogo } from "@/components/layout/FooterCertificationLogo";
import { Container } from "@/components/layout/Container";
import { SocialIconLinks } from "@/components/ui/SocialIconLinks";
import {
  LEGAL_LINKS,
  NAV_LINKS,
  SITE_NAME,
  SITE_TAGLINE,
  instagramLink,
  whatsappLink,
} from "@/lib/constants";
import type { SiteSettings } from "@/sanity/lib/types";

export function Footer({ settings }: { settings?: SiteSettings }) {
  const brand = settings?.brandName || SITE_NAME;
  const tagline = settings?.tagline || SITE_TAGLINE;
  const email = settings?.email;
  const phone = settings?.phone;
  const whatsapp = settings?.whatsapp;
  const waMessage = "Hello, I'd like to know more about your classes.";
  const waHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`
    : whatsappLink(waMessage);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-ivory">
      <Container className="py-section-sm">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 md:items-stretch">
          <div className="flex max-w-sm flex-col lg:col-span-1">
            <div>
              <p className="font-heading text-2xl text-charcoal">{brand}</p>
              <p className="mt-3 text-sm leading-relaxed text-brown">{tagline}</p>
            </div>
            <FooterCertificationLogo className="mt-8 md:mt-auto md:pt-10" />
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
            <h2 className="eyebrow mb-4">Legal</h2>
            <ul className="space-y-2.5 text-sm">
              {LEGAL_LINKS.map((link) => (
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
              {email ? (
                <li>
                  <a href={`mailto:${email}`} className="hover:text-saffron">
                    {email}
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
                    {phone ?? "WhatsApp"}
                  </a>
                </li>
              ) : null}
            </ul>
            <SocialIconLinks
              className="mt-6"
              whatsappHref={whatsapp ? waHref : undefined}
              instagramHref={instagramLink()}
            />
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-xs text-brown">
          <p>
            &copy; {year} {brand}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
