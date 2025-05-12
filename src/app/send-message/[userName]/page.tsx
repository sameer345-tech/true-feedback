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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { messageSchema } from '@/schemas/messageSchema'
import { z } from 'zod'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

function SendMessagePage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { userName } = useParams();

  const decodedUserName = userName
    ? decodeURIComponent(userName.toString()).replace("userName:", "").trim()
    : "";

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const { reset } = form;

  if (!userName) {
    toast("User name is required.", {
      position: "top-right"
    });
    return <div>User name is required</div>;
  }

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post<ApiResponse>("/api/messages/create-messages", {
        username: decodedUserName,
        content: data.content
      });

      if (!response.data.success) {
        toast.error(response.data.message, {
          position: "top-right"
        });
        setIsSubmitting(false);
        return;
      }

      toast.success(response.data.message, {
        position: "top-right"
      });
      reset({ content: "" });
      setIsSubmitting(false);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message, {
        position: "top-right"
      });
      setIsSubmitting(false);
    }
  }

  const handleOnSuggestMessage = async () => {
    try {
      const response = await axios.post("/api/messages/suggest-messages");
      if (!response.data.success) {
        toast.error(response.data.message, {
          position: "top-right"
        });
        return;
      }

      toast.success("Suggestions generated.", {
        position: "top-right"
      });
      // Optional: use suggestions here
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message, {
        position: "top-right"
      });
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
                  <Input placeholder="Type your message" {...field} />
                </FormControl>
                <FormDescription>
                  Send anonymous message here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{isSubmitting ? "Sending..." : "Send"}</Button>
        </form>
      </Form>

      <button
        className='mt-4 text-white bg-blue-700 px-4 py-2 rounded'
        onClick={handleOnSuggestMessage}
      >
        Suggest Messages
      </button>
    </main>
  )
}

export default SendMessagePage
