import { ProgramGrid } from "@/components/programs/ProgramGrid";
import type { ProgramListItem } from "@/sanity/lib/types";

export function ProgramsListing({
  mainPrograms,
  specialPrograms,
  mainHeading,
  specialHeading,
  specialLead,
}: {
  mainPrograms: ProgramListItem[];
  specialPrograms: ProgramListItem[];
  mainHeading?: string;
  specialHeading?: string;
  specialLead?: string;
}) {
  return (
    <>
      <h2 className="eyebrow mb-8">{mainHeading?.trim() || "Main programs"}</h2>
      <ProgramGrid programs={mainPrograms} />

      {specialPrograms.length > 0 ? (
        <section className="mt-14 border-t border-border pt-12">
          <div className="mb-8 text-center">
            <h2 className="eyebrow mb-3">
              {specialHeading?.trim() || "Special programs"}
            </h2>
            <p className="section-lead mx-auto max-w-xl">
              {specialLead?.trim() ||
                "Practices that support specific aspects of health and wellbeing."}
            </p>
          </div>
          <ProgramGrid programs={specialPrograms} />
        </section>
      ) : null}
    </>
  );
}
