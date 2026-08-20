"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/types/database"

/** Client Supabase pour les composants client — respecte les policies RLS de l'utilisateur connecté. */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
