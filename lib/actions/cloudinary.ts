"use server"

import { requireRole } from "@/lib/auth"
import { generateUploadSignature, deleteCloudinaryImage } from "@/lib/cloudinary"

/** Fournit une signature d'upload Cloudinary à un membre du staff connecté. */
export async function getUploadSignature() {
  await requireRole(["super_admin", "admin_commercial", "content_manager"])
  return generateUploadSignature()
}

export async function removeCloudinaryImage(publicId: string) {
  await requireRole(["super_admin", "content_manager"])
  await deleteCloudinaryImage(publicId)
}
