"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  formConsentLabelClass,
  formErrorClass,
  formFieldClass,
  formGridClass,
  formLabelClass,
} from "@/components/forms/form-styles";
import { cn } from "@/lib/utils";
import { apiUrl } from "@/lib/api-url";

/**
 * Posts JSON to /api/contact, which is host-agnostic (works on Vercel, Netlify,
 * or anywhere). To switch to Netlify Forms instead, give the <form> a
 * `name` + `data-netlify="true"`, keep the "company" honeypot, and POST
 * url-encoded data (including `form-name`) to "/". See lib/contact.ts.
 */
interface ContactFormProps {
  programs?: string[];
}

const fieldClass = formFieldClass;
const labelClass = formLabelClass;

const SENT_DISPLAY_MS = 3000;

const PREFERRED_LOCATIONS = [
  "Tirana",
  "Saranda",
  "Vlora",
  "Gjirokaster",
  "Korca",
  "Corfu",
  "Prishtina",
  "Other",
] as const;

const INTERESTS_WITHOUT_SESSION_DETAILS = new Set([
  "Retreats",
  "General Inquiry",
]);

export function ContactForm({ programs = [] }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [interest, setInterest] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSessionDetails =
    interest !== "" && !INTERESTS_WITHOUT_SESSION_DETAILS.has(interest);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  function handleInterestChange(value: string) {
    setInterest(value);
    if (value === "" || INTERESTS_WITHOUT_SESSION_DETAILS.has(value)) {
      setPreferredLocation("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.interest || String(data.interest).trim() === "") {
      setStatus("error");
      setError("Please select an interest.");
      return;
    }

    if (
      showSessionDetails &&
      data.preferredLocation === "Other" &&
      !(typeof data.preferredLocationOther === "string" && data.preferredLocationOther.trim())
    ) {
      setStatus("error");
      setError("Please specify your preferred location.");
      return;
    }

    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }

      setStatus("sent");
      form.reset();
      setInterest("");
      setPreferredLocation("");

      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setStatus("idle");
        resetTimerRef.current = null;
      }, SENT_DISPLAY_MS);
    } catch (err) {
      setStatus("error");
      if (err instanceof TypeError) {
        setError(
          "We couldn't reach the server. Please check your connection and try again.",
        );
        return;
      }
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5" noValidate>
      {/* Honeypot: hidden from users, catches bots. Keep for Netlify too. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company">Company (leave blank)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={formGridClass}>
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full name <span className="text-saffron">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-saffron">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
          />
        </div>
      </div>

      <div className={formGridClass}>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone <span className="text-saffron">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="interest" className={labelClass}>
            Interest <span className="text-saffron">*</span>
          </label>
          <select
            id="interest"
            name="interest"
            className={fieldClass}
            value={interest}
            onChange={(e) => handleInterestChange(e.target.value)}
            required
          >
            <option value="" disabled>
              Select an interest
            </option>
            <option value="One-to-One Session">One-to-One Session</option>
            <option value="Small Group/Family Session">
              Small Group/Family Session
            </option>
            <option value="Corporate Session">Corporate Session</option>
            <option value="Retreats">Retreats</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
        </div>
      </div>

      {showSessionDetails ? (
        <>
          <div className={formGridClass}>
            <div>
              <label htmlFor="program" className={labelClass}>
                Program
              </label>
              <select id="program" name="program" className={fieldClass} defaultValue="">
                <option value="">Select a program (optional)</option>
                {programs.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="preferredTime" className={labelClass}>
                Preferred date / time
              </label>
              <input
                id="preferredTime"
                name="preferredTime"
                type="text"
                placeholder="e.g. Weekday mornings"
                className={fieldClass}
              />
            </div>
          </div>

          <div className={formGridClass}>
            <div>
              <label htmlFor="preferredLocation" className={labelClass}>
                Preferred location
              </label>
              <select
                id="preferredLocation"
                name="preferredLocation"
                className={fieldClass}
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
              >
                <option value="">Select a location (optional)</option>
                {PREFERRED_LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            {preferredLocation === "Other" ? (
              <div>
                <label htmlFor="preferredLocationOther" className={labelClass}>
                  Please specify <span className="text-saffron">*</span>
                </label>
                <input
                  id="preferredLocationOther"
                  name="preferredLocationOther"
                  type="text"
                  required
                  placeholder="Your preferred location"
                  className={fieldClass}
                />
              </div>
            ) : (
              <div className="hidden sm:block" aria-hidden="true" />
            )}
          </div>
        </>
      ) : null}

      <div>
        <label htmlFor="message" className={labelClass}>
          Message <span className="text-saffron">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className={cn(fieldClass, "resize-y")}
        />
      </div>

      <div className="flex items-start gap-2 sm:gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          value="yes"
          className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-border-strong text-saffron focus-visible:outline-none sm:h-4 sm:w-4"
        />
        <label htmlFor="consent" className={formConsentLabelClass}>
          I consent to my details being used to respond to my enquiry, in line with the{" "}
          <a
            href="/privacy-policy"
            className="text-saffron underline underline-offset-2 hover:text-saffron-hover"
          >
            Privacy Policy
          </a>
          . <span className="text-saffron">*</span>
        </label>
      </div>

      {error ? (
        <p role="alert" className={formErrorClass}>
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={status === "submitting" || status === "sent"}
      >
        {status === "submitting"
          ? "Sending..."
          : status === "sent"
            ? "Sent"
            : "Send message"}
      </Button>
    </form>
  );
}
