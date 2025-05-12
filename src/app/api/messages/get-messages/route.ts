import { getServerSession } from "next-auth";
import { userModel } from "@/models/user";
import { dbConnection } from "@/lib/dbConnection";
import { authOptions } from "../../auth/[...nextauth]/options";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

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

     const messages = await   userModel.aggregate([
            {
                $match: {
                  _id: Types.ObjectId.createFromHexString(session.user.id.toString())
                }
              },
             {$group: {
              _id: null,
              messages: {$push: "$message"},
              isMessageAccepted: {$push: "$isMessageAccepted"}
             }},

            {

              $project: {   messages:1, isMessageAccepted:1}
            }
          ]);

          console.log(messages)
          if(messages.length === 0) {
            return NextResponse.json({
                success: false,
                message: "User not found",
                statusCode: 404,
            });
        }

        if(!messages[0].isMessageAccepted) {
            return NextResponse.json({
                success: false,
                message: "Message not accepted",
                statusCode: 400,
            });
        }


        return NextResponse.json({
            success: true,
            message: "Messages retrieved successfully",
            messages:  messages[0].messages[0],
            statusCode: 200,
        });
    } catch (error: unknown) {
       if(error instanceof Error) {
        return NextResponse.json({
            success: false,
            message: `Error during retrieving messages: ${error.message}`,
            statusCode: 500,
        });
       }
       return NextResponse.json({
            success: false,
            message: "Error during retrieving messages",
            statusCode: 500,
        });
    }
 }