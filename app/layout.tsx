import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Public_Sans } from "next/font/google";
import localFont from "next/font/local";
import { PERSON, SITE_URL } from "@/lib/site";
import "./globals.css";

// All fonts are served from this site, so the browser never waits on a request to Google.
// Headings only ever use Archivo 800 at 112% width, so that single instance is self-hosted
// (37 KB) instead of the full width-and-weight variable font (90 KB). See app/fonts/README.md.
const archivo = localFont({
  src: "./fonts/archivo-latin-wdth112-wght800.woff2",
  weight: "800",
  style: "normal",
  declarations: [{ prop: "font-stretch", value: "112%" }],
  variable: "--font-archivo",
  display: "swap",
  // Arial Bold is within 1% of Archivo 800 at 112% width, so the swap barely moves text.
  adjustFontFallback: false,
  fallback: ["Arial", "Helvetica Neue", "system-ui", "sans-serif"],
});
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-public-sans",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"], // 31 KB instead of 41 KB for the full 100-800 range
  variable: "--font-jetbrains",
  display: "swap",
  // The automatic fallback is metric-matched Arial, which is proportional; keep a monospace fallback.
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

// 154 characters, so search results show it whole
const description =
  "EEE undergraduate in Bangladesh. Built a 40 kHz ultrasonic phased-array imager and designs 4-layer PCBs. Seeking a research Master's in power electronics.";
const ogDescription = "Mixed-signal instruments, PCB design and ultrasonic phased-array imaging.";
const ogImageAlt = "Shad Ebny Wahid, Electrical and Electronic Engineering, beside a simulated 40 kHz sector scan";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Shad Ebny Wahid · EEE, PCB design and ultrasonic imaging",
  description,
  authors: [{ name: PERSON.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: PERSON.name,
    title: PERSON.name,
    description: ogDescription,
    url: "/",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: PERSON.name,
    description: ogDescription,
    images: [{ url: "/images/og.jpg", alt: ogImageAlt }],
  },
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
