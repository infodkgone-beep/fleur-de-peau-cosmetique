-- Permet d'associer une image Cloudinary (logo) à chaque marque, pour le bandeau "Nos marques"
-- de la page d'accueil (affiché en logos plutôt qu'en texte une fois les logos ajoutés).

alter table brands add column if not exists logo_public_id text;
