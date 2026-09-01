import { acceptSubmission } from "@/lib/form-delivery";
import { isSimplifiedRegistration } from "@/lib/register-content";

/**
 * Central event-registration submission module.
 *
 * The registration form posts JSON to /api/register, which validates and then
 * calls `deliverRegistration()` below. Delivery is intentionally server-only so
 * API keys and submitted details never enter the client bundle.
 */

export interface RegistrationSubmission {
  /** Program, location, and dates (from the ?event= query param). */
  event?: string;
  /** CMS event type, when known. Free Session uses the short form. */
  category?: string;

  // Step 1 — Personal Information
  fullName: string;
  preferredName?: string;
  email: string;
  phone: string;
  address: string;
  gender?: string;
  age: string;
  occupation?: string;
  emergencyName?: string;
  emergencyRelationship?: string;
  emergencyPhone?: string;

  // Step 2 — Health-Related Information
  healthConditions: string[];
  healthConditionsOther?: string;
  healthDetails?: string;
  majorSurgery?: string;
  pregnant?: string;

  // Step 3 — Program-Related Information
  howHeard: string[];
  howHeardOther?: string;
  priorPractice?: string;
  otherIshaPractices?: string;
  otherIshaPracticesDetails?: string;

  submittedAt: string;
}

export function formatRegistration(s: RegistrationSubmission): string {
  const simplified = isSimplifiedRegistration(s.event, s.category);

  const lines = [
    `Event: ${s.event || "-"}`,
    "",
    "--- Personal Information ---",
    `Full name: ${s.fullName}`,
    `Preferred name: ${s.preferredName || "-"}`,
    `Email: ${s.email}`,
    `Phone: ${s.phone}`,
    `Residential address: ${s.address}`,
    `Gender: ${s.gender || "-"}`,
    `Age: ${s.age}`,
    `Occupation: ${s.occupation || "-"}`,
  ];

  if (!simplified) {
    const conditions =
      s.healthConditions.length > 0 ? s.healthConditions.join(", ") : "-";
    const howHeard = s.howHeard.length > 0 ? s.howHeard.join(", ") : "-";

    lines.push(
      `Emergency contact: ${s.emergencyName || "-"} (${s.emergencyRelationship || "-"}) — ${s.emergencyPhone || "-"}`,
      "",
      "--- Health-Related Information ---",
      `Conditions: ${conditions}`,
      `Other condition: ${s.healthConditionsOther || "-"}`,
      `Condition details: ${s.healthDetails || "-"}`,
      `Major surgery (last 6 months): ${s.majorSurgery || "-"}`,
      `Currently pregnant: ${s.pregnant || "-"}`,
      "",
      "--- Program-Related Information ---",
      `How they heard: ${howHeard}`,
      `How they heard (other): ${s.howHeardOther || "-"}`,
      `Prior yoga/meditation practice: ${s.priorPractice || "-"}`,
      `Other Isha Yoga practices: ${s.otherIshaPractices || "-"}`,
      `Other Isha Yoga details: ${s.otherIshaPracticesDetails || "-"}`,
    );
  }

  lines.push("", `Submitted: ${s.submittedAt}`);
  return lines.join("\n");
}

export async function deliverRegistration(
  submission: RegistrationSubmission,
): Promise<void> {
  const fullName = submission.fullName.replace(/\s+/g, " ").trim();
  const eventName = submission.event?.replace(/\s+/g, " ").trim();

  await acceptSubmission({
    type: "registration",
    subject: `New registration: ${eventName || "Program registration"} - ${fullName}`,
    replyTo: submission.email,
    body: formatRegistration(submission),
    payload: submission,
  });
}
