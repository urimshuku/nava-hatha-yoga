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
import { RegisterFieldControl } from "@/components/forms/RegisterFieldControl";
import { Button } from "@/components/ui/Button";
import {
  DEFAULT_REGISTER_CONTENT,
  type RegisterContent,
  type RegisterFormField,
} from "@/lib/register-config";
import {
  SHOW_PAYMENT_DETAILS_STEP,
  isSimplifiedRegistration,
} from "@/lib/register-content";
import {
  GUIDELINES_PDF_URL,
} from "@/lib/guidelines-pdf.constants";
import { cn } from "@/lib/utils";
import { apiUrl } from "@/lib/api-url";

interface RegistrationFormProps {
  event?: string;
  eventSlug?: string;
  kind?: string;
  simplified?: boolean;
  content?: RegisterContent;
}

const fieldClass = formFieldClass;
const labelClass = formLabelClass;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const KNOWN_KEYS = [
  "fullName",
  "preferredName",
  "email",
  "phone",
  "address",
  "gender",
  "age",
  "occupation",
  "emergencyName",
  "emergencyRelationship",
  "emergencyPhone",
] as const;

type KnownKey = (typeof KNOWN_KEYS)[number];

function isKnownKey(key: string): key is KnownKey {
  return (KNOWN_KEYS as readonly string[]).includes(key);
}

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
  howHeard: string[];
  howHeardOther: string;
  priorPractice: string;
  otherIshaPractices: string;
  otherIshaPracticesDetails: string;
  medicalConsent: boolean;
  refundConsent: boolean;
  agreementConsent: boolean;
  company: string;
  extra: Record<string, string>;
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
  howHeard: [],
  howHeardOther: "",
  priorPractice: "",
  otherIshaPractices: "",
  otherIshaPracticesDetails: "",
  medicalConsent: false,
  refundConsent: false,
  agreementConsent: false,
  company: "",
  extra: {},
};

type Errors = Partial<Record<string, string>>;

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

