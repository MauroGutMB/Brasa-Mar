import type { Metadata, Viewport } from "next";
import { Barlow, Cinzel } from "next/font/google";

import { getSettings } from "@/lib/data";
import { locale, siteUrl } from "@/lib/site";

import "./globals.css";

const sans = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-sans-family",
});

const display = Cinzel({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-family",
});

/**
 * Metadata vem do banco: mudar nome, descrição ou palavras-chave no admin
 * atualiza title, Open Graph e Twitter Card sem passar por deploy.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.name} — ${settings.tagline}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${settings.name}`,
    },
    description: settings.description,
    applicationName: settings.name,
    keywords: settings.seoKeywords,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale,
      url: siteUrl,
      siteName: settings.name,
      title,
      description: settings.description,
      images: [
        {
          url: settings.ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: settings.description,
      images: [settings.ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#08090b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
