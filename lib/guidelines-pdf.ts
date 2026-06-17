import "server-only";

import { readFile } from "fs/promises";
import { join } from "path";

import fontkit from "@pdf-lib/fontkit";
import {
  PDFDocument,
  rgb,
  type PDFImage,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib";

import {
  BLOCK_ICON_BY_HEADING,
  GUIDELINE_ICON_COLOR,
  SECTION_ICON_NAMES,
  type GuidelineIconName,
} from "@/lib/guideline-icons";
import {
  BEFORE_PROGRAM_DOCUMENT,
  BEFORE_PROGRAM_TITLE,
  type GuidelineBlock,
  type GuidelineSection,
} from "@/lib/register-content";

export { GUIDELINES_PDF_FILENAME, GUIDELINES_PDF_URL } from "@/lib/guidelines-pdf.constants";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 48;
const MARGIN_BOTTOM = 48;
const HEADER_HEIGHT = 88;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const THEME = {
  ivory: "#FDFBF6",
  cream: "#FAF6EE",
  charcoal: "#211C16",
  brown: "#6B5D4C",
  clay: GUIDELINE_ICON_COLOR,
  border: "#E6DCCB",
} as const;

interface ThemeFonts {
  body: PDFFont;
  bodyMedium: PDFFont;
  heading: PDFFont;
  headingSemibold: PDFFont;
}

interface PdfContext {
  doc: PDFDocument;
  page: PDFPage;
  y: number;
  fonts: ThemeFonts;
  iconCache: Map<string, PDFImage>;
}

function hexToRgb(hex: string): RGB {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
}

const PALETTE = {
  ivory: hexToRgb(THEME.ivory),
  cream: hexToRgb(THEME.cream),
  charcoal: hexToRgb(THEME.charcoal),
  brown: hexToRgb(THEME.brown),
  clay: hexToRgb(THEME.clay),
  border: hexToRgb(THEME.border),
};

function normalizeForPdf(text: string): string {
  return text
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "-")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\u00B0/g, "°")
    .replace(/\u00A0/g, " ");
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const normalized = normalizeForPdf(text);
  const words = normalized.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

function drawPageBackground(page: PDFPage): void {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: PALETTE.ivory,
  });
}

function addPage(ctx: PdfContext): void {
  ctx.page = ctx.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawPageBackground(ctx.page);
  ctx.y = PAGE_HEIGHT - MARGIN_X;
}

function ensureSpace(ctx: PdfContext, needed: number): void {
  if (ctx.y - needed < MARGIN_BOTTOM) {
    addPage(ctx);
  }
}

async function getIconImage(
  ctx: PdfContext,
  name: GuidelineIconName,
  size: number,
): Promise<PDFImage> {
  const key = `${name}-${size}`;
  const cached = ctx.iconCache.get(key);
  if (cached) return cached;

  const iconPath = join(process.cwd(), "assets/guidelines-icons", `${name}.png`);
  const png = await readFile(iconPath);
  const image = await ctx.doc.embedPng(png);
  ctx.iconCache.set(key, image);
  return image;
}

async function drawIconRow(
  ctx: PdfContext,
  iconName: GuidelineIconName,
  text: string,
  options: {
    font: PDFFont;
    size: number;
    color: RGB;
    lineHeight: number;
    iconSize: number;
    gap: number;
  },
): Promise<void> {
  const icon = await getIconImage(ctx, iconName, options.iconSize);
  const textX = MARGIN_X + options.iconSize + options.gap;
  const textWidth = CONTENT_WIDTH - options.iconSize - options.gap;
  const lines = wrapText(text, options.font, options.size, textWidth);
  const blockHeight = Math.max(options.iconSize, lines.length * options.lineHeight);

  ensureSpace(ctx, blockHeight + 4);

  const iconY = ctx.y - options.iconSize + (options.iconSize - options.size) * 0.15;
  ctx.page.drawImage(icon, {
    x: MARGIN_X,
    y: iconY,
    width: options.iconSize,
    height: options.iconSize,
  });

  let textY = ctx.y - options.size;
  for (const line of lines) {
    ctx.page.drawText(line, {
      x: textX,
      y: textY,
      size: options.size,
      font: options.font,
      color: options.color,
    });
    textY -= options.lineHeight;
  }

  ctx.y -= blockHeight;
}

function drawLines(
  ctx: PdfContext,
  lines: string[],
  options: {
    font: PDFFont;
    size: number;
    color: RGB;
    lineHeight: number;
    indent?: number;
  },
): void {
  const indent = options.indent ?? 0;

  for (const line of lines) {
    ensureSpace(ctx, options.lineHeight);
    ctx.page.drawText(line, {
      x: MARGIN_X + indent,
      y: ctx.y,
      size: options.size,
      font: options.font,
      color: options.color,
    });
    ctx.y -= options.lineHeight;
  }
}

function drawParagraph(ctx: PdfContext, text: string, indent = 0): void {
  const lines = wrapText(text, ctx.fonts.body, 11, CONTENT_WIDTH - indent);
  drawLines(ctx, lines, {
    font: ctx.fonts.body,
    size: 11,
    color: PALETTE.brown,
    lineHeight: 15,
    indent,
  });
  ctx.y -= 4;
}

