"use client";

export function ConfirmDeleteButton({
  slug,
  action,
  message,
}: {
  slug: string;
  action: (formData: FormData) => void | Promise<void>;
  message: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="text-sm text-brown transition-colors hover:text-saffron"
      >
        Delete
      </button>
    </form>
  );
}
