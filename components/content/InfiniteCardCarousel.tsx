import { cn } from "@/lib/utils";

type InfiniteCardCarouselProps = {
  items: string[];
  label?: string;
  className?: string;
};

export function InfiniteCardCarousel({
  items,
  label = "Teacher credentials",
  className,
}: InfiniteCardCarouselProps) {
  const titles = items.map((item) => item.trim()).filter(Boolean);
  if (titles.length === 0) return null;

  const copies = [0, 1, 2];

  return (
    <div
      className={cn(
        "ribbon border-y border-border bg-ivory py-4 sm:py-5",
        className,
      )}
      role="region"
      aria-label={label}
    >
      <div className="ribbon-mask">
        <div className="ribbon-track">
          {copies.map((copy) => (
            <ul
              key={copy}
              className={cn("ribbon-copy", copy > 0 && "ribbon-clone")}
              aria-hidden={copy > 0 ? true : undefined}
            >
              {titles.map((title, index) => (
                <li key={`${copy}-${index}`} className="ribbon-item">
                  <span>{title}</span>
                  <span className="ribbon-sep" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
