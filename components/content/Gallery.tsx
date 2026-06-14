import { SanityImage } from "@/components/ui/SanityImage";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

export function Gallery({ images }: { images?: SanityImageType[] }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((image, i) => (
        <figure
          key={(image as { _key?: string })._key ?? i}
          className="overflow-hidden rounded-lg border border-border bg-ivory"
        >
          <div className="aspect-square">
            <SanityImage
              image={image}
              alt={image.alt ?? ""}
              width={500}
              height={500}
              sizes="(max-width: 640px) 50vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-calm hover:scale-[1.04]"
            />
          </div>
        </figure>
      ))}
    </div>
  );
}
