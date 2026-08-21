"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/products"
import { OrderStatusSelect } from "@/components/admin/order-status-select"
import { PaymentStatusSelect } from "@/components/admin/payment-status-select"
import { OrderRowToggle, OrderRowDetails } from "@/components/admin/order-row-details"
import type { OrderStatus, PaymentStatus } from "@/lib/types/database"

type OrderItem = {
  product_name_snapshot: string
  quantity: number
  unit_price: number
  line_total: number
}

const CHANNEL_LABELS: Record<string, string> = {
  site: "Site web",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
  facebook: "Facebook",
  instagram: "Instagram",
  telephone: "Téléphone",
  boutique: "Boutique",
}

export function OrderRow({
  id,
  orderNumber,
  customerName,
  customerPhone,
  channel,
  status,
  paymentStatus,
  total,
  createdAt,
  deliveryAddress,
  notes,
  items,
}: {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string | null
  channel: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  total: number
  createdAt: string
  deliveryAddress: string | null
  notes: string | null
  items: OrderItem[]
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <tr className="border-b border-border last:border-0">
        <td className="px-2 py-3">
          <OrderRowToggle expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
        </td>
        <td className="px-4 py-3 font-mono text-xs">{orderNumber}</td>
        <td className="px-4 py-3">
          <p className="text-foreground">{customerName}</p>
          {customerPhone && <p className="text-xs text-muted-foreground">{customerPhone}</p>}
        </td>
        <td className="px-4 py-3">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
            {CHANNEL_LABELS[channel] ?? channel}
          </span>
        </td>
        <td className="px-4 py-3 font-semibold">{formatPrice(total)}</td>
        <td className="px-4 py-3">
          <PaymentStatusSelect orderId={id} paymentStatus={paymentStatus} />
        </td>
        <td className="px-4 py-3">
          <OrderStatusSelect orderId={id} status={status} orderNumber={orderNumber} customerPhone={customerPhone} />
        </td>
        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(createdAt).toLocaleDateString("fr-FR")}</td>
      </tr>
      {expanded && (
        <tr className="border-b border-border last:border-0">
          <td colSpan={8} className="p-0">
            <OrderRowDetails items={items} deliveryAddress={deliveryAddress} notes={notes} />
          </td>
        </tr>
      )}
    </>
  )
}
