import "server-only"

/**
 * Envoie un message WhatsApp automatique au gérant via l'API Cloud de Meta (WhatsApp Business
 * Platform), pour le prévenir d'une nouvelle commande site même si l'admin n'est pas ouvert.
 *
 * Ceci est DIFFÉRENT des liens wa.me utilisés ailleurs dans le site : ceux-là ouvrent
 * l'application WhatsApp d'un humain qui clique. Ici, le message part tout seul depuis le
 * serveur, ce qui nécessite un vrai compte WhatsApp Business API (pas juste un numéro
 * WhatsApp normal) :
 *
 *  1. Un compte Meta Business (business.facebook.com) vérifié.
 *  2. Une app Meta avec le produit "WhatsApp" ajouté (developers.facebook.com).
 *  3. Un numéro de téléphone dédié enregistré comme numéro WhatsApp Business API — CE NUMÉRO
 *     NE PEUT PAS ÊTRE CELUI DÉJÀ UTILISÉ SUR WHATSAPP BUSINESS APP NORMAL, sauf migration.
 *  4. Un modèle de message ("template") approuvé par Meta, car un message envoyé par
 *     l'entreprise sans qu'un client ait écrit dans les 24h précédentes doit utiliser un
 *     template pré-approuvé. Suggestion de contenu à soumettre pour approbation :
 *       Nom du template   : nouvelle_commande
 *       Catégorie          : UTILITY
 *       Langue             : Français
 *       Corps du message   : "Nouvelle commande {{1}} de {{2}} pour un total de {{3}}. Consultez l'admin pour la traiter."
 *
 * Variables d'environnement à ajouter sur Vercel une fois ce compte prêt :
 *  - WHATSAPP_CLOUD_API_TOKEN     : jeton d'accès permanent de l'app Meta
 *  - WHATSAPP_PHONE_NUMBER_ID     : identifiant du numéro WhatsApp Business API (pas le numéro lui-même)
 *  - WHATSAPP_ADMIN_NOTIFY_NUMBER : numéro du gérant à prévenir (indicatif pays inclus, sans +, ex: 2250700000000)
 *  - WHATSAPP_ORDER_TEMPLATE_NAME : nom du template approuvé (ex: nouvelle_commande)
 *
 * Tant que ces 4 variables ne sont pas toutes définies, cette fonction ne fait rien
 * (silencieusement) — elle n'empêche jamais la création d'une commande d'aboutir, et n'envoie
 * jamais rien tant que la configuration n'est pas complète.
 */
export async function notifyAdminNewOrderWhatsApp(params: {
  orderNumber: string
  customerName: string
  total: string
}) {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const adminNumber = process.env.WHATSAPP_ADMIN_NOTIFY_NUMBER
  const templateName = process.env.WHATSAPP_ORDER_TEMPLATE_NAME

  if (!token || !phoneNumberId || !adminNumber || !templateName) {
    return
  }

  try {
    await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: adminNumber,
        type: "template",
        template: {
          name: templateName,
          language: { code: "fr" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: params.orderNumber },
                { type: "text", text: params.customerName },
                { type: "text", text: params.total },
              ],
            },
          ],
        },
      }),
    })
  } catch {
    // On ne bloque jamais la création de commande si l'envoi de la notification échoue.
  }
}
