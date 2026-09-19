import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, files with an extension and the per-locale
  // image routes (which must not be redirected by the "as-needed" prefix rule).
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*|.*opengraph-image|.*twitter-image).*)",
  ],
};