export function RegistrationForm({
  event,
  eventSlug,
  kind,
  simplified: simplifiedProp,
  content = DEFAULT_REGISTER_CONTENT,
}: RegistrationFormProps) {
  const simplified =
    simplifiedProp ?? isSimplifiedRegistration(event, undefined, kind);
  const steps = simplified
    ? [content.step1Title]
    : [
        content.step1Title,
        content.step2Title,
        content.step3Title,
        content.step4Title,
        ...(SHOW_PAYMENT_DETAILS_STEP ? ["Payment Details"] : []),
        content.step5Title,
      ];
  const otherCondition = content.otherConditionLabel;
  const notApplicable = content.notApplicableLabel;
  const yesNo = [content.yesLabel, content.noLabel].filter(Boolean);
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
    setErrors((prev) => (prev[key as string] ? { ...prev, [key]: undefined } : prev));
  }

  function fieldValue(key: string): string {
    if (isKnownKey(key)) return form[key];
    return form.extra[key] ?? "";
  }

  function setFieldValue(key: string, value: string) {
    if (isKnownKey(key)) {
      update(key, value);
      return;
    }
    setForm((prev) => ({ ...prev, extra: { ...prev.extra, [key]: value } }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function validateFields(fields: readonly RegisterFormField[], next: Errors) {
    for (const field of fields) {
      const value = fieldValue(field.key).trim();
      if (field.required && !value) {
        next[field.key] = `Please complete ${field.label.toLowerCase()}.`;
      } else if (field.type === "email" && value && !EMAIL_RE.test(value)) {
        next[field.key] = "Please enter a valid email address.";
      }
    }
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

  function toggleHowHeard(option: string) {
    setForm((prev) => {
      const has = prev.howHeard.includes(option);
      const howHeard = has
        ? prev.howHeard.filter((item) => item !== option)
        : [...prev.howHeard, option];
      return { ...prev, howHeard };
    });
    setErrors((prev) => (prev.howHeard ? { ...prev, howHeard: undefined } : prev));
  }

  function validateStep(current: number): Errors {
    const next: Errors = {};

    if (current === 0) {
      validateFields(content.personalFields, next);
      if (!simplified) validateFields(content.emergencyFields, next);
    }

    if (!simplified && current === 1) {
      const healthChoices = [
        ...content.healthConditions,
        otherCondition,
        content.notApplicableLabel,
      ].filter(Boolean);
      if (healthChoices.length > 0 && form.healthConditions.length === 0)
        next.healthConditions =
          `Please select at least one option${content.notApplicableLabel ? ` (or '${content.notApplicableLabel}')` : ""}.`;
      if (
        otherCondition &&
        form.healthConditions.includes(otherCondition) &&
        !form.healthConditionsOther.trim()
      )
        next.healthConditionsOther = "Please specify your other condition.";
      if (content.majorSurgeryQuestion && !form.majorSurgery.trim())
        next.majorSurgery = "This field is required.";
      if (content.disclaimerConsentLabel && !form.medicalConsent)
        next.medicalConsent =
          "Please confirm you have read and agree to the disclaimer.";
    }

    if (!simplified && current === 2) {
      const howHeardShown =
        content.howHeardGroups.length > 0 || Boolean(content.howHeardOtherLabel);
      if (
        howHeardShown &&
        form.howHeard.length === 0 &&
        !form.howHeardOther.trim()
      )
        next.howHeard = "Please select at least one option or fill in Other.";
      if (content.priorPracticeLabel && !form.priorPractice.trim())
        next.priorPractice = "This field is required.";
      if (content.otherIshaLabel && !form.otherIshaPractices)
        next.otherIshaPractices = "Please select an option.";
    }

    if (!simplified && current === 3) {
      if (content.refundPolicyConsentLabel && !form.refundConsent)
        next.refundConsent = "Please confirm you agree to the Refund Policy.";
      if (content.agreementConsentLabel && !form.agreementConsent)
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
    setStep((s) => Math.min(s + 1, steps.length - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleFinish() {
    if (step !== steps.length - 1) return;

    // Re-validate every step before sending.
    for (let i = 0; i < steps.length; i += 1) {
      const stepErrors = validateStep(i);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        setStep(i);
        return;
      }
    }

    setStatus("submitting");
    setSubmitError(null);

    const extraFields = [
      ...content.personalFields,
      ...(simplified ? [] : content.emergencyFields),
    ]
      .filter((field) => !isKnownKey(field.key))
      .map((field) => ({
        key: field.key,
        label: field.label,
        value: fieldValue(field.key),
      }))
      .filter((field) => field.value.trim());

    const payload = {
      event,
      eventSlug,
      kind,
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
      extraFields,
      healthConditions: form.healthConditions,
      healthConditionsOther: form.healthConditionsOther,
      healthDetails: form.healthDetails,
      majorSurgery: form.majorSurgery,
      pregnant: form.pregnant,
      howHeard: form.howHeard,
      howHeardOther: form.howHeardOther,
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
        const body = (await res.json().catch(() => ({}))) as { error?: string };
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

  const isLastStep = step === steps.length - 1;
  const currentStep = steps[step];

  if (status === "success") {
    return (
      <div className="space-y-5 py-3 text-center font-heading sm:space-y-8 sm:py-4">
        <h2 className="text-2xl text-charcoal sm:text-4xl">Thank you!</h2>
        <div className="mx-auto max-w-md space-y-4 text-base leading-relaxed text-brown sm:space-y-6 sm:text-lg">
          {simplified ? (
            <p>
              I look forward to welcoming you to the session and supporting you in
              establishing a practice that can stay with you for a lifetime.
            </p>
          ) : (
            <>
              <p>Payment details will be shared with you shortly.</p>
              <p>
                Meanwhile, I look forward to welcoming you to the program and supporting you in
                establishing a practice that can stay with you for a lifetime.
              </p>
            </>
          )}
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
      title={content.disclaimerTitle}
      document={content.disclaimerDocument}
    />
    <BeforeProgramModal
      open={beforeProgramOpen}
      onClose={() => setBeforeProgramOpen(false)}
      title={content.guidelinesTitle}
      document={content.guidelinesDocument}
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
      {steps.length > 1 ? (
      <div>
        <div className="flex items-baseline justify-between">
          <p className="eyebrow">
            Step {step + 1} of {steps.length}
          </p>
          <p className="text-xs text-brown sm:text-sm">{steps[step]}</p>
        </div>
        <div className="mt-2 flex gap-1 sm:mt-3 sm:gap-1.5" aria-hidden="true">
          {steps.map((label, i) => (
            <span
              key={`${i}-${label}`}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i <= step ? "bg-saffron" : "bg-border-strong/40",
              )}
            />
          ))}
        </div>
      </div>
      ) : null}

      <h2 className="font-heading text-xl text-charcoal sm:text-2xl">{steps[step]}</h2>

      {/* ---------------------------------------------------------------- */}
      {/* Step 1 — Personal Information                                     */}
      {/* ---------------------------------------------------------------- */}
      {step === 0 ? (
        <div className={formStackClass}>
          <div className={formGridClass}>
            {content.personalFields.map((field) => (
              <RegisterFieldControl
                key={field.key}
                field={field}
                id={field.key}
                value={fieldValue(field.key)}
                onChange={(value) => setFieldValue(field.key, value)}
                error={errors[field.key]}
              />
            ))}
          </div>

          {!simplified && content.emergencyFields.length > 0 ? (
            <fieldset className={formBoxClass}>
              {content.emergencyHeading ? (
                <legend className="px-1.5 text-xs font-medium text-charcoal sm:px-2 sm:text-sm">
                  {content.emergencyHeading}
                </legend>
              ) : null}
              <div className={cn("space-y-3 sm:space-y-5", formGridClass)}>
                {content.emergencyFields.map((field) => (
                  <RegisterFieldControl
                    key={field.key}
                    field={field}
                    id={field.key}
                    value={fieldValue(field.key)}
                    onChange={(value) => setFieldValue(field.key, value)}
                    error={errors[field.key]}
                  />
                ))}
              </div>
            </fieldset>
          ) : null}
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Step 2 — Health-Related Information                               */}
      {/* ---------------------------------------------------------------- */}
      {!simplified && step === 1 ? (
        <div className="space-y-4 sm:space-y-6">
          {content.healthIntro.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {content.healthIntro.map((para) => (
                <p key={para} className={formBodyTextClass}>
                  {para}
                </p>
              ))}
            </div>
          ) : null}

          {content.healthConditions.length > 0 ||
          otherCondition ||
          notApplicable ? (
            <fieldset>
              {content.healthConditionsLegend ? (
                <legend className={labelClass}>
                  {content.healthConditionsLegend} <Required />
                </legend>
              ) : null}
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-2.5">
                {content.healthConditions.map((condition) => (
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
                {otherCondition ? (
                  <label className={formChoiceLabelClass}>
                    <input
                      type="checkbox"
                      className={formCheckboxClass}
                      checked={form.healthConditions.includes(otherCondition)}
                      onChange={() => toggleCondition(otherCondition)}
                    />
                    <span>{otherCondition}</span>
                  </label>
                ) : null}
                {notApplicable ? (
                  <label className={formChoiceLabelClass}>
                    <input
                      type="checkbox"
                      className={formCheckboxClass}
                      checked={form.healthConditions.includes(notApplicable)}
                      onChange={() => toggleCondition(notApplicable)}
                    />
                    <span>{notApplicable}</span>
                  </label>
                ) : null}
              </div>
              {otherCondition &&
              form.healthConditions.includes(otherCondition) ? (
                <div className="mt-2 sm:mt-3">
                  <input
                    type="text"
                    placeholder={content.specifyPlaceholder}
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
          ) : null}

          {content.healthDetailsLabel ? (
            <div>
              <label htmlFor="healthDetails" className={labelClass}>
                {content.healthDetailsLabel}
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
          ) : null}

          {content.majorSurgeryQuestion ? (
            <div>
              <label htmlFor="majorSurgery" className={labelClass}>
                {content.majorSurgeryQuestion} <Required />
              </label>
              {content.majorSurgeryHint ? (
                <p className={formHintClass}>{content.majorSurgeryHint}</p>
              ) : null}
              <textarea
                id="majorSurgery"
                rows={2}
                className={cn(fieldClass, "resize-y")}
                value={form.majorSurgery}
                onChange={(e) => update("majorSurgery", e.target.value)}
              />
              <FieldError message={errors.majorSurgery} />
            </div>
          ) : null}

          {content.pregnancyLabel && yesNo.length > 0 ? (
            <fieldset>
              <legend className={labelClass}>{content.pregnancyLabel}</legend>
              <div className="flex gap-4 sm:gap-6">
                {yesNo.map((option) => (
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
          ) : null}

          {content.disclaimerIntro ||
          content.disclaimerBullets.length > 0 ||
          content.disclaimerConsentLabel ? (
            <div className={formBoxClass}>
              {content.disclaimerIntro ? (
                <p className={formBodyTextCharcoalClass}>
                  {content.disclaimerIntro}
                  {content.disclaimerLinkLabel ? (
                    <>
                      {" "}
                      <button
                        type="button"
                        onClick={() => setDisclaimerOpen(true)}
                        className="text-saffron underline underline-offset-2 hover:text-saffron-hover focus-visible:outline-none"
                      >
                        {content.disclaimerLinkLabel}
                      </button>
                    </>
                  ) : null}
                </p>
              ) : null}
              {content.disclaimerConfirmLead ? (
                <p className="mt-3 text-xs font-medium text-charcoal sm:mt-4 sm:text-sm">
                  {content.disclaimerConfirmLead}
                </p>
              ) : null}
              {content.disclaimerBullets.length > 0 ? (
                <ul className={formBulletListClass}>
                  {content.disclaimerBullets.map((bullet) => (
                    <li key={bullet} className={formBulletItemClass}>
                      <span
                        aria-hidden="true"
                        className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay sm:mt-[0.45rem]"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {content.disclaimerConsentLabel ? (
                <label className={formConsentRowClass}>
                  <input
                    type="checkbox"
                    className={formCheckboxClass}
                    checked={form.medicalConsent}
                    onChange={(e) => update("medicalConsent", e.target.checked)}
                  />
                  <span>
                    {content.disclaimerConsentLabel} <Required />
                  </span>
                </label>
              ) : null}
              <FieldError message={errors.medicalConsent} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Step 3 — Program-Related Information                              */}
      {/* ---------------------------------------------------------------- */}
      {!simplified && step === 2 ? (
        <div className={formStackClass}>
          {content.howHeardGroups.length > 0 || content.howHeardOtherLabel ? (
            <fieldset>
              {content.howHeardLabel ? (
                <legend className={labelClass}>
                  {content.howHeardLabel} <Required />
                </legend>
              ) : null}
              <div className="space-y-4 sm:space-y-5">
                {content.howHeardGroups.map((group) => (
                  <div key={group.heading}>
                    <p className="mb-2 text-sm font-medium text-charcoal">
                      {group.heading}
                    </p>
                    <div
                      className={
                        group.options.length <= 3
                          ? "grid gap-2"
                          : "grid gap-2 sm:grid-cols-2 sm:gap-2.5"
                      }
                    >
                      {group.options.map((option) => (
                        <label key={option} className={formChoiceLabelClass}>
                          <input
                            type="checkbox"
                            className={formCheckboxClass}
                            checked={form.howHeard.includes(option)}
                            onChange={() => toggleHowHeard(option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                {content.howHeardOtherLabel ? (
                  <div>
                    <label
                      htmlFor="howHeardOther"
                      className="mb-2 block text-sm font-medium text-charcoal"
                    >
                      {content.howHeardOtherLabel}
                    </label>
                    <input
                      id="howHeardOther"
                      type="text"
                      placeholder={content.specifyPlaceholder}
                      className={fieldClass}
                      value={form.howHeardOther}
                      onChange={(e) => {
                        update("howHeardOther", e.target.value);
                        setErrors((prev) =>
                          prev.howHeard ? { ...prev, howHeard: undefined } : prev,
                        );
                      }}
                    />
                  </div>
                ) : null}
              </div>
              <FieldError message={errors.howHeard} />
            </fieldset>
          ) : null}

          {content.priorPracticeLabel ? (
            <div>
              <label htmlFor="priorPractice" className={labelClass}>
                {content.priorPracticeLabel} <Required />
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
          ) : null}

          {content.otherIshaLabel && yesNo.length > 0 ? (
            <fieldset>
              <legend className={labelClass}>
                {content.otherIshaLabel} <Required />
              </legend>
              <div className="flex gap-4 sm:gap-6">
                {yesNo.map((option) => (
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
          ) : null}

          {content.otherIshaDetailsLabel ? (
            <div>
              <label htmlFor="otherIshaPracticesDetails" className={formHintClass}>
                {content.otherIshaDetailsLabel}
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
          ) : null}
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Step 4 — Agreement                                                */}
      {/* ---------------------------------------------------------------- */}
      {!simplified && step === 3 ? (
        <div className="space-y-4 sm:space-y-6">
          {content.refundPolicyTitle ||
          content.refundPolicyBullets.length > 0 ||
          content.refundPolicyConsentLabel ? (
            <div className={formBoxClass}>
              {content.refundPolicyTitle ? (
                <p className={formSectionTitleClass}>{content.refundPolicyTitle}</p>
              ) : null}
              {content.refundPolicyBullets.length > 0 ? (
                <ul className={formBulletListClass}>
                  {content.refundPolicyBullets.map((bullet) => (
                    <li key={bullet} className={formBulletItemClass}>
                      <span
                        aria-hidden="true"
                        className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay sm:mt-[0.45rem]"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {content.refundPolicyConsentLabel ? (
                <label className={formConsentRowClass}>
                  <input
                    type="checkbox"
                    className={formCheckboxClass}
                    checked={form.refundConsent}
                    onChange={(e) => update("refundConsent", e.target.checked)}
                  />
                  <span>
                    {content.refundPolicyConsentLabel} <Required />
                  </span>
                </label>
              ) : null}
              <FieldError message={errors.refundConsent} />
            </div>
          ) : null}

          {content.agreementTitle ||
          content.agreementBullets.length > 0 ||
          content.agreementConsentLabel ? (
            <div className={formBoxClass}>
              {content.agreementTitle ? (
                <p className={formSectionTitleClass}>{content.agreementTitle}</p>
              ) : null}
              {content.agreementBullets.length > 0 ? (
                <ul className={formBulletListClass}>
                  {content.agreementBullets.map((bullet) => (
                    <li key={bullet} className={formBulletItemClass}>
                      <span
                        aria-hidden="true"
                        className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay sm:mt-[0.45rem]"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {content.agreementConsentLabel ? (
                <label className={formConsentRowClass}>
                  <input
                    type="checkbox"
                    className={formCheckboxClass}
                    checked={form.agreementConsent}
                    onChange={(e) => update("agreementConsent", e.target.checked)}
                  />
                  <span>
                    {content.agreementConsentLabel} <Required />
                  </span>
                </label>
              ) : null}
              <FieldError message={errors.agreementConsent} />
            </div>
          ) : null}
        </div>
      ) : null}

      {!simplified && currentStep === "Payment Details" ? (
        <BankDetailsCard />
      ) : null}

      {!simplified && currentStep === content.step5Title ? (
        <div className="space-y-4 sm:space-y-6">
          {content.beforeSessionBlocks.map((block) => (
            <div key={block.heading} className={cn(formBoxClass, "sm:p-6")}>
              <h3 className={formGuidelineTitleClass}>{block.heading}</h3>
              {block.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-1.5 text-xs leading-snug text-brown sm:mt-2 sm:text-sm sm:leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
              {block.lists?.map((list) => (
                <div key={list.label ?? list.items.join("|")}>
                  {list.label ? (
                    <p className="mt-3 text-xs font-medium text-charcoal sm:mt-4 sm:text-sm">
                      {list.label}
                    </p>
                  ) : null}
                  <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-xs leading-snug text-brown sm:mt-2 sm:space-y-1 sm:pl-5 sm:text-sm sm:leading-relaxed">
                    {list.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}

          {content.guidelinesPrompt ||
          content.guidelinesReadLabel ||
          content.guidelinesDownloadLabel ? (
            <div className={formBoxClass}>
              <p className={formBodyTextCharcoalClass}>
                {content.guidelinesPrompt ? `${content.guidelinesPrompt} ` : null}
                {content.guidelinesReadLabel ? (
                  <button
                    type="button"
                    onClick={() => setBeforeProgramOpen(true)}
                    className="text-saffron underline underline-offset-2 hover:text-saffron-hover focus-visible:outline-none"
                  >
                    {content.guidelinesReadLabel}
                  </button>
                ) : null}
                {content.guidelinesReadLabel && content.guidelinesDownloadLabel
                  ? " or "
                  : null}
                {content.guidelinesDownloadLabel ? (
                  <a
                    href={GUIDELINES_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-saffron underline underline-offset-2 hover:text-saffron-hover focus-visible:outline-none"
                  >
                    {content.guidelinesDownloadLabel}
                  </a>
                ) : null}
                {content.guidelinesPrompt ? "." : null}
              </p>
            </div>
          ) : null}
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
