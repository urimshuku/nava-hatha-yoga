"use client";

import { useState } from "react";

import { BankDetailsCard } from "@/components/forms/BankDetailsCard";
import { BeforeProgramModal } from "@/components/forms/BeforeProgramModal";
import { MedicalDisclaimerModal } from "@/components/forms/MedicalDisclaimerModal";
import { Button } from "@/components/ui/Button";
import {
  AGREEMENT_BULLETS,
  AGREEMENT_CONSENT_LABEL,
  PARTICIPANT_AGREEMENT_TITLE,
  BEFORE_SESSION_CLOTHING,
  BEFORE_SESSION_STOMACH,
  HEALTH_CONDITION_NOT_APPLICABLE,
  HEALTH_CONDITIONS,
  HEALTH_DETAILS_LABEL,
  HEALTH_INTRO,
  MAJOR_SURGERY_HINT,
  MAJOR_SURGERY_QUESTION,
  MEDICAL_DISCLAIMER_BULLETS,
  MEDICAL_DISCLAIMER_CONSENT_LABEL,
  MEDICAL_DISCLAIMER_INTRO,
  PREGNANCY_LABEL,
  REFUND_POLICY_BULLETS,
  REFUND_POLICY_CONSENT_LABEL,
} from "@/lib/register-content";
import { cn } from "@/lib/utils";

interface RegistrationFormProps {
  event?: string;
}

const fieldClass =
  "w-full rounded-lg border border-border-strong bg-ivory px-4 py-3 text-charcoal placeholder:text-brown/60 focus-visible:border-saffron focus-visible:outline-none";
const labelClass = "mb-1.5 block text-sm font-medium text-charcoal";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STEPS = [
  "Personal Information",
  "Health-Related Information",
  "Program-Related Information",
  "Agreement",
  "Payment Details",
  "Before the Start of the Session",
] as const;

const OTHER_CONDITION = "Other";

interface FormState {
  fullName: string;
  preferredName: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  age: string;
  occupation: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  healthConditions: string[];
  healthConditionsOther: string;
  healthDetails: string;
  majorSurgery: string;
  pregnant: string;
  howHeard: string;
  priorPractice: string;
  otherIshaPractices: string;
  otherIshaPracticesDetails: string;
  medicalConsent: boolean;
  refundConsent: boolean;
  agreementConsent: boolean;
  company: string;
}

const initialState: FormState = {
  fullName: "",
  preferredName: "",
  email: "",
  phone: "",
  address: "",
  gender: "",
  age: "",
  occupation: "",
  emergencyName: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  healthConditions: [],
  healthConditionsOther: "",
  healthDetails: "",
  majorSurgery: "",
  pregnant: "",
  howHeard: "",
  priorPractice: "",
  otherIshaPractices: "",
  otherIshaPracticesDetails: "",
  medicalConsent: false,
  refundConsent: false,
  agreementConsent: false,
  company: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

function Required() {
  return <span className="text-saffron">*</span>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm text-saffron-hover">
      {message}
    </p>
  );
}

