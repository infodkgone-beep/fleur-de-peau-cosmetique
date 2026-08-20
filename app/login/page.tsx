"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (signInError) {
      setError("Email ou mot de passe incorrect.")
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-lg">
        <h1 className="font-serif text-2xl font-bold text-foreground">Administration</h1>
        <p className="mt-1 text-sm text-muted-foreground">Fleur de peau Cosmétique</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  )
}
