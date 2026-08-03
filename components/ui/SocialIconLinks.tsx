import { IconInstagram, IconWhatsApp } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";

const iconLinkClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-ivory transition-opacity duration-300 ease-calm hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron/40";

interface SocialIconLinksProps {
  whatsappHref?: string;
  instagramHref: string;
  className?: string;
}

export function SocialIconLinks({
  whatsappHref,
  instagramHref,
  className,
}: SocialIconLinksProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message on WhatsApp"
          className={iconLinkClass}
        >
          <IconWhatsApp className="h-5 w-5 text-[#25D366]" />
        </a>
      ) : null}
      <a
        href={instagramHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Connect on Instagram"
        className={iconLinkClass}
      >
        <IconInstagram className="h-5 w-5" />
      </a>
    </div>
  );
}
