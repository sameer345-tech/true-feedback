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
import { MessageSquare, Sparkles, Send } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function SendMessagePage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const { userName } = useParams();
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

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
      setIsLoadingSuggestions(true);
      setSuggestions([]);
      
      const response = await axios.get("/api/messages/suggest-messages");
      if (!response.data.success) {
        toast.error(response.data.message, {
          position: "top-right"
        });
        setIsLoadingSuggestions(false);
        return;
      }

      setSuggestions(response.data.suggestions || []);
      toast.success("Suggestions generated.", {
        position: "top-right"
      });
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message, {
        position: "top-right"
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  }

  const useSuggestion = (suggestion: string) => {
    form.setValue("content", suggestion);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-8 mb-8 text-center mt-8">
        <h1 className="text-3xl font-bold text-white dark:text-gray-100 mb-2">
          Send a message to {decodedUserName}
        </h1>
        <p className="text-white dark:text-gray-400">
          Your message will be anonymous
        </p>
      </div>

      <Card className="mb-8 shadow-md">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Your Message</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          placeholder="Type your message here..." 
                          className="pl-10 py-6 resize-none" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Your identity will remain anonymous
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Need inspiration?</h2>
          <Button
            onClick={handleOnSuggestMessage}
            variant="outline"
            className="transition-all"
            disabled={isLoadingSuggestions}
          >
            {isLoadingSuggestions ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Ideas
              </>
            )}
          </Button>
        </div>

        <div className="space-y-3">
          {isLoadingSuggestions ? (
            <>
              <Skeleton className="h-16 w-full rounded-lg animate-pulse" />
              <Skeleton className="h-16 w-full rounded-lg animate-pulse" />
              <Skeleton className="h-16 w-full rounded-lg animate-pulse" />
            </>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className={`bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all animate-slide-up`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => useSuggestion(suggestion)}
              >
                <p className="text-gray-800 dark:text-gray-200">{suggestion}</p>
              </div>
            ))
          ) : null}
        </div>
      </div>
    </main>
  )
}

export default SendMessagePage
