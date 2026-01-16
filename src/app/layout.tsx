import "~/styles/globals.css";
import dynamic from "next/dynamic";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { Providers } from "./providers";
import { cn } from "~/lib/utils";
import { Instrument_Serif, Inter } from "next/font/google";

const PostHogPageView = dynamic(() => import("~/providers/PostHogPageView"), { ssr: true });



const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const instrumentSerif = Instrument_Serif({ subsets: ['latin'],weight:'400' ,variable: '--font-instrumentalSerif' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pushup.life"),
  title: {
    default: "Pushup - Build Habits That Last | 365-Day Habit Tracker",
    template: "%s | Pushup",
  },
  description: "Transform your life with the all-or-nothing habit tracker. Track 365 days of consistency, visualize progress, and build habits that truly last.",
  keywords: [
    "habit tracker",
    "365-day challenge", 
    "habit building",
    "consistency tracking",
    "daily habits",
    "productivity app",
    "streak counter",
    "habit formation",
    "self improvement",
    "goal tracking",
  ],
  authors: [{ name: "Pushup" }],
  creator: "Pushup",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Pushup",
    title: "Pushup - Build Habits That Last",
    description: "Transform your life with the all-or-nothing habit tracker. Track 365 days of consistency and build habits that truly last.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Pushup - 365-Day Habit Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pushup - Build Habits That Last",
    description: "Transform your life with the all-or-nothing habit tracker.",
    images: ["/og-default.png"],
    creator: "@pushupapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
}


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(inter.variable, instrumentSerif.variable)} suppressHydrationWarning>
      <body>
        <Providers>
        <TRPCReactProvider>
          <PostHogPageView />
            {children}
          <Toaster/>
        </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
