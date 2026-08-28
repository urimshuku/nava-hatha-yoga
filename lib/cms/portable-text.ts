import type { PortableTextBlock } from "@portabletext/types";

/**
 * Converts between the editor's text box and the Portable Text blocks the site
 * renders with components/content/CMSRichText.tsx.
 *
 * The text box uses a deliberately small subset of Markdown, produced by the
 * toolbar buttons rather than typed by hand:
 *
 *   ## Heading           -> h2            ### Smaller heading -> h3
 *   > Quote              -> blockquote
 *   - Item               -> bullet list   1. Item             -> numbered list
 *   **bold**  *italic*   -> marks         [text](/link)       -> link
 *
 * Blank lines separate paragraphs. Anything else is kept as plain text, so the
 * client can never produce markup the site does not know how to render.
 */

type Span = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

type Block = {
  _type: "block";
  _key: string;
  style: string;
  listItem?: "bullet" | "number";
  level?: number;
  markDefs: { _key: string; _type: "link"; href: string }[];
  children: Span[];
};

/** Deterministic keys keep saved documents stable across edits. */
function createKeyFactory(): (prefix: string) => string {
  let counter = 0;
  return (prefix) => `${prefix}${(counter += 1).toString(36)}`;
}

const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/;
const BOLD_PATTERN = /\*\*([\s\S]+?)\*\*/;
const ITALIC_PATTERN = /\*([\s\S]+?)\*/;

function firstMatch(
  text: string,
): { kind: "link" | "bold" | "italic"; match: RegExpExecArray } | null {
  const candidates: { kind: "link" | "bold" | "italic"; match: RegExpExecArray | null }[] = [
    { kind: "link", match: LINK_PATTERN.exec(text) },
    // Bold is tested before italic so "**x**" is not read as an italic "*x".
    { kind: "bold", match: BOLD_PATTERN.exec(text) },
    { kind: "italic", match: ITALIC_PATTERN.exec(text) },
  ];

  let best: { kind: "link" | "bold" | "italic"; match: RegExpExecArray } | null = null;
  for (const candidate of candidates) {
    if (!candidate.match) continue;
    if (!best || candidate.match.index < best.match.index) {
      best = { kind: candidate.kind, match: candidate.match };
    }
  }

  return best;
}

function parseInline(
  text: string,
  marks: string[],
  markDefs: Block["markDefs"],
  nextKey: (prefix: string) => string,
): Span[] {
  if (!text) return [];

  const found = firstMatch(text);
  if (!found) {
    return [{ _type: "span", _key: nextKey("s"), text, marks: [...marks] }];
  }

  const { kind, match } = found;
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + match[0].length);

  const spans: Span[] = [];
  if (before) {
    spans.push({ _type: "span", _key: nextKey("s"), text: before, marks: [...marks] });
  }

  if (kind === "link") {
    const markKey = nextKey("l");
    markDefs.push({ _key: markKey, _type: "link", href: match[2] });
    spans.push(...parseInline(match[1], [...marks, markKey], markDefs, nextKey));
  } else {
    const mark = kind === "bold" ? "strong" : "em";
    spans.push(...parseInline(match[1], [...marks, mark], markDefs, nextKey));
  }

  spans.push(...parseInline(after, marks, markDefs, nextKey));

  return spans;
}

function buildBlock(
  raw: string,
  nextKey: (prefix: string) => string,
): Block | null {
  const line = raw.trim();
  if (!line) return null;

  let style = "normal";
  let listItem: Block["listItem"];
  let content = line;

  if (line.startsWith("### ")) {
    style = "h3";
    content = line.slice(4);
  } else if (line.startsWith("## ")) {
    style = "h2";
    content = line.slice(3);
  } else if (line.startsWith("> ")) {
    style = "blockquote";
    content = line.slice(2);
  } else if (/^[-*]\s+/.test(line)) {
    listItem = "bullet";
    content = line.replace(/^[-*]\s+/, "");
  } else if (/^\d+[.)]\s+/.test(line)) {
    listItem = "number";
    content = line.replace(/^\d+[.)]\s+/, "");
  }

  const markDefs: Block["markDefs"] = [];
  const children = parseInline(content, [], markDefs, nextKey);
  if (children.length === 0) return null;

  return {
    _type: "block",
    _key: nextKey("b"),
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    markDefs,
    children,
  };
}

/**
 * Splits the text box into blocks. Consecutive list lines each become their own
 * block, matching how Portable Text represents lists.
 */
function splitIntoBlockSources(text: string): string[] {
  const sources: string[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length > 0) {
      sources.push(paragraph.join(" "));
      paragraph = [];
    }
  };

  for (const rawLine of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trim();

    if (!line) {
      flush();
      continue;
    }

    const isOwnBlock =
      /^[-*]\s+/.test(line) ||
      /^\d+[.)]\s+/.test(line) ||
      line.startsWith("#") ||
      line.startsWith("> ");

    if (isOwnBlock) {
      flush();
      sources.push(line);
      continue;
    }

    paragraph.push(line);
  }

  flush();

  return sources;
}

/** Editor text box -> Portable Text blocks stored in the CMS. */
export function textToPortableText(text: string): PortableTextBlock[] {
  const nextKey = createKeyFactory();

  return splitIntoBlockSources(text).flatMap((source) => {
    const block = buildBlock(source, nextKey);
    return block ? [block as unknown as PortableTextBlock] : [];
  }) as PortableTextBlock[];
}

function serializeSpan(span: Span, markDefs: Block["markDefs"]): string {
  let text = span.text;
  const marks = span.marks ?? [];

  if (marks.includes("strong")) text = `**${text}**`;
  if (marks.includes("em")) text = `*${text}*`;

  const linkKey = marks.find((mark) =>
    markDefs.some((def) => def._key === mark),
  );
  if (linkKey) {
    const href = markDefs.find((def) => def._key === linkKey)?.href ?? "";
    text = `[${text}](${href})`;
  }

  return text;
}

/** Portable Text blocks -> the text the editor puts in the text box. */
export function portableTextToText(
  blocks?: PortableTextBlock[] | null,
): string {
  if (!blocks || blocks.length === 0) return "";

  const lines: string[] = [];
  let previousWasList = false;

  for (const raw of blocks) {
    const block = raw as unknown as Block;
    if (block._type !== "block") continue;

    const text = (block.children ?? [])
      .filter((child) => child._type === "span")
      .map((child) => serializeSpan(child, block.markDefs ?? []))
      .join("");

    if (!text.trim()) continue;

    const isList = Boolean(block.listItem);
    // Blank line between blocks, except between consecutive list items.
    if (lines.length > 0 && !(isList && previousWasList)) lines.push("");

    if (block.listItem === "bullet") lines.push(`- ${text}`);
    else if (block.listItem === "number") lines.push(`1. ${text}`);
    else if (block.style === "h2") lines.push(`## ${text}`);
    else if (block.style === "h3") lines.push(`### ${text}`);
    else if (block.style === "blockquote") lines.push(`> ${text}`);
    else lines.push(text);

    previousWasList = isList;
  }

  return lines.join("\n");
}
