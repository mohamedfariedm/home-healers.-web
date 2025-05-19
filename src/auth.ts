import NextAuth, {
  AuthError,
  CredentialsSignin,
  DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";

// Custom error classes
class UserNotRegisteredError extends CredentialsSignin {
  code = "UserNotRegistered";
}

class EmailNotVerifiedError extends CredentialsSignin {
  code = "EmailNotVerified";
}

class InvalidCredentialsError extends CredentialsSignin {
  code = "InvalidCredentials";
}

// Extend the built-in types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role?: string;
    };
  }
  interface User {
    //@ts-ignore
    id: string;
    //@ts-ignore
    email: string;
    role?: string;
  }
}

interface Session2 {
  user: {
    id: string;
    email: string;
    role?: string;
    /**
     * By default, TypeScript merges new interface properties and overwrites existing ones.
     * In this case, the default session user properties will be overwritten,
     * with the new ones defined above. To keep the default session user properties,
     * you need to add them back into the newly declared interface.
     */
  } & DefaultSession["user"];
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  //...authConfig,

  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("loggs-jwt-user", user);
      console.log("loggs-jwt-token", token);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("loggs-session-session", session);
      console.log("loggs-session-token", token);
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string | undefined;
      }
      console.log("loggs-session-session-after", session);

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          try {
            const user = await fetchUser(email, password);
            console.log("loggs-authorize-user", user);

            return user;
          } catch (error) {
            console.log("loggs-authorize-error", error);
            if (error instanceof Error) {
              console.log("error.inside", error.message);
              switch (error.message) {
                case "UserNotRegistered":
                  throw new UserNotRegisteredError();
                case "EmailNotVerified":
                  throw new EmailNotVerifiedError();
                case "InvalidCredentials":
                  throw new InvalidCredentialsError();
                default:
                  throw new CredentialsSignin();
              }
            }
            throw new CredentialsSignin();
          }
        }

        throw new CredentialsSignin();
      },
    }),
  ],
});

async function fetchUser(email: string, password: string) {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/custom-auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log("loggs-fetch-errorData", errorData);

    throw new Error(errorData.error);
  }

  const data = await response.json();
  return { id: data.token, email: data.user.email, role: data.user.role };
}
