# True Feedback - Anonymous Feedback Platform

![True-feedback  Logo](public/logo.png)

True Feedback is a modern, secure platform for anonymous feedback and messaging. Built with Next.js 15 and leveraging AI capabilities, it allows users to send and receive anonymous messages in a safe, controlled environment.

## Features

- **Complete Anonymity**: Send and receive messages without revealing your identity
- **AI-Powered Suggestions**: Get message suggestions powered by Groq's LLaMA 3.1 model
- **Responsive Design**: Fully responsive UI that works seamlessly on mobile, tablet, and desktop
- **User Authentication**: Secure sign-up, sign-in, and account verification
- **Personal Dashboard**: Manage your profile and messages in one place
- **Dark Mode Support**: Comfortable viewing experience in any lighting condition

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI, Lucide Icons, Framer Motion
- **Authentication**: NextAuth.js
- **AI Integration**: AI SDK, Groq API (LLaMA 3.1)
- **Form Handling**: React Hook Form, Zod validation
- **Notifications**: Sonner toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/True-feedback.git
   cd True-feedback
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Database
   DATABASE_URL=your_database_connection_string
   
   # Email (for verification)
   EMAIL_SERVER=smtp://username:password@smtp.example.com:587
   EMAIL_FROM=noreply@yourdomain.com
   
   # AI Integration
   GROQ_API_KEY=your_groq_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
True-feedback/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── sign-in/         # Authentication pages
│   │   └── ...
│   ├── components/          # Reusable components
│   │   ├── ui/              # UI components
│   │   └── ...
│   ├── lib/                 # Utility functions
│   ├── hooks/               # Custom React hooks
│   ├── schemas/             # Zod validation schemas
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
└── ...
```

## Deployment

The easiest way to deploy True-feedback is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Set the required environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - Re-usable components
- [Groq](https://groq.com/) - AI model provider
- [AI SDK](https://ai-sdk.dev/) - AI integration toolkit

