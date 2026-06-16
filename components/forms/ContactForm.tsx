"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Posts JSON to /api/contact, which is host-agnostic (works on Vercel, Netlify,
 * or anywhere). To switch to Netlify Forms instead, give the <form> a
 * `name` + `data-netlify="true"`, keep the "company" honeypot, and POST
 * url-encoded data (including `form-name`) to "/". See lib/contact.ts.
 */
interface ContactFormProps {
  programs?: string[];
}

const fieldClass =
  "w-full rounded-lg border border-border-strong bg-ivory px-4 py-3 text-charcoal placeholder:text-brown/60 focus-visible:border-saffron focus-visible:outline-none";
const labelClass = "mb-1.5 block text-sm font-medium text-charcoal";

export function ContactForm({ programs = [] }: ContactFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }

      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

      <div className="grid gap-5 sm:grid-cols-2">
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

      <div className="grid gap-5 sm:grid-cols-2">
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

      <div className="grid gap-5 sm:grid-cols-2">
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
          <label htmlFor="interest" className={labelClass}>
            Interest
          </label>
          <select id="interest" name="interest" className={fieldClass} defaultValue="">
            <option value="">Select an interest (optional)</option>
            <option value="One-on-One Session">One-on-One Session</option>
            <option value="Small-Group Session">Small-Group Session</option>
            <option value="Corporate session">Corporate session</option>
            <option value="Retreats">Retreats</option>
            <option value="General enquiry">General enquiry</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message <span className="text-saffron">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={cn(fieldClass, "resize-y")}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          value="yes"
          className="mt-1 h-4 w-4 shrink-0 rounded border-border-strong text-saffron focus-visible:outline-none"
        />
        <label htmlFor="consent" className="text-sm leading-relaxed text-brown">
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
        <p role="alert" className="text-sm text-saffron-hover">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
