"use client";

import { Button } from "~/components/ui/button";

import { authClient } from "~/lib/auth-client";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "~/components/ui/card";

function SignInContent() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  return (

        <main className="min-h-screen relative w-full bg-black flex flex-col items-center justify-center overflow-hidden py-6 md:py-12" role="main" aria-labelledby="page-title">
        
      <header className="flex flex-col gap-4 absolute md:top-10 top-6 items-center md:items-start px-4 md:px-0">
        <Link
              prefetch={true}
              className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
              href="/"
            >
          <span className="sr-only">Home</span>
        </Link>
          <h1 id="page-title" className="text-2xl sm:text-3xl md:text-4xl tracking-wide text-foreground font-semibold text-center md:text-left">Welcome to PushUp</h1>

      </header>
    <section aria-labelledby="auth-heading" className="flex items-center justify-center w-full px-4 mt-8 md:mt-0">
      <Card asChild>
        <CardContent>
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg space-y-6" role="region" aria-labelledby="auth-heading">
          <h2 id="auth-heading" className="sr-only">Sign in options</h2>
     
    <Button
      variant="outline"
      className={cn("w-full gap-2")}
      aria-label="Sign in with Google"
      aria-busy={loading}
      disabled={loading}
      onClick={async () => {
        try {
          await authClient.signIn.social(
            {
              provider: "google",
              callbackURL: returnTo ?? "/profile",
            },
            {
              onRequest: () => {
                setLoading(true);
              },
              onResponse: () => {
                setLoading(false);
              },
              onError: (ctx) => {
                setLoading(false);
                console.error("Sign-in failed:", ctx.error);
              },
            },
          );
        } catch (error) {
          setLoading(false);
          console.error("Authentication error:", error);
          // Consider adding toast notification for user feedback
          toast.error("Oops, something went wrong", {
            duration: 5000,
          });
        }
      }}
      >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0.98em"
        height="1em"
        viewBox="0 0 256 262"
        aria-hidden="true"
        focusable="false"
        >
        <path
          fill="#4285F4"
          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          ></path>
        <path
          fill="#34A853"
          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          ></path>
        <path
          fill="#FBBC05"
          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
          ></path>
        <path
          fill="#EB4335"
          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          ></path>
      </svg>
      Login with Google
    </Button>
     
    <footer className="text-xs text-center text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link
            href="/terms-of-service"
            className="underline hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="underline hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
        </footer>
        </div>
        </CardContent>
      </Card>

    </section>

    </main>
  );
}

export default function SignIn() {
  return (
    <Suspense
    fallback={
        <div className="flex flex-col justify-center items-center w-full h-screen">
          <div className="max-w-md w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg h-96"></div>
        </div>
      }
      >
      <SignInContent />
    </Suspense>
  );
}
      