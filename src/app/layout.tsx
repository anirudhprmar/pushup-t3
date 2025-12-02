import "~/styles/globals.css";

import { type Metadata } from "next";
import { Crimson_Pro } from "next/font/google";
import { Lato } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next"



export const metadata: Metadata = {
  title: "Pushup - Habit Tracker",
  description: "Build habits and cultivate a new lifestyle",
}

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson-pro",
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${lato.className} ${crimsonPro.className}`} suppressHydrationWarning>
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
