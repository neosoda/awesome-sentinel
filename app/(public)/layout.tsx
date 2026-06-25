import Link from 'next/link'
import { Navbar } from '@/components/public/Navbar'

export const dynamic = 'force-dynamic'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-shell flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="mt-20 px-4 pb-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[var(--md-surface-container)] px-6 py-10 sm:px-10">
          <div aria-hidden="true" className="absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-[#D0BCFF]/45 blur-3xl" />
          <div aria-hidden="true" className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#EFB8C8]/35 blur-3xl" />
          <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--md-primary)] text-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <span className="text-lg font-bold">Awesome Sentinel</span>
              </div>
              <p className="max-w-xs text-sm leading-6 text-[var(--md-on-surface-variant)]">
                Catalogue personnel d&apos;outils &amp; applications.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-sm font-bold">Navigation</h2>
              <div className="flex flex-col gap-2 text-sm text-[var(--md-primary)]">
                <Link href="/tools">Catalogue</Link>
                <Link href="/categories">Catégories</Link>
                <Link href="/about">À propos</Link>
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-sm font-bold">Ressources</h2>
              <a
                href="https://github.com/neosoda/awesome-sentinel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--md-primary)]"
              >
                GitHub
              </a>
            </div>
            <div>
              <h2 className="mb-3 text-sm font-bold">À propos</h2>
              <p className="text-sm leading-6 text-[var(--md-on-surface-variant)]">
                Une sélection organisée des outils que j&apos;utilise, teste et recommande.
              </p>
            </div>
          </div>
          <div className="relative mt-10 border-t border-[var(--md-outline-variant)] pt-5 text-center text-xs text-[var(--md-on-surface-variant)]">
            © {new Date().getFullYear()} Awesome Sentinel
          </div>
        </div>
      </footer>
    </div>
  )
}
