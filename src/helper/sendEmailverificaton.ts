import EmailTemplate from "@/components/EmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/resend";
export async  function sendEmailVerification  (email: string, userName: string, otp: string ): Promise <ApiResponse>{
 
  try {
       const emailSent =  await resend.emails.send({
            from: 'verification@sameer-dev.online',
            to: email,
            subject: ' Mystery Message verification code ',
            react: EmailTemplate({ userName, email, otp }),
          });
          if(!emailSent?.data?.id) {
            return { success: false, message: "Error sending verification email" ,statusCode: 500};
          }
          return { success: true, message: "Email sent successfully" };

    } catch (emailError) {
        console.log("Error sending verification email:", emailError);
        return { success: false, message: "Error sending verification email", statusCode: 500 };
    }
}