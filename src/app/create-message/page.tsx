"use client"

import { useSession } from 'next-auth/react';
import React from 'react'
import { useRouter } from 'next/navigation';
function createMessagePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    console.log(session)
    if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 animate-fade-in">
          Create Message
        </h1>
        <p className="text-gray-600 dark:text-gray-300 animate-fade-in-delayed">
          Write a message to someone.
        </p>
        <form className="space-y-4 mt-8 animate-slide-up" onSubmit={async(e) => {
          e.preventDefault()
          const content = e.currentTarget.message.value
         const response = await fetch("/api/messages/create-messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({username:"Sameer Ahmed", content }),
          })

          const data = await response.json()
          router.push("/view-messages")
          console.log(data)
        }}>
          <textarea
            name="message"
            className="w-full p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write your message here..."
            rows={10}
          />
          <button
            type="submit"
            className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default createMessagePage