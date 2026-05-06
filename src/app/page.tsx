import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookmarkIcon, ShieldCheckIcon, ZapIcon, GlobeIcon } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <BookmarkIcon className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-xl">SmartMark</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Organize your web, <span className="text-primary">intelligently.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Save bookmarks, fetch metadata automatically, and sync across all your devices in real-time.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-background rounded-xl shadow-sm border">
                <div className="p-3 rounded-full bg-primary/10">
                  <ZapIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Real-time Sync</h3>
                <p className="text-muted-foreground">
                  Your bookmarks are instantly synced across all your open tabs and devices using Supabase Realtime.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-background rounded-xl shadow-sm border">
                <div className="p-3 rounded-full bg-primary/10">
                  <GlobeIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Auto-Metadata</h3>
                <p className="text-muted-foreground">
                  We automatically fetch favicons, titles, and descriptions for your bookmarks to keep them organized.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-background rounded-xl shadow-sm border">
                <div className="p-3 rounded-full bg-primary/10">
                  <ShieldCheckIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Private & Secure</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security with Row Level Security (RLS) ensures only you can access your bookmarks.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2026 SmartMark App. Built for production.
        </p>
      </footer>
    </div>
  )
}
