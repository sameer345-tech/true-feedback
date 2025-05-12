import NextAuth, { DefaultSession } from "next-auth";
import mongoose from "mongoose";
declare module "next-auth" {
    interface Session {
        user: {
            id: mongoose.Types.ObjectId<string>
            email: string;
            name: string;
            isVerified: boolean;
            isMessageAccepted: boolean
        } & DefaultSession["user"]
    } 
   
    interface User {
        id: mongoose.Types.ObjectId<string>
        email: string;
        name: string;
        isVerified: boolean;
        isMessageAccepted: boolean
    } 
    
}