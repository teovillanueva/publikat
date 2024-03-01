import { authMiddleware } from "@clerk/nextjs";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales, localePrefix } from "./config/i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export default authMiddleware({
  beforeAuth(request) {
    return intlMiddleware(request);
  },
  publicRoutes: [
    "/:locale",
    "/:locale/sign-in",
    "/:locale/sign-up",
    "/:locale/billboards",
  ],
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
