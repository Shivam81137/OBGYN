export { auth as middleware } from "@/auth";

/**
 * Route Protection Middleware
 *
 * Protects all routes except public ones (landing, auth, API, static assets).
 * NextAuth v5 middleware automatically redirects unauthenticated users
 * to the signIn page defined in the auth config.
 *
 * TODO: Add role-based route protection:
 * - /admin/* → only ADMIN role
 * - /student/* → only STUDENT role
 * - /doctor/* → only DOCTOR role
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - API routes for auth
     * - Landing page
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api/auth|$).*)",
  ],
};
