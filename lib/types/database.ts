// Types TypeScript correspondant au schéma Supabase (supabase/migrations/0001_init.sql).
// Écrits à la main pour refléter le schéma — à régénérer avec `supabase gen types` si possible.

export type UserRole = "super_admin" | "admin_commercial" | "content_manager"
export type SaleChannel = "site" | "whatsapp" | "tiktok" | "facebook" | "instagram" | "telephone" | "boutique"
export type OrderStatus = "en_attente" | "confirmee" | "expediee" | "livree" | "annulee"
export type PaymentMethod = "especes" | "mobile_money" | "virement" | "carte" | "autre"
export type PaymentStatus = "en_attente" | "partiel" | "paye" | "rembourse"
export type StockMovementType = "vente" | "achat" | "ajustement" | "retour" | "inventaire"
export type ProductStatus = "actif" | "brouillon" | "archive"
export type DiscountType = "pourcentage" | "montant_fixe"
export type MarketingPlatform =
  | "meta_pixel"
  | "instagram"
  | "tiktok_pixel"
  | "google_analytics"
  | "google_tag_manager"
  | "google_ads"
  | "youtube"
  | "pinterest"
  | "snapchat"

export type ProfileRow = {
  id: string
  full_name: string
  email: string
  role: UserRole | null
  active: boolean
  created_at: string
  updated_at: string
}

export type CategoryRow = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  parent_id: string | null
  sort_order: number
  active: boolean
  created_at: string
}

export type BrandRow = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  active: boolean
  created_at: string
}

export type SupplierRow = {
  id: string
  name: string
  contact_name: string | null
  phone: string | null
  email: string | null
  address: string | null
  notes: string | null
  active: boolean
  created_at: string
}

