import Link from "next/link";

/**
 * Edit / Duplicate / Put back on a content list row. Duplicate is always
 * available so a past event can be copied without starting from a blank form.
 */
export function ContentListActions({
  slug,
  hidden,
  editHref,
  duplicate,
  restore,
}: {
  slug: string;
  hidden: boolean;
  editHref: string;
  duplicate: (formData: FormData) => void | Promise<void>;
  restore: (formData: FormData) => void | Promise<void>;
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
    </>
  );
}
