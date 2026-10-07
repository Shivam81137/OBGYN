import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Role-Based Route Protection Middleware
 *
 * Separation of concerns:
 *   /admin/*     → ADMIN role only  (redirects students to /dashboard)
 *   /dashboard   → STUDENT role only (redirects admins to /admin/dashboard)
 *   /login       → redirect already-signed-in users to their own dashboard
 *   everything else authenticated → allowed through
 *   unauthenticated on protected routes → /login
 */
export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role as string | undefined;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isStudentRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/study") ||
    nextUrl.pathname.startsWith("/tests") ||
    nextUrl.pathname.startsWith("/profile");
  const isLoginPage = nextUrl.pathname === "/login";

  // ── Already logged-in user hits /login ────────────────────────────────────
  if (isLoginPage && isLoggedIn) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ── Unauthenticated on protected route ────────────────────────────────────
  if (!isLoggedIn && (isAdminRoute || isStudentRoute)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── STUDENT tries to access /admin/* ──────────────────────────────────────
  if (isAdminRoute && isLoggedIn && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ── ADMIN tries to access student routes ──────────────────────────────────
  if (isStudentRoute && isLoggedIn && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets (images, icons, sw.js, manifest, etc.)
     * - API routes for auth
     * - Landing page (root /)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js|css)$|api/auth|^$).*)",
  ],
};
