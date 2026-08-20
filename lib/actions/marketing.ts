"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import type { MarketingPlatform } from "@/lib/types/database"

const pixelSchema = z.object({
  platform: z.string(),
  pixelId: z.string().nullable(),
  enabled: z.boolean(),
})

/** Active/désactive un pixel marketing et enregistre son identifiant — sans toucher au code. */
export async function updateMarketingPixel(input: z.infer<typeof pixelSchema>) {
  const profile = await requireRole(["super_admin"])
  const supabase = await createClient()
  const parsed = pixelSchema.parse(input)

  const { error } = await supabase
    .from("marketing_pixels")
    .update({
      pixel_id: parsed.pixelId,
      enabled: parsed.enabled,
      updated_by: profile.id,
    })
    .eq("platform", parsed.platform as MarketingPlatform)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/marketing")
  revalidatePath("/")
}

const settingSchema = z.object({
  key: z.enum(["whatsapp_number", "free_delivery_threshold", "announcements"]),
  value: z.union([z.string(), z.number(), z.array(z.string())]),
})

/** Met à jour un paramètre général du site (clé/valeur JSON). */
export async function updateSiteSetting(input: z.infer<typeof settingSchema>) {
  const profile = await requireRole(["super_admin", "content_manager"])
  const supabase = await createClient()
  const parsed = settingSchema.parse(input)

  const { error } = await supabase.from("site_settings").upsert({
    key: parsed.key,
    value: parsed.value,
    updated_by: profile.id,
  })
  if (error) throw new Error(error.message)

  revalidatePath("/admin/marketing")
  revalidatePath("/")
}
