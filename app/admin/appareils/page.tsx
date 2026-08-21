import { Smartphone, Monitor, Apple, HelpCircle, Info } from "lucide-react"
import { getPwaInstalls, getPwaInstallStats } from "@/lib/actions/pwa-installs"

const PLATFORM_LABELS: Record<string, string> = {
  android: "Android",
  ios: "iOS / iPadOS",
  desktop: "PC / Mac",
  autre: "Autre",
}

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  android: Smartphone,
  ios: Apple,
  desktop: Monitor,
  autre: HelpCircle,
}

function statusFor(lastSeenAt: string): { label: string; className: string } {
  const days = (Date.now() - new Date(lastSeenAt).getTime()) / 86400000
  if (days < 3) return { label: "Actif", className: "bg-primary/10 text-primary" }
  if (days < 30) return { label: "Inactif récemment", className: "bg-gold/20 text-gold-foreground" }
  return { label: "Probablement désinstallée (estimation)", className: "bg-destructive/10 text-destructive" }
}

export default async function AppareilsPage() {
  const [installs, stats] = await Promise.all([getPwaInstalls(), getPwaInstallStats()])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Appareils installés</h1>
        <p className="text-sm text-muted-foreground">Suivi des personnes ayant installé le site comme application.</p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-foreground" />
        <p className="leading-relaxed">
          <span className="font-semibold">Important :</span> aucun site web au monde ne peut savoir avec certitude
          quand quelqu&apos;un désinstalle une application — ce n&apos;est pas une limite de ce site, c&apos;est
          une limite technique de tous les navigateurs (Chrome, Safari...). Ce tableau montre les installations
          confirmées (une vraie ouverture de l&apos;application) et la dernière fois que chaque personne l&apos;a
          rouverte. Une longue période sans réouverture est un <span className="font-semibold">signe probable</span>{" "}
          de désinstallation, mais peut aussi simplement vouloir dire que la personne n&apos;a pas eu besoin de
          commander récemment.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total installations" value={stats.totalInstalls.toString()} />
        <KpiCard label="Actives (3 derniers jours)" value={stats.active3d.toString()} />
        <KpiCard
          label="Probablement désinstallées"
          value={stats.inactive30d.toString()}
          alert={stats.inactive30d > 0}
        />
        <KpiCard
          label="Par plateforme"
          value={`${stats.androidCount} Android · ${stats.iosCount} iOS · ${stats.desktopCount} PC`}
          small
        />
      </div>

      <section>
        <h2 className="font-serif text-lg font-semibold text-foreground">Détail par appareil</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Plateforme</th>
                <th className="px-4 py-3">Installée le</th>
                <th className="px-4 py-3">Dernière ouverture</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {installs.map((row) => {
                const Icon = PLATFORM_ICONS[row.platform] ?? HelpCircle
                const status = statusFor(row.lastSeenAt)
                return (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-medium text-foreground">
                        <Icon className="h-4 w-4 text-primary" />
                        {PLATFORM_LABELS[row.platform] ?? "Autre"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(row.installedAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(row.lastSeenAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {installs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    Personne n&apos;a encore installé l&apos;application.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function KpiCard({
  label,
  value,
  alert,
  small,
}: {
  label: string
  value: string
  alert?: boolean
  small?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-4 ${alert ? "border-destructive/40 bg-destructive/5" : "border-border bg-card"}`}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p
        className={`mt-2 font-serif font-bold ${small ? "text-sm leading-snug" : "text-xl"} ${
          alert ? "text-destructive" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  )
}
