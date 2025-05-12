import { userModel } from "@/models/user";
import { dbConnection } from "@/lib/dbConnection";
import { userNameValidation } from "@/schemas/signupSchema";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const userNameQuerySchema = z.object({
    userName: userNameValidation
})

export async function GET(req:NextRequest) {

    await dbConnection()
    try {
        const {searchParams} = new URL(req.url);
        const queryParams = {
            userName: searchParams.get("userName")
        }
        // validate userName using zod
        const result = userNameQuerySchema.safeParse(queryParams);
        // console.log(result)
        if(!result.success) {
            const userNameError = result.error.format().userName?._errors || [];
            return NextResponse.json({
                success: false,
                message: userNameError?.length > 0 ? userNameError.join(",") : "invalid query parameter.",
                statusCode: 400
            });
        }

        const {userName} = result.data;

     const existingUser = await userModel.findOne({userName});
     if(existingUser) {
        return NextResponse.json({
            success: false,
            message: "User name is already taken. Please use a different username",
            statusCode: 400
        })
     }

       return NextResponse.json({
        success: true,
        message: `User name is available.`,
        statusCode: 200
    })

    } catch (error: unknown) {
        if(error instanceof Error) {
            return NextResponse.json({
                success: false,
                message: error.message || "Internal server error",
                statusCode: 500
            })
        }
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            statusCode: 500
        })
    }
}

