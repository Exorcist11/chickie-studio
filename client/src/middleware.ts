import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, localePrefix, Locale } from "./i18n/navigation";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  localeDetection: false,
});


export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle invalid 2-letter locale prefix (e.g. /fr/products -> redirect to /vi/products)
  const segments = pathname.split("/").filter(Boolean);
  if (
    segments.length > 0 &&
    segments[0].length === 2 &&
    !locales.includes(segments[0] as Locale)
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/" + [defaultLocale, ...segments.slice(1)].join("/");
    return NextResponse.redirect(redirectUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
