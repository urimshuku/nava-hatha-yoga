/**
 * Central contact-submission module.
 *
 * This is the ONE place to connect the contact form to a real backend later.
 * The form posts JSON to /api/contact, which validates and then calls
 * `deliverSubmission()` below. Pick an integration and fill in the stub.
 *
 * --- Option A: Email delivery (e.g. Resend) ---
 *   1. `npm install resend`
 *   2. Add RESEND_API_KEY + CONTACT_NOTIFICATION_EMAIL to .env.local
 *   3. In deliverSubmission():
 *        const { Resend } = await import("resend");
 *        const resend = new Resend(process.env.RESEND_API_KEY);
 *        await resend.emails.send({
 *          from: "Nava Hatha Yoga <info@navahathayoga.com>",
 *          to: process.env.CONTACT_NOTIFICATION_EMAIL!,
 *          subject: `New enquiry from ${submission.fullName}`,
 *          replyTo: submission.email,
 *          text: formatSubmission(submission),
 *        });
 *
 * --- Option B: Database / Sanity ---
 *   Use a server-side Sanity client with a write token, or any DB client, and
 *   create a document/row from `submission` here.
 *
 * --- Option C: Netlify Forms ---
 *   Netlify detects forms from static HTML. To use it instead of this API route:
 *   add `data-netlify="true"` + a hidden `form-name` input to a static form, or
 *   POST url-encoded data (including `form-name`) to "/" from the client. The
 *   honeypot field below ("company") is already wired for Netlify spam filtering.
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

/**
 * Deliver a validated submission. Currently logs to the server so the form
 * works end-to-end with no secrets. Replace the body with one of the options
 * documented above when ready to go live.
 */
export async function deliverSubmission(submission: ContactSubmission): Promise<void> {
  console.info("New contact enquiry:\n" + formatSubmission(submission));
}
