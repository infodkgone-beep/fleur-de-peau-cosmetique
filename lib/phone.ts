/**
 * Normalise un numéro ivoirien saisi par un client (ex: "07 00 00 00 00", "07-00-00-00-00")
 * vers le format attendu par les liens wa.me : indicatif pays inclus, uniquement des chiffres.
 */
export function toWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "")
  if (digits.startsWith("225")) return digits
  return `225${digits}`
}
