import {z} from "zod"

 export const signinSchema = z.object({
    userName: z.string().min(4, "Username must be at least 4 characters").max(15, "Username must be at most 15 characters"),
    email: z.string().email({message: "Please enter a valid email address"}).toLowerCase().trim(),
    password: z.string().min(8, "Password must be at least 8 characters").max(20, "Password must be at most 20 characters"),

})