# SmartMark - Intelligent Bookmark Manager

SmartMark is a production-grade bookmark management application built with Next.js 16, Supabase, and Tailwind CSS. It features automatic metadata extraction, real-time synchronization, category-based organization, and a polished SaaS-style UI.

## Features

- **Google OAuth:** Secure authentication using Supabase Auth.
- **Automatic Metadata:** Automatically fetches title, description, and favicons for saved URLs using Cheerio.
- **Bookmark Categories:** Add a category to each bookmark and filter the dashboard by category chips.
- **Real-time Sync:** Instant updates across tabs and devices using Supabase Realtime.
- **Private Bookmarks:** Row Level Security (RLS) ensures your bookmarks are only visible to you.
- **Responsive UI:** Beautifully designed with shadcn/ui and Framer Motion.
- **Confirmation UX:** Secure deletion with confirmation modals and toast notifications.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion.
- **Backend:** Supabase (Auth, Database, Realtime).
- **Validation:** Zod + React Hook Form.

## Technical Implementation Details

### 1. Supabase Auth & Row Level Security (RLS)
Security is implemented at the database level using Supabase RLS. This ensures that even if the frontend logic is bypassed, the database remains secure.
- **Policy Logic:** Every bookmark is linked to a `user_id`. We use the `auth.uid()` function to compare the authenticated user's ID with the `user_id` on the record.
- **Correctness:** By using `USING (auth.uid() = user_id)` for SELECT/DELETE and `WITH CHECK (auth.uid() = user_id)` for INSERT, we guarantee that users can never read, modify, or delete data belonging to another user.

### 2. Real-time Sync
We implemented real-time synchronization using **Supabase Postgres Changes**.
- **Implementation:** The `BookmarkList` component initializes a subscription to the `bookmarks` table, filtered specifically for the current user's ID (`filter: user_id=eq.${userId}`).
- **Cleanup:** To prevent memory leaks and redundant listeners, we utilize the `useEffect` cleanup return function: `supabase.removeChannel(channel)`. This ensures that when the component unmounts (e.g., user logs out or navigates away), the WebSocket connection is properly closed.

### 3. Bonus Feature: Auto-fetch Website Metadata
I chose **Auto-fetch website favicon + metadata** because it significantly elevates the product from a "list of links" to a visual dashboard.
- **Why it matters:** It provides immediate visual recognition for bookmarks, making the app feel "smart" and professional.
- **How it works:** A Next.js Server Action uses `cheerio` to scrape the target URL for Open Graph tags, fallbacks to standard meta tags, and uses Google's favicon service as a final fallback.

### 4. Challenges & Solutions
- **Metadata Scraping (CORS & Headers):** Many websites block generic scrapers. I solved this by implementing the scraping in a **Server Action** (bypassing CORS) and setting a realistic `User-Agent` header to ensure high success rates for metadata fetching.
- **Real-time State Merging:** Merging initial server-fetched data with real-time client updates can lead to duplicates or "flickering". I solved this by using a local state in `BookmarkList` that listens for the `INSERT` and `DELETE` events and updates the UI optimistically.

### 5. Future Improvements
If I had more time, I would implement **bulk import/export** and **saved smart filters**. Categories now handle the day-to-day organization, but power users would benefit from faster onboarding and reusable views.

## Getting Started
... (rest of the content)

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
    category TEXT DEFAULT 'Uncategorized',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- If the table already exists, add the category column safely
ALTER TABLE public.bookmarks
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Uncategorized';

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
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
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
- For Google OAuth in Google Cloud Console, add your Supabase callback URL: `https://fnthgyznkuugsvenrjyk.supabase.co/auth/v1/callback`.

## Engineering Standards

- **Clean Architecture:** Separation of UI, business logic, and database operations.
- **Type Safety:** Full TypeScript implementation.
- **Performance:** Optimized server-side fetching and client-side subscriptions.
- **Accessibility:** Accessible components using shadcn/ui.
