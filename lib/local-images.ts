import "server-only";

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
  "shanmukhi-mudra": "object-[30%_center]",
  "surya-kriya": "object-[85%_center]",
  "surya-shakti": "object-[28%_center]",
  yogasanas: "object-[22%_center]",
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

/** Crop anchor for object-cover about section photos (Tailwind object-position utilities). */
const ABOUT_SECTION_IMAGE_OBJECT_POSITION: Partial<Record<string, string>> = {
  "isha-yoga-center": "object-[35%_center]",
  sadhguru: "object-[center_20%]",
};

export function aboutSectionImageSrc(key: string): string | null {
  return resolveLocalImageSrc(["about"], key);
}

export function aboutSectionImageObjectPositionClass(key: string): string {
  return ABOUT_SECTION_IMAGE_OBJECT_POSITION[key] ?? "object-center";
}

export function footerCertificationLogoSrc(): string | null {
  return resolveLocalImageSrc([], "Sadhguru_Gurukulam_Logo");
}
