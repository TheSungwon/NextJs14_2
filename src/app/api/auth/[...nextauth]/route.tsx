import NextAuth from "next-auth/next";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomBytes, randomUUID } from "crypto";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "a",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "a" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // If no error and we have user data, return it
        if (credentials?.username === "a") {
          return {
            id: "123",
            name: "John Doe",
            email: "jdoe@example.com",
            b: "dddddd",
          };
        }
        // Return null if user data could not be retrieved
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
      return token;
    },
  },
});

export { handler as GET, handler as POST };
