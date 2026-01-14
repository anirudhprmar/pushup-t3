import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next"
import { cn } from "~/lib/utils";
import { Instrument_Serif, Inter } from "next/font/google";


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const instrumentSerif = Instrument_Serif({ subsets: ['latin'],weight:'400' ,variable: '--font-instrumentalSerif' });

export const metadata: Metadata = {
  title: "Pushup - Habit Tracker",
  description: "Build habits and cultivate a new lifestyle",
}


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(inter.variable, instrumentSerif.variable)} suppressHydrationWarning>
      <body>
        <Providers>
        <TRPCReactProvider>
            {children}
          <Toaster/>
          <Analytics />
        </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
