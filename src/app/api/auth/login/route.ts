import { NextResponse } from "next/server";
import { signinSchema } from "@/schemas/signinSchema";
import { dbConnection } from "@/lib/dbConnection";
import { userModel } from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    const validation = signinSchema.safeParse({email, password});

    if (!validation.success) {
      const errors = validation.error.format();
      return NextResponse.json(
        {success: false, message: errors},
        { status: 400 }
      );
    }

    await dbConnection();
    const user = await userModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!user.isverified) {
      return NextResponse.json({ error: "Please verify your email first" }, { status: 403 });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.userName,
      },
      process.env.NEXTAUTH_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    const res = NextResponse.json({
        success: true,
      message: "Login successful",
      statusCode: 200,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

