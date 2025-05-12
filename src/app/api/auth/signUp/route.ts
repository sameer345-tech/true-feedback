import { dbConnection } from "@/lib/dbConnection";
import { userModel } from "@/models/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { sendEmailVerification } from "@/helper/sendEmailverificaton";

export async function POST(req: NextRequest) {
    const { userName, email, password } = await req.json();

    if (!userName || !email.trim() || !password) {
        return NextResponse.json({ success: false, message: "Credentials are required" });
    }

    try {
        await dbConnection();
       const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const existingUserVerified = await userModel.findOne( {
            userName,
            email, 
            isverified: true} );

        if (existingUserVerified) {
            return NextResponse.json({ success: false, message: "User already registered with this email address or user name." });
        }

        const existingUnverified = await userModel.findOne({ userName, email, isverified: false });

        if (existingUnverified) {
            // Resend verification email
            const emailVerification = await sendEmailVerification(email.trim(), userName,  otp);
            if (!emailVerification.success) {
                return NextResponse.json({ success: false, message: emailVerification.message });
            }
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + 10);

            existingUnverified.verifyCode = otp;
            existingUnverified.verifyCodeExpiry = expiryDate;
            await existingUnverified.save();

            return NextResponse.json({ success: true, message: "Verification email sent again successfully." });
        } else {
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + 10);

            const newUser = new userModel({
                userName,
                email,
                password,
                verifyCode: otp,
                verifyCodeExpiry: expiryDate,
                isverified: false,
                isMessageAccepted: true,
                message: []
            });

            await newUser.save();

            // Send verification email
            const emailVerification = await sendEmailVerification(email.trim(), userName,  otp);
            if (!emailVerification.success) {
                return NextResponse.json({ success: false, message: emailVerification.message });
            }

            return NextResponse.json({ success: true, message: "User registered successfully. Please verify your email" });
        }
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error." });
    }
}
