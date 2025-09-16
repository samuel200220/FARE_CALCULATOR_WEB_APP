import type { Metadata } from "next";
<<<<<<< HEAD
//import { Poppins,Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from 'react-hot-toast';
import { Montserrat } from 'next/font/google';
import localFont from "next/font/local";

// const font=Poppins({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'], // choisis ce que tu veux
//   variable: '--font-poppins',
//   display: "swap",
// });
const poppins = localFont({
  src: [
    {
      path: '../public/fonts/Poppins/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-poppins'
});
// const montserrat = Montserrat({
//   subsets: ['latin'],
//   variable: '--font-montserrat',
// });
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
=======
import { Poppins, Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/sidebar";
import { NextIntlClientProvider } from "next-intl";
import requestConfig from "@/src/i18n/request"; // <= récupère locale + messages

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
>>>>>>> internationalisation

export const metadata: Metadata = {
  title: "Fare Calculator",
  description: "Internationalized Fare Calculator App",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  // 🔥 On récupère locale + messages depuis /src/i18n/request.ts
  const { locale, messages } = await requestConfig({
    locale: params.locale,
    requestLocale: Promise.resolve(undefined)
  });

  return (
<<<<<<< HEAD
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
        <head />
        <body className=" text-black text-[16px] lg:text-[20px] sm:text-[16px] md:text-[16px] bg-gray-200 dark:bg-gray-800">
=======
    <html
      lang={locale}
      className={`${font.variable} ${montserrat.variable} ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body className="text-black text-[16px] lg:text-[20px] sm:text-[16px] md:text-[16px] bg-gray-200 dark:bg-gray-800">
        <NextIntlClientProvider locale={locale} messages={messages}>
>>>>>>> internationalisation
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Ton menu latéral reste */}
            {/* <Sidebar /> */}

            {/* Le contenu */}
            <main>{children}</main>

            {/* Toaster global */}
            <Toaster position="top-left" reverseOrder={false} />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
