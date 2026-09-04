import { getPrograms } from "@/lib/cms/site-content";

import { EventForm } from "../EventForm";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const programs = await getPrograms();

  return (
    <EventForm
      isNew
      programs={programs.map((program) => ({
        slug: program.slug,
        title: program.title,
      }))}
    />
  );
}
