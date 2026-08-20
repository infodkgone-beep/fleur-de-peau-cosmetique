-- ============================================================================
-- Fleur de peau Cosmétique — schéma initial
-- Plateforme e-commerce multi-canal (site, WhatsApp, TikTok, téléphone, boutique)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type user_role as enum ('super_admin', 'admin_commercial', 'content_manager');
create type sale_channel as enum ('site', 'whatsapp', 'tiktok', 'facebook', 'instagram', 'telephone', 'boutique');
create type order_status as enum ('en_attente', 'confirmee', 'expediee', 'livree', 'annulee');
create type payment_method as enum ('especes', 'mobile_money', 'virement', 'carte', 'autre');
create type payment_status as enum ('en_attente', 'partiel', 'paye', 'rembourse');
create type stock_movement_type as enum ('vente', 'achat', 'ajustement', 'retour', 'inventaire');
create type product_status as enum ('actif', 'brouillon', 'archive');
create type discount_type as enum ('pourcentage', 'montant_fixe');
create type marketing_platform as enum ('meta_pixel', 'instagram', 'tiktok_pixel', 'google_analytics', 'google_tag_manager', 'google_ads', 'youtube', 'pinterest', 'snapchat');

-- ----------------------------------------------------------------------------
-- Profils utilisateurs (staff / administration) — étend auth.users
-- ----------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role user_role,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table profiles is 'Comptes du personnel (Super Admin, Admin Commercial, Gestionnaire Contenu). Le rôle doit être attribué manuellement par un Super Admin — jamais auto-attribué à l''inscription.';

-- ----------------------------------------------------------------------------
-- Catalogue : catégories, marques, produits, variantes, images
-- ----------------------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon text,
  parent_id uuid references categories(id) on delete set null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  phone text,
  email text,
  address text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid references categories(id) on delete set null,
  brand_id uuid references brands(id) on delete set null,
  short_description text,
  long_description text,
  benefits text,
  usage_instructions text,
  ingredients text,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= 0),
  cost_price numeric(12,2) not null default 0 check (cost_price >= 0),
  sku text unique,
  barcode text,
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  low_stock_threshold int not null default 5,
  status product_status not null default 'brouillon',
  imported boolean not null default false,
  meta_title text,
  meta_description text,
  sort_order int not null default 0,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column products.cost_price is 'Coût d''achat unitaire — sert au calcul automatique de la marge (price - cost_price).';

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  cloudinary_public_id text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null, -- ex: "50ml", "Rose"
  sku text unique,
  price_override numeric(12,2) check (price_override is null or price_override >= 0),
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Clients
-- ----------------------------------------------------------------------------
create table customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  address text,
  city text default 'Abidjan',
  notes text,
  created_at timestamptz not null default now()
);

create unique index customers_phone_unique on customers (phone) where phone is not null;

-- ----------------------------------------------------------------------------
-- Commandes / ventes multi-canal
-- ----------------------------------------------------------------------------
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('CMD-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6)),
  customer_id uuid references customers(id) on delete set null,
  channel sale_channel not null default 'site',
  status order_status not null default 'en_attente',
  payment_status payment_status not null default 'en_attente',
  subtotal numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  promo_code text,
  delivery_address text,
  notes text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name_snapshot text not null,
  unit_price numeric(12,2) not null,
  unit_cost numeric(12,2) not null default 0,
  quantity int not null check (quantity > 0),
  line_total numeric(12,2) not null
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  method payment_method not null default 'especes',
  paid_at timestamptz not null default now(),
  recorded_by uuid references profiles(id) on delete set null,
  notes text
);

