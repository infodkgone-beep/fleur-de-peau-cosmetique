# Guide de mise en service — Espace admin Fleur de peau

Ce guide couvre la mise en route de la nouvelle plateforme (base de données, comptes staff, variables d'environnement, déploiement). Il vient compléter le premier guide (GitHub / Vercel / Hostinger) déjà utilisé pour publier le site.

## 1. Appliquer le schéma de base de données

La base Supabase créée pour Fleur de peau est vide pour l'instant — il faut y injecter le schéma une seule fois.

1. Va sur [supabase.com](https://supabase.com/dashboard), ouvre le projet Fleur de peau.
2. Dans le menu de gauche, clique sur **SQL Editor** → **New query**.
3. Ouvre le fichier `supabase/migrations/0001_init.sql` (dans le dossier livré), copie tout son contenu, colle-le dans l'éditeur SQL.
4. Clique sur **Run**. Ça crée toutes les tables, les règles de sécurité (RLS) et les données de départ (catégories, paramètres du site, pixels marketing désactivés).

Si tu vois une erreur "already exists", c'est probablement que le script a déjà été exécuté partiellement — dis-le-moi, je t'aiderai à corriger.

## 2. Créer le premier compte Super Admin

Personne ne peut s'auto-attribuer un rôle (c'est une protection volontaire). Il faut créer le tout premier compte à la main :

1. Dans Supabase, va dans **Authentication** → **Users** → **Add user** → **Create new user**.
2. Renseigne ton e-mail et un mot de passe, coche **Auto Confirm User**, valide.
3. Retourne dans **SQL Editor**, et lance :
   ```sql
   update profiles set role = 'super_admin' where email = 'TON_EMAIL_ICI';
   ```
4. Tu peux maintenant te connecter sur `/login` avec cet e-mail et ce mot de passe — tu arriveras sur le tableau de bord admin avec accès complet.

Une fois connecté en Super Admin, tu peux créer les autres comptes staff (Admin Commercial, Gestionnaire Contenu) directement depuis **Utilisateurs & rôles** dans l'admin — plus besoin de SQL après ça.

## 3. Variables d'environnement

### En local (fichier `.env.local`, déjà inclus dans le dossier livré)

```
NEXT_PUBLIC_SUPABASE_URL=https://mavppibzmvgbaflevpqe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_STSARwl7WTs8ZX0WtT22cg_ixQyY3y5
   SUPABASE_SERVICE_ROLE_KEY=<voir ton fichier .env.local ou le dashboard Supabase>
CLOUDINARY_CLOUD_NAME=giumizee
CLOUDINARY_API_KEY=562385796682115
CLOUDINARY_API_SECRET=HmwmQ0EiWADiMvZR_G0f62J9dHs
NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER=fleur-de-peau
```

⚠️ `SUPABASE_SERVICE_ROLE_KEY` et `CLOUDINARY_API_SECRET` sont des clés **secrètes** — elles ne doivent jamais être commitées sur GitHub (le `.gitignore` du projet les exclut déjà) ni partagées publiquement.

### Sur Vercel (obligatoire pour que le site déployé fonctionne)

Dashboard Vercel → ton projet → **Settings** → **Environment Variables** → ajoute exactement les 7 mêmes variables que ci-dessus (nom + valeur), pour l'environnement **Production** (et Preview si tu veux tester les branches). Puis redéploie (Vercel le fait automatiquement au prochain push, ou clique sur **Redeploy**).

## 4. Tester en local avant de pousser

```bash
npm install
npm run dev
```

- Site public : http://localhost:3000
- Connexion admin : http://localhost:3000/login
- Espace admin : http://localhost:3000/admin

## 5. Déployer

Même processus que la première fois :

```bash
git add .
git commit -m "Ajout de l'espace admin complet (produits, commandes, stock, comptabilité, marketing)"
git push
```

Vercel redéploie automatiquement. Une fois les variables d'environnement ajoutées (étape 3), le site en ligne aura accès à Supabase et Cloudinary.

## 6. Ce qui a été construit

- **Produits** : fiches complètes (description, bienfaits, ingrédients, SEO), galerie d'images Cloudinary, gestion des prix/coûts/marges, statut (actif/brouillon/archivé).
- **Commandes / ventes multi-canal** : enregistrement des ventes site, WhatsApp, TikTok, Facebook, Instagram, téléphone, boutique — avec mise à jour automatique du stock.
- **Stock centralisé** : journal complet des mouvements (date, heure, produit, quantité, origine, utilisateur, motif), ajustements manuels, achats fournisseurs — le stock ne peut jamais devenir négatif.
- **Comptabilité** : chiffre d'affaires, marges, dépenses, achats, bénéfice net (jour/mois/année), graphique, export CSV (compatible Excel).
- **Fiche produit publique** : galerie zoomable, avis clients, produits similaires, boutons WhatsApp/commande, SEO complet (meta tags, Open Graph, JSON-LD, sitemap).
- **Pixels marketing** : active/désactive Meta, Instagram, TikTok, Google Analytics, GTM, Google Ads, Pinterest, Snapchat sans toucher au code — injectés automatiquement sur le site.
- **Contenu du site** : slider d'accueil et bannières promotionnelles éditables depuis l'admin.
- **Codes promo** : création et gestion.
- **Utilisateurs & rôles** : création de comptes staff et gestion des permissions (Super Admin / Admin Commercial / Gestionnaire Contenu).
- **Sécurité** : accès par rôle appliqué à la fois côté base de données (RLS) et côté application, journal d'activité sur les actions sensibles.

## 7. Limites connues de cette première version (à affiner ensuite)

Comme convenu, c'est une V1 solide et fonctionnelle plutôt qu'un produit fini à 100% — voici ce qui reste basique pour l'instant :

- **Export comptable** : CSV/Excel disponible ; l'export PDF n'est pas encore implémenté (on peut l'ajouter, ou utiliser l'impression du navigateur en attendant).
- **Variantes produit** (ex: tailles, couleurs) : la table existe en base mais il n'y a pas encore d'interface admin dédiée — actuellement chaque produit est géré comme une fiche unique.
- **Pixel "YouTube"** : activable dans l'admin mais n'injecte aucun script (il n'existe pas de balise de suivi universelle pour YouTube — à traiter au cas par cas si besoin).
- **Modification du slider/bannières** : possible de créer et activer/désactiver, mais pas encore d'édition en place après création (il faut supprimer et recréer pour changer un champ).
- **Premier compte Super Admin** : doit être créé à la main via SQL une seule fois (étape 2 ci-dessus) — ensuite tout se gère depuis l'interface.

N'hésite pas à me dire ce que tu veux améliorer en premier une fois que tu as testé.