export function RegistrationForm({ event }: RegistrationFormProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success">(
    "idle",
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [beforeProgramOpen, setBeforeProgramOpen] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function toggleCondition(condition: string) {
    setForm((prev) => {
      const has = prev.healthConditions.includes(condition);
      const healthConditions = has
        ? prev.healthConditions.filter((c) => c !== condition)
        : [...prev.healthConditions, condition];
      return { ...prev, healthConditions };
    });
    setErrors((prev) =>
      prev.healthConditions ? { ...prev, healthConditions: undefined } : prev,
    );
  }

  function validateStep(current: number): Errors {
    const next: Errors = {};

    if (current === 0) {
      if (!form.fullName.trim()) next.fullName = "Please enter your full name.";
      if (!form.email.trim()) next.email = "Please enter your email.";
      else if (!EMAIL_RE.test(form.email.trim()))
        next.email = "Please enter a valid email address.";
      if (!form.phone.trim()) next.phone = "Please enter your phone number.";
      if (!form.address.trim())
        next.address = "Please enter your residential address.";
      if (!form.age.trim()) next.age = "Please enter your age.";
      if (!form.emergencyName.trim())
        next.emergencyName = "Please enter an emergency contact name.";
      if (!form.emergencyPhone.trim())
        next.emergencyPhone = "Please enter an emergency contact phone number.";
    }

    if (current === 1) {
      if (form.healthConditions.length === 0)
        next.healthConditions =
          "Please select at least one option (or 'NOT APPLICABLE').";
      if (
        form.healthConditions.includes(OTHER_CONDITION) &&
        !form.healthConditionsOther.trim()
      )
        next.healthConditionsOther = "Please specify your other condition.";
      if (!form.majorSurgery.trim())
        next.majorSurgery = "This field is required.";
      if (!form.medicalConsent)
        next.medicalConsent =
          "Please confirm you have read and agree to the disclaimer.";
    }

    if (current === 2) {
      if (!form.howHeard.trim()) next.howHeard = "This field is required.";
      if (!form.priorPractice.trim())
        next.priorPractice = "This field is required.";
      if (!form.otherIshaPractices)
        next.otherIshaPractices = "Please select an option.";
    }

    if (current === 3) {
      if (!form.refundConsent)
        next.refundConsent = "Please confirm you agree to the Refund Policy.";
      if (!form.agreementConsent)
        next.agreementConsent = "Please confirm you agree.";
    }

    return next;
  }

  function goNext() {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleFinish() {
    if (step !== STEPS.length - 1) return;

    // Re-validate every step before sending.
    for (let i = 0; i < STEPS.length; i += 1) {
      const stepErrors = validateStep(i);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        setStep(i);
        return;
      }
    }

    setStatus("submitting");
    setSubmitError(null);

    const payload = {
      event,
      fullName: form.fullName,
      preferredName: form.preferredName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      gender: form.gender,
      age: form.age,
      occupation: form.occupation,
      emergencyName: form.emergencyName,
      emergencyRelationship: form.emergencyRelationship,
      emergencyPhone: form.emergencyPhone,
      healthConditions: form.healthConditions,
      healthConditionsOther: form.healthConditionsOther,
      healthDetails: form.healthDetails,
      majorSurgery: form.majorSurgery,
      pregnant: form.pregnant,
      howHeard: form.howHeard,
      priorPractice: form.priorPractice,
      otherIshaPractices: form.otherIshaPractices,
      otherIshaPracticesDetails: form.otherIshaPracticesDetails,
      medicalConsent: form.medicalConsent ? "yes" : "",
      refundConsent: form.refundConsent ? "yes" : "",
      agreementConsent: form.agreementConsent ? "yes" : "",
      company: form.company,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const isLastStep = step === STEPS.length - 1;

  if (status === "success") {
    return (
      <div className="space-y-8 py-4 text-center">
        <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">Thank you!</h2>
        <p className="mx-auto max-w-md text-lg leading-relaxed text-brown">
          Your registration has been received. We will get back to you personally as soon
          as we can. In the meantime, feel free to explore the practices we offer.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/programs">Explore programs</Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
    <MedicalDisclaimerModal
      open={disclaimerOpen}
      onClose={() => setDisclaimerOpen(false)}
    />
    <BeforeProgramModal
      open={beforeProgramOpen}
      onClose={() => setBeforeProgramOpen(false)}
    />
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-8"
      noValidate
    >
      {/* Honeypot: hidden from users, catches bots. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company">Company (leave blank)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-baseline justify-between">
          <p className="eyebrow">
            Step {step + 1} of {STEPS.length}
          </p>
          <p className="text-sm text-brown">{STEPS[step]}</p>
        </div>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i <= step ? "bg-saffron" : "bg-border-strong/40",
              )}
            />
          ))}
        </div>
      </div>

      <h2 className="font-heading text-2xl text-charcoal">{STEPS[step]}</h2>

      {/* ---------------------------------------------------------------- */}
      {/* Step 1 — Personal Information                                     */}
      {/* ---------------------------------------------------------------- */}
      {step === 0 ? (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full name <Required />
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                className={fieldClass}
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
              <FieldError message={errors.fullName} />
            </div>
            <div>
              <label htmlFor="preferredName" className={labelClass}>
                Name you prefer to be called
              </label>
              <input
                id="preferredName"
                type="text"
                className={fieldClass}
                value={form.preferredName}
                onChange={(e) => update("preferredName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className={labelClass}>
                Email <Required />
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={fieldClass}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
              <FieldError message={errors.email} />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone number <Required />
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                className={fieldClass}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
              <FieldError message={errors.phone} />
            </div>
          </div>

          <div>
            <label htmlFor="address" className={labelClass}>
              Residential address <Required />
            </label>
            <textarea
              id="address"
              rows={2}
              className={cn(fieldClass, "resize-y")}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
            <FieldError message={errors.address} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="gender" className={labelClass}>
                Gender
              </label>
              <select
                id="gender"
                className={fieldClass}
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
              >
                <option value="">Select (optional)</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label htmlFor="age" className={labelClass}>
                Age <Required />
              </label>
              <input
                id="age"
                type="number"
                min={1}
                className={fieldClass}
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
              />
              <FieldError message={errors.age} />
            </div>
          </div>

          <div>
            <label htmlFor="occupation" className={labelClass}>
              Occupation
            </label>
            <input
              id="occupation"
              type="text"
              className={fieldClass}
              value={form.occupation}
              onChange={(e) => update("occupation", e.target.value)}
            />
          </div>

          <fieldset className="rounded-xl border border-border bg-cream/60 p-5">
            <legend className="px-2 text-sm font-medium text-charcoal">
              Emergency contact
            </legend>
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="emergencyName" className={labelClass}>
                    Full name <Required />
                  </label>
                  <input
                    id="emergencyName"
                    type="text"
                    className={fieldClass}
                    value={form.emergencyName}
                    onChange={(e) => update("emergencyName", e.target.value)}
                  />
                  <FieldError message={errors.emergencyName} />
                </div>
                <div>
                  <label htmlFor="emergencyRelationship" className={labelClass}>
                    Relationship
                  </label>
                  <input
                    id="emergencyRelationship"
                    type="text"
                    className={fieldClass}
                    value={form.emergencyRelationship}
                    onChange={(e) =>
                      update("emergencyRelationship", e.target.value)
                    }
                  />
                </div>
              </div>
              <div>
                <label htmlFor="emergencyPhone" className={labelClass}>
                  Phone number <Required />
                </label>
                <input
                  id="emergencyPhone"
                  type="tel"
                  className={fieldClass}
                  value={form.emergencyPhone}
                  onChange={(e) => update("emergencyPhone", e.target.value)}
                />
                <FieldError message={errors.emergencyPhone} />
              </div>
            </div>
          </fieldset>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Step 2 — Health-Related Information                               */}
      {/* ---------------------------------------------------------------- */}
      {step === 1 ? (
        <div className="space-y-6">
          <div className="space-y-3">
            {HEALTH_INTRO.map((para) => (
              <p key={para} className="text-sm leading-relaxed text-brown">
                {para}
              </p>
            ))}
          </div>

          <fieldset>
            <legend className={labelClass}>
              Health conditions <Required />
            </legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {HEALTH_CONDITIONS.map((condition) => (
                <label
                  key={condition}
                  className="flex items-start gap-3 text-sm leading-relaxed text-charcoal"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-border-strong text-saffron focus-visible:outline-none"
                    checked={form.healthConditions.includes(condition)}
                    onChange={() => toggleCondition(condition)}
                  />
                  <span>{condition}</span>
                </label>
              ))}
              <label className="flex items-start gap-3 text-sm leading-relaxed text-charcoal">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-border-strong text-saffron focus-visible:outline-none"
                  checked={form.healthConditions.includes(OTHER_CONDITION)}
                  onChange={() => toggleCondition(OTHER_CONDITION)}
                />
                <span>Other</span>
              </label>
              <label className="flex items-start gap-3 text-sm leading-relaxed text-charcoal">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-border-strong text-saffron focus-visible:outline-none"
                  checked={form.healthConditions.includes(
                    HEALTH_CONDITION_NOT_APPLICABLE,
                  )}
                  onChange={() =>
                    toggleCondition(HEALTH_CONDITION_NOT_APPLICABLE)
                  }
                />
                <span>{HEALTH_CONDITION_NOT_APPLICABLE}</span>
              </label>
            </div>
            {form.healthConditions.includes(OTHER_CONDITION) ? (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Please specify"
                  className={fieldClass}
                  value={form.healthConditionsOther}
                  onChange={(e) =>
                    update("healthConditionsOther", e.target.value)
                  }
                />
                <FieldError message={errors.healthConditionsOther} />
              </div>
            ) : null}
            <FieldError message={errors.healthConditions} />
          </fieldset>

          <div>
            <label htmlFor="healthDetails" className={labelClass}>
              {HEALTH_DETAILS_LABEL}
            </label>
            <textarea
              id="healthDetails"
              rows={4}
              className={cn(fieldClass, "resize-y")}
              value={form.healthDetails}
              onChange={(e) => update("healthDetails", e.target.value)}
            />
            <FieldError message={errors.healthDetails} />
          </div>

          <div>
            <label htmlFor="majorSurgery" className={labelClass}>
              {MAJOR_SURGERY_QUESTION} <Required />
            </label>
            <p className="mb-1.5 text-sm leading-relaxed text-brown">
              {MAJOR_SURGERY_HINT}
            </p>
            <textarea
              id="majorSurgery"
              rows={3}
              className={cn(fieldClass, "resize-y")}
              value={form.majorSurgery}
              onChange={(e) => update("majorSurgery", e.target.value)}
            />
            <FieldError message={errors.majorSurgery} />
          </div>

          <fieldset>
            <legend className={labelClass}>{PREGNANCY_LABEL}</legend>
            <div className="flex gap-6">
              {["Yes", "No"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2.5 text-sm text-charcoal"
                >
                  <input
                    type="radio"
                    name="pregnant"
                    value={option}
                    className="h-4 w-4 border-border-strong text-saffron focus-visible:outline-none"
                    checked={form.pregnant === option}
                    onChange={(e) => update("pregnant", e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <FieldError message={errors.pregnant} />
          </fieldset>

          <div className="rounded-xl border border-border bg-cream/60 p-5">
            <p className="text-sm leading-relaxed text-charcoal">
              {MEDICAL_DISCLAIMER_INTRO}{" "}
              <button
                type="button"
                onClick={() => setDisclaimerOpen(true)}
                className="text-saffron underline underline-offset-2 hover:text-saffron-hover focus-visible:outline-none"
              >
                Click Here
              </button>
            </p>
            <p className="mt-4 text-sm font-medium text-charcoal">
              By registering for the program, I confirm that:
            </p>
            <ul className="mt-3 space-y-2">
              {MEDICAL_DISCLAIMER_BULLETS.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 text-sm leading-relaxed text-brown"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-charcoal">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-border-strong text-saffron focus-visible:outline-none"
                checked={form.medicalConsent}
                onChange={(e) => update("medicalConsent", e.target.checked)}
              />
              <span>
                {MEDICAL_DISCLAIMER_CONSENT_LABEL} <Required />
              </span>
            </label>
            <FieldError message={errors.medicalConsent} />
          </div>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Step 3 — Program-Related Information                              */}
      {/* ---------------------------------------------------------------- */}
      {step === 2 ? (
        <div className="space-y-5">
          <div>
            <label htmlFor="howHeard" className={labelClass}>
              How did you come to know of this program? <Required />
            </label>
            <textarea
              id="howHeard"
              rows={2}
              className={cn(fieldClass, "resize-y")}
              value={form.howHeard}
              onChange={(e) => update("howHeard", e.target.value)}
            />
            <FieldError message={errors.howHeard} />
          </div>

          <div>
            <label htmlFor="priorPractice" className={labelClass}>
              Please give details of yoga or meditation you have practiced and
              how long you have been practicing <Required />
            </label>
            <textarea
              id="priorPractice"
              rows={3}
              className={cn(fieldClass, "resize-y")}
              value={form.priorPractice}
              onChange={(e) => update("priorPractice", e.target.value)}
            />
            <FieldError message={errors.priorPractice} />
          </div>

          <fieldset>
            <legend className={labelClass}>
              Have you learnt any other Isha Yoga practices? <Required />
            </legend>
            <div className="flex gap-6">
              {["Yes", "No"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2.5 text-sm text-charcoal"
                >
                  <input
                    type="radio"
                    name="otherIshaPractices"
                    value={option}
                    className="h-4 w-4 border-border-strong text-saffron focus-visible:outline-none"
                    checked={form.otherIshaPractices === option}
                    onChange={(e) =>
                      update("otherIshaPractices", e.target.value)
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <FieldError message={errors.otherIshaPractices} />
          </fieldset>

          <div>
            <label
              htmlFor="otherIshaPracticesDetails"
              className="mb-1.5 block text-sm leading-relaxed text-brown"
            >
              If yes, please give details below
            </label>
            <textarea
              id="otherIshaPracticesDetails"
              rows={3}
              className={cn(fieldClass, "resize-y")}
              value={form.otherIshaPracticesDetails}
              onChange={(e) =>
                update("otherIshaPracticesDetails", e.target.value)
              }
            />
          </div>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Step 4 — Agreement                                                */}
      {/* ---------------------------------------------------------------- */}
      {step === 3 ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-cream/60 p-5">
            <p className="text-sm font-medium text-charcoal">Refund Policy:</p>
            <ul className="mt-3 space-y-2">
              {REFUND_POLICY_BULLETS.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 text-sm leading-relaxed text-brown"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-charcoal">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-border-strong text-saffron focus-visible:outline-none"
                checked={form.refundConsent}
                onChange={(e) => update("refundConsent", e.target.checked)}
              />
              <span>
                {REFUND_POLICY_CONSENT_LABEL} <Required />
              </span>
            </label>
            <FieldError message={errors.refundConsent} />
          </div>

          <div className="rounded-xl border border-border bg-cream/60 p-5">
            <p className="text-sm font-medium text-charcoal">
              {PARTICIPANT_AGREEMENT_TITLE}
            </p>
            <ul className="mt-3 space-y-2">
              {AGREEMENT_BULLETS.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 text-sm leading-relaxed text-brown"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-charcoal">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-border-strong text-saffron focus-visible:outline-none"
                checked={form.agreementConsent}
                onChange={(e) => update("agreementConsent", e.target.checked)}
              />
              <span>
                {AGREEMENT_CONSENT_LABEL} <Required />
              </span>
            </label>
            <FieldError message={errors.agreementConsent} />
          </div>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Step 5 — Payment Details                                          */}
      {/* ---------------------------------------------------------------- */}
      {step === 4 ? (
        <BankDetailsCard />
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Step 6 — Before the Start of the Session                         */}
      {/* ---------------------------------------------------------------- */}
      {step === 5 ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-cream/60 p-5 sm:p-6">
            <h3 className="font-heading text-lg text-charcoal">
              {BEFORE_SESSION_STOMACH.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brown">
              {BEFORE_SESSION_STOMACH.intro}
            </p>
            <p className="mt-4 text-sm font-medium text-charcoal">
              {BEFORE_SESSION_STOMACH.empty.heading}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-brown">
              {BEFORE_SESSION_STOMACH.empty.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-medium text-charcoal">
              {BEFORE_SESSION_STOMACH.light.heading}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-brown">
              {BEFORE_SESSION_STOMACH.light.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-cream/60 p-5 sm:p-6">
            <h3 className="font-heading text-lg text-charcoal">
              {BEFORE_SESSION_CLOTHING.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brown">
              {BEFORE_SESSION_CLOTHING.intro}
            </p>
            <p className="mt-4 text-sm font-medium text-charcoal">
              {BEFORE_SESSION_CLOTHING.heading}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-brown">
              {BEFORE_SESSION_CLOTHING.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-cream/60 p-5">
            <p className="text-sm leading-relaxed text-charcoal">
              For the full guidelines on what to know before, during, and after the
              program, please review the document here:{" "}
              <button
                type="button"
                onClick={() => setBeforeProgramOpen(true)}
                className="text-saffron underline underline-offset-2 hover:text-saffron-hover focus-visible:outline-none"
              >
                Click Here
              </button>
            </p>
          </div>
        </div>
      ) : null}

      {submitError ? (
        <p role="alert" className="text-sm text-saffron-hover">
          {submitError}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
        {step > 0 ? (
          <Button type="button" variant="secondary" onClick={goBack}>
            Back
          </Button>
        ) : (
          <span />
        )}

        {isLastStep ? (
          <Button
            type="button"
            size="lg"
            disabled={status === "submitting"}
            onClick={handleFinish}
          >
            {status === "submitting" ? "Submitting..." : "Finish"}
          </Button>
        ) : (
          <Button type="button" onClick={goNext}>
            Next
          </Button>
        )}
      </div>
    </form>
    </>
  );
}
