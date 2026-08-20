"use client"

import { useState, useTransition } from "react"
import { createStaffUser } from "@/lib/actions/users"
import { ROLE_LABELS } from "@/lib/roles"
import type { UserRole } from "@/lib/types/database"

const ROLES: UserRole[] = ["super_admin", "admin_commercial", "content_manager"]

export function NewStaffForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("admin_commercial")

  function handleSubmit() {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      try {
        await createStaffUser({ fullName, email, password, role })
        setSuccess(true)
        setFullName("")
        setEmail("")
        setPassword("")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors de la création du compte.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <h2 className="font-serif text-lg font-semibold">Créer un compte staff</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nom complet" className="staff-input" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresse e-mail"
          className="staff-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe (8 caractères min.)"
          className="staff-input"
        />
        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="staff-input">
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      {success && <p className="text-sm font-medium text-primary">Compte créé avec succès.</p>}
      <button
        type="button"
        disabled={isPending || !fullName || !email || password.length < 8}
        onClick={handleSubmit}
        className="self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {isPending ? "Création..." : "Créer le compte"}
      </button>

      <style jsx global>{`
        .staff-input {
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--background);
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          width: 100%;
        }
      `}</style>
    </div>
  )
}
