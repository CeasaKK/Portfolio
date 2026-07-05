import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";

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
  title: "Aryan Malhotra — Software · Data · Product",
  description:
    "Cinematic portfolio of Aryan Malhotra: software engineering, data science, product, entrepreneurship, and filmmaking.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <TopBar />
        {children}
      </body>
    </html>
  );
}