-- ----------------------------------------------------------------------------
-- Stock : mouvements, achats fournisseurs
-- ----------------------------------------------------------------------------
create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete set null,
  quantity int not null, -- positif = entrée, négatif = sortie
  movement_type stock_movement_type not null,
  channel sale_channel,
  reference_order_id uuid references orders(id) on delete set null,
  reference_purchase_id uuid,
  reason text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table purchases (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references suppliers(id) on delete set null,
  reference text,
  total_cost numeric(12,2) not null default 0,
  status text not null default 'recu',
  notes text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table purchase_items (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references purchases(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete set null,
  quantity int not null check (quantity > 0),
  unit_cost numeric(12,2) not null check (unit_cost >= 0)
);

alter table stock_movements
  add constraint stock_movements_purchase_fk
  foreign key (reference_purchase_id) references purchases(id) on delete set null;

-- ----------------------------------------------------------------------------
-- Comptabilité : dépenses, revenus divers
-- ----------------------------------------------------------------------------
create table expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  label text not null,
  amount numeric(12,2) not null check (amount > 0),
  expense_date date not null default current_date,
  notes text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table revenues (
  id uuid primary key default gen_random_uuid(),
  source text not null, -- ex: "Vente diverse", "Prestation", hors commandes catalogue
  label text not null,
  amount numeric(12,2) not null check (amount > 0),
  revenue_date date not null default current_date,
  notes text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Marketing : pixels, codes promo, avis clients
-- ----------------------------------------------------------------------------
create table marketing_pixels (
  id uuid primary key default gen_random_uuid(),
  platform marketing_platform not null unique,
  pixel_id text,
  enabled boolean not null default false,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type discount_type not null default 'pourcentage',
  discount_value numeric(12,2) not null check (discount_value > 0),
  active boolean not null default true,
  starts_at timestamptz,
  expires_at timestamptz,
  usage_limit int,
  used_count int not null default 0,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Contenu du site : bannières, slider hero, paramètres
-- ----------------------------------------------------------------------------
create table hero_slides (
  id uuid primary key default gen_random_uuid(),
  eyebrow text,
  title text not null,
  subtitle text,
  cta_label text,
  cta_href text,
  image_url text,
  cloudinary_public_id text,
  sort_order int not null default 0,
  active boolean not null default true,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  badge text,
  code text,
  link text,
  sort_order int not null default 0,
  active boolean not null default true,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

comment on table site_settings is 'Paramètres généraux clé/valeur : numéro WhatsApp, textes d''annonce, seuils de livraison gratuite, réseaux sociaux, etc.';

-- ----------------------------------------------------------------------------
-- Journal d'activité (sécurité / audit)
-- ----------------------------------------------------------------------------
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Index utiles
-- ============================================================================
create index idx_products_category on products(category_id);
create index idx_products_brand on products(brand_id);
create index idx_products_status on products(status);
create index idx_product_images_product on product_images(product_id);
create index idx_product_variants_product on product_variants(product_id);
create index idx_orders_channel on orders(channel);
create index idx_orders_status on orders(status);
create index idx_orders_created_at on orders(created_at desc);
create index idx_order_items_order on order_items(order_id);
create index idx_stock_movements_product on stock_movements(product_id);
create index idx_stock_movements_created_at on stock_movements(created_at desc);
create index idx_reviews_product on reviews(product_id) where approved = true;

-- ============================================================================
-- Fonctions utilitaires
-- ============================================================================

-- Rôle de l'utilisateur actuellement authentifié (NULL si non-staff / non connecté)
create or replace function auth_user_role()
returns user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from profiles where id = auth.uid() and active = true;
$$;

-- Est un membre actif du staff (n'importe quel rôle)
create or replace function is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and active = true and role is not null);
$$;

-- Crée automatiquement un profil (sans rôle) à l'inscription d'un utilisateur Supabase Auth.
-- Le rôle doit ensuite être attribué manuellement par un Super Admin via l'interface ou le SQL editor.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.email, null);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Recalcule et applique un mouvement de stock, en empêchant tout stock négatif.
create or replace function apply_stock_movement(
  p_product_id uuid,
  p_variant_id uuid,
  p_quantity int,
  p_movement_type stock_movement_type,
  p_channel sale_channel,
  p_reference_order_id uuid,
  p_reference_purchase_id uuid,
  p_reason text,
  p_created_by uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_stock int;
begin
  if p_variant_id is not null then
    select stock_quantity into v_current_stock from product_variants where id = p_variant_id for update;
  else
    select stock_quantity into v_current_stock from products where id = p_product_id for update;
  end if;

  if v_current_stock + p_quantity < 0 then
    raise exception 'Stock insuffisant pour ce produit (stock actuel: %, mouvement demandé: %)', v_current_stock, p_quantity;
  end if;

  if p_variant_id is not null then
    update product_variants set stock_quantity = stock_quantity + p_quantity where id = p_variant_id;
  else
    update products set stock_quantity = stock_quantity + p_quantity, updated_at = now() where id = p_product_id;
  end if;

  insert into stock_movements (product_id, variant_id, quantity, movement_type, channel, reference_order_id, reference_purchase_id, reason, created_by)
  values (p_product_id, p_variant_id, p_quantity, p_movement_type, p_channel, p_reference_order_id, p_reference_purchase_id, p_reason, p_created_by);
end;
$$;

-- Marge automatique d'un produit
create or replace view product_margins as
select
  id as product_id,
  name,
  price,
  cost_price,
  (price - cost_price) as margin_amount,
  case when price > 0 then round(((price - cost_price) / price) * 100, 2) else 0 end as margin_percent
from products;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table profiles enable row level security;
alter table categories enable row level security;
alter table brands enable row level security;
alter table suppliers enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table stock_movements enable row level security;
alter table purchases enable row level security;
alter table purchase_items enable row level security;
alter table expenses enable row level security;
alter table revenues enable row level security;
alter table marketing_pixels enable row level security;
alter table promo_codes enable row level security;
alter table reviews enable row level security;
alter table hero_slides enable row level security;
alter table banners enable row level security;
alter table site_settings enable row level security;
alter table activity_log enable row level security;

-- Lecture publique (vitrine) : catalogue actif, contenu actif, avis approuvés
create policy "public_read_categories" on categories for select using (active = true);
create policy "public_read_brands" on brands for select using (active = true);
create policy "public_read_products" on products for select using (status = 'actif');
create policy "public_read_product_images" on product_images for select using (
  exists (select 1 from products p where p.id = product_images.product_id and p.status = 'actif')
);
create policy "public_read_product_variants" on product_variants for select using (
  active = true and exists (select 1 from products p where p.id = product_variants.product_id and p.status = 'actif')
);
create policy "public_read_hero_slides" on hero_slides for select using (active = true);
create policy "public_read_banners" on banners for select using (active = true);
create policy "public_read_reviews" on reviews for select using (approved = true);
create policy "public_read_site_settings" on site_settings for select using (true);
create policy "public_read_active_promo" on promo_codes for select using (
  active = true and (expires_at is null or expires_at > now())
);

-- Staff : lecture de son propre profil + tous les profils visibles par super_admin
create policy "staff_read_own_profile" on profiles for select using (id = auth.uid());
create policy "super_admin_manage_profiles" on profiles for all using (auth_user_role() = 'super_admin') with check (auth_user_role() = 'super_admin');

-- Super Admin : accès total à tout (catalogue, structure)
create policy "super_admin_all_categories" on categories for all using (auth_user_role() = 'super_admin') with check (auth_user_role() = 'super_admin');
create policy "super_admin_all_brands" on brands for all using (auth_user_role() = 'super_admin') with check (auth_user_role() = 'super_admin');
create policy "super_admin_all_suppliers" on suppliers for all using (auth_user_role() = 'super_admin') with check (auth_user_role() = 'super_admin');

-- Produits : Super Admin (tout) + Admin Commercial (prix/stock, pas ajout/suppression)
create policy "super_admin_all_products" on products for all using (auth_user_role() = 'super_admin') with check (auth_user_role() = 'super_admin');
create policy "commercial_update_products" on products for update using (auth_user_role() = 'admin_commercial') with check (auth_user_role() = 'admin_commercial');
create policy "content_manager_read_products" on products for select using (auth_user_role() = 'content_manager');

create policy "super_admin_all_product_images" on product_images for all using (auth_user_role() = 'super_admin') with check (auth_user_role() = 'super_admin');
create policy "content_manager_manage_images" on product_images for all using (auth_user_role() = 'content_manager') with check (auth_user_role() = 'content_manager');

create policy "super_admin_all_variants" on product_variants for all using (auth_user_role() = 'super_admin') with check (auth_user_role() = 'super_admin');
create policy "commercial_manage_variants" on product_variants for all using (auth_user_role() = 'admin_commercial') with check (auth_user_role() = 'admin_commercial');

-- Clients / commandes / paiements : Super Admin + Admin Commercial
create policy "staff_sales_manage_customers" on customers for all using (auth_user_role() in ('super_admin','admin_commercial')) with check (auth_user_role() in ('super_admin','admin_commercial'));
create policy "staff_sales_manage_orders" on orders for all using (auth_user_role() in ('super_admin','admin_commercial')) with check (auth_user_role() in ('super_admin','admin_commercial'));
create policy "staff_sales_manage_order_items" on order_items for all using (auth_user_role() in ('super_admin','admin_commercial')) with check (auth_user_role() in ('super_admin','admin_commercial'));
create policy "staff_sales_manage_payments" on payments for all using (auth_user_role() in ('super_admin','admin_commercial')) with check (auth_user_role() in ('super_admin','admin_commercial'));

-- Stock / achats : Super Admin + Admin Commercial
create policy "staff_sales_manage_stock" on stock_movements for all using (auth_user_role() in ('super_admin','admin_commercial')) with check (auth_user_role() in ('super_admin','admin_commercial'));
create policy "staff_sales_manage_purchases" on purchases for all using (auth_user_role() in ('super_admin','admin_commercial')) with check (auth_user_role() in ('super_admin','admin_commercial'));
create policy "staff_sales_manage_purchase_items" on purchase_items for all using (auth_user_role() in ('super_admin','admin_commercial')) with check (auth_user_role() in ('super_admin','admin_commercial'));

-- Comptabilité : Super Admin uniquement (Admin Commercial voit ventes/bénéfices via vues dédiées, pas dépenses brutes)
create policy "super_admin_manage_expenses" on expenses for all using (auth_user_role() = 'super_admin') with check (auth_user_role() = 'super_admin');
create policy "super_admin_manage_revenues" on revenues for all using (auth_user_role() = 'super_admin') with check (auth_user_role() = 'super_admin');

-- Marketing pixels : Super Admin uniquement
create policy "super_admin_manage_pixels" on marketing_pixels for all using (auth_user_role() = 'super_admin') with check (auth_user_role() = 'super_admin');

-- Codes promo : Super Admin + Admin Commercial
create policy "staff_manage_promo_codes" on promo_codes for all using (auth_user_role() in ('super_admin','admin_commercial')) with check (auth_user_role() in ('super_admin','admin_commercial'));

-- Avis clients : lecture publique (approuvés, déjà couvert), modération par tout le staff
create policy "staff_manage_reviews" on reviews for all using (is_staff()) with check (is_staff());

-- Contenu (slider, bannières, paramètres) : Super Admin + Gestionnaire Contenu
create policy "content_staff_manage_hero" on hero_slides for all using (auth_user_role() in ('super_admin','content_manager')) with check (auth_user_role() in ('super_admin','content_manager'));
create policy "content_staff_manage_banners" on banners for all using (auth_user_role() in ('super_admin','content_manager')) with check (auth_user_role() in ('super_admin','content_manager'));
create policy "content_staff_manage_settings" on site_settings for all using (auth_user_role() in ('super_admin','content_manager')) with check (auth_user_role() in ('super_admin','content_manager'));

-- Journal d'activité : lecture Super Admin, écriture par tout le staff (traçabilité)
create policy "super_admin_read_activity_log" on activity_log for select using (auth_user_role() = 'super_admin');
create policy "staff_write_activity_log" on activity_log for insert with check (is_staff());

-- ============================================================================
-- Données de départ : paramètres du site, pixels désactivés par défaut
-- ============================================================================
insert into site_settings (key, value) values
  ('whatsapp_number', '"2250702602458"'),
  ('free_delivery_threshold', '20000'),
  ('announcements', '["🎉 -20% sur tous les sérums cette semaine · Code SERUM20", "🚚 Livraison OFFERTE à Abidjan dès 20 000 FCFA d''achat", "🌸 Nouveaux produits importés en stock · Quantités limitées"]');

insert into marketing_pixels (platform, enabled) values
  ('meta_pixel', false),
  ('instagram', false),
  ('tiktok_pixel', false),
  ('google_analytics', false),
  ('google_tag_manager', false),
  ('google_ads', false),
  ('youtube', false),
  ('pinterest', false),
  ('snapchat', false);

insert into categories (name, slug, description, icon, sort_order) values
  ('Soins du visage', 'soins-du-visage', 'Éclat & fraîcheur', 'Sparkles', 1),
  ('Soins du corps', 'soins-du-corps', 'Douceur au quotidien', 'Flower2', 2),
  ('Anti-taches éclaircissants', 'anti-taches-eclaircissants', 'Teint unifié', 'Sun', 3),
  ('Hydratants nourrissants', 'hydratants-nourrissants', 'Peau nourrie', 'Droplets', 4),
  ('Protection solaire', 'protection-solaire', 'Protection UV', 'ShieldCheck', 5),
  ('Compléments alimentaires', 'complements-alimentaires', 'Beauté de l''intérieur', 'Leaf', 6);
