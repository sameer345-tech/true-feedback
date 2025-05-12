import {z} from "zod"

export const userNameValidation = z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 15 characters");

export const emailValidation = z.string().email({message: "Please enter a valid email address"});

export const passwordValidation = z.string().min(8, "Password must be at least 8 characters").max(20, "Password must be at most 20 characters");

export const signupSchema = z.object({
    userName: userNameValidation,
    email: emailValidation,
    password: passwordValidation
});