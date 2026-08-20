"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

type Point = { month: string; ca: number; depenses: number; achats: number }

export function AccountingChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
          formatter={(value) => `${Number(value).toLocaleString("fr-FR")} FCFA`}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="ca" name="Chiffre d'affaires" fill="var(--primary)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="depenses" name="Dépenses" fill="#e07a5f" radius={[6, 6, 0, 0]} />
        <Bar dataKey="achats" name="Achats fournisseurs" fill="#8d99ae" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
