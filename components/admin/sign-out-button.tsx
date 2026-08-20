"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function AdminSignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
    >
      <LogOut className="h-3.5 w-3.5" />
      Se déconnecter
    </button>
  )
}
