import { CONTACT } from "@/lib/constants";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/layout/Container";

interface ContactSectionProps {
  programs?: string[];
  email?: string;
}

export function ContactSection({
  programs = [],
  email = CONTACT.email,
}: ContactSectionProps) {
  return (
    <section className="bg-cream py-section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-sm text-balance">Connect with Us</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-brown">
            For questions regarding upcoming programs, private instruction, or
            general inquiries, please leave a message below or email us directly
            at{" "}
            <a
              href={`mailto:${email}`}
              className="text-saffron underline underline-offset-2 hover:text-saffron-hover"
            >
              {email}
            </a>
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-border bg-ivory p-6 shadow-soft sm:p-8">
          <ContactForm programs={programs} />
        </div>
      </Container>
    </section>
  );
}
