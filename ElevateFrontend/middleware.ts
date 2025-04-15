// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Protect platform routes
  if (pathname.startsWith("/platform") && !token) {
    return NextResponse.redirect(
      new URL(
        `/signin?callbackUrl=${encodeURIComponent(pathname)}`,
        request.url
      )
    );
  }

  // Redirect authenticated users away from signin page
  if (pathname.startsWith("/signin") && token) {
    return NextResponse.redirect(
      new URL("/platform/features/dashboard", request.url)
    );
  }

  return NextResponse.next();
}
