import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { rlGlobal, getClientIP } from "~/lib/ratelimit";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;


  // Global API rate limit (per IP)
  if (pathname.startsWith("/api")) {
    const ip = getClientIP(request);
    const key = `${ip}:${pathname}`;
    const { success, reset, remaining, limit } = await rlGlobal.limit(key);

    if (!success) {
      const res = NextResponse.json(
        { error: "Too many requests" },
        { status: 429 },
      );
      if (reset) res.headers.set("Retry-After", Math.max(0, Math.ceil((reset - Date.now()) / 1000)).toString());
      res.headers.set("X-RateLimit-Limit", String(limit ?? 0));
      res.headers.set("X-RateLimit-Remaining", String(remaining ?? 0));
      return res;
    }
  }

  if (sessionCookie && ["/sign-in", "/sign-up"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!sessionCookie && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/sign-in", "/sign-up"] //later add all the dashboard routes
};
