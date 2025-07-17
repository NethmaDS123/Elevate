// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Skip middleware for next-auth session endpoints
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protect platform routes
  if (pathname.startsWith("/platform") && !token) {
    console.log("Redirecting to signin - No token found");
    return NextResponse.redirect(
      new URL(
        `/signin?callbackUrl=${encodeURIComponent(pathname)}`,
        request.url
      )
    );
  }

  // Redirect authenticated users away from signin page
  if (pathname.startsWith("/signin") && token) {
    console.log("Redirecting to dashboard - Token found");
    return NextResponse.redirect(
      new URL("/platform/features/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

// Add matcher to specify which paths middleware will run on
export const config = {
  matcher: ["/platform/:path*", "/signin"],
};
