"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { messageI } from '@/models/message'
import { z } from 'zod';
import mongoose from 'mongoose';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';
import { acceptMessageSchema } from '@/schemas/acceptMsgSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { User } from 'next-auth';
import CustomCard from '@/components/CustomCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
function DashboardPage() {
  const [messages, setMessages] = useState<messageI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitch, setIsSwitch] = useState<boolean>(false);
  const router = useRouter()
  const handleDeleteMessages = (messageId: mongoose.Types.ObjectId) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  };

  const {data: session} = useSession();

  const form = useForm<z.infer <typeof acceptMessageSchema >>({
    resolver: zodResolver(acceptMessageSchema)
  })
   
  const {register,setValue, watch} = form;
  const acceptMessages = watch("acceptMessages");

  const fetchMessageAccepted = useCallback(async()=> {
       try {
        setIsSwitch(true)
       const response = await  axios.get<ApiResponse>("/api/messages/accept-messages");
       setValue("acceptMessages", response?.data?.isMessageAccepted as boolean)

       } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast.error(axiosError.response?.data.message, {
          position: "top-right"
        })
       } finally  {
         setIsSwitch(false)
       }
  }, [setValue]);

  const fetchMessages = useCallback(async(refresh: boolean = false) => {

    try {
      setIsLoading(true)
      setIsSwitch(false);
      const response = await axios.get<ApiResponse>("/api/messages/get-messages");
      setMessages(response?.data?.messages as messageI[] || [])
      if(refresh) {
        toast.success("Messages Refreshed.", {
          position: "top-right"
        })
      }

    } catch (error) {
      const axiosError = error as AxiosError <ApiResponse>
      toast.error(axiosError.response?.data?.message || "fetching messages failed.")
    } finally {
      setIsSwitch(false);
      setIsLoading(false)
    }
  }, [setIsLoading, setMessages]);

  useEffect(() => {
    if(!session || !session.user) return;
    fetchMessages();
    fetchMessageAccepted();
  }, [session, setValue, fetchMessages, fetchMessageAccepted]);

  //handle switch  change

  const handleSwitchChange = async() => {
    try {
      const newValue = !acceptMessages;
      const response = await axios.post<ApiResponse>("/api/messages/accept-messages", {
        isMessageAccepted: newValue
      });
      setValue("acceptMessages", newValue);

      toast.success(response?.data?.message, {
        position: "top-right"
      });
    } catch (error) {
      const axiousError = error as AxiosError <ApiResponse>
      toast.error(axiousError.response?.data.message || "something went wrong during switch change", {
        position: "top-right"
      })
    }
  }

  if(!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-6xl font-bold">Unauthorized</h1>
        <p className="text-2xl">Please sign in to access Dashboard.</p>
        <Link href="/sign-in">
          <p className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
            Sign In
          </p>
        </Link>
      </div>
    )
  }
  const {name} = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/user/${name}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard.", {
      position: "top-right"
    });

    router.push(`/send-message/userName:${name}`)
    
  }
  return (
    <div className="container mx-auto px-4 py-8 mt-[35px]">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden m-t[10px]">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">User Dashboard</h1>
          <p className="text-indigo-100 text-sm md:text-base">Welcome back, {name}</p>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Profile Link Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Your Profile Link
            </h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              />
              <Button 
                onClick={copyToClipboard} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Link
              </Button>
            </div>
          </div>

          {/* Message Settings Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              Message Settings
            </h2>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Switch
                  {...register('acceptMessages')}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitch}
                  className={`${acceptMessages ? 'bg-indigo-600' : 'bg-gray-300'}`}
                />
                <span className="font-medium">Accept Messages</span>
              </div>
              <span className={`text-sm px-2 py-1 rounded-full ${
                acceptMessages 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {acceptMessages ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Messages Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                </svg>
                Your Messages
              </h2>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  fetchMessages(true);
                }}
                className="flex items-center gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="mt-4 flex justify-end">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <CustomCard
                      key={message._id?.toString()}
                      messages={message}
                      onMessageDelete={handleDeleteMessages}
                    />
                  ))
                ) : (
                  <div className="col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">No messages to display</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">When you receive messages, they will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage
