import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";

/**
 * NextAuth v5 (Auth.js) Configuration
 *
 * Uses JWT strategy for session management — optimal for
 * multi-tenant B2B where database session lookups would add latency.
 *
 * The Credentials provider is a placeholder for institutional login.
 * In production, replace with your institution's SSO/SAML provider
 * or add Google/Microsoft OAuth for medical college email domains.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [
    /**
     * Credentials Provider — Placeholder
     *
     * TODO: Replace or supplement with:
     * - Google OAuth (restrict to college email domains)
     * - Microsoft Azure AD (for institutional SSO)
     * - Custom SAML provider for enterprise clients
     */
    Credentials({
      name: "Institutional Login",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "student@aiims.edu",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        // TODO: Implement proper credential verification
        // 1. Validate input with zod
        // 2. Look up user by email
        // 3. Verify password hash (bcrypt)
        // 4. Return user object or null

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Placeholder: In production, verify against database
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          include: { organization: true },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        // TODO: Verify password with bcrypt
        // const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        // if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * JWT Callback
     * Embeds role and organizationId into the JWT for
     * authorization checks without database queries.
     */
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { role: true, organizationId: true },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.organizationId = dbUser.organizationId;
        }
      }
      return token;
    },
    /**
     * Session Callback
     * Exposes role and organizationId to the client session.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string | null;
      }
      return session;
    },
  },
});
