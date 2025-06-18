import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import prisma from "@/app/db";
import bcrypt from "bcryptjs";

// Type declarations
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    firstname?: string | null;
  }
}

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password,
        );
        if (!isValid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.firstname,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    /* If a user logs in via Google/GitHub and their email already exists → it links that provider to the existing user.
    On re-login, the user is found correctly via their linked account. */

    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        if (!user.email) return false;
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email ?? undefined,
          },
        });

        if (existingUser) {
          const linkedAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account?.provider,
              providerAccountId: account?.providerAccountId,
            },
          });

          if (!linkedAccount) {
            if (!account?.provider) return false;
            // Link the OAuth Account to existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account?.provider,
                providerAccountId: account?.providerAccountId,
                type: account.type,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
              },
            });
          }
        }
      }
      return true; // Allow-sign-in
    },

    async jwt({ user, token }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          firstname: user.name,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        // eslint-disable-next-line no-param-reassign
        session.user.email = token.email;
        // eslint-disable-next-line no-param-reassign
        session.user.name = token.firstname;
        // eslint-disable-next-line
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
