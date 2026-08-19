import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = 'https://fleurdepeau.beauty'
const siteTitle = 'Fleur de peau Cosmétique — Une peau saine, une beauté qui se voit'
const siteDescription =
  'Boutique en ligne de produits cosmétiques importés : soins visage, corps, anti-taches, hydratants, protection solaire et compléments alimentaires. Livraison à Abidjan.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s — Fleur de peau Cosmétique',
  },
  description: siteDescription,
  keywords: [
    'cosmétique Abidjan',
    'produits cosmétiques importés',
    'soins visage',
    'soins corps',
    'anti-taches',
    'crème hydratante',
    'boutique beauté Côte d\'Ivoire',
  ],
  authors: [{ name: 'Fleur de peau Cosmétique' }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Fleur de peau Cosmétique',
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fleur de peau Cosmétique',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/opengraph-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
