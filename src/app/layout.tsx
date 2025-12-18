import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsProvider from "@/components/ProductsProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import GoogleTagManager, { GoogleTagManagerNoScript } from "@/components/GoogleTagManager";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Montessori Sénégal - Jouets Éducatifs pour Enfants",
  description: "Boutique en ligne de jouets éducatifs Montessori au Sénégal. Matériel pédagogique de qualité pour le développement de votre enfant.",
  keywords: ["Montessori", "jouets éducatifs", "Sénégal", "Dakar", "enfants", "pédagogie", "apprentissage"],
  authors: [{ name: "Montessori Sénégal" }],
  // Les icônes sont automatiquement détectées par Next.js depuis app/icon.svg et app/apple-icon.svg
  openGraph: {
    title: "Montessori Sénégal - Jouets Éducatifs pour Enfants",
    description: "Boutique en ligne de jouets éducatifs Montessori au Sénégal.",
    locale: "fr_SN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <GoogleTagManager />
      </head>
      <body className="font-sans antialiased bg-stone-50 text-stone-900">
        <GoogleTagManagerNoScript />
        <GoogleAnalytics />
        <MetaPixel />
        <ProductsProvider>
          <Header />
          <main className="min-h-screen pt-20">
            {children}
          </main>
          <Footer />
        </ProductsProvider>
      </body>
    </html>
  );
}
