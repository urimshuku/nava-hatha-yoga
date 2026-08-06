import Link from "next/link";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { FooterCertificationLogo } from "@/components/layout/FooterCertificationLogo";
import { Container } from "@/components/layout/Container";
import { SocialIconLinks } from "@/components/ui/SocialIconLinks";
import {
  LEGAL_LINKS,
  NAV_LINKS,
  SITE_NAME,
  SITE_TAGLINE,
  resolveInstagramHref,
  whatsappLink,
} from "@/lib/constants";
import type { SiteSettings } from "@/sanity/lib/types";

export function Footer({ settings }: { settings?: SiteSettings }) {
  const brand = settings?.brandName || SITE_NAME;
  const tagline = settings?.tagline || SITE_TAGLINE;
  const email = settings?.email;
  const phone = settings?.phone;
  const whatsapp = settings?.whatsapp;
  const instagramHref = resolveInstagramHref(settings?.social);
  const waMessage = "Hello, I'd like to know more about your classes.";
  const waHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`
    : whatsappLink(waMessage);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-ivory">
      <Container className="py-section-sm">
        {/* Phone-only layout */}
        <div className="md:hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <BrandLogo
                variant="symbol"
                decorative
                className="-ml-2 h-12 w-12"
              />
              <div className="min-w-0">
                <p className="font-heading text-lg leading-tight text-charcoal">
                  {brand}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-brown">
                  {tagline}
                </p>
              </div>
            </div>
            <FooterCertificationLogo className="mt-2 shrink-0" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-24 gap-y-6">
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

            <div className="ml-3">
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
          </div>

          <div className="mt-8">
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
                    href={waHref}
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
              instagramHref={instagramHref}
            />
          </div>
        </div>

        {/* Tablet/desktop — original layout */}
        <div className="hidden gap-10 md:grid md:grid-cols-2 md:items-stretch lg:grid-cols-4">
          <div className="flex max-w-sm min-w-0 flex-col lg:col-span-1">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <BrandLogo
                variant="symbol"
                decorative
                className="-ml-1.5 h-16 w-16 lg:-ml-2 lg:h-[4.5rem] lg:w-[4.5rem]"
              />
              <div className="min-w-0">
                <p className="font-heading text-xl leading-tight text-charcoal lg:text-2xl">
                  {brand}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-brown lg:mt-2 lg:text-sm">
                  {tagline}
                </p>
              </div>
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
              instagramHref={instagramHref}
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
