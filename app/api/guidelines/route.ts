import {
  generateGuidelinesPdf,
  GUIDELINES_PDF_FILENAME,
} from "@/lib/guidelines-pdf";

export async function GET() {
  const pdf = await generateGuidelinesPdf();

  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${GUIDELINES_PDF_FILENAME}"`,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
