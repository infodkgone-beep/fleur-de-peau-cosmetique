"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import { MapPin, Phone } from "lucide-react"
import { WhatsAppIcon } from "@/components/site-header"
import { WHATSAPP_NUMBER } from "@/lib/products"

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function SiteFooter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  function handleNewsletter(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail("")
  }

  return (
    <footer id="contact" className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-gold/50">
              <Image
                src="/images/logo-fleur-de-peau.webp"
                alt="Logo Fleur de peau Cosmétique"
                fill
                className="scale-[1.7] object-cover object-top"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-serif text-lg font-bold text-primary">Fleur de peau</span>
              <span className="text-[0.6rem] font-medium uppercase tracking-[0.35em] text-gold">Cosmétique</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Une peau saine, une beauté qui se voit. Produits cosmétiques importés de qualité premium.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-base font-semibold text-foreground">Contact</h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors hover:text-primary"
              >
                <WhatsAppIcon className="h-4 w-4 text-primary" />
                WhatsApp : 0702602458
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-primary" />
              +225 07 02 60 24 58
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-primary" />
              Cocody, Abidjan
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-base font-semibold text-foreground">Suivez-nous</h3>
          <div className="mt-4 flex gap-3">
            <a
              href="#"
              aria-label="Facebook Fleur de peau"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="TikTok Fleur de peau"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Facebook & TikTok :<br />
            <span className="font-medium text-foreground">Fleur de peau</span>
          </p>
        </div>

        <div>
          <h3 className="font-serif text-base font-semibold text-foreground">Newsletter</h3>
          <p className="mt-4 text-sm text-muted-foreground">Recevez nos nouveautés et conseils beauté.</p>
          <form onSubmit={handleNewsletter} className="mt-4 flex flex-col gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre e-mail"
              className="rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              S&apos;inscrire
            </button>
            {subscribed && <p className="text-xs font-medium text-primary">Merci pour votre inscription !</p>}
          </form>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <p className="px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Fleur de peau Cosmétique. Prends soin de ta peau, elle te le rendra.
        </p>
      </div>
    </footer>
  )
}
