import "server-only"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database"

/**
 * Client Supabase "admin" — utilise la clé service_role et CONTOURNE la sécurité RLS.
 *
 * À utiliser uniquement pour des opérations serveur privilégiées et déjà protégées en amont
 * par une vérification de rôle explicite (ex: création d'un compte staff par un Super Admin).
 * Ne JAMAIS exposer ce client ou la clé service_role côté navigateur.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
