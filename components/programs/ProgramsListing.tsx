import { ProgramGrid } from "@/components/programs/ProgramGrid";
import type { ProgramListItem } from "@/sanity/lib/types";

export function ProgramsListing({
  mainPrograms,
  specialPrograms,
}: {
  mainPrograms: ProgramListItem[];
  specialPrograms: ProgramListItem[];
}) {
  return (
    <>
      <p className="eyebrow mb-8">Main programs</p>
      <ProgramGrid programs={mainPrograms} />

      {specialPrograms.length > 0 ? (
        <section className="mt-14 border-t border-border pt-12">
          <div className="mb-8 text-center">
            <p className="eyebrow mb-3">Special programs</p>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-brown">
              Practices that support specific aspects of health and wellbeing.
            </p>
          </div>
          <ProgramGrid programs={specialPrograms} />
        </section>
      ) : null}
    </>
  );
}
