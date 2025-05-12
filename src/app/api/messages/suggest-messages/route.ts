import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!, // Always use env variable in production
});

export async function GET() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content:
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. note: give direct three questions. no more explaination. "
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      top_p: 0.95,
      stream: false, // Don't stream if you want simple response
    });

    const rawText = chatCompletion.choices[0]?.message?.content || '';
    const suggestions = rawText.split('||').map(q => q.trim());

    return NextResponse.json({
      success: true,
      message: 'Ideas generated successfully.',
      suggestions,
    });
  } catch (error: any) {
    console.error("Groq error:", error.message);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch suggestions',
    }, { status: 500 });
  }
}
