import { CONTACT } from "@/lib/constants";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/layout/Container";

interface ContactSectionProps {
  programs?: string[];
  email?: string;
  heading?: string;
  description?: React.ReactNode;
}

export function ContactSection({
  programs = [],
  email = CONTACT.email,
  heading = "Connect with Us",
  description = (
    <>
      For questions regarding upcoming programs, private instruction, or general inquiries,
      please leave a message below or email us directly at{" "}
      <a
        href={`mailto:${email}`}
        className="text-saffron underline underline-offset-2 hover:text-saffron-hover"
      >
        {email}
      </a>
    </>
  ),
}: ContactSectionProps) {
  return (
    <section className="bg-cream py-section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-sm text-balance">{heading}</h2>
          <p className="section-lead mx-auto mt-4 max-w-xl sm:mt-5">
            {description}
          </p>
        </div>

        <div className="mx-auto mt-5 max-w-2xl rounded-2xl border border-border bg-ivory p-3 shadow-soft sm:mt-10 sm:p-8">
          <ContactForm programs={programs} />
        </div>
      </Container>
    </section>
  );
}
