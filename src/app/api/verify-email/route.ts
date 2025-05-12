import { userModel } from "@/models/user";
import { dbConnection } from "@/lib/dbConnection";
import { verifySchema } from "@/schemas/verifySchema";
import { NextRequest, NextResponse } from "next/server";
import { userNameValidation } from "@/schemas/signupSchema";
export async function POST(req: NextRequest) {
  await dbConnection();
  try {
    const { userName, verifyCode } = await req.json();
    // Ensure verifyCode is a string
    const verifyCodeString = typeof verifyCode === 'string' ? verifyCode : String(verifyCode);
    if (!userName || !verifyCodeString) {
      return NextResponse.json({
        success: false,
        message: "UserName and verifyCode are required.",
        statusCode: 400,
      });
    }

    const validateUserName = userNameValidation.safeParse(userName);
    if (!validateUserName.success) {
      const userNameError = validateUserName.error.format()._errors || [];
      return NextResponse.json({
        success: false,
        message:
          userNameError.length > 0
            ? userNameError.join(",")
            : "invalid userName",
        statusCode: 400,
      });
    }
    const validateVerifyCode = verifySchema.safeParse({ verifyCode: verifyCodeString.trim() });
    console.log(validateVerifyCode?.error?.format()._errors);
    if (!validateVerifyCode.success) {
      return NextResponse.json({
        success: false,
        message: "Verification failed. invalid verify code.",
        statusCode: 400,
      });
    }

    const decodedUserName = decodeURIComponent(userName);

    const user = await userModel.findOne({ userName: decodedUserName });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        statusCode: 404,
      });
    }
    if (user.isverified) {
      return NextResponse.json({
        success: false,
        message: "User already verified",
        statusCode: 400,
      });
    }

    const validationVerifyCode = user?.verifyCode === verifyCodeString;

    const validateExpiryDate = new Date(user?.verifyCodeExpiry) > new Date();

    if (!validationVerifyCode || !validateExpiryDate) {
      return NextResponse.json({
        success: false,
        message:
          "Verification failed. invalid verify code or verify code is expired. Please resend again verify code",
        statusCode: 400,
      });
    }

    user.isverified = true;
    await user.save();
    return NextResponse.json({
      success: true,
      message: "Verification completed successfully",
      statusCode: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Email verification failed. Error: ${error.message}`,
      statusCode: 500
    });
  }
}
