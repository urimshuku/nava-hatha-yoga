import { NextResponse } from "next/server";

import {
  findEventForRegistration,
  getRegisterPage,
  getRetreatBySlug,
} from "@/lib/cms/site-content";
import { deliverRegistration } from "@/lib/registration";
import {
  firstEmailValue,
  displayNameValue,
  hasInvalidRegisterFields,
  labeledValuesForFields,
  parseExtraFields,
  REGISTER_EMAIL_RE,
  resolveRegisterContent,
  valueForRegisterField,
} from "@/lib/register-config";
import {
  isSimplifiedRegistrationKind,
  parseRegistrationKind,
  resolveRegistrationKind,
} from "@/lib/registration-kind";

interface RegisterPayload {
  event?: string;
  eventSlug?: string;
  kind?: string;
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
  extraFields?: unknown;
  healthConditions?: string[];
  healthConditionsOther?: string;
  healthDetails?: string;
  majorSurgery?: string;
  pregnant?: string;
  howHeard?: string[];
  howHeardOther?: string;
  priorPractice?: string;
  otherIshaPractices?: string;
  otherIshaPracticesDetails?: string;
  medicalConsent?: string;
  refundConsent?: string;
  agreementConsent?: string;
  /** Honeypot: should always be empty for real users. */
  company?: string;
}

function deliveryErrorHeader(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown delivery error";

  return message.replace(/[^\x20-\x7E]/g, " ").slice(0, 400);
}

function knownValues(data: RegisterPayload): Record<string, string | undefined> {
  return {
    fullName: data.fullName,
    preferredName: data.preferredName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    gender: data.gender,
    age: data.age,
    occupation: data.occupation,
    emergencyName: data.emergencyName,
    emergencyRelationship: data.emergencyRelationship,
    emergencyPhone: data.emergencyPhone,
  };
}

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

  const event = data.event?.trim();
  const eventSlug = data.eventSlug?.trim();
  const requestedKind = parseRegistrationKind(data.kind);
  const [matchedEvent, matchedRetreat] = await Promise.all([
    requestedKind === "retreat"
      ? Promise.resolve(undefined)
      : findEventForRegistration({
          slug: eventSlug,
          label: event,
        }),
    eventSlug ? getRetreatBySlug(eventSlug) : Promise.resolve(undefined),
  ]);
  const isRetreat =
    Boolean(matchedRetreat) && (requestedKind === "retreat" || !matchedEvent);
  const kind = resolveRegistrationKind({
    kind: data.kind,
    category: matchedEvent?.category,
    isRetreat,
    eventLabel: event,
  });
  const content = resolveRegisterContent(await getRegisterPage(kind));
  const simplified = isSimplifiedRegistrationKind(kind);
  const category =
    matchedEvent?.category ??
    (matchedRetreat || kind === "retreat"
      ? "Retreat"
      : kind === "free"
        ? "Free Session"
        : undefined);
  const extra = parseExtraFields(data.extraFields);
  const known = knownValues(data);
  const personalFields = content.personalFields;
  const emergencyFields = simplified ? [] : content.emergencyFields;

  if (
    hasInvalidRegisterFields(personalFields, known, extra) ||
    hasInvalidRegisterFields(emergencyFields, known, extra)
  ) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  const email = firstEmailValue(
    [...personalFields, ...emergencyFields],
    known,
    extra,
  );
  if (email && !REGISTER_EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const healthDetails = data.healthDetails?.trim();
  const majorSurgery = data.majorSurgery?.trim();
  const pregnant = data.pregnant?.trim();
  const howHeard = Array.isArray(data.howHeard)
    ? data.howHeard.filter((item) => typeof item === "string" && item.trim())
    : [];
  const howHeardOther = data.howHeardOther?.trim();
  const priorPractice = data.priorPractice?.trim();
  const otherIshaPractices = data.otherIshaPractices?.trim();
  const healthConditions = Array.isArray(data.healthConditions)
    ? data.healthConditions.filter((c) => typeof c === "string" && c.trim())
    : [];

  if (!simplified) {
    const healthChoices = [
      ...content.healthConditions,
      content.otherConditionLabel,
      content.notApplicableLabel,
    ].filter(Boolean);
    if (healthChoices.length > 0 && healthConditions.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one health option." },
        { status: 400 },
      );
    }
    if (
      content.otherConditionLabel &&
      healthConditions.includes(content.otherConditionLabel) &&
      !data.healthConditionsOther?.trim()
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }
    if (content.majorSurgeryQuestion && !majorSurgery) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    const howHeardShown =
      content.howHeardGroups.length > 0 || Boolean(content.howHeardOtherLabel);
    if (howHeardShown && howHeard.length === 0 && !howHeardOther) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }
    if (content.priorPracticeLabel && !priorPractice) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }
    if (content.otherIshaLabel && !otherIshaPractices) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (
      (content.disclaimerConsentLabel && data.medicalConsent !== "yes") ||
      (content.refundPolicyConsentLabel && data.refundConsent !== "yes") ||
      (content.agreementConsentLabel && data.agreementConsent !== "yes")
    ) {
      return NextResponse.json(
        { error: "Please agree to all required terms to continue." },
        { status: 400 },
      );
    }
  }

  const fullName =
    displayNameValue(personalFields, known, extra) ||
    valueForRegisterField(
      { key: "fullName", label: "Full name", type: "text" },
      known,
      extra,
    );
  const personalLines = labeledValuesForFields(personalFields, known, extra);
  const emergencyLines = labeledValuesForFields(emergencyFields, known, extra);

  try {
    await deliverRegistration({
      event,
      category,
      fullName,
      preferredName: data.preferredName?.trim(),
      email,
      phone: data.phone?.trim() ?? "",
      address: data.address?.trim() ?? "",
      gender: data.gender?.trim(),
      age: data.age?.trim() ?? "",
      occupation: data.occupation?.trim(),
      emergencyName: data.emergencyName?.trim(),
      emergencyRelationship: data.emergencyRelationship?.trim(),
      emergencyPhone: data.emergencyPhone?.trim(),
      personalLines,
      emergencyLines,
      healthConditions,
      healthConditionsOther: data.healthConditionsOther?.trim(),
      healthDetails,
      majorSurgery,
      pregnant,
      howHeard,
      howHeardOther,
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
