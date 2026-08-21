-- ============================================================================
-- Suivi des installations de l'application (PWA) — mobile, PC, tablette, iOS, Android
-- ============================================================================
--
-- Important, à lire avant d'utiliser cette table : aucun site web ne peut détecter avec
-- certitude qu'une personne DÉSINSTALLE une application installée depuis un navigateur
-- (Chrome, Safari...). Ce n'est pas une limite de ce code : c'est une limite technique
-- universelle du web (Facebook, Google etc. ont exactement la même limite pour leurs PWA).
-- Ce que cette table permet de savoir avec certitude, c'est : qui a réellement OUVERT
-- l'application installée, et quand pour la dernière fois. Une longue période sans
-- réouverture est un indice probable de désinstallation (ou simplement de non-usage),
-- jamais une preuve. Voir get_pwa_install_stats() plus bas et la page d'admin associée.

create table pwa_installs (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null unique, -- identifiant anonyme généré et stocké sur l'appareil (localStorage)
  platform text not null default 'autre', -- 'android' | 'ios' | 'desktop' | 'autre'
  user_agent text,
  installed_at timestamptz not null default now(), -- 1ère fois où l'appli a été vue ouverte en mode "application"
  last_seen_at timestamptz not null default now() -- dernière fois où l'appli a été ouverte en mode "application"
);

create index pwa_installs_last_seen_idx on pwa_installs (last_seen_at);

alter table pwa_installs enable row level security;

-- Lecture réservée au staff. Aucune policy d'insertion/mise à jour : les écritures passent
-- uniquement par la Server Action (clé service), qui contourne RLS — exactement comme pour
-- site_visits (migration 0002).
create policy "staff_read_pwa_installs" on pwa_installs for select using (is_staff());

-- Résumé pour la page admin : total d'appareils, actifs récemment, par plateforme.
-- "actif" = ouverte au cours des 3 derniers jours. "probablement désinstallée" = aucune
-- ouverture depuis 30 jours ou plus (estimation, jamais une certitude — voir note ci-dessus).
create or replace function get_pwa_install_stats()
returns table (
  total_installs bigint,
  active_3d bigint,
  inactive_30d bigint,
  android_count bigint,
  ios_count bigint,
  desktop_count bigint,
  autre_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    count(*) as total_installs,
    count(*) filter (where last_seen_at >= now() - interval '3 days') as active_3d,
    count(*) filter (where last_seen_at < now() - interval '30 days') as inactive_30d,
    count(*) filter (where platform = 'android') as android_count,
    count(*) filter (where platform = 'ios') as ios_count,
    count(*) filter (where platform = 'desktop') as desktop_count,
    count(*) filter (where platform = 'autre') as autre_count
  from pwa_installs;
$$;
