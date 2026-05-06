'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bookmark } from '@/types'
import BookmarkCard from './BookmarkCard'
import { AnimatePresence, motion } from 'framer-motion'
import { BookmarkIcon, FilterIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface BookmarkListProps {
  initialBookmarks: Bookmark[]
  userId: string
}

export default function BookmarkList({ initialBookmarks, userId }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const supabase = createClient()

  const normalizeCategory = (category: string | null | undefined) =>
    (category?.trim() || 'Uncategorized')

  const categories = Array.from(
    new Set(bookmarks.map((bookmark) => normalizeCategory(bookmark.category)))
  ).sort()

  const filteredBookmarks = selectedCategory
    ? bookmarks.filter((bookmark) => normalizeCategory(bookmark.category) === selectedCategory)
    : bookmarks

  useEffect(() => {
    setBookmarks(initialBookmarks)
  }, [initialBookmarks])

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark
            setBookmarks((prev) => [newBookmark, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            const updatedBookmark = payload.new as Bookmark
            setBookmarks((prev) =>
              prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b))
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed rounded-2xl bg-muted/10">
        <div className="p-4 rounded-full bg-muted mb-4">
          <BookmarkIcon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">No bookmarks yet</h3>
        <p className="text-muted-foreground max-w-sm mt-2">
          Click the "Add Bookmark" button to save your first link and start organizing your web.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <div className="flex items-center gap-2 mr-2 text-sm font-medium text-muted-foreground">
          <FilterIcon className="h-4 w-4" />
          <span>Filter:</span>
        </div>
        <Badge
          variant={selectedCategory === null ? 'default' : 'outline'}
          className="cursor-pointer px-3 py-1 text-xs"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={`category-${category}`}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className="cursor-pointer px-3 py-1 text-xs"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filteredBookmarks.map((bookmark) => (
            <motion.div
              key={bookmark.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <BookmarkCard bookmark={bookmark} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
