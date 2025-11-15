import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import Head from "next/head";

const poppins = localFont({
  src: [
    {
      path: "../public/fonts/Poppins/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Farcal – Calculateur de coût de transport au Cameroun",
  description:
    "Estimez facilement le coût de vos trajets, taxis et services de transport au Cameroun grâce à Farcal. Application web gratuite et rapide.",
  keywords: [
    "calculateur de coût",
    "transport Cameroun",
    "estimation tarif taxi",
    "calcul prix trajet",
    "application de transport",
    "calcul essence",
    "fare calculator Cameroon"
  ],
  authors: [{ name: "Farcal Team" }],
  openGraph: {
    title: "Farcal – Calculateur de coût de transport au Cameroun",
    description:
      "Farcal vous aide à estimer instantanément vos tarifs et coûts de transport. Simple, précis et gratuit.",
    url: "https://fare-calculator-web-app-pcto.vercel.app/",
    siteName: "Farcal",
    images: [
      {
        url: "https://fare-calculator-web-app-pcto.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Farcal – Calculateur de coût de transport",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Farcal – Calculateur de coût",
    description:
      "Estimez vos frais de transport facilement avec Farcal, l’application web gratuite au Cameroun.",
    images: ["https://fare-calculator-web-app-pcto.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={poppins.variable} suppressHydrationWarning>
      <head>
        {/* ✅ Google Analytics 4 */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Z2PE3K4C83"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z2PE3K4C83');
          `}
        </Script>

        {/* ✅ Données structurées (Schema.org) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Farcal",
              url: "https://fare-calculator-web-app-pcto.vercel.app/",
              description:
                "Application web gratuite pour estimer rapidement le coût de vos trajets et transports au Cameroun.",
              applicationCategory: "UtilityApplication",
              inLanguage: "fr",
              creator: {
                "@type": "Organization",
                name: "Farcal Team",
              },
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "XAF",
              },
            }),
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        {/* <link rel="icon" href="/favicon" /> */}
      </head>
      <body className="text-black bg-gray-200 dark:bg-gray-800 text-[16px] lg:text-[20px]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-left" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
