import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next"
import { Poppins, JetBrains_Mono } from "next/font/google";
import { cn } from "~/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Pushup - Habit Tracker",
  description: "Build habits and cultivate a new lifestyle",
}


const poppins = Poppins({
  subsets:["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-poppins",

})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(poppins.className, jetbrainsMono.variable)} suppressHydrationWarning>
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
