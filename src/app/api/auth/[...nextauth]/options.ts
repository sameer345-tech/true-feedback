import { sendEmailVerification } from "@/helper/sendEmailverificaton";
import { dbConnection } from "@/lib/dbConnection";
import { userModel } from "@/models/user";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";

 export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
            email: { label: "Email", type: "text", placeholder: "Enter your email" },
            password: { label: "Password", type: "password" },
            userName: { label: "User name", type: "text", placeholder: "Enter your user name" }
            },
          async  authorize (credentials: Record<"email" | "password" | "userName", string> | undefined) {
            try {
                if(!credentials?.email.trim() || !credentials?.password || !credentials?.userName) {
                    throw new Error("Credentials are required")
                }
             await   dbConnection()
             const User = await userModel.findOne({email: credentials?.email , userName: credentials?.userName});
             if(!User) {
                throw new Error("User not found")
             }

              const isValidPassword = await bcrypt.compare(credentials.password, User.password)

              if(!isValidPassword) {
                throw new Error("Password is incorrect")
              };


              if(!User.isverified) {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const emailVerification = await sendEmailVerification(credentials.email.trim(), User.userName,  otp);

                if (!emailVerification.success) {
                    throw new Error(emailVerification.message);
                }
                const expiryDate = new Date();
                expiryDate.setMinutes(expiryDate.getMinutes() + 10);

                User.verifyCode = otp;
                User.verifyCodeExpiry = expiryDate;
                await User.save();
                throw new Error("Verification code sent to your email check your inbox.");

             }
               const user = {
                id: User._id as string,
                email: User.email,
                name: User.userName,
                isVerified: User.isverified,
                isMessageAccepted: User.isMessageAccepted
              }
              return user;

            } catch (error: unknown) {
                if(error instanceof Error) {
                    throw new Error(error.message)
                }
                throw new Error(String(error))
            }
          }
        })
    ],


   session: {
    strategy: "jwt",
    maxAge: 259200
  },

  callbacks: {
   async jwt ({token, user}) {
          if(user) {
            token.sub = user.id
            token.name = user.name
            token.email = user.email
            token.isVerified = user.isVerified;
            token.isMessageAccepted = user.isMessageAccepted

          }
          return token
    },

    async session  ({session,token}) {
        const userSession = session.user
        if(userSession) {
            userSession.id = token.sub
            userSession.email  = token.email as string
            userSession.name = token.name  as string
            userSession.isVerified = token.isVerified as boolean
            userSession.isMessageAccepted = token.isMessageAccepted as boolean
        }
        return session
    }
   },


   pages: {
    signIn: "/login",
    error: "/login"
   },

   secret: process.env.NEXTAUTH_SECRET,
  }