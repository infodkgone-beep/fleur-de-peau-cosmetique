"use client"

import { useTransition } from "react"
import { updateUserRole, toggleUserActive } from "@/lib/actions/users"
import { ROLE_LABELS } from "@/lib/roles"
import type { UserRole } from "@/lib/types/database"

const ROLES: UserRole[] = ["super_admin", "admin_commercial", "content_manager"]

export function StaffRoleSelect({ userId, role, isSelf }: { userId: string; role: UserRole | null; isSelf: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      defaultValue={role ?? ""}
      disabled={isPending || (isSelf && role === "super_admin")}
      onChange={(e) => {
        const next = e.target.value as UserRole
        if (!confirm(`Changer le rôle en "${ROLE_LABELS[next]}" ?`)) {
          e.target.value = role ?? ""
          return
        }
        startTransition(async () => {
          try {
            await updateUserRole({ userId, role: next })
          } catch (err) {
            alert(err instanceof Error ? err.message : "Erreur")
          }
        })
      }}
      className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium"
    >
      <option value="" disabled>
        Aucun rôle
      </option>
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {ROLE_LABELS[r]}
        </option>
      ))}
    </select>
  )
}

export function StaffActiveToggle({ userId, active, isSelf }: { userId: string; active: boolean; isSelf: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending || isSelf}
      onClick={() => {
        const next = !active
        if (!confirm(next ? "Réactiver ce compte ?" : "Désactiver ce compte ? L'utilisateur ne pourra plus se connecter.")) return
        startTransition(async () => {
          try {
            await toggleUserActive(userId, next)
          } catch (err) {
            alert(err instanceof Error ? err.message : "Erreur")
          }
        })
      }}
      className={`rounded-full px-2.5 py-1 text-xs font-semibold disabled:opacity-50 ${
        active ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
      }`}
    >
      {active ? "Actif" : "Désactivé"}
    </button>
  )
}
