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
      "Estimez vos frais de transport facilement avec Farcal, l'application web gratuite au Cameroun.",
    images: ["https://fare-calculator-web-app-pcto.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        {/* Meta tags pour la cohérence */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0D1B2A" />
        <meta name="color-scheme" content="dark light" />
        
        {/* GOOGLE SITE VERIFICATION */}
        <meta name="google-site-verification" content="8tvwpqe9FpERjV68ZwbAVbx5LSIxnT63yXzGQu-jocU" />
        
        {/* Préchargement des ressources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
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
            gtag('config', 'G-Z2PE3K4C83', {
              page_title: document.title,
              page_location: window.location.href,
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* ✅ Données structurées (Schema.org) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Farcal",
              "url": "https://fare-calculator-web-app-pcto.vercel.app/",
              "description": "Application web gratuite pour estimer rapidement le coût de vos trajets et transports au Cameroun.",
              "applicationCategory": "UtilityApplication",
              "inLanguage": ["fr", "en", "de"],
              "creator": {
                "@type": "Organization",
                "name": "Farcal Team",
                "url": "https://fare-calculator-web-app-pcto.vercel.app/"
              },
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "XAF"
              },
              "featureList": [
                "Calculateur de tarifs de transport",
                "Estimation en temps réel",
                "Prise en compte des conditions de trajet",
                "Interface multilingue"
              ]
            }),
          }}
        />
      </head>
      <body className="font-sans bg-gradient-to-br from-gray-200 to-gray-200 dark:from-[#0D1B2A] dark:to-[#1B263B] text-gray-800 dark:text-gray-200 antialiased min-h-screen transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
          <Toaster 
            position="top-right" 
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#111827',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                style: {
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                },
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                },
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#ef4444',
                },
              },
              loading: {
                style: {
                  background: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                },
              },
            }}
          />
        </ThemeProvider>
        
        {/* Script pour la détection du thème système */}
        <Script id="theme-detection" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `}
        </Script>
        
        {/* Script pour le smooth scrolling */}
        <Script id="smooth-scroll" strategy="afterInteractive">
          {`
            document.addEventListener('DOMContentLoaded', function() {
              document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                  const targetId = this.getAttribute('href');
                  if (targetId && targetId !== '#') {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                      window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                      });
                    }
                  }
                });
              });
            });
          `}
        </Script>
      </body>
    </html>
  );
}