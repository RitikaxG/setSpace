import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/signup", req.url)); // NextResponse.redirect() — requires an absolute URL.
  }
  return NextResponse.next();
}

// Apply middleware only on specific routes
export const config = {
  matcher: ["/create-event", "/my-booked-events"],
};
