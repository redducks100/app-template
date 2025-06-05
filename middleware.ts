import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const isAuthRoute = (request: NextRequest) => {
  return ["/sign-in", "/sign-up"].includes(request.nextUrl.pathname);
};

const isPublicRoute = (request: NextRequest) => {
  return !isAuthRoute(request) && !isProtectedRoute(request);
};

const isProtectedRoute = (request: NextRequest) => {
  return ["/dashboard", "/create-org", "/select-org"].includes(
    request.nextUrl.pathname,
  );
};

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (sessionCookie && isAuthRoute(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!sessionCookie && !isPublicRoute(request) && !isAuthRoute(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
