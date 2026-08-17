import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Edge-side gate. Every authenticated surface is listed here; the pages and
 * route handlers behind them re-check authorisation server-side, because a
 * proxy matcher is a convenience, not a security boundary.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tutor/:path*",
    "/learn/:path*",
    "/cos/:path*",
    "/api/cos/:path*",
    "/mosh/:path*",
    "/api/mosh/:path*",
  ],
};
