import { dbConnection } from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { messageSchema } from "@/schemas/messageSchema";
import { userModel } from "@/models/user";
import { messageI } from "@/models/message";
export async function POST(req: NextRequest) {
  const { username, content } = await req.json();
  await dbConnection();
  try {
    const validateMessage = messageSchema.safeParse({ content });
    if (!validateMessage.success) {
      const messageError = validateMessage.error.format().content?._errors || [];
      return NextResponse.json({
        success: false,
        message: messageError?.length > 0 ? messageError.join(",") : "invalid message",
        statusCode: 400,
      });
    }
    const user = await userModel.findOne({userName: username});
    if(!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        statusCode: 400,
      });

    }

    if(!user?.isMessageAccepted) {
      return NextResponse.json({
        success: false,
        message: "User not accepting messages.",
        statusCode: 404,
      });
    }

    const message : messageI = {
      content,
      createdAt: new Date()
    }

    user.message.push(message );
    user.save()
    
    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
      statusCode: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Error during creating message: ${error.message}`,
      statusCode: 500,
    });
  }
}
