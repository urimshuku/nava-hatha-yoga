import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border-strong bg-ivory px-6 py-16 text-center">
      <h3 className="font-heading text-2xl text-charcoal">{title}</h3>
      {description ? (
        <p className="mx-auto mt-3 max-w-md text-brown leading-relaxed">{description}</p>
      ) : null}
      {children ? <div className="mt-6 flex justify-center">{children}</div> : null}
    </div>
  );
}
