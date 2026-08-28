"use client";

import { useId, useRef } from "react";

import { Field, inputClassName } from "./Field";

/**
 * A text box with a small toolbar. The buttons wrap the selected text in the
 * simple notation lib/cms/portable-text.ts understands, which keeps the client
 * from having to remember any syntax while still allowing bold, italic, links,
 * headings and lists.
 */

type Wrap = { before: string; after: string; placeholder: string };
type LinePrefix = { prefix: string; placeholder: string };

const WRAPS: Record<"bold" | "italic", Wrap> = {
  bold: { before: "**", after: "**", placeholder: "bold text" },
  italic: { before: "*", after: "*", placeholder: "italic text" },
};

const LINE_PREFIXES: Record<"heading" | "bullet" | "quote", LinePrefix> = {
  heading: { prefix: "## ", placeholder: "Heading" },
  bullet: { prefix: "- ", placeholder: "List item" },
  quote: { prefix: "> ", placeholder: "Quote" },
};

type ToolbarAction =
  | { kind: "wrap"; wrap: keyof typeof WRAPS }
  | { kind: "prefix"; prefix: keyof typeof LINE_PREFIXES }
  | { kind: "link" };

const TOOLBAR: { label: string; title: string; action: ToolbarAction }[] = [
  { label: "B", title: "Bold", action: { kind: "wrap", wrap: "bold" } },
  { label: "I", title: "Italic", action: { kind: "wrap", wrap: "italic" } },
  { label: "Link", title: "Add a link", action: { kind: "link" } },
  {
    label: "List",
    title: "Bullet list",
    action: { kind: "prefix", prefix: "bullet" },
  },
  {
    label: "Heading",
    title: "Heading",
    action: { kind: "prefix", prefix: "heading" },
  },
  {
    label: "Quote",
    title: "Quote",
    action: { kind: "prefix", prefix: "quote" },
  },
];

export function RichTextField({
  name,
  label,
  hint,
  defaultValue,
  rows = 10,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  rows?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fieldId = useId();

  function replaceSelection(
    build: (selected: string) => { text: string; selectionStart: number; selectionEnd: number },
  ) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);
    const built = build(selected);

    textarea.value =
      value.slice(0, selectionStart) + built.text + value.slice(selectionEnd);

    textarea.focus();
    textarea.setSelectionRange(
      selectionStart + built.selectionStart,
      selectionStart + built.selectionEnd,
    );
  }

  function applyWrap(kind: keyof typeof WRAPS) {
    const { before, after, placeholder } = WRAPS[kind];

    replaceSelection((selected) => {
      const body = selected || placeholder;
      return {
        text: `${before}${body}${after}`,
        selectionStart: before.length,
        selectionEnd: before.length + body.length,
      };
    });
  }

  function applyLinePrefix(kind: keyof typeof LINE_PREFIXES) {
    const { prefix, placeholder } = LINE_PREFIXES[kind];

    replaceSelection((selected) => {
      const body = selected || placeholder;
      const lines = body.split("\n").map((line) => `${prefix}${line}`);
      const text = lines.join("\n");
      return {
        text,
        selectionStart: prefix.length,
        selectionEnd: text.length,
      };
    });
  }

  function applyLink() {
    const href = window.prompt(
      "Where should this link go? Use a page like /programs, or a full web address.",
      "/",
    );
    if (!href) return;

    replaceSelection((selected) => {
      const body = selected || "link text";
      return {
        text: `[${body}](${href})`,
        selectionStart: 1,
        selectionEnd: 1 + body.length,
      };
    });
  }

  function run(action: ToolbarAction) {
    if (action.kind === "wrap") applyWrap(action.wrap);
    else if (action.kind === "prefix") applyLinePrefix(action.prefix);
    else applyLink();
  }

  return (
    <Field label={label} hint={hint} htmlFor={fieldId}>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {TOOLBAR.map((button) => (
          <button
            key={button.label}
            type="button"
            title={button.title}
            onClick={() => run(button.action)}
            className="rounded border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal transition-colors hover:border-saffron hover:text-saffron"
          >
            {button.label}
          </button>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        id={fieldId}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className={`${inputClassName} font-mono text-[13px] leading-relaxed`}
      />

      <p className="mt-2 text-xs text-brown">
        Select some text, then press a button. Leave an empty line between
        paragraphs.
      </p>
    </Field>
  );
}
