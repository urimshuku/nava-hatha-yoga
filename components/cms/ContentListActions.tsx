import Link from "next/link";

import { ConfirmDeleteButton } from "@/components/cms/ConfirmDeleteButton";

/**
 * Duplicate / Edit (or Put back) / Delete on a content list row.
 */
export function ContentListActions({
  slug,
  hidden,
  editHref,
  noun,
  duplicate,
  restore,
  remove,
}: {
  slug: string;
  hidden: boolean;
  editHref: string;
  noun: "event" | "program" | "retreat";
  duplicate: (formData: FormData) => void | Promise<void>;
  restore: (formData: FormData) => void | Promise<void>;
  remove: (formData: FormData) => void | Promise<void>;
}) {
  const actionClass =
    "text-sm text-brown transition-colors hover:text-saffron";

  return (
    <>
      <form action={duplicate}>
        <input type="hidden" name="slug" value={slug} />
        <button type="submit" className={actionClass}>
          Duplicate
        </button>
      </form>
      {hidden ? (
        <form action={restore}>
          <input type="hidden" name="slug" value={slug} />
          <button type="submit" className={actionClass}>
            Put back
          </button>
        </form>
      ) : (
        <Link href={editHref} className={actionClass}>
          Edit
        </Link>
      )}
      <ConfirmDeleteButton
        slug={slug}
        action={remove}
        message={`Delete this ${noun} permanently? This cannot be undone.`}
      />
    </>
  );
}
