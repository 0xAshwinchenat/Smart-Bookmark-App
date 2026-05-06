'use server'

import { createClient } from '@/utils/supabase/server'
import { getMetadata } from '@/lib/metadata'
import { revalidatePath } from 'next/cache'

export async function addBookmark(url: string, category: string = 'Uncategorized') {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Basic URL validation
  try {
    new URL(url)
  } catch {
    throw new Error('Invalid URL provided')
  }

  const metadata = await getMetadata(url)

  const { error } = await supabase.from('bookmarks').insert([
    {
      user_id: user.id,
      url,
      category,
      ...metadata,
    },
  ])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('bookmarks').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}
