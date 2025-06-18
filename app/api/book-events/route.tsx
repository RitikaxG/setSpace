import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import prisma from "../../db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user.email) {
    return NextResponse.json(
      {
        message: "Authorization required",
      },
      {
        status: 401,
      },
    );
  }

  const data = await req.json();
  // console.log(session.user.email);
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user.email,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "User not found in database",
      },
      { status: 404 },
    );
  }

  try {
    const eventExists = await prisma.booking.findFirst({
      where: {
        eventId: data.eventId,
        userId: user.id,
      },
    });

    if (eventExists) {
      return NextResponse.json(
        {
          message: "Event already booked",
        },
        {
          status: 400,
        },
      );
    }
    await prisma.booking.create({
      data: {
        eventId: data.eventId,
        userId: user.id,
      },
    });
    return NextResponse.json(
      {
        message: "Event booked successfully",
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: `Error booking event ${err}`,
        error: err instanceof Error ? err.message : String(err),
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    const bookedEvents = await prisma.booking.findMany({
      include: {
        event: true,
      },
    });

    return NextResponse.json(bookedEvents, { status: 200 });
  } catch (err) {
    console.log(`Error fetching booked events ${err}`);
    return NextResponse.json(
      {
        message: `Failed to fetchbooked events`,
      },
      {
        status: 500,
      },
    );
  }
}
