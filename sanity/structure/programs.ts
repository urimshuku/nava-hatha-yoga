/**
 * Studio sidebar order for Programs.
 * Matches live /programs `orderRank` (aligned 16 August 2026).
 * Keep this list and `orderRank` in sync if the public order changes.
 */
export const PROGRAM_STUDIO_ORDER = [
  "surya-kriya",
  "angamardana",
  "yogasanas",
  "upa-yoga",
  "bhuta-shuddhi",
  "surya-shakti",
  "childrens-program",
  "bhastrika-kriya",
  "jala-neti",
  "thoppukarnam",
  "shanmukhi-mudra",
  "eye-care-practices",
  "pavanamuktasana",
] as const;

export type ProgramNavItem = {
  _id: string;
  title?: string;
  slug?: string | null;
};

export function sortProgramsForStudio<T extends ProgramNavItem>(programs: T[]): T[] {
  return [...programs].sort((a, b) => {
    const ai = PROGRAM_STUDIO_ORDER.indexOf(
      (a.slug ?? "") as (typeof PROGRAM_STUDIO_ORDER)[number],
    );
    const bi = PROGRAM_STUDIO_ORDER.indexOf(
      (b.slug ?? "") as (typeof PROGRAM_STUDIO_ORDER)[number],
    );
    if (ai === -1 && bi === -1) {
      return (a.title ?? "").localeCompare(b.title ?? "");
    }
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}
