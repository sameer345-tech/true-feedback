"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import * as z from "zod"
import { verifySchema } from '@/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
function VerificationPage() {
    const { userName} = useParams();
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const router = useRouter();
    const form = useForm<z.infer <typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
      defaultValues: {
        verifyCode: ""
      }
    })
    const onSubmit = async(data: z.infer <typeof verifySchema>) => {
       try {
        setIsVerifying(true)
      const response =  await axios.post("/api/verify-email" , {
        userName,
        verifyCode: data.verifyCode
      })
      if(!response.data?.success) {
        toast.error(response.data?.message,{
          position: "top-right"
        })
        setIsVerifying(false);
        return;
      }
      toast.success(response.data.message, {
        position: "top-right",
        duration: 3000
      })

      setIsVerifying(false);
      router.replace("/sign-in")
      
       } catch (error) {
        console.log(error);
       const axiousError = error as  AxiosError <ApiResponse>;
       toast.error(axiousError.response?.data.message || "something went wron.g", {
         position: "top-right"
       })
       }
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        <div className="w-full max-w-md p-8 bg-white/30 dark:bg-gray-700/40 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-600 transition-all">
          <div className="flex items-center justify-center mb-6">
            <ShieldCheck className="text-blue-600 dark:text-blue-400 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6 tracking-wide">
            Verify Your Email
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

            <FormField
              control={form.control}
              name="verifyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 123456"
                      {...field}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormControl className="mt-4">
                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </FormControl>
              
            </FormItem>
            </form>
          </Form>
        </div>
      </div>
    );

    
}


export default VerificationPage