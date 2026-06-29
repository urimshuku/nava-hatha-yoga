import { persistAndNotify } from "@/lib/form-delivery";

/**
 * Central contact-submission module.
 *
 * The form posts JSON to /api/contact, which validates and then calls
 * `deliverSubmission()` below. Delivery is intentionally server-only so API
 * keys and submitted details never enter the client bundle.
 */

export interface ContactSubmission {
  fullName: string;
  email: string;
  phone?: string;
  program?: string;
  interest?: string;
  preferredTime?: string;
  message: string;
  submittedAt: string;
}

export function formatSubmission(s: ContactSubmission): string {
  return [
    `Name: ${s.fullName}`,
    `Email: ${s.email}`,
    `Phone: ${s.phone || "-"}`,
    `Program: ${s.program || "-"}`,
    `Interest: ${s.interest || "-"}`,
    `Preferred time: ${s.preferredTime || "-"}`,
    "",
    "Message:",
    s.message,
    "",
    `Submitted: ${s.submittedAt}`,
  ].join("\n");
}

export async function deliverSubmission(submission: ContactSubmission): Promise<void> {
  const fullName = submission.fullName.replace(/\s+/g, " ").trim();

  await persistAndNotify({
    type: "contact",
    subject: `New enquiry from ${fullName}`,
    replyTo: submission.email,
    body: formatSubmission(submission),
    payload: submission,
  });
}
