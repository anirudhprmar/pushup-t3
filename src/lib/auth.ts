import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { db } from "~/server/db";
import { admin } from "better-auth/plugins";
import { magicLink } from "better-auth/plugins";
import { Resend } from "resend";
import { account, session, user, verification } from '~/server/db/schema';
import { env } from "~/env";

// Utility function to safely parse dates
function safeParseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  return new Date(value);
}

const resend = new Resend(env.RESEND_API_KEY);



export const auth = betterAuth({
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
  allowedDevOrigins: [env.NEXT_PUBLIC_APP_URL],
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60, // Cache duration in seconds
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }, _request) => {
        try {
          const { data, error } = await resend.emails.send({
            from: "Starter Kit <onboarding@resend.Starter Kit.top>",
            to: email,
            subject: "Your Magic Sign-In Link",
            html: `Click <a href="${url}">here</a> to sign in. This link will expire within 5 min.`,
          });
          if (error) {
            console.error("Resend error:", error);
            throw new Error("Failed to send magic link");
          }
          console.log("Magic link sent to:", email);
        } catch (error) {
          console.error("Magic link error:", error);
          throw error;
        }
      },
    }),
    admin(),
    nextCookies(),
  ],
});
