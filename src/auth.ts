import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

/**
 * NextAuth v5 (Auth.js) Configuration
 *
 * Uses JWT strategy so that `role` & `organizationId` travel with the
 * token — no extra DB round-trip per request for authorization checks.
 *
 * After sign-in the JWT callback reads the role stored during sign-up
 * and embeds it in the token → session → middleware can then guard:
 *   /admin/*   → ADMIN only
 *   /dashboard → STUDENT only
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
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          include: { organization: true },
        });

        if (!user || !user.hashedPassword) return null;

        // Verify the hashed password stored at sign-up
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!isPasswordValid) return null;

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
     * Embeds `role` and `organizationId` into the token once at sign-in.
     * These are used by middleware for route protection without DB queries.
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
     * Exposes `role` and `organizationId` to client-side session consumers.
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
