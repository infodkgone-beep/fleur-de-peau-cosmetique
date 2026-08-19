# Fleur de peau Cosmétique

Site vitrine e-commerce (Next.js 16 + Tailwind CSS v4) pour Fleur de peau Cosmétique, boutique de cosmétiques importés à Abidjan. Les commandes sont envoyées directement sur WhatsApp (pas de base de données ni de paiement en ligne pour l'instant).

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [Tailwind CSS](https://tailwindcss.com) v4
- [Vercel Analytics](https://vercel.com/analytics)
- Déploiement recommandé : [Vercel](https://vercel.com)

## Développement local

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

Le site est disponible sur http://localhost:3000.

## Build de production

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## Contenu du site (lib/products.ts)

Les produits, promotions, bannières et le numéro WhatsApp sont centralisés dans `lib/products.ts`. Pour ajouter/modifier un produit ou une promo, il suffit d'éditer ce fichier — aucune base de données n'est nécessaire.

## Déploiement

Voir le guide fourni séparément pour :
1. Pousser le code sur GitHub
2. Déployer sur Vercel
3. Connecter le nom de domaine fleurdepeau.beauty (acheté chez Hostinger)
