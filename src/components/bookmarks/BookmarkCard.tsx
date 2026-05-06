'use client'

import { useState } from 'react'
import { Bookmark } from '@/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLinkIcon, Trash2Icon, MoreVerticalIcon } from 'lucide-react'
import { deleteBookmark } from '@/app/actions/bookmarks'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface BookmarkCardProps {
  bookmark: Bookmark
}

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteBookmark(bookmark.id)
      toast.success('Bookmark deleted')
    } catch (error) {
      toast.error('Failed to delete bookmark')
      console.error(error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <Card className="group relative flex flex-col h-full overflow-hidden hover:shadow-md transition-all duration-300 border-2">
        <CardHeader className="p-0">
          <div className="aspect-video w-full bg-muted relative overflow-hidden flex items-center justify-center">
            {bookmark.favicon_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bookmark.favicon_url}
                alt={bookmark.title || ''}
                className="w-16 h-16 object-contain z-10 p-2 bg-white rounded-2xl shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <ExternalLinkIcon className="h-12 w-12 text-muted-foreground/30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {bookmark.title || bookmark.url}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive flex items-center gap-2"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2Icon className="h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {bookmark.description || 'No description available.'}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary font-medium hover:underline truncate"
          >
            {new URL(bookmark.url).hostname}
          </a>
        </CardFooter>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your bookmark.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Bookmark'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
