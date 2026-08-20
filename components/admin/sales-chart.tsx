"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export function SalesChart({ data }: { data: { date: string; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
          formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} FCFA`, "Ventes"]}
        />
        <Area type="monotone" dataKey="total" stroke="var(--primary)" fill="url(#salesGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
