-- Connecte le slider d'accueil et les bannières promotionnelles gérés dans l'admin
-- ("Contenu du site") au contenu réellement affiché sur le site public.
--
-- Avant cette migration, components/hero.tsx et components/banner-carousel.tsx affichaient
-- du contenu codé en dur, sans aucun lien avec les tables hero_slides / banners que l'admin
-- gère — d'où la confusion : l'admin semblait vide alors que le site affichait bien des images.
--
-- Cette migration :
--   1. Ajoute à la table "banners" les colonnes image_url / cloudinary_public_id qui lui
--      manquaient (elle ne pouvait donc pas stocker d'image du tout jusqu'ici).
--   2. Insère dans hero_slides et banners le contenu actuellement affiché en dur sur le site,
--      pour que l'admin reflète immédiatement ce que les clientes voient déjà — et que toute
--      modification faite dans l'admin à partir de maintenant apparaisse réellement sur le site.
--
-- À exécuter UNE SEULE FOIS dans l'éditeur SQL de Supabase.

alter table banners add column if not exists image_url text;
alter table banners add column if not exists cloudinary_public_id text;

insert into hero_slides (eyebrow, title, subtitle, cta_label, cta_href, image_url, sort_order, active)
values (
  'Cosmétiques importés',
  'La beauté qui commence par la peau',
  'Produits importés, une peau saine, une beauté qui se voit. Découvrez notre sélection de soins premium pour sublimer votre peau au quotidien.',
  'Découvrir la boutique',
  '#boutique',
  '/images/hero-composition.webp',
  0,
  true
);

insert into banners (title, description, badge, link, image_url, sort_order, active)
values
  ('-20% sur tous les sérums', 'Éclat, hydratation et anti-taches à prix réduit. Code SERUM20.', 'Offre de la semaine', '#promotions', '/images/banner-serums.webp', 0, true),
  ('Livraison offerte à Abidjan', 'Dès 20 000 FCFA d''achat. Vos soins livrés jusqu''à votre porte.', 'Rien que pour vous', '#boutique', '/images/banner-delivery.webp', 1, true),
  ('Nouveaux produits importés', 'Fraîchement arrivés et en quantités limitées. À saisir vite !', 'Nouveautés', '#boutique', '/images/banner-newarrivals.webp', 2, true);
