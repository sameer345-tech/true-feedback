import { messageI } from "@/models/message";

export interface ApiResponse{
    success: boolean,
    message: string,
    messages?: messageI[],
    isMessageAccepted?: boolean,
    statusCode?: number

}