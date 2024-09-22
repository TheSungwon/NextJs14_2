import NextAuth from "next-auth/next";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomBytes, randomUUID } from "crypto";
import clientPromise from "@/lib/mongodb";

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

      async authorize(credentials, req) {
        console.log(credentials, "@@@@@@@@@@");
        // If no error and we have user data, return it
        const client: unknown = await clientPromise;
        const db = client.db("demo_nextauth") as unknown;
        // Return null if user data could not be retrieved

        const user = await db
          .collection("users")
          .findOne({ email: credentials?.email });

        const bcrypt = require("bcrypt");
        if (bcrypt.compareSync(credentials?.password, user?.password)) {
          return {
            id: user?._id.toString(),
            email: user?.email,
          };
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
