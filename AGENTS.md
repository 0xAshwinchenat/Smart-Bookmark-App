<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Repo Notes

- The bookmarks table includes a `category` column and the dashboard supports category filtering.
- Supabase clients read `NEXT_PUBLIC_SUPABASE_URL` plus either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- The app currently uses Google OAuth through Supabase and the callback flow is `/auth/callback` in the app plus `/auth/v1/callback` in Google Cloud Console.
<!-- END:nextjs-agent-rules -->
