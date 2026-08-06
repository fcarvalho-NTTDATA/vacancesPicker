import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const { pathname } = nextUrl;

      const isAdminRoute = pathname.startsWith("/admin");
      const isFeriasRoute = pathname.startsWith("/ferias");
      const isLoginPage = pathname.startsWith("/login");

      if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(
            new URL(role === "ADMIN" ? "/admin" : "/ferias", nextUrl)
          );
        }
        return true;
      }

      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        if (role !== "ADMIN") {
          return Response.redirect(new URL("/ferias", nextUrl));
        }
        return true;
      }

      if (isFeriasRoute) {
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
