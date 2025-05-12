"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import React, { useEffect } from 'react'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signupSchema } from "@/schemas/signupSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"
import { Loader2, User, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

function SignUpPage() {
  const [userName, setUserName] = useState("");
  const [userNameMessage, setUserNameMessage] = useState("");
  const [validatingUserName, setValidatingUserName] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const debounced = useDebounceCallback(setUserName, 500);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    (async () => {
      if (userName) {
        setValidatingUserName(true);
        setUserNameMessage("")
        try {
          const response = await axios.get(`/api/check-userName-unique?userName=${userName} `)
          setUserNameMessage(response.data.message);
          setValidatingUserName(false)
        } catch (error) {
          setValidatingUserName(false)
          const axiousError = error as AxiosError<ApiResponse>
          setUserNameMessage(
            axiousError.response?.data?.message || "Error checking username."
          )
        }
      }
    })()
  }, [userName]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmiting(true);
    try {
      const result = signupSchema.safeParse(data);
      if (!result.success) {
        const errors = result.error.format();
        toast.error(errors.userName?._errors?.[0] || "", {
          position: "top-right"
        });
        return;
      }

      const response = await axios.post(`/api/auth/signUp`, result.data);
      if (!response.data.success) {
        setIsSubmiting(false)
        if (response.data.message === "User already registered with this email address or user name.") {
          toast.error(response.data.message, {
            position: "top-right",
          });
          router.replace("/sign-in")
        }
        else {
          toast.error(response.data.message, {
            position: "top-right",
          });
        }
        return
      }
      toast.success(response.data.message, {
        position: "top-right"
      });
      router.replace(`/verification/${userName}`);
      setIsSubmiting(false);
    } catch (error) {
      console.log(`error during sign up`, error);
      setIsSubmiting(false);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message || "An unexpected error occurred.", {
        position: "top-right"
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <motion.div 
        className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-6 lg:p-12 mt-16 md:mt-0"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">Join our community and start sharing anonymous feedback</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300 text-sm md:text-base">Username</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Choose a unique username"
                          {...field}
                          className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm md:text-base h-10 md:h-auto"
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                        />
                      </FormControl>
                    </div>
                    {validatingUserName && (
                      <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
                        <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-2 animate-spin" />
                        <span className="text-xs md:text-sm">Checking availability...</span>
                      </div>
                    )}
                    {userNameMessage && (
                      <div className={`flex items-center mt-1 ${userNameMessage === "User name is available." ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                        {userNameMessage === "User name is available." ? (
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        ) : (
                          <AlertCircle className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        )}
                        <span className="text-xs md:text-sm">{userNameMessage}</span>
                      </div>
                    )}
                    <FormMessage className="text-xs md:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300 text-sm md:text-base">Email</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email address" 
                          {...field} 
                          className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm md:text-base h-10 md:h-auto"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs md:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300 text-sm md:text-base">Password</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Create a secure password" 
                          {...field} 
                          className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm md:text-base h-10 md:h-auto"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs md:text-sm" />
                  </FormItem>
                )}
              />

              <div className="text-center mt-4">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 md:py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg mt-4 md:mt-6 text-sm md:text-base"
                disabled={isSubmiting}
              >
                {isSubmiting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 md:h-5 md:w-5 mr-2 animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>

      {/* Right side - Illustration/Info */}
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-6 md:p-12"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-md text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Welcome to Mystery App</h2>
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg md:text-xl font-semibold">Anonymous Feedback</h3>
                <p className="mt-1 text-sm md:text-base text-white/80">Share your thoughts without revealing your identity</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg md:text-xl font-semibold">Secure Communication</h3>
                <p className="mt-1 text-sm md:text-base text-white/80">Your data is encrypted and protected</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg md:text-xl font-semibold">Easy to Use</h3>
                <p className="mt-1 text-sm md:text-base text-white/80">Intuitive interface designed for seamless experience</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUpPage
