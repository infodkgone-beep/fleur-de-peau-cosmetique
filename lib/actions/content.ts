"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { deleteCloudinaryImage } from "@/lib/cloudinary"
import type { UserRole } from "@/lib/types/database"

const CONTENT_ROLES: UserRole[] = ["super_admin", "content_manager"]

const heroSlideSchema = z.object({
  id: z.string().uuid().nullable(),
  eyebrow: z.string().nullable(),
  title: z.string().min(1, "Le titre est obligatoire."),
  subtitle: z.string().nullable(),
  cta_label: z.string().nullable(),
  cta_href: z.string().nullable(),
  image_url: z.string().nullable(),
  cloudinary_public_id: z.string().nullable(),
  active: z.boolean(),
})

export async function saveHeroSlide(input: z.infer<typeof heroSlideSchema>) {
  const profile = await requireRole(CONTENT_ROLES)
  const supabase = await createClient()
  const parsed = heroSlideSchema.parse(input)

  const payload = {
    eyebrow: parsed.eyebrow,
    title: parsed.title,
    subtitle: parsed.subtitle,
    cta_label: parsed.cta_label,
    cta_href: parsed.cta_href,
    image_url: parsed.image_url,
    cloudinary_public_id: parsed.cloudinary_public_id,
    active: parsed.active,
    updated_by: profile.id,
  }

  const { error } = parsed.id
    ? await supabase.from("hero_slides").update(payload).eq("id", parsed.id)
    : await supabase.from("hero_slides").insert(payload)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/contenu")
  revalidatePath("/")
}

export async function toggleHeroSlideActive(id: string, active: boolean) {
  const profile = await requireRole(CONTENT_ROLES)
  const supabase = await createClient()
  const { error } = await supabase.from("hero_slides").update({ active, updated_by: profile.id }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/contenu")
  revalidatePath("/")
}

export async function deleteHeroSlide(id: string, cloudinaryPublicId: string | null) {
  await requireRole(CONTENT_ROLES)
  const supabase = await createClient()
  const { error } = await supabase.from("hero_slides").delete().eq("id", id)
  if (error) throw new Error(error.message)
  if (cloudinaryPublicId) {
    try {
      await deleteCloudinaryImage(cloudinaryPublicId)
    } catch {
      // pas bloquant
    }
  }
  revalidatePath("/admin/contenu")
  revalidatePath("/")
}

const bannerSchema = z.object({
  id: z.string().uuid().nullable(),
  title: z.string().min(1, "Le titre est obligatoire."),
  description: z.string().nullable(),
  badge: z.string().nullable(),
  code: z.string().nullable(),
  link: z.string().nullable(),
  active: z.boolean(),
})

export async function saveBanner(input: z.infer<typeof bannerSchema>) {
  const profile = await requireRole(CONTENT_ROLES)
  const supabase = await createClient()
  const parsed = bannerSchema.parse(input)

  const payload = {
    title: parsed.title,
    description: parsed.description,
    badge: parsed.badge,
    code: parsed.code,
    link: parsed.link,
    active: parsed.active,
    updated_by: profile.id,
  }

  const { error } = parsed.id
    ? await supabase.from("banners").update(payload).eq("id", parsed.id)
    : await supabase.from("banners").insert(payload)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/contenu")
  revalidatePath("/")
}

export async function toggleBannerActive(id: string, active: boolean) {
  const profile = await requireRole(CONTENT_ROLES)
  const supabase = await createClient()
  const { error } = await supabase.from("banners").update({ active, updated_by: profile.id }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/contenu")
  revalidatePath("/")
}

export async function deleteBanner(id: string) {
  await requireRole(CONTENT_ROLES)
  const supabase = await createClient()
  const { error } = await supabase.from("banners").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/contenu")
  revalidatePath("/")
}
