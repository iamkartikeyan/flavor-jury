import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Flavor Jury — The Bio-Adaptive Sensory Augmentation Engine",
  description:
    "The world's first computational gastronomy platform that hacks the human sensory network. We don't subtract ingredients — we create Cross-Modal Sensory Illusions so restricted diets taste whole again.",
  keywords: [
    "computational gastronomy",
    "cross-modal sensory illusion",
    "FlavorDB",
    "RecipeDB",
    "dysgeusia",
    "hypertension diet",
    "diabetes food",
    "sensory augmentation",
  ],
  authors: [{ name: "Flavor Jury — Foodoscope ForkIT 2026, IIIT Delhi" }],
  openGraph: {
    title: "Flavor Jury — Judging the molecular fate of your diet",
    description:
      "Bio-Adaptive Sensory Augmentation Engine. 0mg sodium. 94% sensory illusion. 100% dopamine.",
    siteName: "Flavor Jury",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f9f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${instrumentSans.variable} ${plexMono.variable} antialiased bg-ink text-cream font-sans grain`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
