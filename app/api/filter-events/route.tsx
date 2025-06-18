import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db";
// eslint-disable-next-line import/prefer-default-export
export async function POST(req: NextRequest) {
  const data = await req.json();
  // eslint-disable-next-line
  const whereClause: any = {};
  if (data.location) {
    whereClause.location = {
      contains: data.location,
      mode: "insensitive",
    };
  }

  if (data.date) {
    whereClause.date = new Date(data.date);
  }

  if (data.title) {
    whereClause.title = {
      contains: data.title,
      mode: "insensitive", // allows case insensitive search
    };
  }

  try {
    const filteredEvents = await prisma?.event.findMany({
      where: whereClause,
    });

    return NextResponse.json(filteredEvents);
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error filtering events",
        error: err,
      },
      {
        status: 500,
      },
    );
  }
}
