import { NextResponse } from "next/server";

import { deliverSubmission } from "@/lib/contact";

interface ContactPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  program?: string;
  interest?: string;
  preferredTime?: string;
  message?: string;
  consent?: string;
  /** Honeypot: should always be empty for real users. */
  company?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function deliveryErrorHeader(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown delivery error";

  return message.replace(/[^\x20-\x7E]/g, " ").slice(0, 400);
}

export async function POST(request: Request) {
  let data: ContactPayload;
  try {
    data = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: if filled, silently accept without doing anything (bot).
  if (data.company && data.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const fullName = data.fullName?.trim();
  const email = data.email?.trim();
  const phone = data.phone?.trim();
  const message = data.message?.trim();

  if (!fullName || !email || !phone || !message) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (data.consent !== "yes") {
    return NextResponse.json(
      { error: "Please provide consent to continue." },
      { status: 400 },
    );
  }

  try {
    await deliverSubmission({
      fullName,
      email,
      phone,
      program: data.program?.trim(),
      interest: data.interest?.trim(),
      preferredTime: data.preferredTime?.trim(),
      message,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to deliver contact submission:", error);
    return NextResponse.json(
      { error: "We couldn't send your message. Please try again or email us directly." },
      {
        status: 500,
        headers: {
          "X-Form-Delivery-Error": deliveryErrorHeader(error),
        },
      },
    );
  }

  return NextResponse.json({ ok: true });
}
