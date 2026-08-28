import { hasCmsSession } from "@/lib/cms/session";
import { listMedia, uploadImage } from "@/lib/cms/media";

/**
 * Upload endpoint for the editor's image field. A route handler rather than a
 * server action so the picker can upload a file on its own, without submitting
 * the page it belongs to.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await hasCmsSession())) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  return Response.json({ items: await listMedia() });
}

export async function POST(request: Request) {
  if (!(await hasCmsSession())) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Could not read the upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Choose an image first." }, { status: 400 });
  }

  const number = (name: string) => {
    const value = Number(form.get(name));
    return Number.isFinite(value) && value > 0 ? Math.round(value) : undefined;
  };

  try {
    const result = await uploadImage({
      file,
      width: number("width"),
      height: number("height"),
      alt: (form.get("alt") as string | null)?.trim() || undefined,
    });

    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The upload did not work.";
    console.error("CMS image upload failed.", error);
    return Response.json({ error: message }, { status: 400 });
  }
}
