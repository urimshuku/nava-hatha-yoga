import Image from "next/image";

import { programSymbolSrc } from "@/lib/local-images";

type LocalProgramSymbolProps = {
  slug: string;
};

/**
 * Optional decorative symbol: /public/images/programs/{slug}-symbol.png
 */
export function LocalProgramSymbol({ slug }: LocalProgramSymbolProps) {
  const src = programSymbolSrc(slug);

  if (!src) {
    return null;
  }

  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={120}
      height={120}
      className="mx-auto mb-6 h-16 w-16 object-contain opacity-90"
    />
  );
}
