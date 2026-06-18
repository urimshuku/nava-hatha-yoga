import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Link from "next/link";

import { cn } from "@/lib/utils";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 leading-relaxed text-[#3a322a]">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 font-heading text-3xl text-charcoal">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 font-heading text-2xl text-charcoal">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-clay pl-5 italic text-brown">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 list-disc space-y-2 pl-5 marker:text-clay">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-5 marker:text-brown">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-charcoal">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const isExternal = /^https?:\/\//.test(href);
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-saffron underline underline-offset-2 hover:text-saffron-hover"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          className="text-saffron underline underline-offset-2 hover:text-saffron-hover"
        >
          {children}
        </Link>
      );
    },
  },
};

interface CMSRichTextProps {
  value?: PortableTextBlock[] | null;
  className?: string;
}

export function CMSRichText({ value, className }: CMSRichTextProps) {
  if (!value || value.length === 0) return null;
  return (
    <div className={cn("prose-body", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
