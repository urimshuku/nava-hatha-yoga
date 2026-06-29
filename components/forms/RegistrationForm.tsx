"use client";

import { useState } from "react";

import { BankDetailsCard } from "@/components/forms/BankDetailsCard";
import { BeforeProgramModal } from "@/components/forms/BeforeProgramModal";
import {
  formBodyTextCharcoalClass,
  formBodyTextClass,
  formBoxClass,
  formBulletItemClass,
  formBulletListClass,
  formCheckboxClass,
  formChoiceLabelClass,
  formConsentRowClass,
  formErrorClass,
  formFieldClass,
  formGridClass,
  formGuidelineTitleClass,
  formHintClass,
  formLabelClass,
  formRadioClass,
  formRadioLabelClass,
  formSectionTitleClass,
  formStackClass,
} from "@/components/forms/form-styles";
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
  SHOW_PAYMENT_DETAILS_STEP,
} from "@/lib/register-content";
import {
  GUIDELINES_PDF_URL,
} from "@/lib/guidelines-pdf.constants";
import { cn } from "@/lib/utils";
import { apiUrl } from "@/lib/api-url";

interface RegistrationFormProps {
  event?: string;
}

const fieldClass = formFieldClass;
const labelClass = formLabelClass;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STEPS = [
  "Personal Information",
  "Health-Related Information",
  "Program-Related Information",
  "Agreement",
  ...(SHOW_PAYMENT_DETAILS_STEP ? (["Payment Details"] as const) : []),
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
    <p role="alert" className={formErrorClass}>
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
      const res = await fetch(apiUrl("/api/register"), {
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
      if (err instanceof TypeError) {
        setSubmitError(
          "We couldn't reach the server. Please check your connection and try again, or contact us directly.",
        );
        return;
      }
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const isLastStep = step === STEPS.length - 1;
  const currentStep = STEPS[step];

  if (status === "success") {
    return (
      <div className="space-y-5 py-3 text-center font-heading sm:space-y-8 sm:py-4">
        <h2 className="text-2xl text-charcoal sm:text-4xl">Thank you!</h2>
        <div className="mx-auto max-w-md space-y-4 text-base leading-relaxed text-brown sm:space-y-6 sm:text-lg">
          <p>
            I look forward to welcoming you to the program and supporting you in establishing
            a practice that can stay with you for a lifetime.
          </p>
          <div className="space-y-1">
            <p>Pranam,</p>
            <p>Erlinda Mustafaraj</p>
            <p>Classical Hatha Yoga Teacher</p>
          </div>
        </div>
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
      className="space-y-4 sm:space-y-8"
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
          <p className="text-xs text-brown sm:text-sm">{STEPS[step]}</p>
        </div>
        <div className="mt-2 flex gap-1 sm:mt-3 sm:gap-1.5" aria-hidden="true">
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

      <h2 className="font-heading text-xl text-charcoal sm:text-2xl">{STEPS[step]}</h2>

      {/* ---------------------------------------------------------------- */}
      {/* Step 1 — Personal Information                                     */}
      {/* ---------------------------------------------------------------- */}
      {step === 0 ? (
        <div className={formStackClass}>
          <div className={formGridClass}>
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

          <div className={formGridClass}>
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

          <div className={formGridClass}>
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
                type="text"
                inputMode="numeric"
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

          <fieldset className={formBoxClass}>
            <legend className="px-1.5 text-xs font-medium text-charcoal sm:px-2 sm:text-sm">
              Emergency contact
            </legend>
            <div className="space-y-3 sm:space-y-5">
              <div className={formGridClass}>
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
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            {HEALTH_INTRO.map((para) => (
              <p key={para} className={formBodyTextClass}>
                {para}
              </p>
            ))}
          </div>

          <fieldset>
            <legend className={labelClass}>
              Health conditions <Required />
            </legend>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-2.5">
              {HEALTH_CONDITIONS.map((condition) => (
                <label key={condition} className={formChoiceLabelClass}>
                  <input
                    type="checkbox"
                    className={formCheckboxClass}
                    checked={form.healthConditions.includes(condition)}
                    onChange={() => toggleCondition(condition)}
                  />
                  <span>{condition}</span>
                </label>
              ))}
              <label className={formChoiceLabelClass}>
                <input
                  type="checkbox"
                  className={formCheckboxClass}
                  checked={form.healthConditions.includes(OTHER_CONDITION)}
                  onChange={() => toggleCondition(OTHER_CONDITION)}
                />
                <span>Other</span>
              </label>
              <label className={formChoiceLabelClass}>
                <input
                  type="checkbox"
                  className={formCheckboxClass}
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
              <div className="mt-2 sm:mt-3">
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
              rows={3}
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
            <p className={formHintClass}>
              {MAJOR_SURGERY_HINT}
            </p>
            <textarea
              id="majorSurgery"
              rows={2}
              className={cn(fieldClass, "resize-y")}
              value={form.majorSurgery}
              onChange={(e) => update("majorSurgery", e.target.value)}
            />
            <FieldError message={errors.majorSurgery} />
          </div>

          <fieldset>
            <legend className={labelClass}>{PREGNANCY_LABEL}</legend>
            <div className="flex gap-4 sm:gap-6">
              {["Yes", "No"].map((option) => (
                <label key={option} className={formRadioLabelClass}>
                  <input
                    type="radio"
                    name="pregnant"
                    value={option}
                    className={formRadioClass}
                    checked={form.pregnant === option}
                    onChange={(e) => update("pregnant", e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <FieldError message={errors.pregnant} />
          </fieldset>

          <div className={formBoxClass}>
            <p className={formBodyTextCharcoalClass}>
              {MEDICAL_DISCLAIMER_INTRO}{" "}
              <button
                type="button"
                onClick={() => setDisclaimerOpen(true)}
                className="text-saffron underline underline-offset-2 hover:text-saffron-hover focus-visible:outline-none"
              >
                Click Here
              </button>
            </p>
            <p className="mt-3 text-xs font-medium text-charcoal sm:mt-4 sm:text-sm">
              By registering for the program, I confirm that:
            </p>
            <ul className={formBulletListClass}>
              {MEDICAL_DISCLAIMER_BULLETS.map((bullet) => (
                <li key={bullet} className={formBulletItemClass}>
                  <span
                    aria-hidden="true"
                    className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay sm:mt-[0.45rem]"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <label className={formConsentRowClass}>
              <input
                type="checkbox"
                className={formCheckboxClass}
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
        <div className={formStackClass}>
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
              rows={2}
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
            <div className="flex gap-4 sm:gap-6">
              {["Yes", "No"].map((option) => (
                <label key={option} className={formRadioLabelClass}>
                  <input
                    type="radio"
                    name="otherIshaPractices"
                    value={option}
                    className={formRadioClass}
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
            <label htmlFor="otherIshaPracticesDetails" className={formHintClass}>
              If yes, please give details below
            </label>
            <textarea
              id="otherIshaPracticesDetails"
              rows={2}
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
        <div className="space-y-4 sm:space-y-6">
          <div className={formBoxClass}>
            <p className={formSectionTitleClass}>Refund Policy:</p>
            <ul className={formBulletListClass}>
              {REFUND_POLICY_BULLETS.map((bullet) => (
                <li key={bullet} className={formBulletItemClass}>
                  <span
                    aria-hidden="true"
                    className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay sm:mt-[0.45rem]"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <label className={formConsentRowClass}>
              <input
                type="checkbox"
                className={formCheckboxClass}
                checked={form.refundConsent}
                onChange={(e) => update("refundConsent", e.target.checked)}
              />
              <span>
                {REFUND_POLICY_CONSENT_LABEL} <Required />
              </span>
            </label>
            <FieldError message={errors.refundConsent} />
          </div>

          <div className={formBoxClass}>
            <p className={formSectionTitleClass}>{PARTICIPANT_AGREEMENT_TITLE}</p>
            <ul className={formBulletListClass}>
              {AGREEMENT_BULLETS.map((bullet) => (
                <li key={bullet} className={formBulletItemClass}>
                  <span
                    aria-hidden="true"
                    className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay sm:mt-[0.45rem]"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <label className={formConsentRowClass}>
              <input
                type="checkbox"
                className={formCheckboxClass}
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

      {currentStep === "Payment Details" ? (
        <BankDetailsCard />
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Before the Start of the Session                                  */}
      {/* ---------------------------------------------------------------- */}
      {currentStep === "Before the Start of the Session" ? (
        <div className="space-y-4 sm:space-y-6">
          <div className={cn(formBoxClass, "sm:p-6")}>
            <h3 className={formGuidelineTitleClass}>{BEFORE_SESSION_STOMACH.title}</h3>
            <p className="mt-1.5 text-xs leading-snug text-brown sm:mt-2 sm:text-sm sm:leading-relaxed">
              {BEFORE_SESSION_STOMACH.intro}
            </p>
            <p className="mt-3 text-xs font-medium text-charcoal sm:mt-4 sm:text-sm">
              {BEFORE_SESSION_STOMACH.empty.heading}
            </p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-xs leading-snug text-brown sm:mt-2 sm:space-y-1 sm:pl-5 sm:text-sm sm:leading-relaxed">
              {BEFORE_SESSION_STOMACH.empty.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs font-medium text-charcoal sm:mt-4 sm:text-sm">
              {BEFORE_SESSION_STOMACH.light.heading}
            </p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-xs leading-snug text-brown sm:mt-2 sm:space-y-1 sm:pl-5 sm:text-sm sm:leading-relaxed">
              {BEFORE_SESSION_STOMACH.light.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={cn(formBoxClass, "sm:p-6")}>
            <h3 className={formGuidelineTitleClass}>{BEFORE_SESSION_CLOTHING.title}</h3>
            <p className="mt-1.5 text-xs leading-snug text-brown sm:mt-2 sm:text-sm sm:leading-relaxed">
              {BEFORE_SESSION_CLOTHING.intro}
            </p>
            <p className="mt-3 text-xs font-medium text-charcoal sm:mt-4 sm:text-sm">
              {BEFORE_SESSION_CLOTHING.heading}
            </p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-xs leading-snug text-brown sm:mt-2 sm:space-y-1 sm:pl-5 sm:text-sm sm:leading-relaxed">
              {BEFORE_SESSION_CLOTHING.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={formBoxClass}>
            <p className={formBodyTextCharcoalClass}>
              For the full guidelines on what to know before, during, and after the
              program, please{" "}
              <button
                type="button"
                onClick={() => setBeforeProgramOpen(true)}
                className="text-saffron underline underline-offset-2 hover:text-saffron-hover focus-visible:outline-none"
              >
                read
              </button>{" "}
              or{" "}
              <a
                href={GUIDELINES_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-saffron underline underline-offset-2 hover:text-saffron-hover focus-visible:outline-none"
              >
                download the PDF
              </a>
              .
            </p>
          </div>
        </div>
      ) : null}

      {submitError ? (
        <p role="alert" className={formErrorClass}>
          {submitError}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-2 border-t border-border pt-4 sm:gap-3 sm:pt-6">
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
