import {z} from "zod"

 export const sendMessageSchema = z.object({
    userName: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 15 characters"),
    content: z.string().min(2, "Message must be at least 2 characters").max(300, "Message must be at most 300 characters")
});