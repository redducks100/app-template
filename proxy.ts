import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const locales = ["en", "ro"];
const defaultLocale = "en";

const isAuthRoute = (request: NextRequest) => {
  return ["/sign-in", "/sign-up"].includes(request.nextUrl.pathname);
};

const isPublicRoute = (request: NextRequest) => {
  return !isAuthRoute(request) && !isProtectedRoute(request);
};

const isProtectedRoute = (request: NextRequest) => {
  return ["/dashboard", "/create-org", "/select-org", "/account"].includes(
    request.nextUrl.pathname
  );
};

function detectLocaleFromHeader(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim().split("-")[0], q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .find((entry) => locales.includes(entry.lang));

  return preferred?.lang ?? defaultLocale;
}

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (sessionCookie && isAuthRoute(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!sessionCookie && !isPublicRoute(request) && !isAuthRoute(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Set locale cookie on first visit if not already set
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (!cookieLocale || !locales.includes(cookieLocale)) {
    const detectedLocale = detectLocaleFromHeader(request);
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", detectedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
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
