import { getServerSession } from "next-auth";
import { userModel } from "@/models/user";
import { dbConnection } from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  const session =  await getServerSession(authOptions);
 if(!session || !session.user) {
    return NextResponse.json({
      success: false,
      message: "Unauthorized",
      statusCode: 401,
    });
  }
  await dbConnection();
  try {
    const { isMessageAccepted } = await req.json();
    const updatedMessageAccepted = await userModel.findOneAndUpdate({
      _id: session.user.id
    },
      {
       $set: {
        isMessageAccepted: isMessageAccepted,
        
       },
      },

      {new: true}
    )
    if (!updatedMessageAccepted) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        statusCode: 404,
      });
    }
    return NextResponse.json({
      success: true,
      isMessageAccepted: updatedMessageAccepted.isMessageAccepted,
      message: updatedMessageAccepted.isMessageAccepted ? "Message accepted successfully" : "Message rejected successfully",
      statusCode: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Error during accepting message: ${error.message}`,
      statusCode: 500,
    });
  }
}

export async function GET() {
  
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({
      success: false,
      message: "Unauthorized",
      statusCode: 401,
    });
  }
  await dbConnection();
  try {
    const user = await userModel.findById(session.user.id );
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        statusCode: 404,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Message acceptence status retrieved successfully",
      isMessageAccepted: user?.isMessageAccepted,
      statusCode: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Error during retrieving message acceptence status: ${error.message}`,
      statusCode: 500,
    });
  }
}
