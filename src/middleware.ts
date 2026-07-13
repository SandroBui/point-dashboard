import { auth } from "@/auth";
import { NextResponse } from "next/server";

function isAuthenticated(auth: { user?: { email?: string | null } | null } | null) {
  // Hollow/broken sessions (cookie present but no user) must NOT count as logged in.
  return Boolean(auth?.user?.email);
}

export default auth((req) => {
  const loggedIn = isAuthenticated(req.auth);
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") && !loggedIn) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (pathname === "/sign-in" && loggedIn) {
    return NextResponse.redirect(new URL("/dashboard/overview", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in"],
};
