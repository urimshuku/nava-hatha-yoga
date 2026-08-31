"use client";

const buttonClassName =
  "rounded border border-border-strong px-4 py-2.5 text-sm text-brown transition-colors hover:border-saffron hover:text-saffron";

export function RemoveFromWebsite({
  slug,
  noun,
  hide,
  remove,
}: {
  slug: string;
  noun: "event" | "program" | "retreat";
  hide: (formData: FormData) => void | Promise<void>;
  remove: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <section className="mt-10 rounded-lg border border-border bg-white p-5 sm:p-6">
      <h2 className="font-heading text-xl text-charcoal">
        Remove from the website
      </h2>
      <p className="mt-2 max-w-prose text-sm text-brown">
        Hide takes this {noun} off the website. You can put it back at any time.
        Remove deletes it permanently.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <form action={hide}>
          <input type="hidden" name="slug" value={slug} />
          <button type="submit" className={buttonClassName}>
            Hide
          </button>
        </form>
        <form
          action={remove}
          onSubmit={(event) => {
            if (
              !window.confirm(
                `Remove this ${noun} permanently? This cannot be undone.`,
              )
            ) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="slug" value={slug} />
          <button type="submit" className={buttonClassName}>
            Remove
          </button>
        </form>
      </div>
    </section>
  );
}
