import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Role-Based Route Protection Middleware (NextAuth v5)
 *
 * Guard rules:
 *   /admin/*     → ADMIN role only  (students → /dashboard)
 *   /dashboard,
 *   /study,
 *   /tests,
 *   /profile     → authenticated only (admins → /admin/dashboard)
 *   /login       → unauthenticated only (logged-in users → their dashboard)
 *   everything else (/, /api/*, static) → pass through
 */
export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role as string | undefined;

  const pathname = nextUrl.pathname;

  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/study") ||
    pathname.startsWith("/tests") ||
    pathname.startsWith("/profile");
  const isLoginPage = pathname === "/login";

  // ── Already signed-in user visits /login → bounce to their dashboard ──────
  if (isLoginPage && isLoggedIn) {
    const dest = role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // ── Unauthenticated access to protected route → /login ───────────────────
  if (!isLoggedIn && (isAdminRoute || isStudentRoute)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── STUDENT tries /admin/* → /dashboard ───────────────────────────────────
  if (isAdminRoute && isLoggedIn && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ── ADMIN tries student routes → /admin/dashboard ─────────────────────────
  if (isStudentRoute && isLoggedIn && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Run middleware on all paths EXCEPT:
     * - Static assets (_next/static, _next/image, favicon, images, fonts, sw.js)
     * - All API routes (auth handled by next-auth internally)
     * - Root landing page (/)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|js|css)$).*)",
  ],
};
