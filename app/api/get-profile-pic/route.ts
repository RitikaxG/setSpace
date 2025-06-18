import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user.email) {
    return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({
      message: `Error getting user`,
      error: err,
    });
  }
}
