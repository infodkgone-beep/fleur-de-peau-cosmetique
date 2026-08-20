import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { NewStaffForm } from "@/components/admin/new-staff-form"
import { StaffRoleSelect, StaffActiveToggle } from "@/components/admin/staff-role-select"

export default async function UsersPage() {
  const profile = await requireRole(["super_admin"])
  const supabase = await createClient()

  const { data: staff } = await supabase.from("profiles").select("*").order("created_at", { ascending: true })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Utilisateurs & rôles</h1>
        <p className="text-sm text-muted-foreground">
          Gère les comptes staff et leurs permissions (Super Admin, Admin Commercial, Gestionnaire Contenu).
        </p>
      </div>

      <NewStaffForm />

      <section>
        <h2 className="font-serif text-lg font-semibold text-foreground">Comptes existants</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {(staff ?? []).map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {s.full_name} {s.id === profile.id && <span className="text-xs text-muted-foreground">(toi)</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                  <td className="px-4 py-3">
                    <StaffRoleSelect userId={s.id} role={s.role} isSelf={s.id === profile.id} />
                  </td>
                  <td className="px-4 py-3">
                    <StaffActiveToggle userId={s.id} active={s.active} isSelf={s.id === profile.id} />
                  </td>
                </tr>
              ))}
              {(staff ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    Aucun compte staff pour l&apos;instant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
