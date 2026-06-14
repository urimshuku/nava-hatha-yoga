import { Cormorant_Garamond, Inter } from "next/font/google";

export const fontHeading = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-heading",
});

export const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});
