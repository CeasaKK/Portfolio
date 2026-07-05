import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import profile from "@/data/profile.json";
import type { Profile } from "@/lib/types";
import ScrollRig from "@/components/ScrollRig";
import TopBar from "@/components/TopBar";

const p = profile as Profile;

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

export const metadata: Metadata = {
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
  twitter: {
    card: "summary_large_image",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: p.name,
  description: p.tagline,
  sameAs: p.socials.filter((s) => s.url.startsWith("http")).map((s) => s.url),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ScrollRig />
        <TopBar />
        {children}
      </body>
    </html>
  );
}
