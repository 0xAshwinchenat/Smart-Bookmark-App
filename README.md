# SmartMark - Intelligent Bookmark Manager

SmartMark is a production-grade bookmark management application built with Next.js 15, Supabase, and Tailwind CSS. It features automatic metadata extraction, real-time synchronization, and a polished SaaS-style UI.

## Features

- **Google OAuth:** Secure authentication using Supabase Auth.
- **Automatic Metadata:** Automatically fetches title, description, and favicons for saved URLs using Cheerio.
- **Real-time Sync:** Instant updates across tabs and devices using Supabase Realtime.
- **Private Bookmarks:** Row Level Security (RLS) ensures your bookmarks are only visible to you.
- **Responsive UI:** Beautifully designed with shadcn/ui and Framer Motion.
- **Confirmation UX:** Secure deletion with confirmation modals and toast notifications.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion.
- **Backend:** Supabase (Auth, Database, Realtime).
- **Validation:** Zod + React Hook Form.

## Getting Started

### 1. Prerequisites

- A [Supabase](https://supabase.com/) project.
- A [Google Cloud Console](https://console.cloud.google.com/) project for Google OAuth.

### 2. Supabase Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create bookmarks table
CREATE TABLE public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    favicon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Installation

```bash
npm install
npm run dev
```

## Deployment

### Vercel

1. Push your code to GitHub.
2. Import the project in [Vercel](https://vercel.com/).
3. Add your environment variables.
4. Set the build command to `npm run build`.
5. Deploy!

### Supabase Auth Configuration

In your Supabase project settings:
- Add `https://your-domain.vercel.app/auth/callback` to the Redirect URLs.
- Configure Google OAuth under Authentication -> Providers.

## Engineering Standards

- **Clean Architecture:** Separation of UI, business logic, and database operations.
- **Type Safety:** Full TypeScript implementation.
- **Performance:** Optimized server-side fetching and client-side subscriptions.
- **Accessibility:** Accessible components using shadcn/ui.
