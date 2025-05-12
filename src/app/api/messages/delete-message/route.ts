import { dbConnection } from "@/lib/dbConnection";
import { messageModel } from "@/models/message";
import mongoose, { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { userModel } from "@/models/user";


export async function DELETE (req: NextRequest) {
    
    const {id} =  await req.json();
    if(!isValidObjectId(id)) {
      return  NextResponse.json({
            success: false,
            message: "invalid message id.",
            statusCode: 400
        })
    }

    const session = await getServerSession(authOptions)
    if( !session || !session.user  ) {
       return NextResponse.json({
            success: false,
            message: "Unauthorized request.",
            statusCode: 400
        })
    }


    try {
        await dbConnection()
     const deletedMessage =   await userModel.findOneAndUpdate({_id: session?.user?.id},{
        $pull: {
            message: { _id:  id.toString() }
        }
     })
     if(!deletedMessage) {
      return  NextResponse.json({
            success: false,
            message: "Message not found.",
            statusCode: 400
        })
     };

     
   return  NextResponse.json({
        success: true,
        message: "Message deleted successfully.",
        statusCode: 200
    })
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Internal server error during deletion of message." });

    }

}