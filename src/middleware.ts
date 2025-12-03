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

  if (sessionCookie && ["/login"].includes(pathname)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!sessionCookie && pathname.startsWith("/home")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/login","/home","/leaderboard","/accountability","/notifications"] 
};
