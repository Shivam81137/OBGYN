import { type DefaultSession } from "next-auth";

/**
 * NextAuth Type Augmentation
 *
 * Extends the default NextAuth types to include
 * custom properties (role, organizationId) on the session user.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      organizationId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    organizationId?: string | null;
  }
}
