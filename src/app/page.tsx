"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"
import { Mail, ArrowRight, MessageSquare, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

function Home() {
  const { data: session } = useSession();
  return (
    <main className="flex flex-col min-h-screen">
      <section className="relative bg-gradient-to-b from-gray-900 to-indigo-900 text-white mt-16 md:mt-20">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 py-16 md:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Anonymous Feedback
              </span>{" "}
              Made Simple
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Share honest thoughts without revealing your identity. True Feedback helps you communicate freely and securely.
            </p>
            {session?.user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-2 h-auto">
                  <Link href="/dashboard" className="flex items-center">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
               
              </div>
            ): ( <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-2 h-auto">
                  <Link href="/sign-up" className="flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>)}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#f9fafb" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose True Feedback?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[{
              icon: <Shield className="h-6 w-6 text-indigo-600" />, title: 'Complete Anonymity',
              desc: 'Your identity remains hidden, allowing for honest and open communication without fear of judgment.'
            }, {
              icon: <MessageSquare className="h-6 w-6 text-indigo-600" />, title: 'Easy Messaging',
              desc: 'Simple interface for sending and receiving messages with no complicated setup required.'
            }, {
              icon: <User className="h-6 w-6 text-indigo-600" />, title: 'Personal Dashboard',
              desc: 'Manage all your received messages in one place with our intuitive user dashboard.'
            }].map(({ icon, title, desc }, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg h-full">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What People Are Saying</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            See real anonymous messages shared through our platform
          </p>

          <div className="max-w-4xl mx-auto">
            <Carousel
              plugins={[Autoplay({ delay: 3000 })]}
              className="w-full"
              opts={{ loop: true }}
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index} className="p-4 md:basis-1/1">
                    <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-indigo-700">{message.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="flex items-start space-x-4">
                          <div className="bg-indigo-100 p-2 rounded-full flex-shrink-0">
                            <Mail className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-gray-700 italic">{message.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Received {message.received.toString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-6 gap-4">
                <CarouselPrevious className="static transform-none bg-white border border-gray-200 hover:bg-gray-50 shadow-sm" />
                <CarouselNext className="static transform-none bg-white border border-gray-200 hover:bg-gray-50 shadow-sm" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

     {!session?.user ? ( <section className="py-16 md:py-24 bg-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-indigo-200 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already experiencing the freedom of anonymous communication.
          </p>
          <Button asChild size="lg" className="bg-white text-indigo-900 hover:bg-gray-100 py-2 h-auto">
            <Link href="/sign-up">Create Your Account</Link>
          </Button>
        </div>
      </section>) : (null)}

      
    </main>
  );
}

export default Home;
