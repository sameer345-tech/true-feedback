"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signinSchema } from '@/schemas/signinSchema'
import { useForm } from 'react-hook-form'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import z from "zod"
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { signIn } from 'next-auth/react'
import { motion } from "framer-motion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function page() {
  const [isSignin, setIsSignin] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSignin(true);
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      })
      if (!response?.ok) {
        const error = response?.error?.replace("Error: ", "");
        toast.error(error, {
          position: "top-right"
        })
        setIsSignin(false);
        return
      }

      setIsSignin(false);
      toast.success("Sign in successful", {
        position: "top-right",
        duration: 3000
      });
      router.replace("/dashboard")

    } catch (error) {
      console.log(`error during sign in`, error);
      setIsSignin(false);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message || "An unexpected error occurred.", {
        position: "top-right"
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Illustration/Info */}
      <motion.div
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-12"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
          <p className="text-xl mb-8 text-white/90">
            Sign in to access your personal dashboard and continue sharing anonymous feedback.
          </p>
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
            <blockquote className="italic text-white/90">
              "Mystery App has transformed how our team communicates. The anonymous feedback feature has led to more honest conversations and better outcomes."
            </blockquote>
            <div className="mt-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold">JD</span>
              </div>
              <div className="ml-3">
                <p className="font-medium">Sameer</p>
                <p className="text-sm text-white/70">Product Manager</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div
        className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-full max-w-md">
          <div className="text-center mt-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sign in to your account</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Enter your credentials to access your dashboard</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Enter your email address"
                          {...field}
                          className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                      <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg mt-6"
                disabled={isSignin}
              >
                {isSignin ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Sign in</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  )
}

export default page
