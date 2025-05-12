"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { messageSchema } from '@/schemas/messageSchema'
import { z } from 'zod'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

function SendMessagePage() {
    const [isSubmiting, setIsSubmitting] = React.useState<boolean>(false);
    const {userName} = useParams();
   if(!userName) {
    toast("User name is required.", {
      position: "top-right"
    });
    return;
   }
    const decodedUserName =  decodeURIComponent(userName.toString())
     const DecodedUserName = decodedUserName.replace("userName:", "").trim()

   const form = useForm<z.infer <typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    }
  })

  const {reset} = form;
  const onSubmit = async(data: z.infer <typeof messageSchema>) => {
    try {
      setIsSubmitting(true)
      const response = await axios.post<ApiResponse>("/api/messages/create-messages", {
        username: DecodedUserName,
        content: data.content
      })
      // console.log(response?.data)
      if(!response.data.success) {
        toast.error(response.data.message, {
          position: "top-right"
        })
        setIsSubmitting(false);
        return;
      }
      toast.success(response.data.message, {
        position: "top-right"
      })
      reset({content: ""})
      setIsSubmitting(false);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message, {
        position: "top-right"
      })
      setIsSubmitting(false);
    }
  }

  const handleOnSuggestMessage = async() => {
        try {
          const response = await axios.post("/api/messages/suggest-messages");
          const suggestions = response?.data;
          console.log(suggestions)

          if(!response.data.success) {
            toast.error(response.data.message, {
              position: "top-right"
            })
            return;
          }
          toast.success("Suggestions generated.", {
            position: "top-right"
          })
          // console.log(suggestions.data)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast.error(axiosError.response?.data.message, {
            position: "top-right"
          })
        }
  }

  return (
    <main className='px-2.5'>
         <div className='text-center text-2xl font-bold'>Public Profile Link</div>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
       
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Input placeholder="type your message" {...field} />
              </FormControl>
              <FormDescription>
                Sent anoynmous message here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{isSubmiting ? "Sending..." : "Send"}</Button>
      </form>
    </Form>

    <button className='mt-4 text-white bg-blue-700' onClick={handleOnSuggestMessage} >Suggest Messages</button>

    </main>
  )
}

export default SendMessagePage