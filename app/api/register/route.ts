import { NextResponse } from "next/server";

import { deliverRegistration } from "@/lib/registration";

interface RegisterPayload {
  event?: string;
  fullName?: string;
  preferredName?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
  age?: string;
  occupation?: string;
  emergencyName?: string;
  emergencyRelationship?: string;
  emergencyPhone?: string;
  healthConditions?: string[];
  healthConditionsOther?: string;
  healthDetails?: string;
  majorSurgery?: string;
  pregnant?: string;
  howHeard?: string;
  priorPractice?: string;
  otherIshaPractices?: string;
  otherIshaPracticesDetails?: string;
  medicalConsent?: string;
  refundConsent?: string;
  agreementConsent?: string;
  /** Honeypot: should always be empty for real users. */
  company?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let data: RegisterPayload;
  try {
    data = (await request.json()) as RegisterPayload;
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
  const address = data.address?.trim();
  const age = data.age?.trim();
  const emergencyName = data.emergencyName?.trim();
  const emergencyPhone = data.emergencyPhone?.trim();
  const healthDetails = data.healthDetails?.trim();
  const majorSurgery = data.majorSurgery?.trim();
  const pregnant = data.pregnant?.trim();
  const howHeard = data.howHeard?.trim();
  const priorPractice = data.priorPractice?.trim();
  const otherIshaPractices = data.otherIshaPractices?.trim();
  const healthConditions = Array.isArray(data.healthConditions)
    ? data.healthConditions.filter((c) => typeof c === "string" && c.trim())
    : [];

  if (
    !fullName ||
    !email ||
    !phone ||
    !address ||
    !age ||
    !emergencyName ||
    !emergencyPhone ||
    !majorSurgery ||
    !howHeard ||
    !priorPractice ||
    !otherIshaPractices
  ) {
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

  if (healthConditions.length === 0) {
    return NextResponse.json(
      { error: "Please select at least one health option." },
      { status: 400 },
    );
  }

  if (
    data.medicalConsent !== "yes" ||
    data.refundConsent !== "yes" ||
    data.agreementConsent !== "yes"
  ) {
    return NextResponse.json(
      { error: "Please agree to all required terms to continue." },
      { status: 400 },
    );
  }

  try {
    await deliverRegistration({
      event: data.event?.trim(),
      fullName,
      preferredName: data.preferredName?.trim(),
      email,
      phone,
      address,
      gender: data.gender?.trim(),
      age,
      occupation: data.occupation?.trim(),
      emergencyName,
      emergencyRelationship: data.emergencyRelationship?.trim(),
      emergencyPhone,
      healthConditions,
      healthConditionsOther: data.healthConditionsOther?.trim(),
      healthDetails,
      majorSurgery,
      pregnant,
      howHeard,
      priorPractice,
      otherIshaPractices,
      otherIshaPracticesDetails: data.otherIshaPracticesDetails?.trim(),
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to deliver registration:", error);
    return NextResponse.json(
      {
        error:
          "We couldn't submit your registration. Please try again or contact us directly.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
