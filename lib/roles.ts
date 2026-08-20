// Constantes liées aux rôles, sans dépendance serveur — importable depuis des composants client.
import type { UserRole } from "@/lib/types/database"

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Administrateur",
  admin_commercial: "Administrateur Commercial",
  content_manager: "Gestionnaire Contenu",
}
