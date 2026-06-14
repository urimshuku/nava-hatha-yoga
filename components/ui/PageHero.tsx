import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="bg-ivory pt-32 pb-section-sm sm:pt-40 border-b border-border">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
          <h1 className="text-display text-balance">{title}</h1>
          {description ? (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brown">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-8 flex justify-center">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
