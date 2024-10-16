import NextAuth, { AuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// import { randomBytes, randomUUID } from "crypto";
import mongoose from "@/lib/mongodb";
import * as bcrypt from "bcrypt";
import User from "@/models/User";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
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

        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        await mongoose.connection;

        const user = await User.findOne({ email: credentials?.email });
        console.log(user, "@@@@@nextauth");

        if (!user) {
          return null;
        }

        if (bcrypt.compareSync(credentials?.password ?? "", user?.password)) {
          return {
            id: user?._id.toString(),
            email: user?.email,
            role: user?.role || "admin",
          };
        }

        return null;
      },
    }),
  ],
  // session: {
  //   strategy: "jwt",
  //   maxAge: 30 * 24 * 60 * 60,
  //   generateSessionToken: () => {
  //     return randomUUID?.() ?? randomBytes(32).toString("hex");
  //   },
  // },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
