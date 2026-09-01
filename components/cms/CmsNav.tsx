"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { CmsNavSection } from "@/lib/cms/sections";
import { cn } from "@/lib/utils";

/**
 * Sidebar for the editor. The sections follow the website's own structure, so
 * "where do I change this?" has the same answer as "where is it on the site?".
 */
export function CmsNav({ sections }: { sections: CmsNavSection[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Website sections" className="space-y-8">
      {sections.map((section) => (
        <div key={section.heading}>
          <p className="mb-3 text-xs uppercase tracking-widest text-brown">
            {section.heading}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "block rounded px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-saffron/10 text-saffron-hover"
                        : "text-charcoal hover:bg-sand/40",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
