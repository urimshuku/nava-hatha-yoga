import type { ReactNode } from "react";

/** Groups related fields under a heading, so a long form reads as short steps. */
export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-white p-5 sm:p-6">
      <h2 className="font-heading text-xl text-charcoal">{title}</h2>
      {description ? (
        <p className="mt-1 max-w-2xl text-sm text-brown">{description}</p>
      ) : null}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}
