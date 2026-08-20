import "server-only"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER || "fleur-de-peau"

/** Génère une signature d'upload à durée limitée, utilisée par le composant d'upload côté client. */
export function generateUploadSignature(paramsToSign: Record<string, string | number> = {}) {
  const timestamp = Math.round(Date.now() / 1000)
  const params = { timestamp, folder: FOLDER, ...paramsToSign }

  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!)

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder: FOLDER,
  }
}

/** Supprime une image de Cloudinary par son public_id. */
export async function deleteCloudinaryImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId)
}
