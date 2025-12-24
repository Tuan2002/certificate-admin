import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./middlewares";

export function middleware(request: NextRequest) {
  const authResult = withAuth(request);
  if (authResult) return authResult;

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif|.*\\.ico|.*\\.webp).*)',
  ],
}