function drawSectionRule(ctx: PdfContext): void {
  ctx.y -= 18;
  ensureSpace(ctx, 24);
  ctx.page.drawLine({
    start: { x: MARGIN_X, y: ctx.y },
    end: { x: PAGE_WIDTH - MARGIN_X, y: ctx.y },
    thickness: 1,
    color: PALETTE.border,
  });
  ctx.y -= 18;
}

async function drawBlock(ctx: PdfContext, block: GuidelineBlock): Promise<void> {
  const iconName = BLOCK_ICON_BY_HEADING[block.heading] ?? "guidelines";

  await drawIconRow(ctx, iconName, block.heading, {
    font: ctx.fonts.headingSemibold,
    size: 16,
    color: PALETTE.charcoal,
    lineHeight: 19,
    iconSize: 18,
    gap: 8,
  });
  ctx.y -= 4;

  for (const paragraph of block.paragraphs ?? []) {
    drawParagraph(ctx, paragraph);
  }

  for (const list of block.lists ?? []) {
    if (list.label) {
      drawLines(ctx, wrapText(list.label, ctx.fonts.bodyMedium, 11, CONTENT_WIDTH), {
        font: ctx.fonts.bodyMedium,
        size: 11,
        color: PALETTE.charcoal,
        lineHeight: 15,
      });
      ctx.y -= 2;
    }

    for (const item of list.items) {
      const bulletLines = wrapText(item, ctx.fonts.body, 11, CONTENT_WIDTH - 18);
      for (let i = 0; i < bulletLines.length; i++) {
        ensureSpace(ctx, 15);
        if (i === 0) {
          ctx.page.drawCircle({
            x: MARGIN_X + 5,
            y: ctx.y - 3,
            size: 2.25,
            color: PALETTE.clay,
          });
        }
        ctx.page.drawText(bulletLines[i]!, {
          x: MARGIN_X + 14,
          y: ctx.y,
          size: 11,
          font: ctx.fonts.body,
          color: PALETTE.brown,
        });
        ctx.y -= 15;
      }
    }
    ctx.y -= 2;
  }

  ctx.y -= 10;
}

async function drawSection(
  ctx: PdfContext,
  section: GuidelineSection,
  sectionIndex: number,
  isFirst: boolean,
): Promise<void> {
  if (!isFirst) {
    drawSectionRule(ctx);
  }

  await drawIconRow(ctx, SECTION_ICON_NAMES[sectionIndex] ?? "beforeStart", section.title, {
    font: ctx.fonts.headingSemibold,
    size: 18,
    color: PALETTE.charcoal,
    lineHeight: 22,
    iconSize: 22,
    gap: 10,
  });
  ctx.y -= 10;

  for (const block of section.blocks) {
    await drawBlock(ctx, block);
  }
}

function drawTitleHeader(ctx: PdfContext): void {
  drawPageBackground(ctx.page);

  ctx.page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - HEADER_HEIGHT,
    width: PAGE_WIDTH,
    height: HEADER_HEIGHT,
    color: PALETTE.cream,
  });

  ctx.page.drawLine({
    start: { x: 0, y: PAGE_HEIGHT - HEADER_HEIGHT },
    end: { x: PAGE_WIDTH, y: PAGE_HEIGHT - HEADER_HEIGHT },
    thickness: 1,
    color: PALETTE.border,
  });

  const titleLines = wrapText(
    BEFORE_PROGRAM_TITLE,
    ctx.fonts.headingSemibold,
    22,
    CONTENT_WIDTH,
  );

  let titleY = PAGE_HEIGHT - 34;
  for (const line of titleLines) {
    ctx.page.drawText(line, {
      x: MARGIN_X,
      y: titleY,
      size: 22,
      font: ctx.fonts.headingSemibold,
      color: PALETTE.charcoal,
    });
    titleY -= 26;
  }

  ctx.y = PAGE_HEIGHT - HEADER_HEIGHT - 28;
}

async function loadFonts(doc: PDFDocument): Promise<ThemeFonts> {
  const fontDir = join(process.cwd(), "assets/fonts");
  const [bodyBytes, bodyMediumBytes, headingBytes, headingSemiboldBytes] =
    await Promise.all([
      readFile(join(fontDir, "Inter-Regular.woff")),
      readFile(join(fontDir, "Inter-Medium.woff")),
      readFile(join(fontDir, "CormorantGaramond-Regular.woff")),
      readFile(join(fontDir, "CormorantGaramond-SemiBold.woff")),
    ]);

  const [body, bodyMedium, heading, headingSemibold] = await Promise.all([
    doc.embedFont(bodyBytes),
    doc.embedFont(bodyMediumBytes),
    doc.embedFont(headingBytes),
    doc.embedFont(headingSemiboldBytes),
  ]);

  return { body, bodyMedium, heading, headingSemibold };
}

export async function generateGuidelinesPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(BEFORE_PROGRAM_TITLE);
  doc.setAuthor("Nava Hatha Yoga");
  doc.setCreator("Nava Hatha Yoga");

  const fonts = await loadFonts(doc);
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const ctx: PdfContext = {
    doc,
    page,
    y: PAGE_HEIGHT - MARGIN_X,
    fonts,
    iconCache: new Map(),
  };

  drawTitleHeader(ctx);

  for (let index = 0; index < BEFORE_PROGRAM_DOCUMENT.length; index++) {
    await drawSection(ctx, BEFORE_PROGRAM_DOCUMENT[index]!, index, index === 0);
  }

  return doc.save();
}
