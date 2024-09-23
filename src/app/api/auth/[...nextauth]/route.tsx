import NextAuth from "next-auth/next";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomBytes, randomUUID } from "crypto";
import clientPromise from "@/lib/mongodb";
import { MongoClient } from "mongodb";
import * as bcrypt from "bcrypt";
const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "a",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        console.log(credentials, "@@@@@@@@@@");
        // If no error and we have user data, return it
        const client = (await clientPromise) as MongoClient;
        const db = client.db("demo_nextauth");
        // Return null if user data could not be retrieved

        const user = await db
          .collection("users")
          .findOne({ email: credentials?.email });

        if (bcrypt.compareSync(credentials?.password ?? "", user?.password)) {
          return {
            id: user?._id.toString(), // Convert id to string
            email: user?.email,
          } as never;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = { ...token };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
