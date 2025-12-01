import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next"



export const metadata: Metadata = {
  title: "Pushup - Habit Tracker",
  description: "Build habits and cultivate a new lifestyle",
}

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <Providers>
        <TRPCReactProvider>{children}
          <Toaster/>
          <Analytics />
        </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