export type ProductRow = {
  id: string
  name: string
  slug: string
  category_id: string | null
  brand_id: string | null
  short_description: string | null
  long_description: string | null
  benefits: string | null
  usage_instructions: string | null
  ingredients: string | null
  price: number
  compare_at_price: number | null
  cost_price: number
  sku: string | null
  barcode: string | null
  stock_quantity: number
  low_stock_threshold: number
  status: ProductStatus
  imported: boolean
  meta_title: string | null
  meta_description: string | null
  sort_order: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export type ProductImageRow = {
  id: string
  product_id: string
  url: string
  cloudinary_public_id: string
  alt_text: string | null
  sort_order: number
  created_at: string
}

export type ProductVariantRow = {
  id: string
  product_id: string
  name: string
  sku: string | null
  price_override: number | null
  stock_quantity: number
  active: boolean
  created_at: string
}

export type CustomerRow = {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  notes: string | null
  created_at: string
}

export type OrderRow = {
  id: string
  order_number: string
  customer_id: string | null
  channel: SaleChannel
  status: OrderStatus
  payment_status: PaymentStatus
  subtotal: number
  discount_amount: number
  delivery_fee: number
  total: number
  promo_code: string | null
  delivery_address: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type OrderItemRow = {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  product_name_snapshot: string
  unit_price: number
  unit_cost: number
  quantity: number
  line_total: number
}

export type PaymentRow = {
  id: string
  order_id: string
  amount: number
  method: PaymentMethod
  paid_at: string
  recorded_by: string | null
  notes: string | null
}

export type StockMovementRow = {
  id: string
  product_id: string
  variant_id: string | null
  quantity: number
  movement_type: StockMovementType
  channel: SaleChannel | null
  reference_order_id: string | null
  reference_purchase_id: string | null
  reason: string | null
  created_by: string | null
  created_at: string
}

export type PurchaseRow = {
  id: string
  supplier_id: string | null
  reference: string | null
  total_cost: number
  status: string
  notes: string | null
  created_by: string | null
  created_at: string
}

export type PurchaseItemRow = {
  id: string
  purchase_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  unit_cost: number
}

export type ExpenseRow = {
  id: string
  category: string
  label: string
  amount: number
  expense_date: string
  notes: string | null
  created_by: string | null
  created_at: string
}

export type RevenueRow = {
  id: string
  source: string
  label: string
  amount: number
  revenue_date: string
  notes: string | null
  created_by: string | null
  created_at: string
}

export type MarketingPixelRow = {
  id: string
  platform: MarketingPlatform
  pixel_id: string | null
  enabled: boolean
  updated_by: string | null
  updated_at: string
}

export type PromoCodeRow = {
  id: string
  code: string
  description: string | null
  discount_type: DiscountType
  discount_value: number
  active: boolean
  starts_at: string | null
  expires_at: string | null
  usage_limit: number | null
  used_count: number
  created_by: string | null
  created_at: string
}

export type ReviewRow = {
  id: string
  product_id: string
  customer_name: string
  rating: number
  comment: string | null
  approved: boolean
  created_at: string
}

export type HeroSlideRow = {
  id: string
  eyebrow: string | null
  title: string
  subtitle: string | null
  cta_label: string | null
  cta_href: string | null
  image_url: string | null
  cloudinary_public_id: string | null
  sort_order: number
  active: boolean
  updated_by: string | null
  updated_at: string
}

export type BannerRow = {
  id: string
  title: string
  description: string | null
  badge: string | null
  code: string | null
  link: string | null
  sort_order: number
  active: boolean
  updated_by: string | null
  updated_at: string
}

export type SiteSettingRow = {
  key: string
  value: unknown
  updated_by: string | null
  updated_at: string
}

export type ActivityLogRow = {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  details: unknown
  created_at: string
}

export type ProductMarginRow = {
  product_id: string
  name: string
  price: number
  cost_price: number
  margin_amount: number
  margin_percent: number
}

export type SiteVisitRow = {
  id: string
  visitor_id: string
  path: string
  created_at: string
}

export type VisitorStatsRow = {
  today_visitors: number
  today_views: number
  week_visitors: number
  week_views: number
  month_visitors: number
  month_views: number
  year_visitors: number
  year_views: number
}

export type DailyVisitorCountRow = {
  day: string
  unique_visitors: number
}

// Métadonnées de clés étrangères, nécessaires à postgrest-js pour typer les `select()` avec
// jointures imbriquées (ex: `products(name)`). Reflète les `references ...` de la migration SQL —
// si le schéma change, ces relations doivent être mises à jour en conséquence.
type Rel<FK extends string, Cols extends string[], Ref extends string, RefCols extends string[]> = {
  foreignKeyName: FK
  columns: Cols
  isOneToOne: boolean
  referencedRelation: Ref
  referencedColumns: RefCols
}

type TableDef<Row, Relationships extends unknown[] = []> = {
  Row: Row
  Insert: Partial<Row>
  Update: Partial<Row>
  Relationships: Relationships
}

type CategoriesRelationships = [Rel<"categories_parent_id_fkey", ["parent_id"], "categories", ["id"]>]

type ProductsRelationships = [
  Rel<"products_category_id_fkey", ["category_id"], "categories", ["id"]>,
  Rel<"products_brand_id_fkey", ["brand_id"], "brands", ["id"]>,
  Rel<"products_created_by_fkey", ["created_by"], "profiles", ["id"]>,
]

type ProductImagesRelationships = [Rel<"product_images_product_id_fkey", ["product_id"], "products", ["id"]>]

type ProductVariantsRelationships = [Rel<"product_variants_product_id_fkey", ["product_id"], "products", ["id"]>]

type OrdersRelationships = [
  Rel<"orders_customer_id_fkey", ["customer_id"], "customers", ["id"]>,
  Rel<"orders_created_by_fkey", ["created_by"], "profiles", ["id"]>,
]

type OrderItemsRelationships = [
  Rel<"order_items_order_id_fkey", ["order_id"], "orders", ["id"]>,
  Rel<"order_items_product_id_fkey", ["product_id"], "products", ["id"]>,
  Rel<"order_items_variant_id_fkey", ["variant_id"], "product_variants", ["id"]>,
]

type PaymentsRelationships = [
  Rel<"payments_order_id_fkey", ["order_id"], "orders", ["id"]>,
  Rel<"payments_recorded_by_fkey", ["recorded_by"], "profiles", ["id"]>,
]

type StockMovementsRelationships = [
  Rel<"stock_movements_product_id_fkey", ["product_id"], "products", ["id"]>,
  Rel<"stock_movements_variant_id_fkey", ["variant_id"], "product_variants", ["id"]>,
  Rel<"stock_movements_reference_order_id_fkey", ["reference_order_id"], "orders", ["id"]>,
  Rel<"stock_movements_purchase_fk", ["reference_purchase_id"], "purchases", ["id"]>,
  Rel<"stock_movements_created_by_fkey", ["created_by"], "profiles", ["id"]>,
]

type PurchasesRelationships = [
  Rel<"purchases_supplier_id_fkey", ["supplier_id"], "suppliers", ["id"]>,
  Rel<"purchases_created_by_fkey", ["created_by"], "profiles", ["id"]>,
]

type PurchaseItemsRelationships = [
  Rel<"purchase_items_purchase_id_fkey", ["purchase_id"], "purchases", ["id"]>,
  Rel<"purchase_items_product_id_fkey", ["product_id"], "products", ["id"]>,
  Rel<"purchase_items_variant_id_fkey", ["variant_id"], "product_variants", ["id"]>,
]

type ExpensesRelationships = [Rel<"expenses_created_by_fkey", ["created_by"], "profiles", ["id"]>]
type RevenuesRelationships = [Rel<"revenues_created_by_fkey", ["created_by"], "profiles", ["id"]>]
type MarketingPixelsRelationships = [Rel<"marketing_pixels_updated_by_fkey", ["updated_by"], "profiles", ["id"]>]
type PromoCodesRelationships = [Rel<"promo_codes_created_by_fkey", ["created_by"], "profiles", ["id"]>]
type ReviewsRelationships = [Rel<"reviews_product_id_fkey", ["product_id"], "products", ["id"]>]
type HeroSlidesRelationships = [Rel<"hero_slides_updated_by_fkey", ["updated_by"], "profiles", ["id"]>]
type BannersRelationships = [Rel<"banners_updated_by_fkey", ["updated_by"], "profiles", ["id"]>]
type SiteSettingsRelationships = [Rel<"site_settings_updated_by_fkey", ["updated_by"], "profiles", ["id"]>]
type ActivityLogRelationships = [Rel<"activity_log_user_id_fkey", ["user_id"], "profiles", ["id"]>]

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<ProfileRow>
      categories: TableDef<CategoryRow, CategoriesRelationships>
      brands: TableDef<BrandRow>
      suppliers: TableDef<SupplierRow>
      products: TableDef<ProductRow, ProductsRelationships>
      product_images: TableDef<ProductImageRow, ProductImagesRelationships>
      product_variants: TableDef<ProductVariantRow, ProductVariantsRelationships>
      customers: TableDef<CustomerRow>
      orders: TableDef<OrderRow, OrdersRelationships>
      order_items: TableDef<OrderItemRow, OrderItemsRelationships>
      payments: TableDef<PaymentRow, PaymentsRelationships>
      stock_movements: TableDef<StockMovementRow, StockMovementsRelationships>
      purchases: TableDef<PurchaseRow, PurchasesRelationships>
      purchase_items: TableDef<PurchaseItemRow, PurchaseItemsRelationships>
      expenses: TableDef<ExpenseRow, ExpensesRelationships>
      revenues: TableDef<RevenueRow, RevenuesRelationships>
      marketing_pixels: TableDef<MarketingPixelRow, MarketingPixelsRelationships>
      promo_codes: TableDef<PromoCodeRow, PromoCodesRelationships>
      reviews: TableDef<ReviewRow, ReviewsRelationships>
      hero_slides: TableDef<HeroSlideRow, HeroSlidesRelationships>
      banners: TableDef<BannerRow, BannersRelationships>
      site_settings: TableDef<SiteSettingRow, SiteSettingsRelationships>
      activity_log: TableDef<ActivityLogRow, ActivityLogRelationships>
      site_visits: TableDef<SiteVisitRow>
    }
    Views: {
      product_margins: { Row: ProductMarginRow; Relationships: [] }
    }
    Functions: {
      apply_stock_movement: {
        Args: {
          p_product_id: string | null
          p_variant_id: string | null
          p_quantity: number
          p_movement_type: StockMovementType
          p_channel: SaleChannel | null
          p_reference_order_id: string | null
          p_reference_purchase_id: string | null
          p_reason: string | null
          p_created_by: string | null
        }
        Returns: undefined
      }
      get_visitor_stats: {
        Args: Record<string, never>
        Returns: VisitorStatsRow[]
      }
      get_daily_visitor_counts: {
        Args: { p_days: number }
        Returns: DailyVisitorCountRow[]
      }
    }
    Enums: {
      user_role: UserRole
      sale_channel: SaleChannel
      order_status: OrderStatus
      payment_method: PaymentMethod
      payment_status: PaymentStatus
      stock_movement_type: StockMovementType
      product_status: ProductStatus
      discount_type: DiscountType
      marketing_platform: MarketingPlatform
    }
  }
}
