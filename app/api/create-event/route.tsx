import prisma from "@/app/db";
import { Prisma } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const hour = Number(formData.get("hour"));
  const minute = Number(formData.get("minute"));
  const duration = formData.get("duration") as string;
  const location = formData.get("location") as string;
  const image = formData.get("image") as File;

  if (
    !title ||
    !description ||
    !date ||
    typeof hour !== "number" || // This way '0' will be accepted ( In Javascript O is falsy and !0 becomes true)
    Number.isNaN(hour) ||
    typeof minute !== "number" ||
    Number.isNaN(minute) ||
    !duration ||
    !location ||
    !image
  ) {
    return NextResponse.json(
      {
        message: "All fields are required",
      },
      {
        status: 400,
      },
    );
  }

  // Convert image to binary
  const bytes = await image.arrayBuffer();

  // NodeJS compatible buffer
  const buffer = Buffer.from(bytes);

  // Unique name for file
  const fileName = `${Date.now()}-${image.name}`;

  // Save path
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);

  // Save file locally
  await writeFile(filePath, buffer);

  // URL to serve image later
  const imageUrl = `/uploads/${fileName}`;

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        hour,
        minute,
        duration,
        location,
        image: imageUrl,
      },
    });

    return NextResponse.json(
      {
        message: "You have successfully signed up",
        newEvent,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json({
        message: "Event already exists with this title",
      });
    }
    return NextResponse.json(
      {
        message: "Error creating new event!",
        error: err,
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    const allEvents = await prisma.event.findMany();
    return NextResponse.json(allEvents, {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: `Error fetching events ${err}`,
      },
      {
        status: 500,
      },
    );
  }
}
