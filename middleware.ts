import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("_Secure-next-auth.session-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url)); // NextResponse.redirect() — requires an absolute URL.
  }
  return NextResponse.next();
}

// Apply middleware only on specific routes
export const config = {
  matcher: ["/create-event", "/my-booked-events"],
};
