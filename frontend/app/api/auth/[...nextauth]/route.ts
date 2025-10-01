import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Get whitelisted admin emails from environment
const ADMIN_EMAILS =
  process.env.ADMIN_EMAILS?.split(",").map((email) =>
    email.trim().toLowerCase()
  ) || [];

console.log("🔐 Whitelisted admin emails:", ADMIN_EMAILS);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("👤 Sign-in attempt:", user.email);

      // Check if email is in whitelist
      if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        console.log("✅ Admin access granted:", user.email);
        return true;
      }

      console.log("❌ Admin access denied:", user.email);
      // Redirect to unauthorized page
      return "/unauthorized";
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.isAdmin = user.email
          ? ADMIN_EMAILS.includes(user.email.toLowerCase())
          : false;
        token.email = user.email || undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/unauthorized",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
