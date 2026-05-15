import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

// Hardcoded admin account - works without database
const ADMIN_ACCOUNT = {
  id: "admin-001",
  email: "ahmeddarkxx1@gmail.com",
  name: "Ahmed",
  password: "Ahmed2026",
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Check hardcoded admin account first (no database needed)
        if (
          credentials.email === ADMIN_ACCOUNT.email &&
          credentials.password === ADMIN_ACCOUNT.password
        ) {
          return {
            id: ADMIN_ACCOUNT.id,
            email: ADMIN_ACCOUNT.email,
            name: ADMIN_ACCOUNT.name,
          };
        }

        // Try database if not admin
        try {
          const prisma = (await import("@/lib/prisma")).default;
          const crypto = await import("crypto");
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user || !user.password) return null;

          const hashedPassword = crypto.createHash("sha256").update(credentials.password).digest("hex");
          if (hashedPassword !== user.password) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (e) {
          // Database not available, only admin account works
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
