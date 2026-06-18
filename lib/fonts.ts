import localFont from "next/font/local";

export const fontHeading = localFont({
  src: [
    {
      path: "../assets/fonts/CormorantGaramond-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/CormorantGaramond-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-heading",
});

export const fontBody = localFont({
  src: "../assets/fonts/Montserrat[wght].ttf",
  weight: "400 500",
  display: "swap",
  variable: "--font-body",
});
