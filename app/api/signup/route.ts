import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// eslint-disable-next-line
export async function POST(req: NextRequest) {
  const { firstname, lastname, email, password } = await req.json();

  if (!firstname || !lastname || !email || !password) {
    return NextResponse.json(
      {
        message: "All fields are required",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        {
          status: 409,
        },
      );
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 5);

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "You have successfully signed up",
        user,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error signing user!",
        error: err,
      },
      {
        status: 500,
      },
    );
  }
}
