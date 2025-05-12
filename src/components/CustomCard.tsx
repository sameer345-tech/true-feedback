"use client";
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { messageI,  } from '@/models/message';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import mongoose from 'mongoose';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
type CustomCardProps = {
  messages: messageI;
  onMessageDelete: (messageId: mongoose.Types.ObjectId) => void;
};

function CustomCard({ messages, onMessageDelete }: CustomCardProps) {
  const onConfirmDelete = async(messageId: mongoose.Types.ObjectId) => {
         try {
          const response = await axios.delete<ApiResponse>(`/api/messages/delete-message`, {
            data: { id: messageId }
          });
          if(!response.data.success) {
            toast.error(response.data.message, {
              position: "top-right"
            });
            return;
          }
          toast.success(response?.data?.message as string, {
            position: "top-right"
          });
          onMessageDelete(messageId);
         } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast.error(axiosError.response?.data.message, {
            position: "top-right"
          });
         }
  }
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-4 md:p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs px-2 py-1 rounded-full">
              {new Date(messages.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
          <CardDescription className="text-base mb-4 line-clamp-3">
            {messages.content}
          </CardDescription>
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Message</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this message? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onConfirmDelete(messages._id as mongoose.Types.ObjectId)}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CustomCard;
