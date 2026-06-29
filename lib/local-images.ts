const PROGRAM_IMAGES: Record<string, string> = {
  angamardana: "/images/programs/angamardana.webp",
  "bhastrika-kriya": "/images/programs/bhastrika-kriya.jpg",
  "bhuta-shuddhi": "/images/programs/bhuta-shuddhi.webp",
  "eye-care-practices": "/images/programs/eye-care-practices.webp",
  "jala-neti": "/images/programs/jala-neti.jpg",
  pavanamuktasana: "/images/programs/pavanamuktasana.webp",
  "shanmukhi-mudra": "/images/programs/shanmukhi-mudra.webp",
  "surya-kriya": "/images/programs/surya-kriya.webp",
  "surya-shakti": "/images/programs/surya-shakti.webp",
  thoppukarnam: "/images/programs/thoppukarnam.webp",
  yogasanas: "/images/programs/yogasanas.webp",
};

const PROGRAM_DESKTOP_IMAGES: Partial<Record<string, string>> = {
  yogasanas: "/images/programs/yogasanas-desktop.webp",
};

const PROGRAM_SYMBOLS: Record<string, string> = {};

const ABOUT_SECTION_IMAGES: Record<string, string> = {
  "isha-foundation": "/images/about/isha-foundation.jpg",
  "isha-hatha-yoga-teacher-training": "/images/about/isha-hatha-yoga-teacher-training.jpg",
  "isha-yoga-center": "/images/about/isha-yoga-center.jpg",
  sadhguru: "/images/about/sadhguru.jpg",
  "teacher-linda": "/images/about/teacher-linda.png",
};

const FOOTER_CERTIFICATION_LOGO_SRC = "/images/Sadhguru_Gurukulam_Logo.avif";

export function programImageSrc(slug: string): string | null {
  return PROGRAM_IMAGES[slug] ?? null;
}

export function programDesktopImageSrc(slug: string): string | null {
  return PROGRAM_DESKTOP_IMAGES[slug] ?? null;
}

/** Crop anchor for object-cover program photos (Tailwind object-position utilities). */
const PROGRAM_IMAGE_OBJECT_POSITION: Partial<Record<string, string>> = {
  angamardana: "object-[95%_center]",
  "bhastrika-kriya": "object-left",
  "shanmukhi-mudra": "object-[30%_center]",
  "surya-kriya": "object-[85%_center]",
  "surya-shakti": "object-[28%_center]",
  yogasanas: "object-center",
};

const PROGRAM_DESKTOP_IMAGE_OBJECT_POSITION: Partial<Record<string, string>> = {
  yogasanas: "object-left",
};

export function programImageObjectPositionClass(slug: string): string {
  return PROGRAM_IMAGE_OBJECT_POSITION[slug] ?? "object-center";
}

export function programDesktopImageObjectPositionClass(slug: string): string {
  return PROGRAM_DESKTOP_IMAGE_OBJECT_POSITION[slug] ?? programImageObjectPositionClass(slug);
}

export function programSymbolSrc(slug: string): string | null {
  return PROGRAM_SYMBOLS[slug] ?? null;
}

/** Crop anchor for object-cover about section photos (Tailwind object-position utilities). */
const ABOUT_SECTION_IMAGE_OBJECT_POSITION: Partial<Record<string, string>> = {
  "isha-yoga-center": "object-[35%_center]",
  sadhguru: "object-[center_20%]",
  "teacher-linda": "object-[center_58%]",
};

export function aboutSectionImageSrc(key: string): string | null {
  return ABOUT_SECTION_IMAGES[key] ?? null;
}

export function aboutSectionImageObjectPositionClass(key: string): string {
  return ABOUT_SECTION_IMAGE_OBJECT_POSITION[key] ?? "object-center";
}

export function footerCertificationLogoSrc(): string | null {
  return FOOTER_CERTIFICATION_LOGO_SRC;
}
