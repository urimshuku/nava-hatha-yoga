"use client";

import { useRef, useState, useTransition } from "react";

import { urlForImage } from "@/lib/cms/image-url";
import type { SanityImage } from "@/lib/cms/content-types";

import { Field, inputClassName } from "./Field";

/**
 * Picks the image for one field: upload a new one, reuse something already
 * uploaded, or leave whatever is there alone.
 *
 * The value travels as JSON in a single hidden input so an existing image is
 * handed back untouched rather than rebuilt from a few inputs.
 */

interface ImageValue {
  _type?: string;
  key?: string;
  alt?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

interface MediaItem {
  key: string;
  filename: string;
  width?: number;
  height?: number;
  alt?: string;
}

/** Preview for the image currently chosen, from /media or a data URL. */
function previewOf(image: ImageValue | null | undefined): string | undefined {
  if (!image) return undefined;
  return urlForImage(image as SanityImage)?.width(320).height(240).url();
}

export function ImageField({
  name,
  label,
  hint,
  value,
}: {
  /** Field path; the hidden input adds the `__json` suffix the parser expects. */
  name: string;
  label: string;
  hint?: string;
  value?: ImageValue | null;
}) {
  const [image, setImage] = useState<ImageValue | null>(value ?? null);
  const [preview, setPreview] = useState<string | undefined>(previewOf(value));
  const [error, setError] = useState<string | undefined>();
  const [library, setLibrary] = useState<MediaItem[] | undefined>();
  const [isUploading, startUpload] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const apply = (next: ImageValue | null, nextPreview?: string) => {
    setImage(next);
    setPreview(nextPreview);
    setError(undefined);
  };

  async function measure(file: File) {
    try {
      const bitmap = await createImageBitmap(file);
      const size = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return size;
    } catch {
      return { width: undefined, height: undefined };
    }
  }

  function upload(file: File) {
    startUpload(async () => {
      const size = await measure(file);
      const body = new FormData();
      body.set("file", file);
      if (size.width) body.set("width", String(size.width));
      if (size.height) body.set("height", String(size.height));

      const response = await fetch("/api/cms/media", { method: "POST", body });
      const result = (await response.json()) as {
        key?: string;
        error?: string;
      };

      if (!response.ok || !result.key) {
        setError(result.error ?? "The upload did not work. Please try again.");
        return;
      }

      apply(
        {
          _type: "cmsImage",
          key: result.key,
          alt: image?.alt ?? "",
          ...size,
        },
        `/media/${result.key}`,
      );
    });
  }

  function openLibrary() {
    startUpload(async () => {
      const response = await fetch("/api/cms/media");
      if (!response.ok) {
        setError("Could not load your images.");
        return;
      }
      const result = (await response.json()) as { items: MediaItem[] };
      setLibrary(result.items);
    });
  }

  return (
    <Field label={label} hint={hint}>
      <input
        type="hidden"
        name={`${name}__json`}
        value={image ? JSON.stringify(image) : ""}
      />

      <div className="rounded border border-border bg-white p-3">
        <div className="flex flex-wrap items-start gap-4">
          <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded bg-cream">
            {preview ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={preview}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-brown">
                No image
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={isUploading}
                className="rounded border border-border px-3 py-1.5 text-xs font-medium text-charcoal transition-colors hover:border-saffron disabled:opacity-50"
              >
                {isUploading ? "Working…" : preview ? "Replace" : "Upload"}
              </button>
              <button
                type="button"
                onClick={openLibrary}
                disabled={isUploading}
                className="rounded border border-border px-3 py-1.5 text-xs font-medium text-charcoal transition-colors hover:border-saffron disabled:opacity-50"
              >
                Choose existing
              </button>
              {preview ? (
                <button
                  type="button"
                  onClick={() => apply(null, undefined)}
                  className="rounded border border-border px-3 py-1.5 text-xs font-medium text-brown transition-colors hover:border-red-300 hover:text-red-700"
                >
                  Remove
                </button>
              ) : null}
            </div>

            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) upload(file);
              }}
            />

            <input
              type="text"
              value={image?.alt ?? ""}
              onChange={(event) =>
                setImage((current) =>
                  current ? { ...current, alt: event.target.value } : current,
                )
              }
              disabled={!image}
              placeholder="Describe the image for screen readers"
              className={`${inputClassName} text-xs disabled:bg-cream disabled:text-brown`}
            />

            {error ? <p className="text-xs text-red-700">{error}</p> : null}
          </div>
        </div>

        {library ? (
          <div className="mt-3 border-t border-border pt-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-charcoal">Your images</p>
              <button
                type="button"
                onClick={() => setLibrary(undefined)}
                className="text-xs text-brown underline"
              >
                Close
              </button>
            </div>
            {library.length === 0 ? (
              <p className="text-xs text-brown">
                Nothing uploaded yet. Use Upload above to add the first image.
              </p>
            ) : (
              <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5">
                {library.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    title={item.filename}
                    onClick={() => {
                      apply(
                        {
                          _type: "cmsImage",
                          key: item.key,
                          alt: item.alt ?? "",
                          width: item.width,
                          height: item.height,
                        },
                        `/media/${item.key}`,
                      );
                      setLibrary(undefined);
                    }}
                    className="relative aspect-4/3 overflow-hidden rounded border border-border transition-colors hover:border-saffron"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/media/${item.key}`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Field>
  );
}
