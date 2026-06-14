import fs from "node:fs";
import path from "node:path";

const EXTENSIONS = ["avif", "webp", "jpg", "jpeg", "png"] as const;

/**
 * Resolve a local image under /public/images when the file exists on disk.
 * Returns the public URL path (e.g. /images/programs/surya-kriya.jpg).
 */
export function resolveLocalImageSrc(
  subpath: string[],
  basename: string,
): string | null {
  const dir = path.join(process.cwd(), "public", "images", ...subpath);

  for (const ext of EXTENSIONS) {
    const filePath = path.join(dir, `${basename}.${ext}`);
    if (fs.existsSync(filePath)) {
      const urlPath = ["images", ...subpath, `${basename}.${ext}`]
        .filter(Boolean)
        .join("/");
      return `/${urlPath}`;
    }
  }

  return null;
}

export function programImageSrc(slug: string): string | null {
  return resolveLocalImageSrc(["programs"], slug);
}

/** Crop anchor for object-cover program photos (Tailwind object-position utilities). */
const PROGRAM_IMAGE_OBJECT_POSITION: Partial<Record<string, string>> = {
  angamardana: "object-[95%_center]",
  "bhastrika-kriya": "object-left",
};

export function programImageObjectPositionClass(slug: string): string {
  return PROGRAM_IMAGE_OBJECT_POSITION[slug] ?? "object-center";
}

/** Sidebar photo height per program (Tailwind aspect-ratio utilities). */
const PROGRAM_SIDEBAR_IMAGE_ASPECT: Partial<Record<string, string>> = {
  "bhuta-shuddhi": "aspect-[19/20]",
};

export function programSidebarImageAspectClass(slug: string): string {
  return PROGRAM_SIDEBAR_IMAGE_ASPECT[slug] ?? "aspect-[9/10]";
}

export function programSymbolSrc(slug: string): string | null {
  return resolveLocalImageSrc(["programs"], `${slug}-symbol`);
}

export function footerCertificationLogoSrc(): string | null {
  return resolveLocalImageSrc([], "Sadhguru_Gurukulam_Logo");
}
