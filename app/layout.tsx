import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono, Public_Sans } from "next/font/google";
import { PERSON, SITE_URL } from "@/lib/site";
import "./globals.css";

// Fonts are downloaded at build time and served from this site, so the
// browser never waits on a render-blocking request to Google.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"], // headings use font-stretch:112%
  variable: "--font-archivo",
  display: "swap",
  // Arial Bold is within 1% of Archivo 800 at 112% width, so the swap barely moves text.
  adjustFontFallback: false,
  fallback: ["Arial", "Helvetica Neue", "system-ui", "sans-serif"],
});
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  // The automatic fallback is metric-matched Arial, which is proportional; keep a monospace fallback.
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

const description =
  "Shad Ebny Wahid — EEE undergraduate building mixed-signal embedded instruments: a low-cost 40 kHz ultrasonic phased-array imager, multi-layer PCB design and power electronics.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Shad Ebny Wahid · EEE, PCB design and ultrasonic imaging",
  description,
  authors: [{ name: PERSON.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: PERSON.name,
    description: "Mixed-signal instruments, PCB design and ultrasonic phased-array imaging.",
    url: "/",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEF1F4" },
    { media: "(prefers-color-scheme: dark)", color: "#0E161D" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${publicSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
