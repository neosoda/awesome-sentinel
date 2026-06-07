import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Awesome Sentinel — Catalogue d\'outils & applications',
    template: '%s | Awesome Sentinel',
  },
  description: 'Catalogue personnel d\'outils, applications self-hosted, SaaS, projets open source et outils dev. Découvrez, filtrez et explorez les meilleurs outils.',
  keywords: ['self-hosted', 'outils', 'applications', 'open source', 'SaaS', 'catalogue', 'awesome-sentinel'],
  authors: [{ name: 'Awesome Sentinel', url: 'https://github.com/neosoda/awesome-sentinel' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Awesome Sentinel',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100`}>
        {children}
      </body>
    </html>
  )
}
