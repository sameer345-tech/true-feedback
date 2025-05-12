"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { messageI } from "@/models/message";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import CustomCard from "@/components/CustomCard";
import Skelton from "@/components/Skelton";
import mongoose from "mongoose";

interface _messages {
  _id: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

function viewMessagesPage() {
  const [messages, setMessages] = useState<_messages[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoader(true);
      try {
        const response = await axios.get<_messages[]>("/api/messages/get-messages", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setLoader(false);
        setMessages(response.data);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.log(axiosError);
        toast.error(axiosError.response?.data.message ?? "Something went wrong", {
          position: "top-right",
        });
        setLoader(false);
      }
    })();
  }, []);

  const onConfirmDelete = async (messageId: mongoose.Types.ObjectId) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete<ApiResponse>(`/api/messages/delete-message/${messageId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.data.success) {
        setIsDeleting(false);
        toast.error(response.data.message, {
          position: "top-right",
        });
      } else {
        toast.success(response.data.message, {
          position: "top-right",
        });
        setIsDeleting(false);
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== messageId)
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError);
      toast.error(axiosError.response?.data.message ?? "Something went wrong", {
        position: "top-right",
      });
      setIsDeleting(false);
    }
  };
  loader && <Skelton />
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {messages.length > 0 ? (
        messages.map((message) => (
          <CustomCard
            key={message._id.toString()}
            messages={message}
            onConfirmDelete={onConfirmDelete}
          />
        ))
      ) : (
        <p>Messages not found</p>
      )}
    </div>
  );
}

export default viewMessagesPage;
