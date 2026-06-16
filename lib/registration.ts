/**
 * Central event-registration submission module.
 *
 * Mirrors lib/contact.ts: the registration form posts JSON to /api/register,
 * which validates and then calls `deliverRegistration()` below. This is the ONE
 * place to connect registrations to a real backend later (email via Resend,
 * Sanity/DB write, etc.). For now it logs to the server so the flow works
 * end-to-end with no secrets.
 */

export interface RegistrationSubmission {
  /** Event the person is registering for (from the ?event= query param). */
  event?: string;

  // Step 1 — Personal Information
  fullName: string;
  preferredName?: string;
  email: string;
  phone: string;
  address: string;
  gender?: string;
  age: string;
  occupation?: string;
  emergencyName: string;
  emergencyRelationship?: string;
  emergencyPhone: string;

  // Step 2 — Health-Related Information
  healthConditions: string[];
  healthConditionsOther?: string;
  healthDetails?: string;
  majorSurgery: string;
  pregnant?: string;

  // Step 3 — Program-Related Information
  howHeard: string;
  priorPractice: string;
  otherIshaPractices: string;
  otherIshaPracticesDetails?: string;

  submittedAt: string;
}

export function formatRegistration(s: RegistrationSubmission): string {
  const conditions =
    s.healthConditions.length > 0 ? s.healthConditions.join(", ") : "-";

  return [
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
    `Emergency contact: ${s.emergencyName} (${s.emergencyRelationship || "-"}) — ${s.emergencyPhone}`,
    "",
    "--- Health-Related Information ---",
    `Conditions: ${conditions}`,
    `Other condition: ${s.healthConditionsOther || "-"}`,
    `Condition details: ${s.healthDetails || "-"}`,
    `Major surgery (last 6 months): ${s.majorSurgery}`,
    `Currently pregnant: ${s.pregnant || "-"}`,
    "",
    "--- Program-Related Information ---",
    `How they heard: ${s.howHeard}`,
    `Prior yoga/meditation practice: ${s.priorPractice}`,
    `Other Isha Yoga practices: ${s.otherIshaPractices}`,
    `Other Isha Yoga details: ${s.otherIshaPracticesDetails || "-"}`,
    "",
    `Submitted: ${s.submittedAt}`,
  ].join("\n");
}

/**
 * Deliver a validated registration. Currently logs to the server so the form
 * works end-to-end with no secrets. Replace the body with email/DB delivery
 * (see lib/contact.ts for documented options) when ready to go live.
 */
export async function deliverRegistration(
  submission: RegistrationSubmission,
): Promise<void> {
  console.info("New event registration:\n" + formatRegistration(submission));
}
