import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { getProfile } from "@/lib/content";

// Display: Archivo variable with the width axis — rendered expanded (§4.3 fallback for Monument Extended)
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile();
  return {
    metadataBase: new URL("https://aryanmalhotra.dev"), // placeholder — swap for the real domain at deploy
    title: {
      default: "Aryan Malhotra — Software · Data · Product",
      template: "%s — Aryan Malhotra",
    },
    description:
      "Cinematic portfolio of Aryan Malhotra: software engineering, data science, product, entrepreneurship, and filmmaking.",
    openGraph: {
      title: "Aryan Malhotra — Software · Data · Product",
      description: p.tagline,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

// Root layout is intentionally minimal so the Keystatic admin (/keystatic)
// doesn't inherit the site chrome — that lives in app/(site)/layout.tsx.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
