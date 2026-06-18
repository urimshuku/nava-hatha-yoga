import { NextResponse } from "next/server";

import { GUIDELINES_PDF_URL } from "@/lib/guidelines-pdf.constants";

export async function GET(request: Request) {
  return NextResponse.redirect(new URL(GUIDELINES_PDF_URL, request.url));
}
