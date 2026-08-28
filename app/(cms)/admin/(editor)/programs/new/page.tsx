import { ProgramForm } from "../ProgramForm";

export const dynamic = "force-dynamic";

export default function NewProgramPage() {
  return (
    <ProgramForm
      isNew
      richText={{
        whatIs: "",
        aboutThePractice: "",
        practiceIndependently: "",
        privateAndGroupSessions: "",
      }}
    />
  );
}
