import { ProgramCard } from "@/components/cards/ProgramCard";
import type { ProgramListItem } from "@/lib/cms/content-types";

export function ProgramGrid({ programs }: { programs: ProgramListItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <ProgramCard key={program._id} program={program} />
      ))}
    </div>
  );
}
