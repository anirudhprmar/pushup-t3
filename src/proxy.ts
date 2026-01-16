import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = [
  "/profile",
  "/habits",
  "/tasks",
  "/goals",
  "/weekly-goals",
  "/leaderboard",
  "/notifications",
  "/settings",
];

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (sessionCookie && pathname === "/login") {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/profile",
    "/habits",
    "/tasks",
    "/goals",
    "/weekly-goals",
    "/leaderboard",
    "/notifications",
    "/settings",
  ],
};
