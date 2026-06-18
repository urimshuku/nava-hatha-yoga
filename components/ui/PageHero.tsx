import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="border-b border-border bg-ivory pb-10 pt-10 sm:pb-section-sm sm:pt-16 md:pt-40">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? <p className="eyebrow mb-3 sm:mb-5">{eyebrow}</p> : null}
          <h1 className="text-display text-balance">{title}</h1>
          {description ? (
            <p className="section-lead mx-auto mt-4 max-w-2xl sm:mt-6">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-5 flex justify-center sm:mt-8">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
