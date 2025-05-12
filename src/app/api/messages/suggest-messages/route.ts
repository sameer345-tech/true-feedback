import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

import { NextResponse } from 'next/server';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // make sure this exists in your .env file
// });

export const runtime = 'edge';

export async function POST() {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.";

     const result = streamText({
    model: groq('llama-3.1-8b-instant'),
    prompt,
  });

    const suggestions = result.text || '';
    // const formattedSuggestions = suggestions.split('||');

    return NextResponse.json({
      success: true,
      message: 'Suggestions generated successfully',
      messages: suggestions,
      statusCode: 200,
    });

  } catch (error: unknown) {
    console.error('OpenAI API Error:', error);
    if(error instanceof Error) {
    return NextResponse.json({
      success: false,
      message: error?.message || 'Something went wrong',
      statusCode: 500,
    });
    }
  }
}
