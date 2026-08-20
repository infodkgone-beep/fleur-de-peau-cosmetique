"use client"

/** Génère et télécharge un CSV côté navigateur (compatible Excel) à partir de lignes déjà chargées côté serveur. */
export function ExportCsvButton({
  filename,
  headers,
  rows,
  label,
}: {
  filename: string
  headers: string[]
  rows: (string | number)[][]
  label: string
}) {
  function handleExport() {
    const escape = (v: string | number) => {
      const s = String(v ?? "")
      return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const csv = [headers, ...rows].map((r) => r.map(escape).join(";")).join("\n")
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
    >
      {label}
    </button>
  )
}
