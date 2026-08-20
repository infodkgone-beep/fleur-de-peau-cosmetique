-- ============================================================================
-- Suivi des visiteurs du site public (anonyme, sans cookie tiers)
-- ============================================================================

create table site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null, -- identifiant anonyme stocké dans un cookie 1ère partie côté visiteur
  path text not null,
  created_at timestamptz not null default now()
);

create index site_visits_created_at_idx on site_visits (created_at);
create index site_visits_visitor_id_idx on site_visits (visitor_id);

alter table site_visits enable row level security;

-- Lecture réservée au staff. Aucune policy d'insertion : les écritures passent
-- uniquement par la Server Action (clé service), qui contourne RLS.
create policy "staff_read_site_visits" on site_visits for select using (is_staff());

-- Statistiques agrégées jour / semaine / mois / année, utilisées par le tableau de bord admin.
create or replace function get_visitor_stats()
returns table (
  today_visitors bigint,
  today_views bigint,
  week_visitors bigint,
  week_views bigint,
  month_visitors bigint,
  month_views bigint,
  year_visitors bigint,
  year_views bigint
)
language sql
security definer
set search_path = public
as $$
  select
    count(distinct visitor_id) filter (where created_at >= date_trunc('day', now())) as today_visitors,
    count(*) filter (where created_at >= date_trunc('day', now())) as today_views,
    count(distinct visitor_id) filter (where created_at >= date_trunc('week', now())) as week_visitors,
    count(*) filter (where created_at >= date_trunc('week', now())) as week_views,
    count(distinct visitor_id) filter (where created_at >= date_trunc('month', now())) as month_visitors,
    count(*) filter (where created_at >= date_trunc('month', now())) as month_views,
    count(distinct visitor_id) filter (where created_at >= date_trunc('year', now())) as year_visitors,
    count(*) filter (where created_at >= date_trunc('year', now())) as year_views
  from site_visits;
$$;

-- Visites uniques par jour sur les 30 derniers jours, pour le graphique du tableau de bord.
create or replace function get_daily_visitor_counts(p_days int default 30)
returns table (
  day date,
  unique_visitors bigint
)
language sql
security definer
set search_path = public
as $$
  select
    d::date as day,
    count(distinct sv.visitor_id) as unique_visitors
  from generate_series(
    date_trunc('day', now()) - ((p_days - 1) || ' days')::interval,
    date_trunc('day', now()),
    '1 day'::interval
  ) as d
  left join site_visits sv on date_trunc('day', sv.created_at) = d
  group by d
  order by d;
$$;
